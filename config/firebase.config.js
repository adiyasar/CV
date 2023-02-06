import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyBEXlgMqnwk23FuYcN0PsuVgutCqiUm1xs',
  authDomain: 'nu-mar.firebaseapp.com',
  databaseURL: 'https://nu-mar-default-rtdb.firebaseio.com',
  projectId: 'nu-mar',
  storageBucket: 'nu-mar.appspot.com',
  messagingSenderId: '88841886188',
  appId: '1:88841886188:web:42c037bc5f09ad8e5d88c9',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
