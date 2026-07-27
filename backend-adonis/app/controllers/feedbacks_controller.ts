import type { HttpContext } from '@adonisjs/core/http'
import VersionFeedback from '#models/version_feedback'
import EventVersion from '#models/event_version'
import Event from '#models/event'
import vine from '@vinejs/vine'
import { EventState } from '../enums/event_state.js'
import { NotificationService } from '#services/notification_service'

const createFeedbackValidator = vine.compile(
  vine.object({
    fieldName: vine.string().nullable().optional(),
    comment: vine.string().trim().minLength(1),
  })
)

export default class FeedbacksController {
  async index({ params, response }: HttpContext) {
    const feedbacks = await VersionFeedback.query()
      .where('eventVersionId', params.versionId)
      .preload('reviewer')
      .orderBy('createdAt', 'desc')

    return response.ok({ data: feedbacks })
  }

  async store({ params, request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createFeedbackValidator)
    const user = auth.use('web').user!
    await user.load('role')

    const roleName = user.role?.name?.toLowerCase()
    if (roleName !== 'moderador' && roleName !== 'encargado_departamento' && roleName !== 'admin') {
      return response.forbidden({ message: 'No tienes permiso para dar feedback.' })
    }

    const version = await EventVersion.findOrFail(params.versionId)
    const event = await Event.findOrFail(version.eventId)

    if (event.currentState !== EventState.IN_REVIEW && event.currentState !== EventState.REQUESTED) {
      return response.badRequest({ message: 'El evento debe estar en revisión para recibir feedback.' })
    }

    if (roleName === 'encargado_departamento') {
      await event.load('user')
      if (event.user.departmentId !== user.departmentId) {
         return response.forbidden({ message: 'Solo puedes dar feedback a eventos de tu departamento.' })
      }
    }

    const feedback = new VersionFeedback()
    feedback.fieldName = data.fieldName || null
    feedback.comment = data.comment
    feedback.status = 'pending'
    feedback.eventVersionId = version.id
    feedback.reviewerId = user.id

    await feedback.save()
    await feedback.load('reviewer')

    // Disparar notificación por correo al creador
    NotificationService.notifyNewFeedback(event, feedback, user).catch(console.error)

    return response.created({ message: 'Feedback añadido', data: feedback })
  }

  async resolve({ params, response, auth }: HttpContext) {
    const user = auth.use('web').user!
    const feedback = await VersionFeedback.findOrFail(params.id)
    const version = await EventVersion.findOrFail(feedback.eventVersionId)
    const event = await Event.findOrFail(version.eventId)

    await user.load('role')

    if (event.userId !== user.id && user.role?.name?.toLowerCase() !== 'admin') {
      return response.forbidden({ message: 'Solo el creador puede marcar el feedback como resuelto.' })
    }

    feedback.status = 'resolved'
    await feedback.save()

    return response.ok({ message: 'Feedback resuelto', data: feedback })
  }
}
