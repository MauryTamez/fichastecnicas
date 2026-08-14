import vine from '@vinejs/vine'

const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine.string().minLength(8).confirmed(),
  })
)

export default updatePasswordValidator