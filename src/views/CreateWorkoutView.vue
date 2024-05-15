<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useForm, useFieldArray } from 'vee-validate'
import { createWorkout } from '@/schemas/workout'
import { supabase } from '@/supabase/config'
import InputSelect from '@/components/form/InputSelect.vue'
import InputText from '@/components/form/InputText.vue'

const type: Ref<string> = ref('#')

const { handleReset, handleSubmit } = useForm({
  validationSchema: createWorkout
})

const { remove, replace, push, fields } = useFieldArray('exercises')

watch(type, () => {
  replace([])
  if (type.value === 'strength') {
    replace([
      {
        exercise: '',
        sets: '',
        reps: '',
        weight: ''
      }
    ])
  } else if (type.value === 'cardio') {
    replace([
      {
        cardio_type: '#',
        distance: '',
        duration: '',
        pace: ''
      }
    ])
  }
})

const removeItem = (idx: number) => {
  if (idx >= 1) {
    remove(idx)
    toast.success('Ejercicio eliminado')
    return
  }

  toast.error('No se puede eliminar el primer ejercicio')
}

const onSubmit = handleSubmit(async ({ workout_name, workout_type, exercises }) => {
  exercises = exercises.map((exercise: any) => ({
    id: crypto.randomUUID(),
    ...exercise
  }))

  try {
    const { error } = await supabase.from('workouts').insert([
      {
        workout_name,
        workout_type,
        exercises
      }
    ])

    if (error) throw error

    handleReset()

    toast.success('Ejercicio creado correctamente')
  } catch (e: any) {
    toast.error(e.message)
  }
})
</script>

<template>
  <div class="max-w-screen-md mx-auto px-10 py-10">
    <form
      @submit.prevent="onSubmit"
      class="p-8 flex flex-col bg-ligh-grey rounded-md gap-y-4 border border-custom-lightness-black"
    >
      <h1 class="text-3xl text-white mb-4">Crear ejercicio</h1>
      <InputText id="workout_name" label="Nombre de ejercicio" placeholder="Nombre de ejercicio" />
      <InputSelect
        id="workout_type"
        label="Tipo de ejercicio"
        :options="[
          {
            value: '#',
            text: 'Tipo de ejercicio'
          },
          {
            value: 'strength',
            text: 'Fuerza'
          },
          {
            value: 'cardio',
            text: 'Cardio'
          }
        ]"
        v-model="type"
      />

      <div v-if="type === 'strength'" class="flex flex-col gap-y-4">
        <div
          class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row"
          v-for="(field, idx) in fields"
          :key="field.key"
        >
          <div class="flex flex-col md:w-1/3">
            <InputText
              :id="`exercises[${idx}].exercise`"
              label="Ejercicio"
              placeholder="Ejercicio"
            />
          </div>
          <div class="flex flex-col flex-1">
            <InputText
              :id="`exercises[${idx}].sets`"
              type="number"
              label="Series"
              placeholder="Series"
            />
          </div>
          <div class="flex flex-col flex-1">
            <InputText
              :id="`exercises[${idx}].reps`"
              type="number"
              label="Repeticiones"
              placeholder="Repeticiones"
            />
          </div>
          <div class="flex flex-col flex-1">
            <InputText
              :id="`exercises[${idx}].weight`"
              type="number"
              label="Peso (kg)"
              placeholder="Peso (kg)"
            />
          </div>
          <img
            @click="removeItem(idx)"
            src="@/assets/images/trash-light.png"
            class="h-4 w-auto absolute -left-5 top-1 cursor-pointer"
            alt="trash icon"
          />
        </div>
        <button
          @click="
            push({
              exercise: '',
              sets: '',
              reps: '',
              weight: ''
            })
          "
          type="button"
          class="bg-[#343C13] text-custom-primary rounded py-2"
        >
          Agregar ejercicio
        </button>
      </div>

      <div v-if="type === 'cardio'" class="flex flex-col gap-y-4">
        <div
          class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row"
          v-for="(field, idx) in fields"
          :key="field.key"
        >
          <div class="flex flex-col md:w-1/3">
            <InputSelect
              :id="`exercises[${idx}].cardio_type`"
              label="Tipo de ejercicio"
              :v-model="`exercises[${idx}].cardio_type`"
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
          </div>
          <div class="flex flex-col flex-1">
            <InputText
              :id="`exercises[${idx}].distance`"
              label="Distancia"
              placeholder="Distancia"
            />
          </div>
          <div class="flex flex-col flex-1">
            <InputText :id="`exercises[${idx}].duration`" label="Duración" placeholder="Duración" />
          </div>
          <div class="flex flex-col flex-1">
            <InputText :id="`exercises[${idx}].pace`" label="Ritmo" placeholder="Ritmo" />
          </div>
          <img
            @click="removeItem(idx)"
            src="@/assets/images/trash-light.png"
            class="h-4 w-auto absolute -left-5 top-1 cursor-pointer"
            alt="trash icon"
          />
        </div>
        <button
          @click="
            push({
              cardio_type: '#',
              distance: '',
              duration: '',
              pace: ''
            })
          "
          type="button"
          class="bg-[#343C13] text-custom-primary rounded py-2"
        >
          Agregar ejercicio
        </button>
      </div>
      <button class="bg-[#343C13] text-custom-primary rounded py-2">Enviar</button>
    </form>
  </div>
</template>
