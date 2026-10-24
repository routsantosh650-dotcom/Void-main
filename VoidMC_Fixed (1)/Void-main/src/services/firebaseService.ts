import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import { Order, UserAccount, ServerConfig, AuditLog } from '../types/index.ts';

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
export async function saveAuditLogToFirestore(log: AuditLog): Promise<void> {
  try {
    const logRef = doc(db, 'auditLogs', log.id);
    await setDoc(logRef, log);
  } catch (err) {
    console.warn('Could not save audit log to Firestore.', err);
  }
}
