<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useToast } from "vue-toastification"
import {
  observeReaderAuth,
  signInWithGoogle,
  signOutReader,
} from "../services/publicAuth"

const currentUser = ref(null)
const profileMenuOpen = ref(false)
const isSigningIn = ref(false)
const isSigningOut = ref(false)

const toast = useToast()

let unsubscribeAuth = null

const userEmail = computed(() => currentUser.value?.email ?? "Guest")

const userDisplayName = computed(() => {
  return currentUser.value?.displayName || currentUser.value?.email || "Guest"
})

const userInitials = computed(() => {
  if (currentUser.value?.displayName) {
    const parts = currentUser.value.displayName.trim().split(" ")
    const initials = parts.slice(0, 2).map(part => part[0]).join("")
    return initials.toUpperCase()
  }

  if (currentUser.value?.email) {
    return currentUser.value.email.slice(0, 2).toUpperCase()
  }

  return "G"
})

const handleDocumentClick = (event) => {
  if (!event.target.closest("[data-public-profile-menu]")) {
    profileMenuOpen.value = false
  }
}

const handleSignIn = async () => {
  if (isSigningIn.value) return

  isSigningIn.value = true

  try {
    await signInWithGoogle()
    profileMenuOpen.value = false
    toast.success("Signed in successfully.")
  } catch (error) {
    console.error("Public sign-in failed:", error)
    toast.error("Failed to sign in.")
  } finally {
    isSigningIn.value = false
  }
}

const handleSignOut = async () => {
  if (isSigningOut.value) return

  isSigningOut.value = true

  try {
    await signOutReader()
    profileMenuOpen.value = false
    toast.success("Signed out successfully.")
  } catch (error) {
    console.error("Public sign-out failed:", error)
    toast.error("Failed to sign out.")
  } finally {
    isSigningOut.value = false
  }
}

onMounted(() => {
  unsubscribeAuth = observeReaderAuth((user) => {
    currentUser.value = user
  })

  document.addEventListener("click", handleDocumentClick)
})

onBeforeUnmount(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
  }

  document.removeEventListener("click", handleDocumentClick)
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <router-link :to="{ name: 'BlogHomeView' }" class="min-w-0">
        <div class="flex flex-col leading-tight">
          <span class="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Wild &amp; Free
          </span>
          <span class="text-xs text-gray-500 sm:text-sm">
            All Good Things are Wild &amp; Free
          </span>
        </div>
      </router-link>

      <div class="relative" data-public-profile-menu>
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white"
          :aria-label="`Reader profile for ${userEmail}`"
          @click.stop="profileMenuOpen = !profileMenuOpen"
        >
          {{ userInitials }}
        </button>

        <div
          v-if="profileMenuOpen"
          class="absolute right-0 top-12 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Reader
          </p>

         

          <p class="mt-1 break-all text-sm text-gray-600">
            {{ userEmail }}
          </p>

          <button
            v-if="!currentUser"
            type="button"
            class="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSigningIn"
            @click="handleSignIn"
          >
            {{ isSigningIn ? "Signing in..." : "Sign in with Google" }}
          </button>

          <button
            v-else
            type="button"
            class="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSigningOut"
            @click="handleSignOut"
          >
            {{ isSigningOut ? "Signing out..." : "Sign out" }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
