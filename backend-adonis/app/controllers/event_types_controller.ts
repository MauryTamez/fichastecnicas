import type { HttpContext } from '@adonisjs/core/http'
import EventType from '#models/event_type'
import { createEventTypeValidator, updateEventTypeValidator } from '#validators/event_type'

export default class EventTypesController {
    /**
     * Obtener todos los tipos de evento
     */
    async index({ response }: HttpContext) {
        const eventTypes = await EventType.query().preload('organization')
        return response.json(eventTypes)
    }

    /**
     * Crear un nuevo tipo de evento
     */
    async store({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createEventTypeValidator)
        const eventType = await EventType.create(payload)
        return response.created(eventType)
    }

    /**
     * Obtener un tipo de evento por ID
     */
    async show({ params, response }: HttpContext) {
        const eventType = await EventType.findOrFail(params.id)
        await eventType.load('organization')
        return response.json(eventType)
    }

    /**
     * Actualizar un tipo de evento
     */
    async update({ params, request, response }: HttpContext) {
        const eventType = await EventType.findOrFail(params.id)
        const payload = await request.validateUsing(updateEventTypeValidator)
        
        eventType.merge(payload)
        await eventType.save()
        
        return response.json(eventType)
    }

    /**
     * Eliminar un tipo de evento
     */
    async destroy({ params, response }: HttpContext) {
        const eventType = await EventType.findOrFail(params.id)
        await eventType.delete()
        
        return response.ok({ message: 'Tipo de evento eliminado correctamente' })
    }
}