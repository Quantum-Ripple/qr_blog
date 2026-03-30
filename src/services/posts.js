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
import { getAuth } from "firebase/auth"
import { db } from "../firebase"

const auth = getAuth()
const postsCollection = collection(db, "posts")

const requireUser = () => {
  const user = auth.currentUser
  if (!user) {
    throw new Error("You must be signed in.")
  }
  return user
}

export const createDraftPost = async () => {
  const user = requireUser()

  const docRef = await addDoc(postsCollection, {
    authorId: user.uid,
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
  requireUser()

  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const getPostById = async (postId) => {
  requireUser()

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
  requireUser()

  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    ...data,
    status: "published",
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const archivePost = async (postId) => {
  requireUser()

  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    status: "archived",
    updatedAt: serverTimestamp(),
  })
}

export const getDraftPosts = async () => {
  const user = requireUser()

  const q = query(
    postsCollection,
    where("authorId", "==", user.uid),
    where("status", "==", "draft"),
    orderBy("updatedAt", "desc")
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const getPublishedPosts = async () => {
  const user = requireUser()

  const q = query(
    postsCollection,
    where("authorId", "==", user.uid),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const getArchivedPosts = async () => {
  const user = requireUser()

  const q = query(
    postsCollection,
    where("authorId", "==", user.uid),
    where("status", "==", "archived"),
    orderBy("updatedAt", "desc")
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const restorePostToDraft = async (postId) => {
  requireUser()

  const postRef = doc(db, "posts", postId)
  await updateDoc(postRef, {
    status: "draft",
    updatedAt: serverTimestamp(),
  })
}

export const getAllPosts = async () => {
  const user = requireUser()

  const q = query(
    postsCollection,
    where("authorId", "==", user.uid),
    orderBy("updatedAt", "desc")
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const getPublicPublishedPosts = async () => {
  const q = query(
    postsCollection,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const getPublicPostById = async (postId) => {
  const postRef = doc(db, "posts", postId)
  const snapshot = await getDoc(postRef)

  if (!snapshot.exists()) {
    throw new Error("Post not found")
  }

  const post = {
    id: snapshot.id,
    ...snapshot.data(),
  }

  if (post.status !== "published") {
    throw new Error("Post not available")
  }

  return post
}