<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useFieldArray, useIsFormValid } from 'vee-validate'
import { toast } from 'vue-sonner'
import { supabase } from '@/supabase/config'
import Loader from '@/components/Loader.vue'
import { type WorkoutFromSupabase } from '@/types/workout'
import { useAuthStore } from '@/stores/auth'
import InputText from '@/components/form/InputText.vue'
import InputSelect from '@/components/form/InputSelect.vue'
import { createWorkout } from '@/schemas/workout'

const route = useRoute()
const router = useRouter()
const data: Ref<any | WorkoutFromSupabase> = ref(null)
const isLoading: Ref<Boolean> = ref(true)
const editMode: Ref<Boolean> = ref(false)
const { workoutId } = route.params
const authStore = useAuthStore()

const { handleSubmit } = useForm({
  validationSchema: createWorkout
})

const isFormValid = useIsFormValid()

const { push, remove, replace, fields } = useFieldArray('exercises')

const onSubmit = handleSubmit(async ({ workout_name, workout_type, exercises }) => {
  try {
    const { error } = await supabase
      .from('workouts')
      .update({
        workout_name,
        workout_type,
        exercises
      })
      .eq('id', workoutId)

    if (error) throw error

    const { data: workout } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single() // Get updated workout

    data.value = workout
    replace([]) // Clear existing elements in array from useFieldArray hook
    workout.exercises.forEach((item: any) => {
      push({
        ...item
      })
    })

    toast.success('Ejercicio actualizado')
    editMode.value = false
  } catch (e: any) {
    toast.error('Hubo un error al actualizar, intente más tarde')
  }
})

const addExercise = () => {
  if (data.value.workout_type === 'strength') {
    push({
      id: crypto.randomUUID(),
      exercise: '',
      sets: 0,
      reps: 0,
      weight: 0
    })
  } else if (data.value.workout_type === 'cardio') {
    push({
      id: crypto.randomUUID(),
      cardio_type: '#',
      distance: '',
      duration: '',
      pace: ''
    })
  }
}

const removeExercise = (index: number) => {
  if (index >= 1) {
    remove(index)
    toast.success('Ejercicio eliminado')
    return
  }

  toast.error('No se puede eliminar el primer ejercicio')
}

const deleteWorkout = async () => {
  try {
    const { error } = await supabase.from('workouts').delete().eq('id', workoutId)

    if (error) throw error

    router.push('/')
    toast.success('La rutina fue eliminada')
  } catch (e: any) {
    toast.error('Hubo un error, intentelo de nuevo más tarde')
  }
}

