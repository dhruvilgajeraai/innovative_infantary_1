import { Router, Request, Response } from 'express';
import { createPaymentOrder, verifyPaymentSignature, updateRazorpayKeys, getRazorpayKeyId } from '../services/razorpay';
import { authenticateToken, AuthenticatedRequest } from '../services/auth';
import { query, isDbConnected, memoryStore, saveDatabaseToDisk } from '../db';

export const paymentsRouter = Router();

// GET /api/payments/config (Retrieve current Razorpay Gateway Configuration)
paymentsRouter.get('/config', (req: Request, res: Response) => {
  const currentKeyId = getRazorpayKeyId();
  const isLive = currentKeyId.startsWith('rzp_live_');
  return res.json({
    success: true,
    keyId: currentKeyId,
    mode: isLive ? 'live' : 'test',
    isConfigured: Boolean(currentKeyId && currentKeyId !== 'rzp_test_champions_club_key')
  });
});

// POST /api/payments/config (Update Razorpay Live/Test Keys Dynamically)
paymentsRouter.post('/config', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { keyId, keySecret, mode } = req.body;
  if (!keyId || !keySecret) {
    return res.status(400).json({ success: false, message: 'Key ID and Key Secret are required.' });
  }

  updateRazorpayKeys(keyId, keySecret);
  memoryStore.config.razorpayKeyId = keyId;
  memoryStore.config.razorpayKeySecret = keySecret;
  memoryStore.config.mode = mode || (keyId.startsWith('rzp_live_') ? 'live' : 'test');
  saveDatabaseToDisk();

  return res.json({
    success: true,
    message: `Razorpay Gateway updated to ${memoryStore.config.mode.toUpperCase()} mode!`,
    mode: memoryStore.config.mode,
    keyId
  });
});

// POST /api/payments/create-order
paymentsRouter.post('/create-order', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, receipt, notes = {} } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount in INR is required.' });
    }

    const orderResult = await createPaymentOrder({
      amount: Number(amount),
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        ...notes,
        userId: req.user?.userId || 'guest'
      }
    });

    return res.json({
      success: true,
      order: orderResult
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initiate Razorpay order.' });
  }
});

// POST /api/payments/verify
paymentsRouter.post('/verify', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, paymentId, signature, bookingId, posTabId, amount } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay signature verification parameters.' });
    }

    // Verify cryptographic HMAC-SHA256 signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Security Alert: Invalid Razorpay cryptographic signature. Payment verification failed.'
      });
    }

    const paymentRecordId = `PAY-${Date.now().toString(36).toUpperCase()}`;

    // Record verified transaction in PostgreSQL
    if (isDbConnected()) {
      await query(
        `INSERT INTO payments (id, order_id, payment_id, signature, amount, currency, status, user_id, booking_id, item_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [paymentRecordId, orderId, paymentId, signature, amount || 0, 'INR', 'captured', req.user?.userId || null, bookingId || null, bookingId ? 'booking' : 'pos_tab']
      );

      // If associated with a booking, mark as paid
      if (bookingId) {
        await query(
          `UPDATE bookings SET payment_status = 'paid', razorpay_payment_id = $1 WHERE id = $2`,
          [paymentId, bookingId]
        );
      }

      // If associated with a POS bar tab, mark as settled
      if (posTabId) {
        await query(
          `UPDATE pos_tabs SET status = 'settled', payment_method = 'razorpay', razorpay_payment_id = $1, settled_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [paymentId, posTabId]
        );
      }
    } else {
      memoryStore.payments.set(paymentRecordId, {
        id: paymentRecordId,
        orderId,
        paymentId,
        signature,
        amount,
        status: 'captured',
        userId: req.user?.userId,
        bookingId,
        posTabId,
        timestamp: new Date().toISOString()
      });

      if (bookingId && memoryStore.bookings.has(bookingId)) {
        const b = memoryStore.bookings.get(bookingId);
        b.paymentStatus = 'paid';
        b.razorpayPaymentId = paymentId;
      }
      saveDatabaseToDisk();
    }

    return res.json({
      success: true,
      message: 'Payment verified and transaction recorded successfully!',
      paymentId,
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ success: false, message: 'Server error during payment verification.' });
  }
});

// GET /api/payments/transactions (Retrieve all payment ledger records)
paymentsRouter.get('/transactions', (req: Request, res: Response) => {
  const transactionsList = Array.from(memoryStore.payments.values());
  return res.json({
    success: true,
    count: transactionsList.length,
    transactions: transactionsList
  });
});

// POST /api/payments/record (Record a UPI QR / UPI ID or Manual payment transaction)
paymentsRouter.post('/record', (req: Request, res: Response) => {
  try {
    const { source, customerName, itemName, amount, paymentMethod, referenceId, notes } = req.body;
    const id = `TXN-${Date.now().toString(36).toUpperCase()}`;
    const txnRecord = {
      id,
      source: source || 'counter',
      customerName: customerName || 'Customer',
      itemName: itemName || 'Sports Service',
      amount: Number(amount) || 0,
      paymentMethod: paymentMethod || 'upi_qr',
      upiId: 'anjanabajaniya@okicici',
      referenceId: referenceId || `REF-${Date.now().toString().slice(-8)}`,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: notes || 'Direct transaction recorded'
    };

    memoryStore.payments.set(id, txnRecord);
    saveDatabaseToDisk();

    return res.json({
      success: true,
      message: 'Transaction recorded successfully in permanent ledger!',
      transaction: txnRecord
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to record transaction.' });
  }
});
