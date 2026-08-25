import vine from '@vinejs/vine'

const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine
      .string()
      .minLength(8)
      // La contraseña debe tener al menos una mayúscula y un número.
      // Además, permite letras minúsculas y los símbolos más comunes de forma segura.
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)
      .confirmed(),
  })
)

export default updatePasswordValidator