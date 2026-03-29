
import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"
import DraftView from "../views/DraftView.vue"
import Archive from "../views/Archive.vue"
import PublishView from "../views/PublishView.vue"
import WriteBlog from "../views/WriteBlogView.vue"
import LoginView from "../views/LoginView.vue"

import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: "/drafts",
    name: "DraftView",
    component: DraftView,
    meta: { requiresAuth: true }
  },
  {
    path: "/published",
    name: "PublishView",
    component: PublishView,
    meta: { requiresAuth: true }
  },
  {
    path: "/archives",
    name: "Archive",
    component: Archive,
    meta: { requiresAuth: true }
  },
  {
    path: "/edit",
    name: "WriteBlog",
    component: WriteBlog,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
    meta: { requiresGuest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    next("/login")
  } else if (to.meta.requiresGuest && user) {
    next("/")
  } else {
    next()
  }
})

export default router