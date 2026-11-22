const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBjUkGjwsSZ_ZZQFTpnzCBmkVy7ickoMr0",
  authDomain: "islamic-alo-bac6a.firebaseapp.com",
  projectId: "islamic-alo-bac6a",
  storageBucket: "islamic-alo-bac6a.firebasestorage.app",
  messagingSenderId: "218549105493",
  appId: "1:218549105493:web:4a152d6dd6bfcfb34cb5dc",
  measurementId: "G-2NY719J7Z8"
};

const ADMIN_EMAIL = "saharuk787@gmail.com";

if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const fbAuth = typeof firebase !== "undefined" ? firebase.auth() : null;
const fbDb = typeof firebase !== "undefined" ? firebase.firestore() : null;

function signInWithGoogle() {
  if (!fbAuth) return Promise.reject(new Error("Firebase Auth not loaded"));
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return fbAuth.signInWithPopup(provider);
}

function signOutUser() {
  if (!fbAuth) return Promise.resolve();
  return fbAuth.signOut();
}

function isAdminUser(user) {
  return Boolean(user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
}
