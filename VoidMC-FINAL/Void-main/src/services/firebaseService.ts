import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import {
  Order,
  UserAccount,
  ServerConfig,
  AuditLog,
  SiteContent,
  StoreItem,
  ShowcaseImage,
  Coupon,
  BanRecord,
  LeaderboardPlayer,
} from '../types/index.ts';
import { mergeSiteContent } from '../data/defaults.ts';

// 1. ORDERS SERVICE
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, order);
  } catch (err) {
    console.warn('Could not save order to Firestore directly; local copy preserved.', err);
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (err) {
    console.warn('Could not update order status in Firestore.', err);
  }
}

export function subscribeToOrders(onUpdate: (orders: Order[]) => void) {
  try {
    const q = query(collection(db, 'orders'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Order);
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Orders subscription note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Failed to start orders subscription', err);
    return () => {};
  }
}

// 2. USER ACCOUNT SERVICE
export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, user);
  } catch (err) {
    console.warn('Could not save user to Firestore.', err);
  }
}

export async function loginOrRegisterPlayer(
  username: string,
  pass: string,
  isSignUp: boolean,
  emailProvided?: string
): Promise<UserAccount> {
  const cleanUsername = username.trim();
  const authEmail =
    emailProvided?.trim() || `${cleanUsername.toLowerCase().replace(/[^a-z0-9_]/g, '')}@voidmc.fun`;

  let firebaseUid = `usr_${cleanUsername.toLowerCase()}`;

  try {
    const { auth } = await import('../firebase.ts');
    const {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signInAnonymously,
    } = await import('firebase/auth');

    if (isSignUp) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, pass);
        firebaseUid = cred.user.uid;
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          const cred = await signInWithEmailAndPassword(auth, authEmail, pass);
          firebaseUid = cred.user.uid;
        } else {
          const cred = await signInAnonymously(auth);
          firebaseUid = cred.user.uid;
        }
      }
    } else {
      try {
        const cred = await signInWithEmailAndPassword(auth, authEmail, pass);
        firebaseUid = cred.user.uid;
      } catch (err) {
        const cred = await signInAnonymously(auth);
        firebaseUid = cred.user.uid;
      }
    }
  } catch (authErr) {
    console.warn('Firebase Auth note (syncing profile via Firestore):', authErr);
  }

  // Check if existing document in Firestore
  let existingCoins = isSignUp ? 1200 : 850;
  let existingRank = 'ABYSS MEMBER';
  try {
    const { getDoc } = await import('firebase/firestore');
    const userDocRef = doc(db, 'users', firebaseUid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserAccount;
      existingCoins = data.coins ?? existingCoins;
      existingRank = data.rank ?? existingRank;
    }
  } catch (err) {
    console.warn('Firestore doc check note:', err);
  }

  const userAccount: UserAccount = {
    uid: firebaseUid,
    username: cleanUsername,
    email: emailProvided?.trim() || undefined,
    role: 'player',
    rank: existingRank,
    coins: existingCoins,
    avatarUrl: `https://mc-heads.net/avatar/${cleanUsername}/64`,
    createdAt: new Date().toISOString(),
  };

  // Persist directly to Firestore
  await saveUserToFirestore(userAccount);

  return userAccount;
}

// 3. SERVER CONFIG SERVICE
export async function saveServerConfigToFirestore(config: ServerConfig): Promise<void> {
  try {
    const cfgRef = doc(db, 'config', 'server');
    await setDoc(cfgRef, config);
  } catch (err) {
    console.warn('Could not sync server config to Firestore.', err);
  }
}

export function subscribeToServerConfig(onUpdate: (config: ServerConfig) => void) {
  try {
    const cfgRef = doc(db, 'config', 'server');
    return onSnapshot(
      cfgRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as ServerConfig);
        }
      },
      (error) => {
        console.warn('Config subscription note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to server config', err);
    return () => {};
  }
}

// 4. AUDIT LOG SERVICE
// Firestore rejects `undefined` field values; a JSON round trip drops those keys.
const plain = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export async function saveAuditLogToFirestore(log: AuditLog): Promise<void> {
  try {
    const logRef = doc(db, 'auditLogs', log.id);
    await setDoc(logRef, { ...log, createdAt: Date.now() });
  } catch (err) {
    console.warn('Could not save audit log to Firestore.', err);
  }
}

export function subscribeToAuditLogs(onUpdate: (logs: AuditLog[]) => void) {
  try {
    const q = query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'), limit(150));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: AuditLog[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as AuditLog);
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('Audit log subscription note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Failed to start audit log subscription', err);
    return () => {};
  }
}

// 5. SITE CONTENT SERVICE (discounts + platform links)
// Admin-managed data lives in the `config` collection under prefixed document ids, because the
// rules already deployed for this project allow reading and writing it from the browser.
const CONTENT_COLLECTION = 'config';
const SITE_CONTENT_DOC = 'site_content';
const STORE_CATALOG_DOC = 'store_catalog';
const SHOWCASE_DOC_PREFIX = 'showcase_';

