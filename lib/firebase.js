import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGQ1XfFsNU8Lt0iGjHocZm0yVPvAP8RFo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "wealth-store-c9b24.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wealth-store-c9b24",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "wealth-store-c9b24.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1078073019211",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1078073019211:web:712165603c76defd82b6ce",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-S9PVLG25S8",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("[firebase] initialized new app", { projectId: firebaseConfig.projectId });
} else {
  app = getApp();
  console.log("[firebase] using existing app", { projectId: firebaseConfig.projectId });
}

export const db = getFirestore(app);
export const auth = getAuth(app);
