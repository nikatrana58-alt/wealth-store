import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGQ1XfFsNU8Lt0iGjHocZm0yVPvAP8RFo",
  authDomain: "wealth-store-c9b24.firebaseapp.com",
  projectId: "wealth-store-c9b24",
  storageBucket: "wealth-store-c9b24.firebasestorage.app",
  messagingSenderId: "1078073019211",
  appId: "1:1078073019211:web:712165603c76defd82b6ce",
  measurementId: "G-S9PVLG25S8",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db = getFirestore(app);
export const auth = getAuth(app);