export async function saveSiteContentToFirestore(content: SiteContent): Promise<void> {
  try {
    await setDoc(doc(db, CONTENT_COLLECTION, SITE_CONTENT_DOC), plain(content));
  } catch (err) {
    console.warn('Could not sync site content to Firestore.', err);
  }
}

export function subscribeToSiteContent(onUpdate: (content: SiteContent) => void) {
  try {
    return onSnapshot(
      doc(db, CONTENT_COLLECTION, SITE_CONTENT_DOC),
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(mergeSiteContent(snapshot.data() as Partial<SiteContent>));
        }
      },
      (error) => {
        console.warn('Site content subscription note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to site content', err);
    return () => {};
  }
}

// 6. STORE CATALOG SERVICE
export async function saveStoreItemsToFirestore(items: StoreItem[]): Promise<void> {
  try {
    await setDoc(doc(db, CONTENT_COLLECTION, STORE_CATALOG_DOC), plain({ items }));
  } catch (err) {
    console.warn('Could not sync store items to Firestore.', err);
  }
}

export function subscribeToStoreItems(onUpdate: (items: StoreItem[]) => void) {
  try {
    return onSnapshot(
      doc(db, CONTENT_COLLECTION, STORE_CATALOG_DOC),
      (snapshot) => {
        const data = snapshot.data() as { items?: StoreItem[] } | undefined;
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          onUpdate(data.items);
        }
      },
      (error) => {
        console.warn('Store items subscription note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to store items', err);
    return () => {};
  }
}

// 7. SHARED LISTS SERVICE (coupons / bans / leaderboard)
type ListKind = 'coupons' | 'bans' | 'leaderboard';

const LIST_DOC: Record<ListKind, string> = {
  coupons: 'list_coupons',
  bans: 'list_bans',
  leaderboard: 'list_leaderboard',
};

export async function saveListToFirestore(kind: ListKind, rows: unknown[]): Promise<void> {
  try {
    await setDoc(doc(db, CONTENT_COLLECTION, LIST_DOC[kind]), plain({ rows }));
  } catch (err) {
    console.warn(`Could not sync ${kind} to Firestore.`, err);
  }
}

export function subscribeToList<T>(kind: ListKind, onUpdate: (rows: T[]) => void) {
  try {
    return onSnapshot(
      doc(db, CONTENT_COLLECTION, LIST_DOC[kind]),
      (snapshot) => {
        const data = snapshot.data() as { rows?: T[] } | undefined;
        if (data && Array.isArray(data.rows)) {
          onUpdate(data.rows);
        }
      },
      (error) => {
        console.warn(`${kind} subscription note:`, error.message);
      }
    );
  } catch (err) {
    console.warn(`Failed to subscribe to ${kind}`, err);
    return () => {};
  }
}

export function subscribeToCoupons(onUpdate: (rows: Coupon[]) => void) {
  return subscribeToList<Coupon>('coupons', onUpdate);
}

export function subscribeToBans(onUpdate: (rows: BanRecord[]) => void) {
  return subscribeToList<BanRecord>('bans', onUpdate);
}

export function subscribeToLeaderboard(onUpdate: (rows: LeaderboardPlayer[]) => void) {
  return subscribeToList<LeaderboardPlayer>('leaderboard', onUpdate);
}

// 8. SHOWCASE GALLERY SERVICE
// One document per photo: a single shared doc would hit Firestore's 1 MiB limit after a few uploads.
export async function saveShowcasePhotoToFirestore(photo: ShowcaseImage): Promise<void> {
  try {
    await setDoc(doc(db, CONTENT_COLLECTION, SHOWCASE_DOC_PREFIX + photo.id), {
      ...plain(photo),
      createdAt: photo.createdAt ?? Date.now(),
    });
  } catch (err) {
    console.warn('Could not save showcase photo to Firestore.', err);
  }
}

export async function updateShowcaseCaptionInFirestore(id: string, caption: string): Promise<void> {
  try {
    await updateDoc(doc(db, CONTENT_COLLECTION, SHOWCASE_DOC_PREFIX + id), { caption });
  } catch (err) {
    console.warn('Could not update showcase caption in Firestore.', err);
  }
}

export async function deleteShowcasePhotoFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CONTENT_COLLECTION, SHOWCASE_DOC_PREFIX + id));
  } catch (err) {
    console.warn('Could not delete showcase photo from Firestore.', err);
  }
}

export function subscribeToShowcasePhotos(onUpdate: (photos: ShowcaseImage[]) => void) {
  try {
    return onSnapshot(
      collection(db, CONTENT_COLLECTION),
      (snapshot) => {
        const list: ShowcaseImage[] = [];
        snapshot.forEach((docSnap) => {
          if (!docSnap.id.startsWith(SHOWCASE_DOC_PREFIX) || !docSnap.exists()) return;
          list.push(docSnap.data() as ShowcaseImage);
        });
        list.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
        onUpdate(list.slice(0, 60));
      },
      (error) => {
        console.warn('Showcase photo subscription note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Failed to start showcase photo subscription', err);
    return () => {};
  }
}
