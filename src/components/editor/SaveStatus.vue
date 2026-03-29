<template>
  <div class="text-sm">
    <span
      :class="{
        'text-gray-500': status === 'idle',
        'text-blue-600': status === 'saving',
        'text-green-600': status === 'saved',
        'text-red-600': status === 'error'
      }"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  status: {
    type: String,
    default: "idle",
  },
})

const label = computed(() => {
  switch (props.status) {
    case "saving":
      return "Saving..."
    case "saved":
      return "Saved"
    case "error":
      return "Failed to save"
    default:
      return "Not saved yet"
  }
})
</script>