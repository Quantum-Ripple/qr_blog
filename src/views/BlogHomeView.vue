<template>
  <div class="min-h-screen bg-[#f8f5ef] text-[#1f1a17]">
    <PublicAppBar />


    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
      <!-- Featured -->
      <section v-if="featuredPost" class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="h-px flex-1 bg-[#d9d1c7]" />
          <h2 class="text-sm uppercase tracking-[0.3em] text-[#7a6f63] font-semibold">
            Featured Story
          </h2>
          <div class="h-px flex-1 bg-[#d9d1c7]" />
        </div>

        <article
          class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-8 lg:gap-12 items-start"
        >
          <div
            v-if="featuredPost.coverImageUrl"
            class="overflow-hidden border border-[#d9d1c7] bg-white"
          >
            <img
              :src="featuredPost.coverImageUrl"
              :alt="featuredPost.title"
              class="w-full h-[260px] sm:h-[380px] lg:h-[460px] object-cover"
            />
          </div>

          <div class="space-y-5">
            <p class="text-sm text-[#7a6f63] tracking-wide">
              {{ formatDate(featuredPost.publishedAt) }}
            </p>

            <h3
              class="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-[#1f1a17]"
            >
              {{ featuredPost.title || "Untitled post" }}
            </h3>

            <p class="text-[15px] sm:text-base leading-8 text-[#4f463d]">
              {{ getPreviewText(featuredPost.content, 240) }}
            </p>

            <router-link
              :to="{ name: 'BlogPostView', params: { id: featuredPost.id } }"
              class="inline-flex items-center gap-2 border-b border-[#1f1a17] pb-1 text-sm sm:text-base font-semibold text-[#1f1a17] hover:opacity-70 transition"
            >
              Read full article
              <span aria-hidden="true">→</span>
            </router-link>
          </div>
        </article>
      </section>

      <!-- Latest Posts -->
      <section class="space-y-8">
        <div class="flex items-center gap-4">
          <div class="h-px flex-1 bg-[#d9d1c7]" />
          <h2 class="text-sm uppercase tracking-[0.3em] text-[#7a6f63] font-semibold">
            Recent Posts
          </h2>
          <div class="h-px flex-1 bg-[#d9d1c7]" />
        </div>

        <div v-if="loading" class="space-y-5">
          <div
            v-for="n in 4"
            :key="n"
            class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 border-b border-[#ddd4c9] pb-5 animate-pulse"
          >
            <div class="h-40 bg-[#e8e1d7]" />
            <div class="space-y-3">
              <div class="h-4 w-28 bg-[#e8e1d7]" />
              <div class="h-8 w-3/4 bg-[#e8e1d7]" />
              <div class="h-4 w-full bg-[#e8e1d7]" />
              <div class="h-4 w-5/6 bg-[#e8e1d7]" />
            </div>
          </div>
        </div>

        <div
          v-else-if="posts.length === 0"
          class="border border-dashed border-[#cfc5b8] bg-[#f3eee6] px-6 py-12 text-center"
        >
          <h3 class="font-serif text-2xl font-semibold text-[#1f1a17]">
            No posts published yet
          </h3>
          <p class="mt-3 text-[#6d6258] leading-7">
            Published articles will appear here when they are available.
          </p>
        </div>

        <div v-else class="divide-y divide-[#ddd4c9] border-t border-[#ddd4c9]">
          <article
            v-for="post in remainingPosts"
            :key="post.id"
            class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 py-6"
          >
            <div
              v-if="post.coverImageUrl"
              class="overflow-hidden border border-[#d9d1c7] bg-white"
            >
              <img
                :src="post.coverImageUrl"
                :alt="post.title"
                class="w-full h-44 md:h-full min-h-[170px] object-cover"
              />
            </div>

            <div v-else class="hidden md:block border border-[#d9d1c7] bg-[#efe8dd]" />

            <div class="space-y-3 self-center">
              <p class="text-sm text-[#7a6f63]">
                {{ formatDate(post.publishedAt) }}
              </p>

              <h3
                class="font-serif text-2xl sm:text-3xl font-semibold leading-snug text-[#1f1a17]"
              >
                {{ post.title || "Untitled post" }}
              </h3>

              <p class="text-[15px] leading-8 text-[#4f463d] max-w-3xl">
                {{ getPreviewText(post.content, 180) }}
              </p>

              <router-link
                :to="{ name: 'BlogPostView', params: { id: post.id } }"
                class="inline-flex items-center gap-2 border-b border-[#1f1a17] pb-1 text-sm font-semibold text-[#1f1a17] hover:opacity-70 transition"
              >
                Continue reading
                <span aria-hidden="true">→</span>
              </router-link>
            </div>
          </article>
        </div>
      </section>
    </main>

    <footer class="border-t border-[#d9d1c7] bg-[#f3eee6] mt-16">
      <div
        class="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-[#6d6258]"
      >
        <p>© 2026 Wild & Free. All rights reserved.</p>
        <p><a href="mailto:hello@quantumripple.co.ke" class="hover:underline">hello@quantumripple.co.ke</a></p>
        <p class="italic">Written for thoughtful readers.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useToast } from "vue-toastification"
import PublicAppBar from "../components/PublicAppBar.vue"
import { getPublicPublishedPosts } from "../services/posts"

const toast = useToast()

const posts = ref([])
const loading = ref(true)

const featuredPost = computed(() => posts.value[0] || null)
const remainingPosts = computed(() => posts.value.slice(1))

const stripHtml = (html) => {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

const getPreviewText = (html, maxLength = 160) => {
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

const loadPosts = async () => {
  try {
    loading.value = true
    posts.value = await getPublicPublishedPosts()
  } catch (error) {
    console.error("Failed to load public posts:", error)
    toast.error("Failed to load blog posts.")
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPosts()
})
</script>
