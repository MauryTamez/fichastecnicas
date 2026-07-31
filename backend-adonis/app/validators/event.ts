import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),

    objective: vine.string().trim().optional(),
    description: vine.string().trim().optional(),

    startsAt: vine.string(),
    endsAt: vine.string(),

    locationId: vine.number(),

    organizationId: vine.number().optional(),
    eventTypeId: vine.number().optional(),

    dressCode: vine.string().optional(),
    programImpacted: vine.string().optional(),
    guestSpecifications: vine.string().optional(),

    presidiumDetail: vine.string().optional(),
    directorAction: vine.string().optional(),

    cantidadPersonas: vine.number().optional(),
    acomodoTipo: vine.string().optional(),
    acomodo_tipo: vine.string().optional(),
    audiovisual: vine.any().optional(),

    microfonos: vine.any().optional(),

    requerimientosOtros: vine.any().optional(),

    listaEstacionamiento: vine.array(vine.any()).optional(),

    horaFotografia: vine.string().optional(),

    listaPresidium: vine.array(vine.any()).optional(),

    otrosObservaciones: vine.string().optional(),

    activities: vine.array(
      vine.object({
        name: vine.string().trim(),

        startsAt: vine.string(),

        endsAt: vine.string(),

        description: vine.string().optional(),
      })
    ).optional(),
  })
)


export const updateEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),

    objective: vine.string().trim().optional(),

    description: vine.string().trim().optional(),

    startsAt: vine.string().optional(),

    endsAt: vine.string().optional(),

    locationId: vine.number().optional(),

    organizationId: vine.number().optional(),

    eventTypeId: vine.number().optional(),

    dressCode: vine.string().optional(),

    programImpacted: vine.string().optional(),

    guestSpecifications: vine.string().optional(),

    presidiumDetail: vine.string().optional(),

    directorAction: vine.string().optional(),

    cantidadPersonas: vine.number().optional(),

    acomodoTipo: vine.string().optional(),

    acomodo_tipo: vine.string().optional(),

    audiovisual: vine.any().optional(),

    requerimientosOtros: vine.any().optional(),

    listaEstacionamiento: vine.array(vine.any()).optional(),

    horaFotografia: vine.string().optional(),

    listaPresidium: vine.array(vine.any()).optional(),

    otrosObservaciones: vine.string().optional(),

    activities: vine.array(
      vine.object({
        name: vine.string().trim(),

        startsAt: vine.string(),

        endsAt: vine.string(),

        description: vine.string().optional(),
      })
    ).optional(),
  })
)
