<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ postId ? "Edit Post" : "Write Post" }}
          </h1>
          
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <SaveStatus :status="saveStatus" />

          <button
            @click="handleSaveDraft"
            :disabled="loading || saving"
            class="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
          >
            {{ saving ? "Saving..." : "Save Draft" }}
          </button>

          <button
            @click="handlePublish"
            :disabled="loading || publishing"
            class="rounded-xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black transition disabled:opacity-60"
          >
            {{ publishing ? "Publishing..." : "Publish" }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="rounded-2xl bg-white border border-gray-200 p-6 text-gray-500">
        Loading editor...
      </div>

      <div v-else class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              v-model="title"
              type="text"
              placeholder="Write your post title..."
              class="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <CoverImageUploader v-model="coverImageUrl" />
        </div>

        <BlogEditor v-model="content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useToast } from "vue-toastification"

import BlogEditor from "../components/editor/BlogEditor.vue"
import SaveStatus from "../components/editor/SaveStatus.vue"
import CoverImageUploader from "../components/editor/CoverImageUpload.vue"

import {
  createDraftPost,
  updatePost,
  getPostById,
  publishPost,
} from "../services/posts"

const route = useRoute()
const router = useRouter()
const toast = useToast()

const postId = ref(null)

const title = ref("")
const content = ref("")
const coverImageUrl = ref("")

const loading = ref(true)
const saving = ref(false)
const publishing = ref(false)
const saveStatus = ref("idle")

const initializeEditor = async () => {
  loading.value = true

  try {
    const queryId = route.query.id

    if (queryId) {
      postId.value = queryId

      const post = await getPostById(queryId)
      title.value = post.title || ""
      content.value = post.content || ""
      coverImageUrl.value = post.coverImageUrl || ""
    }
  } catch (error) {
    console.error("Failed to initialize editor:", error)
    toast.error("Failed to load post.")
  } finally {
    loading.value = false
  }
}

const getPayload = () => ({
  title: title.value.trim(),
  content: content.value,
  coverImageUrl: coverImageUrl.value?.trim() || "",
})

const handleSaveDraft = async () => {
  try {
    saving.value = true
    saveStatus.value = "saving"

    if (!postId.value) {
      postId.value = await createDraftPost()
      await router.replace({
        name: "WriteBlog",
        query: { id: postId.value },
      })
    }

    const payload = getPayload()

    await updatePost(postId.value, {
      ...payload,
      status: "draft",
    })

    saveStatus.value = "saved"
    toast.success("Draft saved successfully.")
  } catch (error) {
    console.error("Save draft failed:", error)
    saveStatus.value = "error"
    toast.error("Failed to save draft.")
  } finally {
    saving.value = false
  }
}

const handlePublish = async () => {
  try {
    publishing.value = true
    saveStatus.value = "saving"

    const payload = getPayload()

    if (!payload.title) {
      toast.error("Please add a title before publishing.")
      return
    }

    const plainContent = payload.content.replace(/<[^>]*>/g, "").trim()
    if (!plainContent) {
      toast.error("Please write some content before publishing.")
      return
    }

    if (!postId.value) {
      postId.value = await createDraftPost()
      await router.replace({
        name: "WriteBlog",
        query: { id: postId.value },
      })
    }

    await publishPost(postId.value, payload)

    saveStatus.value = "saved"
    toast.success("Post published successfully.")

    router.push({ name: "PublishView" })
  } catch (error) {
    console.error("Publish failed:", error)
    saveStatus.value = "error"
    toast.error("Failed to publish post.")
  } finally {
    publishing.value = false
  }
}

onMounted(() => {
  initializeEditor()
})
</script>
