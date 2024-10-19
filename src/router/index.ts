import { createRouter, createWebHistory } from 'vue-router'
import CodeEditor from '../views/CodeEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CodeEditor,
    },
  ],
})

export default router
