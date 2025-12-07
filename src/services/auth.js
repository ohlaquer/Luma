import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

// Реєстрація
export async function signUp(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
}

// Логін
export async function signIn(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

// Відновлення паролю
export async function resetPassword(email) {
    return await sendPasswordResetEmail(auth, email);
}

// Вихід
export async function logOut() {
    return await signOut(auth);
}
