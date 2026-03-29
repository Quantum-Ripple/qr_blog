import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../firebase"

const postsCollection = collection(db, "posts")

export const createDraftPost = async () => {
  const docRef = await addDoc(postsCollection, {
    title: "",
    content: "",
    status: "draft",
    coverImageUrl: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: null,
  })

  return docRef.id
}

export const updatePost = async (postId, data) => {
  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const getPostById = async (postId) => {
  const postRef = doc(db, "posts", postId)
  const snapshot = await getDoc(postRef)

  if (!snapshot.exists()) {
    throw new Error("Post not found")
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export const publishPost = async (postId, data) => {
  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    ...data,
    status: "published",
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const archivePost = async (postId) => {
  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    status: "archived",
    updatedAt: serverTimestamp(),
  })
}

// New function to fetch all drafts
export const getDraftPosts = async () => {
  const q = query(postsCollection, where("status", "==", "draft"))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const getPublishedPosts = async () => {
  const q = query(
    postsCollection, 
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}



export const getArchivedPosts = async () => {
  const q = query(
    postsCollection,
    where("status", "==", "archived"),
    orderBy("updatedAt", "desc")
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const restorePostToDraft = async (postId) => {
  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    status: "draft",
    updatedAt: serverTimestamp(),
  })
}

export const getAllPosts = async () => {
  const q = query(postsCollection, orderBy("updatedAt", "desc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}