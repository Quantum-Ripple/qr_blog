<template>
  <div class="min-h-screen bg-white text-gray-900">
    <PublicAppBar />

    <main v-if="loading" class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div class="animate-pulse space-y-6">
        <div class="h-8 bg-gray-200 rounded w-2/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-72 bg-gray-200 rounded-3xl"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </main>

    <main v-else-if="post" class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <article class="space-y-8">
        <router-link
          :to="{ name: 'BlogHomeView' }"
          class="inline-flex text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          Back to Blog
        </router-link>

        <header class="max-w-3xl space-y-4">
          <p class="text-sm text-gray-500">
            {{ formatDate(post.publishedAt) }}
          </p>

          <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
            {{ post.title || "Untitled post" }}
          </h1>

          <p class="text-gray-600 text-lg leading-8">
            {{ getPreviewText(post.content, 220) }}
          </p>
        </header>

        <div
          v-if="post.coverImageUrl"
          class="overflow-hidden rounded-3xl border border-gray-200"
        >
          <img
            :src="post.coverImageUrl"
            :alt="post.title"
            class="w-full max-h-[500px] object-cover"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3 border-y border-gray-200 py-4">
          <button
            @click="copyLink"
            class="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Copy Link
          </button>

          <a
            :href="twitterShareUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Share on X
          </a>
        </div>

        <div
          class="prose prose-lg max-w-none prose-img:rounded-2xl prose-pre:rounded-2xl"
          v-html="post.content"
        />

        <CommentsSection :post-id="post.id" />
      </article>
    </main>

    <main v-else class="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
      <h1 class="text-3xl font-bold">Post not found</h1>
      <p class="text-gray-500 mt-3">This article is unavailable.</p>
      <router-link
        :to="{ name: 'BlogHomeView' }"
        class="inline-flex mt-6 rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition"
      >
        Back to Blog
      </router-link>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted ,onBeforeUnmount} from "vue"
import { useRoute } from "vue-router"
import { useToast } from "vue-toastification"
import PublicAppBar from "../components/PublicAppBar.vue"
import { getPublicPostById } from "../services/posts"
import CommentsSection from "../components/CommentSection.vue"


const route = useRoute()
const toast = useToast()

const post = ref(null)
const loading = ref(true)

let unsubscribeAuth = null

const stripHtml = (html) => {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

const getPreviewText = (html, maxLength = 180) => {
  const text = stripHtml(html)
  if (!text) return "No preview available."
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
}

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return "Recently"
  return timestamp.toDate().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const twitterShareUrl = computed(() => {
  if (!post.value) return "#"
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value.title || "Check out this post")
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard.")
  } catch (error) {
    console.error("Failed to copy link:", error)
    toast.error("Failed to copy link.")
  }
}

const loadPost = async () => {
  try {
    loading.value = true
    post.value = await getPublicPostById(route.params.id)
  } catch (error) {
    console.error("Failed to load post:", error)
    post.value = null
    toast.error("Failed to load post.")
  } finally {
    loading.value = false
  }
}
onBeforeUnmount(() => {
  if (unsubscribeAuth) unsubscribeAuth()
})

onMounted(() => {
  loadPost()
})
</script>
