<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Admin Login</h1>

      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            required
          />
        </div>

        <div v-if="errorMessage" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-gray-900 text-white py-3 font-semibold hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { loginAdmin } from "../services/auth"

const router = useRouter()

const email = ref("")
const password = ref("")
const loading = ref(false)
const errorMessage = ref("")

const handleLogin = async () => {
  errorMessage.value = ""
  loading.value = true

  try {
    await loginAdmin(email.value, password.value)
    router.push("/")
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Invalid email address."
        break
      case "auth/user-disabled":
        errorMessage.value = "This account has been disabled."
        break
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        errorMessage.value = "Incorrect email or password."
        break
      default:
        errorMessage.value = "Failed to sign in. Please try again."
    }
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>