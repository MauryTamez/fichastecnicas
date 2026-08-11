import vine from '@vinejs/vine'

export const createDepartmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    priority: vine.number().min(1),
    organizationId: vine.number(),
  })
)

export const updateDepartmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    priority: vine.number().min(1).optional(),
    organizationId: vine.number().optional(),
  })
)
