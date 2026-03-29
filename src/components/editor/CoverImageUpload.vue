<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">
      Cover Image URL
    </label>

    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Paste cover image URL"
      class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
    />

    <div
      v-if="modelValue"
      class="overflow-hidden rounded-2xl border border-gray-200"
    >
      <img
        :src="modelValue"
        alt="Cover preview"
        class="w-full h-64 object-cover"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
})

defineEmits(["update:modelValue"])
</script>