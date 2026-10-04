import { Router, Request, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../services/auth';
import { query, isDbConnected, memoryStore, saveDatabaseToDisk } from '../db';

export const bookingsRouter = Router();

// GET /api/bookings
bookingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { date, courtId, userId } = req.query;

    if (isDbConnected()) {
      let sql = 'SELECT * FROM bookings WHERE 1=1';
      const params: any[] = [];
      if (date) {
        params.push(date);
        sql += ` AND date = $${params.length}`;
      }
      if (courtId) {
        params.push(courtId);
        sql += ` AND court_id = $${params.length}`;
      }
      if (userId) {
        params.push(userId);
        sql += ` AND user_id = $${params.length}`;
      }
      sql += ' ORDER BY date DESC, start_time ASC';
      const result = await query(sql, params);
      return res.json({ success: true, bookings: result.rows });
    } else {
      let list = Array.from(memoryStore.bookings.values());
      if (date) list = list.filter(b => b.date === date);
      if (courtId) list = list.filter(b => b.courtId === courtId);
      if (userId) list = list.filter(b => b.userId === userId);
      return res.json({ success: true, bookings: list });
    }
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
});

// POST /api/bookings (Zero-Collision 30-min Slot Reservation)
bookingsRouter.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courtId, courtName, sport, date, startTime, endTime, price, userName, userEmail } = req.body;

    // Server-Side Input Validation
    if (!courtId || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required court booking parameters.' });
    }

    // Server-Side Collision Prevention Engine: Ensure court is not already booked at this date and time
    if (isDbConnected()) {
      const collisionCheck = await query(
        `SELECT id FROM bookings WHERE court_id = $1 AND date = $2 AND start_time = $3 AND status != 'cancelled'`,
        [courtId, date, startTime]
      );
      if (collisionCheck.rows.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: `Collision Detected: Court ${courtName || courtId} is already booked for ${date} at ${startTime}. Please select a different 30-min slot.` 
        });
      }
    } else {
      const isColliding = Array.from(memoryStore.bookings.values()).some(
        b => b.courtId === courtId && b.date === date && b.startTime === startTime && b.status !== 'cancelled'
      );
      if (isColliding) {
        return res.status(409).json({
          success: false,
          message: `Collision Detected: Court is already booked for ${date} at ${startTime}.`
        });
      }
    }

    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const effectiveUserId = req.user?.userId || 'GUEST';
    const effectiveUserName = userName || req.user?.email?.split('@')[0] || 'Member';
    const effectiveUserEmail = userEmail || req.user?.email || 'member@arenaflow.com';

    const newBooking = {
      id: bookingId,
      courtId,
      courtName: courtName || 'Championship Court',
      sport,
      userId: effectiveUserId,
      userName: effectiveUserName,
      userEmail: effectiveUserEmail,
      date,
      startTime,
      endTime,
      price: Number(price) || 500,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await query(
        `INSERT INTO bookings (id, court_id, court_name, sport, user_id, user_name, user_email, date, start_time, end_time, price, status, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [bookingId, courtId, newBooking.courtName, sport, effectiveUserId, effectiveUserName, effectiveUserEmail, date, startTime, endTime, newBooking.price, 'confirmed', 'unpaid']
      );
    } else {
      memoryStore.bookings.set(bookingId, newBooking);
      saveDatabaseToDisk();
    }

    return res.status(201).json({
      success: true,
      message: `Reservation confirmed for ${newBooking.courtName} on ${date} (${startTime} - ${endTime})!`,
      booking: newBooking
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return res.status(500).json({ success: false, message: 'Server failed to record court reservation.' });
  }
});

// PATCH /api/bookings/:id/cancel
bookingsRouter.patch('/:id/cancel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (isDbConnected()) {
    await query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [id]);
  } else {
    const b = memoryStore.bookings.get(id);
    if (b) {
      b.status = 'cancelled';
      saveDatabaseToDisk();
    }
  }
  return res.json({ success: true, message: 'Booking cancelled successfully.' });
});

// PATCH /api/bookings/:id/check-in
bookingsRouter.patch('/:id/check-in', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (isDbConnected()) {
    await query(`UPDATE bookings SET status = 'checked-in' WHERE id = $1`, [id]);
  } else {
    const b = memoryStore.bookings.get(id);
    if (b) {
      b.status = 'checked-in';
      saveDatabaseToDisk();
    }
  }
  return res.json({ success: true, message: 'Member checked in to court.' });
});
