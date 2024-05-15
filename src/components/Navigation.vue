<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/config'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.user)

const logout = async () => {
  await supabase.auth.signOut()
  router.push({ name: 'login' })
  toast.success('Sesión cerrada correctamente')
}
</script>

<template>
  <header class="bg-at-light-green text-white border-b border-custom-lightness-black">
    <nav class="container py-5 px-4 flex flex-col gap-4 items-center sm:flex-row">
      <div class="flex items-center gap-x-4">
        <img class="w-14" src="@/assets/images/dumbbell-light.png" alt="logo" />
        <h1 class="text-lg">Active tracker</h1>
      </div>
      <ul class="flex flex-1 justify-end gap-x-10">
        <Router-link :to="{ name: 'home' }">Inicio</Router-link>
        <Router-link :to="{ name: 'create' }" v-if="user">Crear</Router-link>
        <Router-link :to="{ name: 'login' }" v-if="!user">Iniciar sesión</Router-link>
        <button @click="logout" v-if="user">Cerrar sesión</button>
      </ul>
    </nav>
  </header>
</template>
