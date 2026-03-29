<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        

        <router-link
          to="/edit"
          class="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition"
        >
          New Post
        </router-link>
      </div>

      <div v-if="loading" class="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500">
        Loading drafts...
      </div>

      <div
        v-else-if="drafts.length === 0"
        class="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center"
      >
        <h2 class="text-xl font-semibold text-gray-800">No drafts yet</h2>
        

        <router-link
          to="/edit"
          class="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition"
        >
          Write your first post
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="draft in drafts"
          :key="draft.id"
          class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
        >
          <div v-if="draft.coverImageUrl" class="h-48 overflow-hidden">
            <img
              :src="draft.coverImageUrl"
              alt="Draft cover"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="p-5 space-y-4">
            <div class="space-y-2">
              <div class="inline-flex items-center rounded-full bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1">
                Draft
              </div>

              <h2 class="text-xl font-bold text-gray-900 line-clamp-2">
                {{ draft.title || "Untitled draft" }}
              </h2>

              <p class="text-sm text-gray-500">
                Updated {{ formatDate(draft.updatedAt) }}
              </p>
            </div>

            <p class="text-gray-600 text-sm line-clamp-4">
              {{ getPreviewText(draft.content) }}
            </p>

            <div class="pt-2">
              <router-link
                :to="`/edit?id=${draft.id}`"
                class="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Continue Writing
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getDraftPosts } from "../services/posts"

const drafts = ref([])
const loading = ref(true)

const stripHtml = (html) => {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").trim()
}

const getPreviewText = (html) => {
  const text = stripHtml(html)
  return text || "No content yet..."
}

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return "just now"

  return timestamp.toDate().toLocaleString()
}

const loadDrafts = async () => {
  try {
    loading.value = true
    drafts.value = await getDraftPosts()
  } catch (error) {
    console.error("Failed to load drafts:", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDrafts()
})
</script>