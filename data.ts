import { Router, Request, Response } from 'express';
import { 
  memoryStore, 
  saveDatabaseToDisk, 
  getFullDatabaseSnapshot, 
  restoreDatabaseSnapshot 
} from '../db';

export const dataRouter = Router();

// POST /api/data/sync (Permanent Sync of ALL Data to Server Disk)
dataRouter.post('/sync', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload structure.' });
    }

    let syncedCount = 0;

    // Sync Courts
    if (Array.isArray(payload.courts)) {
      payload.courts.forEach((c: any) => {
        if (c.id) {
          memoryStore.courts.set(c.id, c);
          syncedCount++;
        }
      });
    }

    // Sync Bookings
    if (Array.isArray(payload.bookings)) {
      payload.bookings.forEach((b: any) => {
        if (b.id) {
          memoryStore.bookings.set(b.id, b);
          syncedCount++;
        }
      });
    }

    // Sync Products
    if (Array.isArray(payload.products)) {
      payload.products.forEach((p: any) => {
        if (p.id) {
          memoryStore.products.set(p.id, p);
          syncedCount++;
        }
      });
    }

    // Sync Orders
    if (Array.isArray(payload.orders)) {
      payload.orders.forEach((o: any) => {
        if (o.id) {
          memoryStore.orders.set(o.id, o);
          syncedCount++;
        }
      });
    }

    // Sync POS Tabs
    if (Array.isArray(payload.posTabs)) {
      payload.posTabs.forEach((t: any) => {
        if (t.id) {
          memoryStore.posTabs.set(t.id, t);
          syncedCount++;
        }
      });
    }

    // Sync Invoices
    if (Array.isArray(payload.invoices)) {
      payload.invoices.forEach((inv: any) => {
        if (inv.id) {
          memoryStore.invoices.set(inv.id, inv);
          syncedCount++;
        }
      });
    }

    // Sync Staff
    if (Array.isArray(payload.staff)) {
      payload.staff.forEach((s: any) => {
        if (s.id) {
          memoryStore.staff.set(s.id, s);
          syncedCount++;
        }
      });
    }

    // Sync Leads
    if (Array.isArray(payload.leads)) {
      payload.leads.forEach((l: any) => {
        if (l.id) {
          memoryStore.leads.set(l.id, l);
          syncedCount++;
        }
      });
    }

    // Sync Users / Members
    if (Array.isArray(payload.users)) {
      payload.users.forEach((u: any) => {
        const key = u.email ? u.email.toLowerCase() : u.id;
        if (key) {
          memoryStore.users.set(key, u);
          syncedCount++;
        }
      });
    }

    // Sync Audit Logs
    if (Array.isArray(payload.auditLogs)) {
      memoryStore.auditLogs = payload.auditLogs;
      syncedCount += payload.auditLogs.length;
    }

    // Sync Transactions / Payments
    if (Array.isArray(payload.transactions)) {
      payload.transactions.forEach((t: any) => {
        if (t.id) {
          memoryStore.payments.set(t.id, t);
          syncedCount++;
        }
      });
    }

    // Immediately persist 100% of mutations to server disk JSON file
    saveDatabaseToDisk();

    return res.json({
      success: true,
      message: `All sports complex data permanently saved to server database without errors! (${syncedCount} items synchronized)`,
      timestamp: new Date().toISOString(),
      counts: {
        courts: memoryStore.courts.size,
        bookings: memoryStore.bookings.size,
        products: memoryStore.products.size,
        orders: memoryStore.orders.size,
        transactions: memoryStore.payments.size,
        posTabs: memoryStore.posTabs.size,
        invoices: memoryStore.invoices.size,
        staff: memoryStore.staff.size,
        leads: memoryStore.leads.size,
        users: memoryStore.users.size,
        auditLogs: memoryStore.auditLogs.length
      }
    });
  } catch (err: any) {
    console.error('Server Data Sync error:', err);
    return res.status(500).json({ success: false, message: 'Server failed to save data to disk.' });
  }
});

// GET /api/data/all (Retrieve Entire Permanent Database Snapshot)
dataRouter.get('/all', (req: Request, res: Response) => {
  const snapshot = getFullDatabaseSnapshot();
  return res.json({
    success: true,
    data: snapshot
  });
});

// GET /api/data/export (Download Complete Database Backup JSON)
dataRouter.get('/export', (req: Request, res: Response) => {
  const snapshot = getFullDatabaseSnapshot();
  const filename = `arenaflow_backup_${new Date().toISOString().split('T')[0]}.json`;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(JSON.stringify(snapshot, null, 2));
});

// POST /api/data/import (Restore Entire Database from JSON File)
dataRouter.post('/import', (req: Request, res: Response) => {
  try {
    const backupData = req.body;
    if (!backupData || typeof backupData !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid backup format.' });
    }
    restoreDatabaseSnapshot(backupData);
    return res.json({
      success: true,
      message: 'Database backup restored successfully into permanent server storage!',
      snapshot: getFullDatabaseSnapshot()
    });
  } catch (err: any) {
    console.error('Import error:', err);
    return res.status(500).json({ success: false, message: 'Failed to restore database backup.' });
  }
});
