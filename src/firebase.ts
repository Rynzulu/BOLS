import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  setLogLevel 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Configure log level to avoid benign offline watchdog noise in console
try {
  setLogLevel('error');
} catch (_) {}

// CRITICAL: Initialize Firestore with database ID specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Connectivity check helper with defensive timeout
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000));
    const probePromise = (async () => {
      try {
        await getDoc(doc(db, 'schoolConfig', 'profile'));
        return true;
      } catch (error: any) {
        if (error?.message?.includes('the client is offline')) {
          return false;
        }
        return true;
      }
    })();
    return await Promise.race([probePromise, timeoutPromise]);
  } catch (_) {
    return false;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  
  // Suppress benign offline/unavailable network messages when running locally or during transient offline states
  const isOfflineOrUnavailable = 
    errMsg.includes('unavailable') || 
    errMsg.includes('the client is offline') || 
    errMsg.includes('Could not reach Cloud Firestore backend') ||
    errMsg.includes('network');

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };

  if (!isOfflineOrUnavailable) {
    console.error('Firestore Error:', JSON.stringify(errInfo));
  } else {
    console.debug('Firestore running in offline local persistence mode:', errInfo.path);
  }

  return errInfo;
}
