import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user: Ref<null | any> = ref(null)

    return {
      user
    }
  },
  { persist: true }
)
