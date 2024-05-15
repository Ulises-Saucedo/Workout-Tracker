<script setup lang="ts">
import { supabase } from '@/supabase/config'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useIsFormValid, useForm } from 'vee-validate'
import { loginSchema } from '@/schemas/auth'
import InputText from '@/components/form/InputText.vue'

const router = useRouter()

const { handleSubmit } = useForm({
  validationSchema: loginSchema
})

const isFormValid = useIsFormValid()

const onSubmit = handleSubmit(async ({ email, password }) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    toast.success('Inicio de sesión exitoso')
    router.push({ name: 'home' })
  } catch (e: any) {
    toast.error(e.message)
  }
})
</script>

<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <form
      @submit.prevent="onSubmit"
      class="p-8 flex flex-col bg-ligh-grey rounded-md gap-y-4 border border-custom-lightness-black"
    >
      <h1 class="text-3xl text-white mb-4">Iniciar sesión</h1>
      <InputText id="email" label="Email" placeholder="Email" />
      <InputText id="password" type="password" label="Contraseña" placeholder="Contraseña" />

      <button
        type="submit"
        :disabled="!isFormValid"
        class="rounded py-2"
        :class="isFormValid ? 'bg-[#343C13] text-custom-primary' : ' text-red-500 bg-red-900'"
      >
        Iniciar sesión
      </button>

      <RouterLink :to="{ name: 'register' }" class="text-center text-white">
        ¿No tienes una cuenta?
        <span class="text-custom-primary underline underline-offset-4">Registrarme</span>
      </RouterLink>
    </form>
  </div>
</template>
