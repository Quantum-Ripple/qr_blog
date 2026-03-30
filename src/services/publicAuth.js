import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "../firebase"

const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export const signOutReader = async () => {
  await signOut(auth)
}

export const observeReaderAuth = (callback) => {
  return onAuthStateChanged(auth, callback)
}