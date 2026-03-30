
import { createRouter, createWebHistory } from "vue-router"
//et all
import HomeView from "../views/HomeView.vue"
import DraftView from "../views/DraftView.vue"
import Archive from "../views/Archive.vue"
import PublishView from "../views/PublishView.vue"
import WriteBlog from "../views/WriteBlogView.vue"
import LoginView from "../views/LoginView.vue"
import BlogHomeView from '../views/BlogHomeView.vue'
import BlogPostView from '../views/BlogPostView.vue'

import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"

const routes = [
  {
    path: "/",
    name: "BlogHomeView",
    component: BlogHomeView,
    meta: { publicReader: true }
  },
  {
    path: "/posts/:id",
    name: "BlogPostView",
    component: BlogPostView,
    meta: { publicReader: true }
  },
  {
    path: "/blog",
    redirect: { name: "BlogHomeView" }
  },
  {
    path: "/blog/posts/:id",
    redirect: to => ({
      name: "BlogPostView",
      params: { id: to.params.id }
    })
  },
  {
    path: "/admin",
    name: "AdminHome",
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/drafts",
    name: "DraftView",
    component: DraftView,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/published",
    name: "PublishView",
    component: PublishView,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/archives",
    name: "Archive",
    component: Archive,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/edit",
    name: "WriteBlog",
    component: WriteBlog,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: "/login",
    redirect: { name: "AdminLogin" }
  },
  {
    path: "/drafts",
    redirect: { name: "DraftView" }
  },
  {
    path: "/published",
    redirect: { name: "PublishView" }
  },
  {
    path: "/archives",
    redirect: { name: "Archive" }
  },
  {
    path: "/edit",
    redirect: to => ({
      name: "WriteBlog",
      query: to.query
    })
  },
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
    next({
      name: "AdminLogin",
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.requiresGuest && user) {
    next({ name: "AdminHome" })
  } else {
    next()
  }
})

export default router
