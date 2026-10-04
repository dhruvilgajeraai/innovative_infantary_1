import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  onSnapshot, 
  Firestore,
  writeBatch
} from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Default demo / development Firebase configuration
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyArenaFlowLiveDemoKey987654321",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "arenaflow-champions-club.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "arenaflow-champions-club",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "arenaflow-champions-club.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcdef123456"
};

// Retrieve stored configuration or use default
export function getSavedFirebaseConfig(): FirebaseConfig {
  try {
    const saved = localStorage.getItem('arenaflow_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading firebase config from storage', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(cfg: FirebaseConfig) {
  localStorage.setItem('arenaflow_firebase_config', JSON.stringify(cfg));
  // Reload window or reinitialize
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isConnectedToLiveFirestore = false;

try {
  const config = getSavedFirebaseConfig();
  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  isConnectedToLiveFirestore = true;
} catch (err) {
  console.warn('Firebase initialized in local-first sync mode:', err);
  isConnectedToLiveFirestore = false;
}

export { app, db, isConnectedToLiveFirestore };

// Generic Firestore Sync helper
export async function syncCollectionToFirestore<T extends { id: string }>(
  collectionName: string, 
  items: T[]
): Promise<boolean> {
  if (!db) return false;
  try {
    const batch = writeBatch(db);
    for (const item of items) {
      const ref = doc(db, collectionName, item.id);
      batch.set(ref, item, { merge: true });
    }
    await batch.commit();
    return true;
  } catch (error) {
    console.warn(`Firestore sync error for ${collectionName}:`, error);
    return false;
  }
}

export async function fetchCollectionFromFirestore<T>(collectionName: string): Promise<T[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as T));
  } catch (error) {
    console.warn(`Firestore fetch failed for ${collectionName}:`, error);
    return [];
  }
}

// Master Cloud Sync for all Sports Complex Data
export async function syncAllSportsDataToFirestore(data: {
  courts?: any[];
  bookings?: any[];
  products?: any[];
  orders?: any[];
  posTabs?: any[];
  invoices?: any[];
  staff?: any[];
  leads?: any[];
  members?: any[];
  transactions?: any[];
}): Promise<{ success: boolean; syncedCount: number; message: string }> {
  if (!db) {
    return { success: false, syncedCount: 0, message: 'Firestore offline. Operating in resilient local storage cache mode.' };
  }
  
  try {
    let synced = 0;
    if (data.courts?.length) { await syncCollectionToFirestore('courts', data.courts); synced += data.courts.length; }
    if (data.bookings?.length) { await syncCollectionToFirestore('bookings', data.bookings); synced += data.bookings.length; }
    if (data.products?.length) { await syncCollectionToFirestore('products', data.products); synced += data.products.length; }
    if (data.orders?.length) { await syncCollectionToFirestore('orders', data.orders); synced += data.orders.length; }
    if (data.posTabs?.length) { await syncCollectionToFirestore('posTabs', data.posTabs); synced += data.posTabs.length; }
    if (data.invoices?.length) { await syncCollectionToFirestore('invoices', data.invoices); synced += data.invoices.length; }
    if (data.staff?.length) { await syncCollectionToFirestore('staff', data.staff); synced += data.staff.length; }
    if (data.leads?.length) { await syncCollectionToFirestore('leads', data.leads); synced += data.leads.length; }
    if (data.members?.length) { await syncCollectionToFirestore('members', data.members); synced += data.members.length; }
    if (data.transactions?.length) { await syncCollectionToFirestore('transactions', data.transactions); synced += data.transactions.length; }

    return { 
      success: true, 
      syncedCount: synced, 
      message: `Successfully synchronized ${synced} documents across all collections to Cloud Firestore!` 
    };
  } catch (err: any) {
    console.error('Master Cloud Sync failed:', err);
    return { success: false, syncedCount: 0, message: `Cloud sync encountered an issue: ${err.message || 'Network timeout'}` };
  }
}
