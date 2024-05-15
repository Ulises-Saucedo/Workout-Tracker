<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import { supabase } from '@/supabase/config'
import Loader from '@/components/Loader.vue'
import { type WorkoutFromSupabase } from '@/types/workout'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const data: Ref<WorkoutFromSupabase[]> = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('created_by', auth.user.id)

    if (error) throw error

    data.value = workouts
    isLoading.value = false
  } catch (e: any) {
    console.log(e)
  }
})
</script>

<template>
  <div v-if="isLoading" class="mt-32 flex flex-col items-center">
    <Loader />
  </div>

  <div class="container mt-10 px-10" v-else>
    <div class="w-full flex flex-col items-center" v-if="data.length === 0">
      <h1 class="text-2xl text-white text-center">
        Oops! Parece vacío,
        <RouterLink
          class="underline underline-offset-4 text-custom-primary"
          :to="{ name: 'create' }"
        >
          agregar ejercicios
        </RouterLink>
        😁
      </h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" v-else>
      <RouterLink
        class="flex flex-col items-center border border-custom-lightness-black p-8 rounded"
        :to="{ name: 'workout', params: { workoutId: workout.id } }"
        v-for="(workout, index) in data"
        :key="index"
      >
        <img
          v-if="workout.workout_type === 'cardio'"
          src="@/assets/images/running-light.png"
          :alt="workout.workout_type"
          class="h-24 w-auto"
        />

        <img
          v-if="workout.workout_type === 'strength'"
          src="@/assets/images/dumbbell-light.png"
          :alt="workout.workout_type"
          class="h-24 w-auto"
        />

        <p class="mt-6 py-1 px-3 text-xs text-white">{{ workout.workout_type.toUpperCase() }}</p>

        <h2 class="mt-8 mb-2 text-center text-xl text-custom-primary">
          {{ workout.workout_name }}
        </h2>
      </RouterLink>
    </div>
  </div>
</template>
