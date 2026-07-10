import Event from '#models/event'
import User from '#models/user'
import { EventState } from '../enums/event_state.js'
import { Exception } from '@adonisjs/core/exceptions'

export class EventStateService {
  /**
   * Transición: draft -> requested
   * Solo permitido si el usuario es el creador del evento.
   */
  public async requestReview(event: Event, user: User): Promise<Event> {
    if (event.currentState !== EventState.DRAFT) {
      throw new Exception('El evento debe estar en estado borrador para solicitar revisión', { status: 400 })
    }

    if (user.id !== event.userId) {
      throw new Exception('Solo el creador del evento puede solicitar su revisión', { status: 403 })
    }

    event.currentState = EventState.RESQUESTED
    await event.save()
    
    return event
  }

  /**
   * Transición: requested -> in_review
   * Solo permitido si el usuario tiene el rol de "Subdirector".
   */
  public async acceptRequest(event: Event, user: User): Promise<Event> {
    if (event.currentState !== EventState.RESQUESTED) {
      throw new Exception('El evento debe estar en estado solicitado para aceptar la solicitud', { status: 400 })
    }

    await user.load('role')
    
    if (user.role?.name.toLowerCase() !== 'subdirector') {
      throw new Exception('No tienes los permisos de Subdirector para aceptar la solicitud', { status: 403 })
    }

    event.currentState = EventState.IN_REVIEW
    await event.save()

    return event
  }

  /**
   * Transición: in_review -> scheduled
   * Solo permitido si el usuario tiene el rol de "Moderador".
   */
  public async approveEvent(event: Event, user: User): Promise<Event> {
    if (event.currentState !== EventState.IN_REVIEW) {
      throw new Exception('El evento debe estar en revisión para poder ser aprobado', { status: 400 })
    }

    await user.load('role')

    if (user.role?.name.toLowerCase() !== 'moderador') {
      throw new Exception('No tienes los permisos de Moderador para aprobar este evento', { status: 403 })
    }

    event.currentState = EventState.SCHEDULED
    await event.save()

    return event
  }

  /**
   * Transición: in_review -> rejected
   * Solo permitido si el usuario tiene el rol de "Moderador".
   */
  public async rejectEvent(event: Event, user: User): Promise<Event> {
    if (event.currentState !== EventState.IN_REVIEW) {
      throw new Exception('El evento debe estar en revisión para poder ser rechazado', { status: 400 })
    }

    await user.load('role')

    if (user.role?.name.toLowerCase() !== 'moderador') {
      throw new Exception('No tienes los permisos de Moderador para rechazar este evento', { status: 403 })
    }

    event.currentState = EventState.REJECTED
    await event.save()

    return event
  }
}