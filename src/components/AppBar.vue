<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { logoutAdmin, observeAuthState } from "../services/auth"

const router = useRouter()
const route = useRoute()

const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const currentUser = ref(null)
const isLoggingOut = ref(false)

let unsubscribeAuth = null

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Write", to: { name: "WriteBlog" } },
  { name: "Drafts", to: { name: "DraftView" } },
  { name: "Published", to: { name: "PublishView" } },
  { name: "Archives", to: { name: "Archive" } }
]

const userEmail = computed(() => currentUser.value?.email ?? "No email found")

const userInitials = computed(() => {
  const email = userEmail.value

  if (!email || email === "No email found") {
    return "?"
  }

  return email.slice(0, 2).toUpperCase()
})

const closeMenus = () => {
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
}

const handleDocumentClick = (event) => {
  if (!event.target.closest("[data-profile-menu]")) {
    profileMenuOpen.value = false
  }
}

const handleLogout = async () => {
  if (isLoggingOut.value) {
    return
  }

  isLoggingOut.value = true

  try {
    await logoutAdmin()
    closeMenus()
    router.push("/login")
  } catch (error) {
    console.error(error)
  } finally {
    isLoggingOut.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    closeMenus()
  }
)

onMounted(() => {
  unsubscribeAuth = observeAuthState((user) => {
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
  <header class="fixed top-0 w-full z-50">
    <nav class="border-b border-emerald-500/10 bg-white px-4 py-3 backdrop-blur-lg sm:px-6">
      <div class="mx-auto flex max-w-7xl items-center gap-4">
        <div class="min-w-0 flex-1">
          <div class="flex flex-col leading-tight">
            <span class="text-lg font-bold uppercase tracking-tighter text-black sm:text-xl">
              Wild & Free
            </span>
            <span class="text-xs font-normal italic capitalize tracking-normal text-gray-500">
              All good things are wild & free
            </span>
          </div>
        </div>

        <div class="hidden lg:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-black">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.to"
            class="transition-colors hover:text-emerald-500"
          >
            {{ link.name }}
          </router-link>
        </div>

        <div>

          <div class="relative" data-profile-menu>
            <button
              type="button"
              class="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-900 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              aria-label="Open user menu"
              @click.stop="profileMenuOpen = !profileMenuOpen"
            >
              {{ userInitials }}
            </button>

            <div
              v-if="profileMenuOpen"
              class="absolute right-0 top-14 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Signed in as
              </p>
              <p class="mt-2 break-all text-sm font-medium text-gray-900">
                {{ userEmail }}
              </p>

              <button
                type="button"
                class="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isLoggingOut"
                @click="handleLogout"
              >
                {{ isLoggingOut ? "Logging out..." : "Logout" }}
              </button>
            </div>
          </div>

          <button
            type="button"
            class="p-2 text-black focus:outline-none lg:hidden"
            aria-label="Toggle navigation menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="mx-auto mt-4 flex max-w-7xl flex-col gap-2 border-t border-gray-100 pt-4 lg:hidden"
      >
        <router-link
          v-for="link in navLinks"
          :key="`${link.name}-mobile`"
          :to="link.to"
          class="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
        >
          {{ link.name }}
        </router-link>
      </div>
    </nav>
  </header>

  <div class="h-24 sm:h-28"></div>
</template>
