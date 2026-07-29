import Event from '#models/event'
import EventVersion from '#models/event_version'
import VersionActivity from '#models/version_activity'
import VersionContent from '#models/version_content'
import { EventStateService } from '#services/event_state_service'
import { NotificationService } from '#services/notification_service'
import { RagService } from '#services/rag_service'
import { createEventValidator, updateEventValidator } from '#validators/event'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { EventState } from '../enums/event_state.js'

export default class EventsController {
  private ragService = new RagService()

  private async checkOverlaps(startsAt: DateTime, endsAt: DateTime, locationId: number, currentEventId: number | null = null) {
    if (!startsAt.isValid || !endsAt.isValid) return []

    const allEvents = await Event.query()
      .where('locationId', locationId)
      .whereIn('currentState', [EventState.SCHEDULED, EventState.IN_REVIEW])
      .if(currentEventId, (query) => query.whereNot('id', currentEventId as number))
      .preload('eventVersions', (v) => v.where('isCurrentVersion', true).preload('versionContent'))

    return allEvents.filter(e => {
      const ver = e.eventVersions[0]
      if (!ver || !ver.versionContent) return false

      const eventStart = ver.versionContent.startsAt
      const eventEnd = ver.versionContent.endsAt

      return (startsAt < eventEnd && endsAt > eventStart)
    })
  }