onMounted(async () => {
  try {
    const { data: workout, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single()

    if (error) throw error
    if (workout.created_by !== authStore.user.id) throw new Error('No estás autorizado')

    data.value = workout
    workout.exercises.forEach((item: any) => {
      push({
        ...item
      })
    })
    isLoading.value = false
  } catch {
    toast.error('Hubo un error, intentelo de nuevo más tarde')
    router.push('/')
  }
})
</script>

<template>
  <div v-if="isLoading" class="mt-32 flex flex-col items-center">
    <Loader />
  </div>

  <form @submit.prevent="onSubmit" v-else>
    <div class="max-w-screen-sm mx-auto px-4 py-10">
      <div
        class="flex flex-col items-center p-4 gap-y-6 rounded border border-custom-lightness-black relative"
      >
        <div class="flex gap-x-2 me-auto">
          <div
            class="h-10 w-10 rounded-full flex justify-center items-center cursor-pointer border border-custom-lightness-black hover:bg-custom-lightness-black duration-300"
            @click="editMode = !editMode"
          >
            <img src="@/assets/images/pencil-light.png" alt="edit-icon" class="h-4 w-auto" />
          </div>

          <div
            class="h-10 w-10 rounded-full flex justify-center items-center cursor-pointer border border-custom-lightness-black hover:bg-custom-lightness-black duration-300"
            @click="deleteWorkout"
          >
            <img src="@/assets/images/trash-light.png" alt="trash-icon" class="h-4 w-auto" />
          </div>
        </div>

        <img
          v-if="data?.workout_type === 'cardio'"
          src="@/assets/images/running-light.png"
          :alt="data?.workout_type"
          class="h-24 w-auto"
        />

        <img
          v-if="data?.workout_type === 'strength'"
          src="@/assets/images/dumbbell-light.png"
          :alt="data?.workout_type"
          class="h-24 w-auto"
        />

        <span class="py-1.5 px-5 text-xs text-white bg-[#343C13] rounded-full">
          {{ data?.workout_type.toUpperCase() }}
        </span>

        <div class="w-full">
          <InputText
            v-if="editMode"
            id="workout_name"
            :value="data?.workout_name"
            label="Nombre de rutina"
            placeholder="Nombre de rutina"
          />

          <h1 class="text-white text-2xl text-center" v-else>{{ data?.workout_name }}</h1>

          <div class="hidden">
            <InputText
              id="workout_type"
              :value="data?.workout_type"
              label="Nombre de rutina"
              placeholder="Nombre de rutina"
            />
          </div>
        </div>
      </div>

      <div
        class="mt-10 p-8 rounded flex flex-col items-center border border-custom-lightness-black"
      >
        <!-- WORKOUT TYPE STRENGTH -->
        <div class="flex flex-col gap-y-4 w-full" v-if="data?.workout_type === 'strength'">
          <div
            class="flex flex-col gap-x-6 gap-y-2 relative sm:flex-row"
            v-for="(field, idx) in fields"
            :key="field.key"
          >
            <div class="flex flex-col md:w-1/3">
              <InputText
                v-if="editMode"
                :id="`exercises[${idx}].exercise`"
                :value="data.exercises[idx]?.exercise"
                label="Nombre de ejercicio"
                placeholder="Nombre de ejercicio"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">
                Nombre
              </p>
              <p class="text-white" v-if="!editMode">{{ data.exercises[idx].exercise }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <InputText
                v-if="editMode"
                :id="`exercises[${idx}].sets`"
                :value="data.exercises[idx]?.sets"
                type="number"
                label="Series"
                placeholder="Series"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">
                Series
              </p>
              <p class="text-white" v-if="!editMode">{{ data.exercises[idx].sets }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <InputText
                v-if="editMode"
                :id="`exercises[${idx}].reps`"
                :value="data.exercises[idx]?.reps"
                type="number"
                label="Repeticiones"
                placeholder="Repeticiones"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">
                Repeticiones
              </p>
              <p class="text-white" v-if="!editMode">{{ data.exercises[idx].reps }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <InputText
                v-if="editMode"
                :id="`exercises[${idx}].weight`"
                :value="data.exercises[idx]?.weight"
                type="number"
                label="Peso"
                placeholder="Peso"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">Peso</p>
              <p class="text-white" v-if="!editMode">{{ data.exercises[idx].weight }}</p>
            </div>

            <img
              src="@/assets/images/trash-light.png"
              alt="trash-icon"
              class="absolute h-4 top-1 w-auto -left-5 cursor-pointer"
              v-if="editMode"
              @click="removeExercise(idx)"
            />
          </div>

          <button
            type="button"
            class="bg-[#343C13] text-custom-primary rounded py-2"
            v-if="editMode"
            @click="addExercise"
          >
            Agregar ejercicio
          </button>

          <button
            type="submit"
            @click="onSubmit"
            class="bg-[#343C13] text-custom-primary rounded py-2"
            v-if="editMode && isFormValid"
          >
            Actualizar rutina
          </button>
        </div>

        <!-- WORKOUT TYPE CARDIO -->
        <div class="flex flex-col gap-y-4 w-full" v-if="data?.workout_type === 'cardio'">
          <div
            class="flex flex-col gap-x-6 gap-y-2 relative sm:flex-row"
            v-for="(field, idx) in fields"
            :key="field.key"
          >
            <div class="flex flex-col md:w-1/3">
              <InputSelect
                v-if="editMode"
                :id="`exercises[${idx}].cardio_type`"
                :v-model="`exercises[${idx}].cardio_type`"
                label="Cardio"
                :options="[
                  {
                    value: '#',
                    text: 'Tipo de ejercicio'
                  },
                  {
                    value: 'run',
                    text: 'Correr'
                  },
                  {
                    value: 'walk',
                    text: 'Caminar'
                  }
                ]"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">
                Cardio
              </p>
              <p class="text-white" v-if="!editMode">
                {{ data.exercises[idx].cardio_type === 'run' ? 'Correr' : 'Caminar' }}
              </p>
            </div>

            <div class="flex flex-1 flex-col">
              <InputText
                v-if="editMode"
                :id="`exercises[${idx}].distance`"
                :value="data.exercises[idx]?.distance"
                label="Distancia"
                placeholder="Distancia"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">
                Distancia
              </p>
              <p class="text-white" v-if="!editMode">{{ data.exercises[idx].distance }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <InputText
                v-if="editMode"
                :id="`exercises[${idx}].duration`"
                :value="data.exercises[idx]?.duration"
                label="Duración"
                placeholder="Duración"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">
                Duración
              </p>
              <p class="text-white" v-if="!editMode">{{ data.exercises[idx].duration }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <InputText
                v-if="editMode"
                :id="`exercises[${idx}].pace`"
                :value="data.exercises[idx]?.pace"
                label="Ritmo"
                placeholder="Ritmo"
              />
              <p class="text-custom-primary underline underline-offset-4" v-if="!editMode">Ritmo</p>
              <p class="text-white" v-if="!editMode">{{ data.exercises[idx].pace }}</p>
            </div>

            <img
              src="@/assets/images/trash-light.png"
              alt="trash-icon"
              class="absolute h-4 top-1 w-auto -left-5 cursor-pointer"
              v-if="editMode"
              @click="removeExercise(idx)"
            />
          </div>

          <button
            type="button"
            class="bg-[#343C13] text-custom-primary rounded py-2"
            v-if="editMode"
            @click="addExercise"
          >
            Agregar ejercicio
          </button>

          <button
            type="submit"
            @click="onSubmit"
            class="bg-[#343C13] text-custom-primary rounded py-2"
            v-if="editMode && isFormValid"
          >
            Actualizar rutina
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
