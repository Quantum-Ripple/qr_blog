import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db, auth } from "../firebase"

const commentsCollection = collection(db, "comments")

export const getCommentsForPost = async (postId) => {
  const q = query(
    commentsCollection,
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const createComment = async ({ postId, content, parentId = null }) => {
  const user = auth.currentUser

  if (!user) {
    throw new Error("You must be signed in to comment.")
  }

  const trimmed = content.trim()
  if (!trimmed) {
    throw new Error("Comment cannot be empty.")
  }

  await addDoc(commentsCollection, {
    postId,
    parentId,
    content: trimmed,
    authorId: user.uid,
    authorName: user.displayName || "Reader",
    authorEmail: user.email || "",
    authorPhotoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}