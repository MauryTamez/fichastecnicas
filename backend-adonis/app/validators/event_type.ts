import vine from '@vinejs/vine'

export const createEventTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    description: vine.string().trim().optional(),
    organizationId: vine.number().positive(),
  })
)

export const updateEventTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).optional(),
    description: vine.string().trim().optional(),
    organizationId: vine.number().positive().optional(),
  })
)
