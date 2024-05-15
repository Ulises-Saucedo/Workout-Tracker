<script setup lang="ts">
import { supabase } from '@/supabase/config'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useIsFormValid, useForm } from 'vee-validate'
import { registerSchema } from '@/schemas/auth'
import InputText from '@/components/form/InputText.vue'

const router = useRouter()

const { handleSubmit } = useForm({
  validationSchema: registerSchema
})

const isFormValid = useIsFormValid()

const onSubmit = handleSubmit(async ({ email, password }) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) throw error

    toast.info('Verifique su email')
    router.push({ name: 'login' })
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
      <h1 class="text-3xl text-white mb-4">Registro</h1>
      <InputText id="email" label="Email" placeholder="Email" />
      <InputText id="password" type="password" label="Contraseña" placeholder="Contraseña" />
      <InputText
        id="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="Ingrese la contraseña nuevamente"
      />

      <button
        type="submit"
        :disabled="!isFormValid"
        class="rounded py-2"
        :class="isFormValid ? ' bg-[#343C13] text-custom-primary' : ' text-red-500 bg-red-900'"
      >
        Registrarme
      </button>

      <RouterLink :to="{ name: 'login' }" class="text-center text-white">
        ¿Tienes una cuenta?
        <span class="text-custom-primary underline underline-offset-4">Iniciar sesión</span>
      </RouterLink>
    </form>
  </div>
</template>
