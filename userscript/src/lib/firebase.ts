// Configuração e inicialização do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyDjL3e2KxKqchkzJtyUcY7VZ-w1cC70QHM",
  authDomain: "drinkwater-5fca5.firebaseapp.com",
  projectId: "drinkwater-5fca5",
  storageBucket: "drinkwater-5fca5.firebasestorage.app",
  messagingSenderId: "815020126595",
  appId: "1:815020126595:web:118fc15974861e291d06b6"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;