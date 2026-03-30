<script setup>
import { computed, onMounted, ref } from "vue"
import { useToast } from "vue-toastification"
import { createComment, getCommentsForPost } from "../services/comment"
import { observeReaderAuth, signInWithGoogle } from "../services/publicAuth"

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
})

const toast = useToast()

const currentUser = ref(null)
const comments = ref([])
const loading = ref(true)
const submitting = ref(false)

const newComment = ref("")
const replyInputs = ref({})
const replyingTo = ref(null)

let unsubscribeAuth = null

const topLevelComments = computed(() =>
  comments.value.filter((comment) => !comment.parentId)
)

const getReplies = (commentId) => {
  return comments.value.filter((comment) => comment.parentId === commentId)
}

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return "Just now"
  return timestamp.toDate().toLocaleString()
}

const loadComments = async () => {
  try {
    loading.value = true
    comments.value = await getCommentsForPost(props.postId)
  } catch (error) {
    console.error("Failed to load comments:", error)
    toast.error("Failed to load comments.")
  } finally {
    loading.value = false
  }
}

const ensureSignedIn = async () => {
  if (currentUser.value) return true

  try {
    await signInWithGoogle()
    return true
  } catch (error) {
    console.error("Sign-in required action failed:", error)
    toast.error("Please sign in with Google to continue.")
    return false
  }
}

const handleCommentSubmit = async () => {
  const allowed = await ensureSignedIn()
  if (!allowed) return

  try {
    submitting.value = true

    await createComment({
      postId: props.postId,
      content: newComment.value,
      parentId: null,
    })

    newComment.value = ""
    await loadComments()
    toast.success("Comment posted.")
  } catch (error) {
    console.error("Failed to post comment:", error)
    toast.error(error.message || "Failed to post comment.")
  } finally {
    submitting.value = false
  }
}

const openReplyBox = async (commentId) => {
  const allowed = await ensureSignedIn()
  if (!allowed) return

  replyingTo.value = replyingTo.value === commentId ? null : commentId
}

const handleReplySubmit = async (parentId) => {
  const allowed = await ensureSignedIn()
  if (!allowed) return

  try {
    submitting.value = true

    await createComment({
      postId: props.postId,
      content: replyInputs.value[parentId] || "",
      parentId,
    })

    replyInputs.value[parentId] = ""
    replyingTo.value = null
    await loadComments()
    toast.success("Reply posted.")
  } catch (error) {
    console.error("Failed to post reply:", error)
    toast.error(error.message || "Failed to post reply.")
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  unsubscribeAuth = observeReaderAuth((user) => {
    currentUser.value = user
  })

  await loadComments()
})
</script>

<template>
  <section class="pt-10 border-t border-gray-200">
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold">Comments</h2>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50">
      <textarea
        v-model="newComment"
        rows="4"
        placeholder="Write a comment..."
        class="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
      />

      <div class="mt-3 flex items-center justify-between gap-3">
        <p class="text-sm text-gray-500">
          {{ currentUser ? `Commenting as ${currentUser.displayName || currentUser.email}` : "You need Google sign-in to comment." }}
        </p>

        <button
          type="button"
          class="rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-semibold hover:bg-black transition disabled:opacity-60"
          :disabled="submitting"
          @click="handleCommentSubmit"
        >
          {{ submitting ? "Posting..." : "Comment" }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="mt-8 text-gray-500">
      Loading comments...
    </div>

    <div v-else-if="topLevelComments.length === 0" class="mt-8 text-gray-500">
      No comments yet. Be the first to join the conversation.
    </div>

    <div v-else class="mt-8 space-y-6">
      <article
        v-for="comment in topLevelComments"
        :key="comment.id"
        class="rounded-2xl border border-gray-200 p-4 sm:p-5"
      >
        <div class="flex items-start gap-3">
          <img
            v-if="comment.authorPhotoURL"
            :src="comment.authorPhotoURL"
            alt="Author"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold"
          >
            {{ (comment.authorName || "R").slice(0, 1).toUpperCase() }}
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p class="font-semibold text-gray-900">
                {{ comment.authorName || "Reader" }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(comment.createdAt) }}
              </p>
            </div>

            <p class="mt-2 text-gray-700 leading-7 whitespace-pre-line">
              {{ comment.content }}
            </p>

            <button
              type="button"
              class="mt-3 text-sm font-medium text-gray-700 hover:text-black transition"
              @click="openReplyBox(comment.id)"
            >
              Reply
            </button>

            <div v-if="replyingTo === comment.id" class="mt-4 space-y-3">
              <textarea
                v-model="replyInputs[comment.id]"
                rows="3"
                placeholder="Write a reply..."
                class="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />

              <div class="flex items-center justify-end gap-3">
                <button
                  type="button"
                  class="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                  @click="replyingTo = null"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  class="rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black transition disabled:opacity-60"
                  :disabled="submitting"
                  @click="handleReplySubmit(comment.id)"
                >
                  {{ submitting ? "Posting..." : "Post Reply" }}
                </button>
              </div>
            </div>

            <div v-if="getReplies(comment.id).length" class="mt-5 space-y-4 border-l border-gray-200 pl-4">
              <div
                v-for="reply in getReplies(comment.id)"
                :key="reply.id"
                class="rounded-xl bg-gray-50 border border-gray-200 p-4"
              >
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p class="font-semibold text-gray-900">
                    {{ reply.authorName || "Reader" }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(reply.createdAt) }}
                  </p>
                </div>

                <p class="mt-2 text-gray-700 leading-7 whitespace-pre-line">
                  {{ reply.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>