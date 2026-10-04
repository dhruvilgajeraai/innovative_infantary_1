import { 
  Court, 
  Product, 
  POSTable, 
  ClubEvent, 
  Lead, 
  BusinessClient, 
  StaffMember, 
  StaffTask, 
  FixedAuthorityConfig,
  Invoice,
  Expense,
  Volunteer,
  Fundraiser,
  Election,
  ReimbursementRequest,
  Booking,
  User,
  TransactionRecord
} from '../types';

export const INITIAL_AUTHORITIES: FixedAuthorityConfig[] = [
  {
    id: 'SUPER-001',
    name: 'Super Administrator',
    description: 'Unrestricted master system administration, security audit, authority delegation',
    department: 'Executive Management',
    email: 'superadmin@arenaflow.io',
    color: '#ef4444',
    icon: 'ShieldAlert',
    defaultRoute: '/superadmin',
    permissions: ['*'],
    assignedUserIds: ['user-super-01'],
    isActive: true,
    lastLogin: '2026-10-03 12:15'
  },
  {
    id: 'ADMIN-001',
    name: 'General Administrator',
    description: 'Club operations, system configurations, cross-module monitoring',
    department: 'Operations',
    email: 'admin@thechampionsclub.com',
    color: '#8b5cf6',
    icon: 'Shield',
    defaultRoute: '/admin',
    permissions: ['admin.view', 'admin.manage', 'reports.view', 'users.view'],
    assignedUserIds: ['user-admin-01'],
    isActive: true,
    lastLogin: '2026-10-03 11:40'
  },
  {
    id: 'SALES-001',
    name: 'Sales Authority',
    description: 'Leads, membership sales, trials, customer conversion targets',
    department: 'Sales & Growth',
    email: 'sales@thechampionsclub.com',
    color: '#3b82f6',
    icon: 'TrendingUp',
    defaultRoute: '/sales',
    permissions: ['sales.view', 'sales.create', 'sales.edit', 'leads.manage'],
    assignedUserIds: ['user-sales-01'],
    isActive: true,
    lastLogin: '2026-10-03 10:20'
  },
  {
    id: 'BOOKING-001',
    name: 'Booking & Courts Authority',
    description: 'Court schedules, 30-min slot engine, check-ins, double-booking prevention',
    department: 'Court Operations',
    email: 'desk.bookings@thechampionsclub.com',
    color: '#06b6d4',
    icon: 'Calendar',
    defaultRoute: '/bookings',
    permissions: ['bookings.view', 'bookings.create', 'bookings.edit', 'bookings.cancel', 'courts.manage'],
    assignedUserIds: ['user-booking-01'],
    isActive: true,
    lastLogin: '2026-10-03 12:30'
  },
  {
    id: 'MEMBER-001',
    name: 'Membership Authority',
    description: 'Gold, Silver, Junior plans, renewals, expirations, perks and discounts',
    department: 'Member Relations',
    email: 'memberships@thechampionsclub.com',
    color: '#10b981',
    icon: 'Award',
    defaultRoute: '/memberships',
    permissions: ['members.view', 'members.create', 'members.edit', 'members.renew'],
    assignedUserIds: ['user-member-01'],
    isActive: true,
    lastLogin: '2026-10-03 09:15'
  },
  {
    id: 'SPORT-001',
    name: 'Sports Operations Authority',
    description: 'Football, Tennis, Cricket, Badminton, Padel, Running & Coaching',
    department: 'Athletics & Training',
    email: 'headcoach@thechampionsclub.com',
    color: '#14b8a6',
    icon: 'Activity',
    defaultRoute: '/sports',
    permissions: ['sports.view', 'sports.schedules', 'coaches.manage', 'courts.inspect'],
    assignedUserIds: ['user-sport-01'],
    isActive: true,
    lastLogin: '2026-10-03 08:45'
  },
  {
    id: 'SHOP-001',
    name: 'Pro Gear Shop & Inventory',
    description: 'Shared physical/online stock, rackets, balls, shoes, low-stock threshold',
    department: 'Retail & Merchandising',
    email: 'shop@thechampionsclub.com',
    color: '#f59e0b',
    icon: 'ShoppingBag',
    defaultRoute: '/shop',
    permissions: ['shop.view', 'inventory.manage', 'orders.fulfill', 'products.edit'],
    assignedUserIds: ['user-shop-01'],
    isActive: true,
    lastLogin: '2026-10-03 11:10'
  },
  {
    id: 'POS-001',
    name: 'Bar & Cafeteria POS Authority',
    description: 'Tables 1-12, tabs, orders, cash/card/UPI, auto-applied member discounts',
    department: 'Hospitality & F&B',
    email: 'bar@thechampionsclub.com',
    color: '#f97316',
    icon: 'Coffee',
    defaultRoute: '/pos',
    permissions: ['pos.view', 'pos.orders', 'pos.tabs', 'pos.payments'],
    assignedUserIds: ['user-pos-01'],
    isActive: true,
    lastLogin: '2026-10-03 12:40'
  },
  {
    id: 'EVENT-001',
    name: 'Events & Tournaments Authority',
    description: 'Club championships, Friday Social Play, QR check-in scanner, capacity',
    department: 'Events & Experiences',
    email: 'events@thechampionsclub.com',
    color: '#ec4899',
    icon: 'Ticket',
    defaultRoute: '/events',
    permissions: ['events.view', 'events.create', 'events.checkin', 'events.tickets'],
    assignedUserIds: ['user-event-01'],
    isActive: true,
    lastLogin: '2026-10-03 10:50'
  },
  {
    id: 'FINANCE-001',
    name: 'Finance & Accounts Authority',
    description: 'Revenue aggregation (Courts, Shop, Bar, Events, Members), invoices, expenses',
    department: 'Finance & Treasury',
    email: 'finance@thechampionsclub.com',
    color: '#22c55e',
    icon: 'DollarSign',
    defaultRoute: '/finance',
    permissions: ['finance.view', 'finance.export', 'invoices.manage', 'expenses.approve'],
    assignedUserIds: ['user-finance-01'],
    isActive: true,
    lastLogin: '2026-10-03 11:55'
  },
  {
    id: 'CRM-001',
    name: 'CRM & Corporate Client Authority',
    description: '5-stage pipeline, corporate wellness contracts, sponsorship proposals',
    department: 'Partnerships & CRM',
    email: 'partnerships@thechampionsclub.com',
    color: '#6366f1',
    icon: 'Users',
    defaultRoute: '/crm',
    permissions: ['crm.view', 'crm.pipeline', 'clients.manage', 'quotes.create'],
    assignedUserIds: ['user-crm-01'],
    isActive: true,
    lastLogin: '2026-10-03 09:40'
  },
  {
    id: 'STAFF-001',
    name: 'Staff & Roster Authority',
    description: 'Coaches, desk attendants, baristas, duty shifts, task boards',
    department: 'Human Resources',
    email: 'hr@thechampionsclub.com',
    color: '#a855f7',
    icon: 'UserCheck',
    defaultRoute: '/staff',
    permissions: ['staff.view', 'staff.shifts', 'tasks.manage', 'attendance.audit'],
    assignedUserIds: ['user-staff-01'],
    isActive: true,
    lastLogin: '2026-10-03 08:30'
  },
  {
    id: 'MARKETING-001',
    name: 'Marketing & Growth Authority',
    description: 'Social campaigns, seasonal promotions, referral offers, engagement analytics',
    department: 'Marketing',
    email: 'marketing@thechampionsclub.com',
    color: '#0ea5e9',
    icon: 'Megaphone',
    defaultRoute: '/marketing',
    permissions: ['marketing.view', 'campaigns.create', 'promos.manage', 'analytics.view'],
    assignedUserIds: ['user-mkt-01'],
    isActive: true,
    lastLogin: '2026-10-02 17:00'
  },
  {
    id: 'SERVICE-001',
    name: 'Customer Support Authority',
    description: 'Member inquiries, locker issues, stringing requests, complaint resolution',
    department: 'Customer Success',
    email: 'support@thechampionsclub.com',
    color: '#eab308',
    icon: 'Headphones',
    defaultRoute: '/service',
    permissions: ['service.view', 'tickets.respond', 'feedback.manage'],
    assignedUserIds: ['user-svc-01'],
    isActive: true,
    lastLogin: '2026-10-03 12:00'
  },
  {
    id: 'CONTENT-001',
    name: 'Website & Content Authority',
    description: 'Public landing page CMS, announcements, tournament banners, court notices',
    department: 'Digital Media',
    email: 'content@thechampionsclub.com',
    color: '#d946ef',
    icon: 'Globe',
    defaultRoute: '/content',
    permissions: ['content.view', 'content.edit', 'announcements.publish'],
    assignedUserIds: ['user-cnt-01'],
    isActive: true,
    lastLogin: '2026-10-02 19:30'
  }
];

