import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Event from '#models/event'
import EventVersion from '#models/event_version'
import VersionContent from '#models/version_content'
import { RagService } from '#services/rag_service'
import EventVersionEmbedding from '#models/event_version_embedding'

export default class VectorizeExisting extends BaseCommand {
  static commandName = 'db:vectorize-existing'
  static description = 'Vectoriza de forma retroactiva las fichas tecnicas existentes sin embedding en la base de datos'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Iniciando vectorización retroactiva de eventos...')
    const ragService = new RagService()

    // 1. Obtener todos los eventos
    const events = await Event.query()
    this.logger.info(`Se encontraron ${events.length} eventos en la base de datos.`)

    let vectorizedCount = 0

    for (const event of events) {
      // Buscar la versión actual
      const eventVersion = await EventVersion.query()
        .where('eventId', event.id)
        .where('isCurrentVersion', true)
        .first()

      if (!eventVersion) {
        this.logger.warning(`No se encontró versión actual para el evento ID: ${event.id}`)
        continue
      }

      // Validar si ya tiene un embedding
      const existingEmbedding = await EventVersionEmbedding.query()
        .where('versionContentId', eventVersion.versionContentId)
        .first()

      if (existingEmbedding) {
        this.logger.info(`El evento ID ${event.id} ("${contentNameSnippet(existingEmbedding.contentChunk)}") ya está vectorizado.`)
        continue
      }

      // Obtener el contenido de la versión
      const content = await VersionContent.find(eventVersion.versionContentId)
      if (!content) {
        this.logger.error(`No se encontró contenido para la versión ID: ${eventVersion.versionContentId}`)
        continue
      }

      // Obtener las actividades
      const activities = await eventVersion.related('versionActivities').query()
      const activitiesText = activities
        .map((a: any) => `- ${a.name}: ${a.startsAt ? a.startsAt.toFormat('HH:mm') : ''}`)
        .join('\n')

      const fullContent = `
Ficha Técnica: ${content.name}
Objetivo: ${content.objective}
Descripción: ${content.description}
Dress Code: ${content.dressCode || 'No especificado'}
Agenda:
${activitiesText}
`.trim()

      this.logger.info(`Vectorizando evento "${content.name}" (ID: ${event.id})...`)
      try {
        await ragService.vectorizeFichaTecnica(event.id, content.id, fullContent)
        this.logger.success(`¡Vectorizado exitosamente!`)
        vectorizedCount++
      } catch (err: any) {
        this.logger.error(`Error al vectorizar evento ID ${event.id}: ${err.message}`)
      }
    }

    this.logger.info(`Vectorización completada. Se vectorizaron ${vectorizedCount} nuevos eventos.`)
  }
}

function contentNameSnippet(chunk: string): string {
  const line = chunk.split('\n')[0] || ''
  return line.replace('Ficha Técnica:', '').trim()
}