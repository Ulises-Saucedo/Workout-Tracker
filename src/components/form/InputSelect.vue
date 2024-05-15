<script setup lang="ts">
import { useField } from 'vee-validate'
import { type WorkoutType } from '@/types/workout'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String
  },
  options: {
    type: Array<WorkoutType>,
    required: true
  },
  modelValue: String
})

const { value: inputValue, errorMessage } = useField(props.id, undefined, {
  syncVModel: true
})
</script>

<template>
  <div class="space-y-1">
    <label :id="id" :label="label" :label-for="id" v-if="label" class="text-white">
      {{ label }}
    </label>
    <select
      class="border w-full py-2 px-4 rounded placeholder:text-stone-600 outline-none bg-custom-black text-white"
      :class="!!errorMessage ? 'border-red-500' : 'border-custom-primary'"
      :id="id"
      v-model="inputValue"
    >
      <option v-for="(option, i) in options" :key="i" :value="option.value">
        {{ option.text }}
      </option>
    </select>

    <div v-if="!!errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>
  </div>
</template>
