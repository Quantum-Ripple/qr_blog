<template>
  <div class="flex flex-wrap gap-2 border border-gray-200 rounded-xl p-3 bg-white">
    <button
      type="button"
      @click="editor.chain().focus().toggleBold().run()"
      :class="buttonClass(editor.isActive('bold'))"
    >
      Bold
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleItalic().run()"
      :class="buttonClass(editor.isActive('italic'))"
    >
      Italic
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="buttonClass(editor.isActive('heading', { level: 1 }))"
    >
      H1
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="buttonClass(editor.isActive('heading', { level: 2 }))"
    >
      H2
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleBulletList().run()"
      :class="buttonClass(editor.isActive('bulletList'))"
    >
      Bullet List
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleOrderedList().run()"
      :class="buttonClass(editor.isActive('orderedList'))"
    >
      Ordered List
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleBlockquote().run()"
      :class="buttonClass(editor.isActive('blockquote'))"
    >
      Quote
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleCodeBlock().run()"
      :class="buttonClass(editor.isActive('codeBlock'))"
    >
      Code
    </button>

    <button
      type="button"
      @click="addImage"
      class="px-3 py-2 rounded-lg border text-sm font-medium bg-gray-50 hover:bg-gray-100"
    >
      Add Image
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
})

const buttonClass = (active) =>
  [
    "px-3 py-2 rounded-lg border text-sm font-medium transition",
    active
      ? "bg-gray-900 text-white border-gray-900"
      : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700",
  ].join(" ")

const addImage = () => {
  const url = window.prompt("Enter image URL")
  if (!url) return

  props.editor.chain().focus().setImage({ src: url }).run()
}
</script>