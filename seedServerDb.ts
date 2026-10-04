import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_COURTS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_POS_TABLES,
  INITIAL_LEADS,
  INITIAL_STAFF,
  INITIAL_INVOICES,
  INITIAL_EVENTS,
  INITIAL_BOOKINGS,
  DEMO_USERS
} from '../src/data/seedData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'server', 'data', 'database.json');

// Read existing db to keep existing user credentials and config
let existingDb: any = {};
if (fs.existsSync(dbPath)) {
  try {
    existingDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    console.error('Error reading existing db:', e);
  }
}

// Convert arrays to Map format: Array of [key, value] pairs
const courtsEntries = INITIAL_COURTS.map(c => [c.id, c]);
const productsEntries = INITIAL_PRODUCTS.map(p => [p.id, p]);
const posTabsEntries = INITIAL_POS_TABLES.map(t => [`tab-${t.id}`, t]);
const leadsEntries = INITIAL_LEADS.map(l => [l.id, l]);
const staffEntries = INITIAL_STAFF.map(s => [s.id, s]);
const invoicesEntries = INITIAL_INVOICES.map(i => [i.id, i]);
const bookingsEntries = INITIAL_BOOKINGS.map(b => [b.id, b]);
const paymentsEntries = INITIAL_TRANSACTIONS.map(t => [t.id, t]);

// Preserve existing users or merge with seed demo users and department authority accounts
import { ALL_DEPARTMENT_USERS } from '../server/routes/auth';

const userMap = new Map<string, any>(existingDb.users || []);
DEMO_USERS.forEach(u => {
  const key = u.email ? u.email.toLowerCase() : u.id;
  if (!userMap.has(key)) {
    userMap.set(key, u);
  }
});

ALL_DEPARTMENT_USERS.forEach(u => {
  const emailKey = u.email.toLowerCase();
  const idKey = u.id.toUpperCase();
  userMap.set(emailKey, u);
  userMap.set(idKey, u);
});

const newSnapshot = {
  users: Array.from(userMap.entries()),
  courts: courtsEntries,
  bookings: bookingsEntries,
  products: productsEntries,
  orders: existingDb.orders || [],
  posTabs: posTabsEntries,
  invoices: invoicesEntries,
  staff: staffEntries,
  leads: leadsEntries,
  payments: paymentsEntries,
  auditLogs: existingDb.auditLogs || [
    {
      id: 'log-seed-01',
      action: 'DATABASE_INITIALIZATION',
      module: 'FINANCE & COMMERCE',
      details: 'All courts, Flipkart/Amazon pro-shop products, and Bharat UPI ledger initialized with real Indian market pricing.',
      timestamp: new Date().toISOString()
    }
  ],
  config: existingDb.config || {
    razorpayKeyId: 'rzp_test_champions_club_key',
    razorpayKeySecret: 'rzp_test_champions_secret_key_2026',
    mode: 'test'
  }
};

fs.writeFileSync(dbPath, JSON.stringify(newSnapshot, null, 2), 'utf-8');
console.log('✅ Successfully seeded server/data/database.json with real market data!');
console.log(`Courts: ${courtsEntries.length}, Products: ${productsEntries.length}, Transactions: ${paymentsEntries.length}`);
