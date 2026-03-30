<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        

        <router-link
          :to="{ name: 'WriteBlog' }"
          class="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition"
        >
          New Post
        </router-link>
      </div>

      <div
        v-if="loading"
        class="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500"
      >
        Loading published posts...
      </div>

      <div
        v-else-if="posts.length === 0"
        class="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center"
      >
        <h2 class="text-xl font-semibold text-gray-800">No published posts yet</h2>
       
        <router-link
          :to="{ name: 'WriteBlog' }"
          class="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition"
        >
          Write a post
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <article
          v-for="post in posts"
          :key="post.id"
          class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
        >
          <div v-if="post.coverImageUrl" class="h-48 overflow-hidden">
            <img
              :src="post.coverImageUrl"
              alt="Post cover"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="p-5 space-y-4">
            <div class="space-y-2">
              <div
                class="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-semibold px-3 py-1"
              >
                Published
              </div>

              <h2 class="text-xl font-bold text-gray-900 line-clamp-2">
                {{ post.title || "Untitled post" }}
              </h2>

              <p class="text-sm text-gray-500">
                Published {{ formatDate(post.publishedAt) }}
              </p>
            </div>

            <p class="text-gray-600 text-sm line-clamp-4">
              {{ getPreviewText(post.content) }}
            </p>

            <div class="flex flex-wrap gap-3 pt-2">
              <router-link
                :to="{ name: 'WriteBlog', query: { id: post.id } }"
                class="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Edit
              </router-link>

              <button
                @click="handleArchive(post.id)"
                :disabled="archivingId === post.id"
                class="inline-flex items-center justify-center rounded-xl bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-60"
              >
                {{ archivingId === post.id ? "Archiving..." : "Archive" }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useToast } from "vue-toastification"
import { getPublishedPosts, archivePost } from "../services/posts"

const toast = useToast()

const posts = ref([])
const loading = ref(true)
const archivingId = ref(null)

const stripHtml = (html) => {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

const getPreviewText = (html) => {
  const text = stripHtml(html)
  return text || "No content preview available."
}

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return "just now"
  return timestamp.toDate().toLocaleString()
}

const loadPublishedPosts = async () => {
  try {
    loading.value = true
    posts.value = await getPublishedPosts()
  } catch (error) {
    console.error("Failed to load published posts:", error)
    toast.error("Failed to load published posts.")
  } finally {
    loading.value = false
  }
}

const handleArchive = async (postId) => {
  try {
    archivingId.value = postId
    await archivePost(postId)
    posts.value = posts.value.filter((post) => post.id !== postId)
    toast.success("Post archived successfully.")
  } catch (error) {
    console.error("Failed to archive post:", error)
    toast.error("Failed to archive post.")
  } finally {
    archivingId.value = null
  }
}

onMounted(() => {
  loadPublishedPosts()
})
</script>