  async index({ request, response, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20

    const user = auth.use('web').user
    await user?.load('role')
    const roleName = user?.role?.name

    const eventsQuery = Event.query()
      .preload('eventVersions', (query) => {
        query.where('isCurrentVersion', true)
          .preload('versionContent')
          .preload('versionActivities')
      })
      .preload('organization')
      .preload('user')
      .orderBy('createdAt', 'desc')

    if (user && roleName !== 'admin' && roleName !== 'moderador') {
      if (roleName === 'encargado_departamento') {
        eventsQuery.whereHas('user', (q) => {
          q.where('departmentId', user.departmentId || 0)
        })
      } else if (roleName === 'creador') {
        eventsQuery.where((q) => {
          q.where('userId', user.id).orWhere('mainResponsibleId', user.id)
        })
      } else if (roleName === 'auxiliares' || roleName === 'auxiliar') {
        eventsQuery.whereHas('eventVersions', (v) => {
          v.where('isCurrentVersion', true)
            .whereHas('versionStaffings', (s) => {
              s.where('userId', user.id)
            })
        })
      } else {
        // Fallback for other legacy roles
        eventsQuery.where('userId', user.id)
      }
    }

    const events = await eventsQuery.paginate(page, limit)

    const mapped = events.toJSON().data.map((e: any) => {
      const currentVersion = e.eventVersions[0];
      const content = currentVersion?.versionContent;
      return {
        id: e.id,
        titulo: content?.name || 'Sin título',
        descripcion: content?.description || '',
        asistentes: content?.guestSpecifications || '',
        fecha_inicio: content?.startsAt || e.createdAt,
        fecha_fin: content?.endsAt || e.createdAt,
        venue_id: e.locationId || 1,
        locationId: e.locationId,
        organizationId: e.organizationId,
        eventTypeId: e.eventTypeId,
        user_id: e.userId,
        user: { nombre: e.user?.name },
        estado: e.currentState === 'in_review' ? 'pendiente' : (e.currentState === 'scheduled' ? 'aceptado' : (e.currentState === 'rejected' ? 'rechazado' : (e.currentState === 'draft' ? 'borrador' : (e.currentState === 'requested' ? 'solicitado' : (e.currentState === 'historical' ? 'histórico' : 'pendiente'))))),
        name: content?.name,
        objective: content?.objective,
        description: content?.description,
        dressCode: content?.dressCode,
        programImpacted: content?.programImpacted,
        guestSpecifications: content?.guestSpecifications,
        presidiumDetail: content?.presidiumDetail,
        directorAction: content?.directorAction,
        currentState: e.currentState,
        activities: currentVersion?.versionActivities?.map((a: any) => ({
          id: a.id,
          name: a.name,
          startsAt: a.startsAt ? DateTime.fromISO(a.startsAt).toFormat('HH:mm') : '',
          endsAt: a.endsAt ? DateTime.fromISO(a.endsAt).toFormat('HH:mm') : '',
          description: a.description
        })) || []
      }
    });

    return response.ok({
      data: mapped,
      meta: events.getMeta()
    })
  }

  async pendingApprovals({ response, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('role')
    const role = user.role?.name.toLowerCase()

    let eventsQuery = Event.query()
      .preload('eventVersions', (vQuery) => {
        vQuery.where('isCurrentVersion', true).preload('versionContent')
      })
      .preload('user')

    if (role === 'encargado_departamento') {
      eventsQuery
        .where('currentState', EventState.REQUESTED)
        .whereHas('user', (uQuery) => {
          uQuery.where('departmentId', user.departmentId || -1)
        })
    } else if (role === 'moderador') {
      eventsQuery.where('currentState', EventState.IN_REVIEW)
    } else {
      return response.forbidden({ message: 'No tienes permiso para ver aprobaciones pendientes.' })
    }

    const events = await eventsQuery

    const mapped = events.map(e => {
      const content = e.eventVersions[0]?.versionContent;
      return {
        id: e.id,
        versionId: e.eventVersions[0]?.id,
        titulo: content?.name || 'Sin título',
        fecha_inicio: content?.startsAt || e.createdAt,
        user_name: e.user?.name || 'Desconocido',
        currentState: e.currentState
      }
    })

    return response.ok({ data: mapped })
  }

  async show({ params, response }: HttpContext) {
    try {
      const event = await Event.query()
        .where('id', params.id)
        .preload('eventVersions', (query) => {
          query.orderBy('id', 'desc')
            .preload('versionContent')
            .preload('versionActivities')
            .preload('versionFeedbacks', (fbQuery) => {
              fbQuery.preload('reviewer')
            })
        })
        .preload('organization')
        .preload('user')
        .firstOrFail()

      const mappedVersions = event.eventVersions.map(v => {
        const content = v.versionContent;
        return {
          id: v.id,
          versionNumber: content?.versionNumber || v.id,
          isCurrentVersion: v.isCurrentVersion,
          name: content?.name,
          objective: content?.objective,
          description: content?.description,
          startsAt: content?.startsAt,
          endsAt: content?.endsAt,
          dressCode: content?.dressCode,
          programImpacted: content?.programImpacted,
          guestSpecifications: content?.guestSpecifications,
          presidiumDetail: content?.presidiumDetail,
          directorAction: content?.directorAction,
          cantidadPersonas: content?.cantidadPersonas,
          acomodo_tipo: content?.acomodoTipo,
          audiovisual: {
            sonido: Boolean(content?.sonido),
            microfonoInalambrico: Boolean(content?.microfonoInalambricoMano),
            microfonoMesa: Boolean(content?.microfonoInalambricoMesa),
            microfonoPresidencial: Boolean(content?.microfonoPresidencial),
            microfonoDiadema: Boolean(content?.microfonoDiadema),
            microfonoAlambrico: Boolean(content?.microfonoAlambrico),
            proyeccionPresentacion: Boolean(content?.proyeccionPresentacion),
            proyeccionVideo: Boolean(content?.proyeccionVideo),
            videograbacion: Boolean(content?.videograbacion),
            personalApoyo: Boolean(content?.personalApoyo),
            apuntador: Boolean(content?.apuntador),
            musicaFondo: Boolean(content?.musicaFondo),
          },
          requerimientosOtros: {
            manteles: Boolean(content?.manteles),
            banderas: Boolean(content?.banderas),
            coffeeBreak: Boolean(content?.mesaCoffeeBreak),
            estacionamiento: Boolean(content?.estacionamiento),
            fotografia: Boolean(content?.tomaFotografia),
            podium: Boolean(content?.podium),
            presidium: Boolean(content?.presidium),
            edecanes: Boolean(content?.edecanes),
            himno: Boolean(content?.himnoUanl),
            separadorHimno: Boolean(content?.separadorHimno),
          },
          otrosObservaciones: content?.otrosObservaciones || '',
          listaEstacionamiento: content?.listaEstacionamiento || [],
          horaFotografia: content?.horaFotografia || '',
          listaPresidium: content?.listaPresidium || [],
          activities: v.versionActivities?.map((a: any) => ({
            id: a.id,
            name: a.name,
            startsAt: a.startsAt ? DateTime.fromISO(a.startsAt).toFormat('HH:mm') : '',
            endsAt: a.endsAt ? DateTime.fromISO(a.endsAt).toFormat('HH:mm') : '',
            description: a.description
          })) || [],
          feedbacks: v.versionFeedbacks?.map((f: any) => ({
            id: f.id,
            fieldName: f.fieldName,
            comment: f.comment,
            status: f.status,
            createdAt: f.createdAt,
            reviewer: {
              name: f.reviewer?.name,
              role: f.reviewer?.role?.name
            }
          })) || []
        }
      })

      return response.ok({
        id: event.id,
        currentState: event.currentState,
        locationId: event.locationId,
        organizationId: event.organizationId,
        eventTypeId: event.eventTypeId,
        userId: event.userId,
        user: { name: event.user?.name },
        versions: mappedVersions
      })
    } catch (error) {
      console.error(error)
      return response.notFound({ message: 'Evento no encontrado' })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createEventValidator)
    const userEmail = auth.use('web').user?.email || ''

    const locationId = data.locationId
    const startsAt = DateTime.fromISO(data.startsAt)
    const endsAt = DateTime.fromISO(data.endsAt)

    if (!startsAt.isValid || !endsAt.isValid) {
      return response.badRequest({ message: 'Fechas inválidas' })
    }

    const overlaps = await this.checkOverlaps(startsAt, endsAt, locationId)
    if (overlaps.length > 0) {
      if (userEmail === 'direccion@fichas.com') {
        for (const conflict of overlaps) {
          conflict.currentState = EventState.REJECTED
          await conflict.save()
        }
      } else {
        return response.status(409).json({ message: 'El recinto ya se encuentra reservado en esas fechas.' })
      }
    }

    const transaction = await db.transaction()

    try {
      const event = new Event()
      event.currentState = EventState.DRAFT
      event.organizationId = data.organizationId || 1
      event.userId = auth.use('web').user!.id
      event.mainResponsibleId = auth.use('web').user!.id
      event.eventTypeId = data.eventTypeId || 1
      event.locationId = locationId
      event.useTransaction(transaction)
      await event.save()

        const content = new VersionContent()
        content.versionNumber = 1
        content.name = data.name
        content.objective = data.objective || null
        content.description = data.description || null
        content.startsAt = startsAt
        content.endsAt = endsAt
        content.dressCode = data.dressCode || null
        content.programImpacted = data.programImpacted || null
        content.guestSpecifications = data.guestSpecifications || null
        content.presidiumDetail = data.presidiumDetail || null
        content.directorAction = data.directorAction || null
        content.cantidadPersonas = data.cantidadPersonas || null
        content.acomodoTipo = data.acomodoTipo || data.acomodo_tipo || null

        content.sonido = Boolean(data.audiovisual?.sonido)
        content.microfonoInalambricoMano = Boolean(data.audiovisual?.microfonoInalambrico)
        content.microfonoInalambricoMesa = Boolean(data.audiovisual?.microfonoMesa)
        content.microfonoPresidencial = Boolean(data.audiovisual?.microfonoPresidencial)
        content.microfonoDiadema = Boolean(data.audiovisual?.microfonoDiadema)
        content.microfonoAlambrico = Boolean(data.audiovisual?.microfonoAlambrico)
        content.proyeccionPresentacion = Boolean(data.audiovisual?.proyeccionPresentacion)
        content.proyeccionVideo = Boolean(data.audiovisual?.proyeccionVideo)
        content.videograbacion = Boolean(data.audiovisual?.videograbacion)
        content.personalApoyo = Boolean(data.audiovisual?.personalApoyo)
        content.apuntador = Boolean(data.audiovisual?.apuntador)
        content.musicaFondo = Boolean(data.audiovisual?.musicaFondo)

        content.manteles = Boolean(data.requerimientosOtros?.manteles)
        content.banderas = Boolean(data.requerimientosOtros?.banderas)
        content.mesaCoffeeBreak = Boolean(data.requerimientosOtros?.coffeeBreak)
        content.estacionamiento = Boolean(data.requerimientosOtros?.estacionamiento)
        content.tomaFotografia = Boolean(data.requerimientosOtros?.fotografia)
        content.podium = Boolean(data.requerimientosOtros?.podium)
        content.presidium = Boolean(data.requerimientosOtros?.presidium)
        content.edecanes = Boolean(data.requerimientosOtros?.edecanes)
        content.himnoUanl = Boolean(data.requerimientosOtros?.himno)
        content.separadorHimno = Boolean(data.requerimientosOtros?.separadorHimno)

        content.otrosObservaciones = data.otrosObservaciones || null
        content.listaEstacionamiento = data.listaEstacionamiento || null
        content.horaFotografia = data.horaFotografia || null
        content.listaPresidium = data.listaPresidium || null

        content.useTransaction(transaction)
        await content.save()


        const version = new EventVersion()
        version.isCurrentVersion = true
        version.eventId = event.id
        version.versionContentId = content.id
        version.useTransaction(transaction)
        await version.save()

      if (data.activities && Array.isArray(data.activities)) {
        for (const act of data.activities) {
          const activity = new VersionActivity()
          activity.fill({
            name: act.name,
            description: act.description || null,
            startsAt: DateTime.fromISO(act.startsAt),
            endsAt: DateTime.fromISO(act.endsAt),
            responsibleId: auth.use('web').user!.id,
            locationId: event.locationId || 1
          })
          activity.useTransaction(transaction)
          await activity.save()
          await version.related('versionActivities').attach([activity.id], transaction)
        }
      }

      await transaction.commit()

      // Vectorizar para IA
      try {
        const activitiesText = data.activities?.map((a: any) => `- ${a.name}: ${a.startsAt}`).join('\n') || ''
        const fullContent = `
            Ficha Técnica: ${content.name}
            Objetivo: ${content.objective}
            Descripción: ${content.description}
            Dress Code: ${content.dressCode}
            Agenda:\n${activitiesText}
          `.trim()
        await this.ragService.vectorizeFichaTecnica(event.id, content.id, fullContent)
      } catch (e) {
        console.error('Error vectorizando ficha:', e)
      }

      return response.created({ message: 'Ficha técnica creada', event })
    } catch (error) {
      await transaction.rollback()
      console.error(error)
      return response.internalServerError({ message: 'Error al crear el evento' })
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    const data = await request.validateUsing(updateEventValidator)
    const event = await Event.findOrFail(params.id)

    const user = auth.use('web').user!
    await user.load('role')
    const roleName = user.role?.name?.toLowerCase() || ''
    const isSubdirectorOrAdmin = ['admin', 'encargado_departamento', 'subdirector'].includes(roleName)

    // Authorization Check: Admin, Subdirector (Encargado de Depto) o Creador del evento
    if (!isSubdirectorOrAdmin && event.userId !== user.id) {
      return response.forbidden({ message: 'No tienes permiso para editar este evento' })
    }

    const userEmail = user.email || ''

    const oldVersion = await EventVersion.query()
      .where('eventId', event.id)
      .where('isCurrentVersion', true)
      .preload('versionFeedbacks')
      .first()
    const oldContent = oldVersion ? await VersionContent.find(oldVersion.versionContentId) : null

    // Validar restricción de edición basada en estado y feedbacks (solo para creador sin permisos de subdirector/admin)
    if (event.currentState !== EventState.DRAFT && !isSubdirectorOrAdmin) {
      if (!oldVersion || !oldVersion.versionFeedbacks || oldVersion.versionFeedbacks.length === 0) {
        return response.forbidden({ message: 'No puedes editar el evento porque no tiene feedback asignado.' })
      }
      const pendingFeedbacks = oldVersion.versionFeedbacks.filter(f => f.status === 'pending')
      if (pendingFeedbacks.length > 0) {
        return response.forbidden({ message: 'Debes marcar todos los feedbacks como resueltos antes de crear una nueva versión.' })
      }
    }

    const startsAtStr = data.startsAt || oldContent?.startsAt?.toISO()
    const endsAtStr = data.endsAt || oldContent?.endsAt?.toISO()
    const startsAt = startsAtStr ? DateTime.fromISO(startsAtStr) : null
    const endsAt = endsAtStr ? DateTime.fromISO(endsAtStr) : null
    const locationId = (data.locationId !== undefined ? data.locationId : event.locationId) || 1

    if (startsAt?.isValid && endsAt?.isValid) {
      const overlaps = await this.checkOverlaps(startsAt, endsAt, locationId, event.id)
      if (overlaps.length > 0) {
        if (userEmail === 'direccion@fichas.com') {
          for (const conflict of overlaps) {
            conflict.currentState = EventState.REJECTED
            await conflict.save()
          }
        } else {
          return response.status(409).json({ message: 'El recinto ya se encuentra reservado en esas fechas.' })
        }
      }
    }

    const transaction = await db.transaction()

    try {
      if (oldVersion) {
        oldVersion.isCurrentVersion = false
        oldVersion.useTransaction(transaction)
        await oldVersion.save()
      }

      const content = new VersionContent()
      content.versionNumber = (oldContent?.versionNumber || 0) + 1
      content.name = data.name || oldContent?.name || ''
      content.objective = data.objective !== undefined ? data.objective : oldContent?.objective || null
      content.description = data.description !== undefined ? data.description : oldContent?.description || null
      content.startsAt = startsAt || oldContent!.startsAt
      content.endsAt = endsAt || oldContent!.endsAt
      content.dressCode = data.dressCode !== undefined ? data.dressCode : oldContent?.dressCode || null
      content.programImpacted = data.programImpacted !== undefined ? data.programImpacted : oldContent?.programImpacted || null
      content.guestSpecifications = data.guestSpecifications !== undefined ? data.guestSpecifications : oldContent?.guestSpecifications || null
      content.presidiumDetail = data.presidiumDetail !== undefined ? data.presidiumDetail : oldContent?.presidiumDetail || null
      content.directorAction = data.directorAction !== undefined ? data.directorAction : oldContent?.directorAction || null
      content.cantidadPersonas = data.cantidadPersonas !== undefined ? data.cantidadPersonas : (oldContent?.cantidadPersonas || null)
      content.acomodoTipo = data.acomodoTipo !== undefined ? data.acomodoTipo : (data.acomodo_tipo !== undefined ? data.acomodo_tipo : (oldContent?.acomodoTipo || null))

      const av = data.audiovisual
      content.sonido = av?.sonido !== undefined ? Boolean(av.sonido) : (oldContent?.sonido || false)
      content.microfonoInalambricoMano = av?.microfonoInalambrico !== undefined ? Boolean(av.microfonoInalambrico) : (oldContent?.microfonoInalambricoMano || false)
      content.microfonoInalambricoMesa = av?.microfonoMesa !== undefined ? Boolean(av.microfonoMesa) : (oldContent?.microfonoInalambricoMesa || false)
      content.microfonoPresidencial = av?.microfonoPresidencial !== undefined ? Boolean(av.microfonoPresidencial) : (oldContent?.microfonoPresidencial || false)
      content.microfonoDiadema = av?.microfonoDiadema !== undefined ? Boolean(av.microfonoDiadema) : (oldContent?.microfonoDiadema || false)
      content.microfonoAlambrico = av?.microfonoAlambrico !== undefined ? Boolean(av.microfonoAlambrico) : (oldContent?.microfonoAlambrico || false)
      content.proyeccionPresentacion = av?.proyeccionPresentacion !== undefined ? Boolean(av.proyeccionPresentacion) : (oldContent?.proyeccionPresentacion || false)
      content.proyeccionVideo = av?.proyeccionVideo !== undefined ? Boolean(av.proyeccionVideo) : (oldContent?.proyeccionVideo || false)
      content.videograbacion = av?.videograbacion !== undefined ? Boolean(av.videograbacion) : (oldContent?.videograbacion || false)
      content.personalApoyo = av?.personalApoyo !== undefined ? Boolean(av.personalApoyo) : (oldContent?.personalApoyo || false)
      content.apuntador = av?.apuntador !== undefined ? Boolean(av.apuntador) : (oldContent?.apuntador || false)
      content.musicaFondo = av?.musicaFondo !== undefined ? Boolean(av.musicaFondo) : (oldContent?.musicaFondo || false)

      const ro = data.requerimientosOtros
      content.manteles = ro?.manteles !== undefined ? Boolean(ro.manteles) : (oldContent?.manteles || false)
      content.banderas = ro?.banderas !== undefined ? Boolean(ro.banderas) : (oldContent?.banderas || false)
      content.mesaCoffeeBreak = ro?.coffeeBreak !== undefined ? Boolean(ro.coffeeBreak) : (oldContent?.mesaCoffeeBreak || false)
      content.estacionamiento = ro?.estacionamiento !== undefined ? Boolean(ro.estacionamiento) : (oldContent?.estacionamiento || false)
      content.tomaFotografia = ro?.fotografia !== undefined ? Boolean(ro.fotografia) : (oldContent?.tomaFotografia || false)
      content.podium = ro?.podium !== undefined ? Boolean(ro.podium) : (oldContent?.podium || false)
      content.presidium = ro?.presidium !== undefined ? Boolean(ro.presidium) : (oldContent?.presidium || false)
      content.edecanes = ro?.edecanes !== undefined ? Boolean(ro.edecanes) : (oldContent?.edecanes || false)
      content.himnoUanl = ro?.himno !== undefined ? Boolean(ro.himno) : (oldContent?.himnoUanl || false)
      content.separadorHimno = ro?.separadorHimno !== undefined ? Boolean(ro.separadorHimno) : (oldContent?.separadorHimno || false)

      content.otrosObservaciones = data.otrosObservaciones !== undefined ? data.otrosObservaciones : (oldContent?.otrosObservaciones || null)
      content.listaEstacionamiento = data.listaEstacionamiento !== undefined ? data.listaEstacionamiento : (oldContent?.listaEstacionamiento || null)
      content.horaFotografia = data.horaFotografia !== undefined ? data.horaFotografia : (oldContent?.horaFotografia || null)
      content.listaPresidium = data.listaPresidium !== undefined ? data.listaPresidium : (oldContent?.listaPresidium || null)

      content.useTransaction(transaction)
      await content.save()

      const version = new EventVersion()
      version.isCurrentVersion = true
      version.eventId = event.id
      version.versionContentId = content.id
      version.useTransaction(transaction)
      await version.save()

      if (data.activities && Array.isArray(data.activities)) {
        for (const act of data.activities) {
          const activity = new VersionActivity()
          activity.fill({
            name: act.name,
            description: act.description || null,
            startsAt: DateTime.fromISO(act.startsAt),
            endsAt: DateTime.fromISO(act.endsAt),
            responsibleId: auth.use('web').user!.id,
            locationId: event.locationId || 1
          })
          activity.useTransaction(transaction)
          await activity.save()
          await version.related('versionActivities').attach([activity.id], transaction)
        }
      }

      if (data.locationId) event.locationId = data.locationId
      if (data.organizationId) event.organizationId = data.organizationId
      if (data.eventTypeId) event.eventTypeId = data.eventTypeId

      // Mantener el estado de revisión si estaba en revisión o solicitado, pero indicar que hubo una actualización.
      // Como el creador ya resolvió el feedback, puede volver a REQUESTED o IN_REVIEW.
      // Asignaremos REQUESTED para que el encargado lo vuelva a ver, o se podría asignar IN_REVIEW si estaba ahí.
      // Lo dejaremos en IN_REVIEW por simplicidad, o lo devolveremos a REQUESTED si así se desea.
      // Aquí lo cambiaremos a REQUESTED si estaba en REQUESTED, de lo contrario IN_REVIEW.
      if (event.currentState === EventState.REQUESTED) {
        event.currentState = EventState.REQUESTED
      } else if (event.currentState === EventState.IN_REVIEW) {
        event.currentState = EventState.IN_REVIEW
      } else {
        event.currentState = EventState.IN_REVIEW
      }

      event.useTransaction(transaction)
      await event.save()

      await transaction.commit()

      return response.ok({ message: 'Ficha técnica actualizada', event })
    } catch (error) {
      await transaction.rollback()
      console.error(error)
      return response.internalServerError({ message: 'Error al actualizar el evento' })
    }
  }

  async updateStatus({ params, request, response, auth }: HttpContext) {
    const { estado } = request.only(['estado'])
    const event = await Event.findOrFail(params.id)

    if (auth.use('web').user?.role?.name !== 'admin' && auth.use('web').user?.role?.name !== 'auxiliar' && auth.use('web').user?.role?.name !== 'moderador') {
      return response.forbidden({ message: 'No tienes permiso para cambiar el estado de este evento' })
    }

    const statusMap: Record<string, EventState> = {
      'aceptado': EventState.SCHEDULED,
      'rechazado': EventState.REJECTED,
      'pendiente': EventState.IN_REVIEW
    }

    const newStatus = statusMap[estado] || EventState.IN_REVIEW
    event.currentState = newStatus
    await event.save()

    if (newStatus === EventState.SCHEDULED) {
      NotificationService.notifyEventApproved(event).catch(console.error)
    } else if (newStatus === EventState.REJECTED) {
      NotificationService.notifyEventRejected(event).catch(console.error)
    }

    return response.ok({ message: 'Estado actualizado', event })
  }

  async requestReview({ params, response, auth }: HttpContext) {
    const user = auth.use('web').user
    if (!user) {
      return response.unauthorized({ message: 'No estás autenticado' })
    }

    try {
      const event = await Event.findOrFail(params.id)
      const eventStateService = new EventStateService()
      await eventStateService.requestReview(event, user)
      return response.ok({ message: 'Revisión solicitada exitosamente', event })
    } catch (error: any) {
    if (error.status) {
      return response.status(error.status).json({ message: error.message })
    }

    return response.internalServerError({
      message: 'Error interno del servidor',
      error: error.message
    })
  }
  }

  async passToReview({ params, response, auth }: HttpContext) {
    const user = auth.use('web').user!
    await user.load('role')

    const event = await Event.findOrFail(params.id)

    if (user.role?.name?.toLowerCase() !== 'encargado_departamento' && user.role?.name?.toLowerCase() !== 'admin') {
      return response.forbidden({ message: 'No tienes permiso para pasar este evento a revisión' })
    }

    if (event.currentState !== EventState.REQUESTED) {
      return response.badRequest({ message: 'El evento no está en estado de solicitud' })
    }

    event.currentState = EventState.IN_REVIEW
    await event.save()

    NotificationService.notifyPassedToReview(event).catch(console.error)

    return response.ok({ message: 'El evento ha pasado a revisión', event })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const event = await Event.findOrFail(params.id)

    if (auth.use('web').user?.role?.name !== 'admin' && event.userId !== auth.use('web').user?.id) {
      return response.forbidden({ message: 'No tienes permiso para cancelar este evento' })
    }

    event.currentState = EventState.CANCELLED
    await event.save()

    NotificationService.notifyEventCancelled(event).catch(console.error)

    return response.ok({ message: 'Evento cancelado' })
  }
}
