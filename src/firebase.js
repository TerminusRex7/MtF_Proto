import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGcSmtn6VelahxLbHC63Xm4h-GcRaeWoY",
  authDomain: "mtfproto.firebaseapp.com",
  projectId: "mtfproto",
  storageBucket: "mtfproto.firebasestorage.app",
  messagingSenderId: "783381494970",
  appId: "1:783381494970:web:0c33124208b3d0e0175683",
  measurementId: "G-7GXZB7L2NV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// For simplicity without auth, we use a static user ID for the demo/prototype
const MOCK_UID = "demo_user_001";

export const saveAssessment = async (assessmentData) => {
  try {
    const docRef = doc(db, "users", MOCK_UID, "assessment", "current");
    await setDoc(docRef, {
      ...assessmentData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving assessment:", error);
    return false;
  }
};

export const saveHistorySnapshot = async (assessmentData, source) => {
  try {
    const historyRef = doc(collection(db, "users", MOCK_UID, "assessment_history"));
    await setDoc(historyRef, {
      ...assessmentData,
      source,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving history:", error);
  }
};

export const savePlanState = async (planData) => {
  try {
    const docRef = doc(db, "users", MOCK_UID, "plan", "current");
    await setDoc(docRef, {
      ...planData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving plan:", error);
  }
};

export default db;