export const INITIAL_COURTS: Court[] = [
  { id: 'c-football-1', name: '5v5 FIFA AstroTurf Football Pitch', sport: 'football', courtNumber: 1, indoor: false, hourlyRate: 1500, memberHourlyRate: 1000, status: 'active' },
  { id: 'c-cricket-1', name: 'Floodlit Box Cricket Turf', sport: 'cricket', courtNumber: 1, indoor: false, hourlyRate: 1200, memberHourlyRate: 800, status: 'active' },
  { id: 'c-tennis-1', name: 'Centre Clay Court 1', sport: 'tennis', courtNumber: 1, indoor: false, hourlyRate: 800, memberHourlyRate: 500, status: 'active' },
  { id: 'c-tennis-2', name: 'Grand Slam Hard Court 2', sport: 'tennis', courtNumber: 2, indoor: true, hourlyRate: 700, memberHourlyRate: 450, status: 'active' },
  { id: 'c-padel-1', name: 'Panoramic Glass Padel Court 1', sport: 'padel', courtNumber: 1, indoor: true, hourlyRate: 1600, memberHourlyRate: 1100, status: 'active' },
  { id: 'c-padel-2', name: 'Pro Glass Padel Court 2', sport: 'padel', courtNumber: 2, indoor: true, hourlyRate: 1600, memberHourlyRate: 1100, status: 'active' },
  { id: 'c-badminton-1', name: 'BWF Indoor Wooden Court A', sport: 'badminton', courtNumber: 1, indoor: true, hourlyRate: 400, memberHourlyRate: 250, status: 'active' },
  { id: 'c-badminton-2', name: 'BWF Indoor Wooden Court B', sport: 'badminton', courtNumber: 2, indoor: true, hourlyRate: 400, memberHourlyRate: 250, status: 'active' },
  { id: 'c-running-1', name: '400m Tartan Athletic Lane 1-4', sport: 'running', courtNumber: 1, indoor: false, hourlyRate: 300, memberHourlyRate: 150, status: 'active' },
  { id: 'c-pool-1', name: 'VIP Rasson Slate Pool Table 1', sport: 'pool', courtNumber: 1, indoor: true, hourlyRate: 350, memberHourlyRate: 200, status: 'active' },
  { id: 'c-pool-2', name: 'Championship 8-Ball Snooker Table 2', sport: 'pool', courtNumber: 2, indoor: true, hourlyRate: 300, memberHourlyRate: 180, status: 'active' },
  { id: 'c-volleyball-1', name: 'Championship Pro Volleyball Court 1', sport: 'volleyball', courtNumber: 1, indoor: true, hourlyRate: 900, memberHourlyRate: 600, status: 'active' },
  { id: 'c-volleyball-2', name: 'Olympic Sand Beach Volleyball Court 2', sport: 'volleyball', courtNumber: 2, indoor: false, hourlyRate: 800, memberHourlyRate: 500, status: 'active' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p-1', sku: 'RKT-YON-7000', name: 'Yonex Nanoray 7000 Badminton Racket (Carbon Light)', category: 'rackets', price: 1899, memberPrice: 1599, stock: 18, lowStockThreshold: 5, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=60', sport: 'badminton' },
  { id: 'p-2', sku: 'SHU-MAV-350', name: 'Yonex Mavis 350 Nylon Shuttles (Pack of 6, Yellow)', category: 'balls', price: 649, memberPrice: 549, stock: 45, lowStockThreshold: 12, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=60', sport: 'badminton' },
  { id: 'p-3', sku: 'BAL-WIL-US3', name: 'Wilson US Open Extra Duty Tennis Balls (Can of 3)', category: 'balls', price: 599, memberPrice: 499, stock: 50, lowStockThreshold: 15, image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500&auto=format&fit=crop&q=60', sport: 'tennis' },
  { id: 'p-4', sku: 'RKT-HEAD-SPD', name: 'Head Speed Pro Tennis Racket (Graphite)', category: 'rackets', price: 12499, memberPrice: 10999, stock: 8, lowStockThreshold: 3, image: 'https://images.unsplash.com/photo-1617083934555-563d332616f7?w=500&auto=format&fit=crop&q=60', sport: 'tennis' },
  { id: 'p-5', sku: 'FTB-NIV-STM', name: 'Nivia Storm Football Size 5 (FIFA Approved)', category: 'balls', price: 849, memberPrice: 699, stock: 24, lowStockThreshold: 6, image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&auto=format&fit=crop&q=60', sport: 'football' },
  { id: 'p-6', sku: 'BAL-SG-CLB', name: 'SG Club White Leather Cricket Ball (Handmade 4-Piece)', category: 'balls', price: 549, memberPrice: 449, stock: 36, lowStockThreshold: 10, image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=500&auto=format&fit=crop&q=60', sport: 'cricket' },
  { id: 'p-7', sku: 'PAD-BULL-IND', name: 'Bullpadel Indiga Power Padel Racket', category: 'rackets', price: 7999, memberPrice: 6799, stock: 6, lowStockThreshold: 2, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=60', sport: 'padel' },
  { id: 'p-8', sku: 'SHO-NIKE-GX', name: 'Nike Phantom GX Club Turf Football Shoes', category: 'shoes', price: 5995, memberPrice: 4995, stock: 12, lowStockThreshold: 4, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60', sport: 'football' },
  { id: 'p-9', sku: 'SHO-ASIC-UP5', name: 'ASICS Upcourt 5 Indoor Badminton & Court Shoes', category: 'shoes', price: 4499, memberPrice: 3799, stock: 15, lowStockThreshold: 5, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60', sport: 'badminton' },
  { id: 'p-10', sku: 'ACC-NIV-GLV', name: 'Nivia Pro Grip Football Goalkeeper Gloves', category: 'accessories', price: 399, memberPrice: 319, stock: 20, lowStockThreshold: 6, image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60', sport: 'football' },
  { id: 'p-11', sku: 'ACC-YON-GRP', name: 'Yonex Super Grap Overgrip (Pack of 3, White/Black)', category: 'accessories', price: 349, memberPrice: 279, stock: 60, lowStockThreshold: 15, image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60', sport: 'badminton' },
  { id: 'p-12', sku: 'VB-MIK-200W', name: 'Mikasa V200W Official Match Volleyball', category: 'balls', price: 3499, memberPrice: 2999, stock: 14, lowStockThreshold: 4, image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500&auto=format&fit=crop&q=60', sport: 'volleyball' },
  { id: 'p-13', sku: 'BEV-ON-WHEY', name: 'Optimum Nutrition Gold Standard Whey Shake (Chocolate 350ml)', category: 'beverages', price: 180, memberPrice: 150, stock: 75, lowStockThreshold: 20, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60' },
  { id: 'p-14', sku: 'BEV-GAT-500', name: 'Gatorade Blue Bolt Isotonic Electrolyte Drink 500ml', category: 'beverages', price: 50, memberPrice: 45, stock: 90, lowStockThreshold: 25, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=60' },
  { id: 'p-15', sku: 'BEV-RB-250', name: 'Red Bull Energy Drink Can 250ml', category: 'beverages', price: 125, memberPrice: 115, stock: 65, lowStockThreshold: 20, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=60' },
  { id: 'p-16', sku: 'BEV-FAST-500', name: 'Fast&Up Reload Electrolyte Sports Hydration 500ml', category: 'beverages', price: 45, memberPrice: 35, stock: 80, lowStockThreshold: 20, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=60' },
  { id: 'p-17', sku: 'SNK-SUB-PAN', name: 'Artisan Grilled Paneer & Veggie High-Protein Sub', category: 'snacks', price: 180, memberPrice: 150, stock: 30, lowStockThreshold: 8, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60' },
  { id: 'p-18', sku: 'SNK-SUB-CHK', name: 'Artisan Grilled Chicken High-Protein Sub', category: 'snacks', price: 220, memberPrice: 180, stock: 25, lowStockThreshold: 8, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60' },
];

export const INITIAL_POS_TABLES: POSTable[] = [
  { id: 1, name: 'Courtside Terrace 1', capacity: 4, status: 'vacant' },
  { id: 2, name: 'Courtside Terrace 2', capacity: 4, status: 'vacant' },
  { id: 3, name: 'Padel Glass View 3', capacity: 2, status: 'vacant' },
  { id: 4, name: 'Lounge Sofa 4', capacity: 6, status: 'vacant' },
  { id: 5, name: 'Bar High Table 5', capacity: 2, status: 'vacant' },
  { id: 6, name: 'Bar High Table 6', capacity: 2, status: 'vacant' },
  { id: 7, name: 'Cafeteria Booth 7', capacity: 4, status: 'vacant' },
  { id: 8, name: 'Cafeteria Booth 8', capacity: 4, status: 'vacant' },
  { id: 9, name: 'Player Recovery Deck 9', capacity: 4, status: 'vacant' },
  { id: 10, name: 'Terrace VIP 10', capacity: 8, status: 'vacant' },
  { id: 11, name: 'Garden Lawn 11', capacity: 4, status: 'vacant' },
  { id: 12, name: 'Front Desk Quick Bar 12', capacity: 1, status: 'vacant' },
];

export const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: 'evt-1',
    title: 'Champions Friday Night Social Play & Mixer',
    description: 'Weekly 18:00 - 22:00 multi-court social tennis, padel & badminton doubles with complimentary recovery drinks and live DJ.',
    sport: 'all',
    date: '2026-10-09',
    time: '18:00 - 22:00',
    location: 'Courts 1-4 & Club Lounge',
    capacity: 48,
    registeredCount: 0,
    ticketPriceRegular: 499,
    ticketPriceMember: 0,
    status: 'upcoming',
    organizer: 'Coach Marcus & Front Desk'
  },
  {
    id: 'evt-2',
    title: 'Autumn Open Padel Championship 2026',
    description: 'Knockout doubles tournament for Gold, Silver and Open pairs with trophies, prize pool and live stream.',
    sport: 'padel',
    date: '2026-10-17',
    time: '09:00 - 18:00',
    location: 'Padel Courts 1 & 2',
    capacity: 32,
    registeredCount: 0,
    ticketPriceRegular: 1499,
    ticketPriceMember: 999,
    status: 'upcoming',
    organizer: 'Elena Rostova'
  },
  {
    id: 'evt-3',
    title: 'Junior Tennis Masterclass with Pro Coach',
    description: 'High performance footwork, serve mechanics, and tactical match simulation for under-18 juniors.',
    sport: 'tennis',
    date: '2026-10-12',
    time: '16:00 - 18:30',
    location: 'Centre Clay Court 1',
    capacity: 16,
    registeredCount: 14,
    ticketPriceRegular: 799,
    ticketPriceMember: 399,
    status: 'upcoming',
    organizer: 'Coach David K.'
  }
];

export const INITIAL_LEADS: Lead[] = [];

export const INITIAL_BUSINESS_CLIENTS: BusinessClient[] = [];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'stf-1', name: 'David Koenig', role: 'Head Coach', sport: 'tennis', email: 'david.k@thechampionsclub.com', phone: '+91 98765 00001', shift: 'Morning (06:00 - 14:00)', status: 'on_duty', attendanceRate: 98 },
  { id: 'stf-2', name: 'Elena Rostova', role: 'Assistant Coach', sport: 'padel', email: 'elena.r@thechampionsclub.com', phone: '+91 98765 00002', shift: 'Evening (14:00 - 22:00)', status: 'on_duty', attendanceRate: 96 },
  { id: 'stf-3', name: 'Sarah Jenkins', role: 'Front Desk Officer', email: 'sarah.j@thechampionsclub.com', phone: '+91 98765 00003', shift: 'Morning (06:00 - 14:00)', status: 'on_duty', attendanceRate: 100 },
  { id: 'stf-4', name: 'Marcus Bennett', role: 'Barista & F&B', email: 'marcus.b@thechampionsclub.com', phone: '+91 98765 00004', shift: 'Evening (14:00 - 22:00)', status: 'on_duty', attendanceRate: 94 },
  { id: 'stf-5', name: 'Oliver Hayes', role: 'Groundskeeper', email: 'oliver.h@thechampionsclub.com', phone: '+91 98765 00005', shift: 'Morning (06:00 - 14:00)', status: 'on_duty', attendanceRate: 99 },
  { id: 'stf-6', name: 'Priya Sharma', role: 'Fitness Trainer', sport: 'running', email: 'priya.s@thechampionsclub.com', phone: '+91 98765 00006', shift: 'Full Day', status: 'off_duty', attendanceRate: 95 }
];

export const INITIAL_TASKS: StaffTask[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'vol-1', name: 'Arthur Pendelton', email: 'arthur.p@outlook.com', phone: '+91 98765 11111', skills: ['Ball Kid Coordinator', 'First Aid'], eventAssigned: 'Autumn Open Padel Championship', status: 'active', hoursLogged: 0 },
  { id: 'vol-2', name: 'Claire Dubois', email: 'claire.d@gmail.com', phone: '+91 98765 22222', skills: ['Guest Check-in', 'Hospitality'], eventAssigned: 'Champions Friday Night Social', status: 'active', hoursLogged: 0 }
];

export const INITIAL_FUNDRAISERS: Fundraiser[] = [
  { id: 'fun-1', title: 'Junior Sports Scholarship Fund 2026', description: 'Providing equipment, court access and tournament travel subsidies for underprivileged youth talent.', targetAmount: 1200000, currentAmount: 0, donorCount: 0, deadline: '2026-11-30' },
  { id: 'fun-2', title: 'Solar Canopy & Eco-Stadium Initiative', description: 'Installing solar canopies over padel courts to power arena floodlights cleanly.', targetAmount: 2500000, currentAmount: 0, donorCount: 0, deadline: '2026-12-31' }
];

export const INITIAL_ELECTIONS: Election[] = [
  {
    id: 'el-1',
    title: '2026-2027 Club Advisory Committee Board Member',
    role: 'Member Representative on Board',
    candidates: [
      { id: 'cand-1', name: 'Dr. Helen Carter', votes: 0, bio: 'Club member for 9 years. Passionate about women’s sport access and junior development.' },
      { id: 'cand-2', name: 'Robert Stirling', votes: 0, bio: 'Experienced tennis captain advocating for expanded evening social tournaments and lighting upgrades.' }
    ],
    totalVotes: 0,
    status: 'active',
    endDate: '2026-10-25'
  }
];

export const INITIAL_REIMBURSEMENTS: ReimbursementRequest[] = [];

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [];

export const DEMO_USERS: User[] = [
  {
    id: 'user-normal-01',
    name: 'Alexander Wright',
    email: 'alex.wright@gmail.com',
    phone: '+91 98765 43210',
    organization: 'The Champions Club Member',
    accountType: 'normal',
    emailVerified: true,
    assignedAuthorities: [],
    membershipTier: 'silver',
    membershipExpiry: '2027-04-15',
    createdAt: '2026-08-10'
  },
  {
    id: 'user-multi-01',
    name: 'Rebecca Sterling (Manager)',
    email: 'rebecca.s@thechampionsclub.com',
    phone: '+91 98765 88888',
    organization: 'The Champions Club Ops',
    accountType: 'staff',
    emailVerified: true,
    assignedAuthorities: ['BOOKING-001', 'MEMBER-001', 'POS-001'],
    activeAuthority: 'BOOKING-001',
    membershipTier: 'gold',
    membershipExpiry: '2027-12-31',
    createdAt: '2026-06-01'
  },
  {
    id: 'user-super-01',
    name: 'Chief Administrator',
    email: 'superadmin@arenaflow.io',
    phone: '+91 98765 99999',
    organization: 'ArenaFlow Global HQ',
    accountType: 'superadmin',
    emailVerified: true,
    assignedAuthorities: ['SUPER-001'],
    activeAuthority: 'SUPER-001',
    membershipTier: 'gold',
    membershipExpiry: '2030-01-01',
    createdAt: '2026-01-01'
  }
];
