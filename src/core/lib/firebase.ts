// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDkPWLkwyRQPTlK2YdxoL3VKOuUDyRlOYs",
  authDomain: "rocha-brindes.firebaseapp.com",
  projectId: "rocha-brindes",
  storageBucket: "rocha-brindes.firebasestorage.app",
  messagingSenderId: "400382511245",
  appId: "1:400382511245:web:526a56c3d9ed19ffe2fac4",
  measurementId: "G-2M3853EFPV"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()