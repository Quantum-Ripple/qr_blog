<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        <router-link
          :to="{ name: 'WriteBlog' }"
          class="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition"
        >
          New Post
        </router-link>
      </div>

      <!-- Stats -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse h-32"
        />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Total Posts</p>
          <h2 class="mt-3 text-3xl font-bold text-gray-900">{{ totalPosts }}</h2>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Drafts</p>
          <h2 class="mt-3 text-3xl font-bold text-amber-600">{{ draftsCount }}</h2>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Published</p>
          <h2 class="mt-3 text-3xl font-bold text-green-600">{{ publishedCount }}</h2>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Archived</p>
          <h2 class="mt-3 text-3xl font-bold text-gray-700">{{ archivedCount }}</h2>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <router-link
            :to="{ name: 'WriteBlog' }"
            class="rounded-2xl border border-gray-200 p-5 hover:bg-gray-50 transition"
          >
            <h3 class="font-semibold text-gray-900">Write New Post</h3>
            <p class="text-sm text-gray-500 mt-1">Start a fresh draft.</p>
          </router-link>

          <router-link
            :to="{ name: 'DraftView' }"
            class="rounded-2xl border border-gray-200 p-5 hover:bg-gray-50 transition"
          >
            <h3 class="font-semibold text-gray-900">Drafts</h3>
            <p class="text-sm text-gray-500 mt-1">Continue unfinished writing.</p>
          </router-link>

          <router-link
            :to="{ name: 'PublishView' }"
            class="rounded-2xl border border-gray-200 p-5 hover:bg-gray-50 transition"
          >
            <h3 class="font-semibold text-gray-900">Published</h3>
            <p class="text-sm text-gray-500 mt-1">Manage live posts.</p>
          </router-link>

          <router-link
            :to="{ name: 'Archive' }"
            class="rounded-2xl border border-gray-200 p-5 hover:bg-gray-50 transition"
          >
            <h3 class="font-semibold text-gray-900">Archived</h3>
            <p class="text-sm text-gray-500 mt-1">Restore older posts.</p>
          </router-link>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900">Recent Posts</h2>
        </div>

        <div v-if="!loading && recentPosts.length === 0" class="text-center py-10">
          <h3 class="text-lg font-semibold text-gray-800">No posts yet</h3>
          

          <router-link
            :to="{ name: 'WriteBlog' }"
            class="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition"
          >
            Create your first post
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <article
            v-for="post in recentPosts"
            :key="post.id"
            class="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div v-if="post.coverImageUrl" class="h-44 overflow-hidden">
              <img
                :src="post.coverImageUrl"
                alt="Post cover"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(post.status)"
                >
                  {{ post.status }}
                </span>

                <span class="text-xs text-gray-400">
                  {{ formatDate(post.updatedAt) }}
                </span>
              </div>

              <h3 class="text-lg font-bold text-gray-900 line-clamp-2">
                {{ post.title || "Untitled post" }}
              </h3>

              <p class="text-sm text-gray-600 line-clamp-3">
                {{ getPreviewText(post.content) }}
              </p>

              <div class="pt-2">
                <router-link
                  :to="{ name: 'WriteBlog', query: { id: post.id } }"
                  class="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Open Post
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useToast } from "vue-toastification"
import { getAllPosts } from "../services/posts"

const toast = useToast()

const posts = ref([])
const loading = ref(true)

const totalPosts = computed(() => posts.value.length)
const draftsCount = computed(() =>
  posts.value.filter(post => post.status === "draft").length
)
const publishedCount = computed(() =>
  posts.value.filter(post => post.status === "published").length
)
const archivedCount = computed(() =>
  posts.value.filter(post => post.status === "archived").length
)

const recentPosts = computed(() => posts.value.slice(0, 6))

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

const statusClass = (status) => {
  switch (status) {
    case "draft":
      return "bg-amber-100 text-amber-700"
    case "published":
      return "bg-green-100 text-green-700"
    case "archived":
      return "bg-gray-200 text-gray-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const loadDashboard = async () => {
  try {
    loading.value = true
    posts.value = await getAllPosts()
  } catch (error) {
    console.error("Failed to load dashboard posts:", error)
    toast.error("Failed to load dashboard data.")
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
