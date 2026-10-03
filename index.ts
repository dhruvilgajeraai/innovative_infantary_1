export type UserRole = 'owner' | 'manager' | 'front_desk' | 'staff' | 'coach' | 'member';

export type MembershipTier = 'gold' | 'silver' | 'junior';

export interface Member {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: MembershipTier;
  sport?: string;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  courtDiscount: number; // e.g. 50% for gold, 25% for silver, 35% for junior
  shopDiscount: number; // e.g. 20% for gold, 10% for silver, 15% for junior
  barDiscount: number; // e.g. 15% for gold, 10% for silver, 10% for junior
  walletBalance: number;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  notes?: string;
}

export type CourtStatus = 'available' | 'booked' | 'maintenance' | 'social';

export interface CourtSlot {
  id: string;
  courtId: string;
  courtName: string;
  sport: 'Tennis' | 'Padel' | 'Badminton' | 'Squash' | 'Cricket' | string;
  time: string; // e.g. "06:00", "06:30"
  durationMinutes: number; // usually 60 mins
  status: CourtStatus;
  bookedBy?: {
    memberId: string;
    memberName: string;
    memberTier: MembershipTier;
    phone: string;
    bookingId: string;
    paymentStatus: 'paid' | 'pending';
    price: number;
  };
  maintenanceReason?: string;
  socialSessionId?: string;
}

export interface CourtBooking {
  id: string;
  courtId: string;
  courtName: string;
  sport: string;
  date: string;
  time: string;
  durationMinutes: number;
  memberId: string;
  memberName: string;
  memberTier: MembershipTier;
  basePrice: number;
  discountApplied: number;
  finalPrice: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Wallet' | 'Online';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}

export interface SocialSession {
  id: string;
  title: string;
  sport: string;
  courtName: string;
  courtId: string;
  date: string;
  time: string;
  maxPlayers: number;
  registeredPlayers: {
    memberId: string;
    name: string;
    tier: MembershipTier;
    avatar: string;
  }[];
  pricePerPlayer: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | string;
  coachLead?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Rackets' | 'Balls' | 'Shoes' | 'Accessories' | 'Apparel' | 'Nutrition' | string;
  sport: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  image: string;
  description: string;
  memberDiscountPercent: number;
  brand: string;
  rating: number;
  totalSold: number;
}

export interface ShopOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerId?: string;
  customerTier?: MembershipTier;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  discountAmount: number;
  total: number;
  channel: 'In-Club Counter' | 'Online Web' | string;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Online' | string;
  paymentStatus: 'paid' | 'pending';
  status: 'Completed' | 'Ready for Pickup' | 'Processing' | string;
}

export interface CafeteriaItem {
  id: string;
  name: string;
  category: 'Drinks' | 'Coffee' | 'Protein & Energy' | 'Hot Meals' | 'Snacks' | string;
  price: number;
  image: string;
  description: string;
  isVegetarian?: boolean;
  isVeg?: boolean;
  isAvailable: boolean;
  stock?: number;
  calories?: string;
  prepTimeMinutes: number;
}

export interface POSTable {
  id: number;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'payment_pending';
  currentOrderId?: string;
  occupiedSince?: string;
  guestCount?: number;
}

export interface KDSOrder {
  id: string;
  orderNumber: string;
  tableNumber: string | number;
  customerName: string;
  memberName?: string;
  customerId?: string;
  customerTier?: MembershipTier;
  items: {
    itemId?: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: 'paid' | 'pending';
  status: 'New' | 'Preparing' | 'Ready' | 'Completed' | 'new' | 'preparing' | 'ready' | 'served' | 'Served';
  time?: string;
  createdAt: string;
  updatedAt: string;
}

export type CRMStage = 'new' | 'trial_booked' | 'trial_attended' | 'follow_up' | 'converted' | 'member' | 'lost' | 'contacted' | 'interested';

export interface CRMEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  sport: string;
  preferredPlan: MembershipTier | 'undecided';
  stage: CRMStage;
  source: 'Website Form' | 'Walk-in' | 'Phone Call' | 'Referral' | 'Instagram' | string;
  assignedStaff: string;
  lastContacted: string;
  followUpDate?: string;
  trialDate?: string;
  trialSlot?: string;
  notes: any;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  shift: string;
  status?: string;
  todayStatus?: string;
  specialty?: string;
  clockInTime?: string;
  attendanceRate: number;
  monthlySalary: number;
  assignedCourts?: string[];
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface UnifiedPayment {
  id: string;
  transactionId: string;
  source: 'Membership' | 'Court Booking' | 'Pro Shop' | 'Cafeteria & Bar' | string;
  customerName: string;
  customerId?: string;
  customerTier?: MembershipTier;
  amount: number;
  date: string;
  time: string;
  paymentMethod?: string;
  method?: string;
  status: 'Paid' | 'Pending' | 'Refunded' | string;
  referenceId?: string;
  description: string;
}

export type PaymentRecord = UnifiedPayment;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'booking' | 'membership' | 'inventory' | 'pos' | 'crm' | 'maintenance' | 'payment' | string;
  severity: 'info' | 'warning' | 'success' | 'critical';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
  relatedId?: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  courtName?: string;
  courtOrEquipment: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Completed' | string;
  assignedStaff?: string;
  assignedTo?: string;
  reportedDate?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  dueDate: string;
  costEstimate: number;
  description: string;
  taskDescription?: string;
  courtIdAffected?: string;
}

export interface MemberActivity {
  id: string;
  date: string;
  time: string;
  type: 'joined' | 'court_booked' | 'shop_purchase' | 'cafeteria_order' | 'payment' | 'social_play' | 'tier_upgrade';
  title: string;
  description: string;
  amount?: number;
  badge?: string;
}

export const COURTS_LIST = [
  { id: 'c1', name: 'Arena 1 — Tennis', sport: 'Tennis', surface: 'Italian Red Clay', lights: '1200 Lux Pro', basePricePerHour: 800 },
  { id: 'c2', name: 'Arena 2 — Badminton', sport: 'Badminton', surface: 'Yonex Pro Cushion Mat', lights: 'Olympic Standard', basePricePerHour: 600 },
  { id: 'c3', name: 'Arena 3 — Cricket Nets & Box', sport: 'Cricket', surface: 'High-Density Astro Turf', lights: 'Floodlight Pro LED', basePricePerHour: 1200 },
  { id: 'c4', name: 'Arena 4 — Table Tennis', sport: 'Table Tennis', surface: 'Olympic Non-Slip Floor', lights: 'Diffused Anti-Glare', basePricePerHour: 500 },
  { id: 'c5', name: 'Arena 5 — Pool & Billiards', sport: 'Pool', surface: 'Rasson Championship Slate', lights: 'Overhead Warm LED', basePricePerHour: 550 },
  { id: 'c6', name: 'Arena 6 — Squash', sport: 'Squash', surface: 'WSF Solid Maple Hardwood', lights: '1000 Lux Glassback', basePricePerHour: 700 }
];

export const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30'
];
