<template>
  <div class="space-y-4">
    <EditorToolbar v-if="editor" :editor="editor" />

    <div
      class="min-h-[400px] rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm"
    >
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue"
import { EditorContent, useEditor } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import EditorToolbar from "./EditorToolbar.vue"

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["update:modelValue"])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image,
  ],
  editorProps: {
    attributes: {
      class:
        "prose prose-lg max-w-none focus:outline-none min-h-[350px]",
    },
  },
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editor.value) return

    const current = editor.value.getHTML()
    if (current !== newValue) {
      editor.value.commands.setContent(newValue || "", false)
    }
  }
)
</script>