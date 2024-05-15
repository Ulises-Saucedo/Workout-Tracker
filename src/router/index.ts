import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
        title: 'Inicio'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: 'Iniciar sesión'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        title: 'Registro'
      }
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateWorkoutView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Crear rutina'
      }
    },
    {
      path: '/workouts/:workoutId',
      name: 'workout',
      component: () => import('../views/ExerciseView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Mi rutina'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => {
        return { name: '404' }
      }
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../views/404View.vue'),
      meta: {
        title: '404'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Workout Tracker`
  next()
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  supabase.auth.onAuthStateChange((_, session) => {
    authStore.user = session?.user
  })

  if (to.meta.requiresAuth) {
    if (authStore.user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
