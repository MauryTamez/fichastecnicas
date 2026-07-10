import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'
import { EventState } from '../app/enums/event_state.js'

export default class ArchiveEvents extends BaseCommand {
  static commandName = 'events:archive'
  static description = 'Archiva automáticamente eventos finalizados con 24h de gracia'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Iniciando proceso automático de archivado de eventos finalizados...')

    try {
      // Usamos Query Builder para un batch update eficiente de todos los eventos finalizados.
      // Se une con event_versions (versión activa) y version_contents para revisar ends_at.
      const affectedRows = await db
        .from('events')
        .where('current_state', EventState.SCHEDULED)
        .whereExists(
          db.from('event_versions')
            .whereRaw('event_versions.event_id = events.id')
            .where('event_versions.is_current_version', true)
            .whereExists(
              db.from('version_contents')
                .whereRaw('version_contents.id = event_versions.version_content_id')
                .where('version_contents.ends_at', '<=', db.raw("NOW() - INTERVAL '1 DAY'"))
            )
        )
        .update({
          current_state: EventState.HISTORICAL,
          updated_at: db.raw('NOW()') // Aseguramos refrescar fecha de actualización
        })

      // El ORM/Driver normalmente devuelve la cantidad de rows afectadas o un arreglo.
      const count = typeof affectedRows === 'number' 
        ? affectedRows 
        : (Array.isArray(affectedRows) ? affectedRows.length : 0)

      if (count > 0) {
        this.logger.info(`✅ Se archivaron exitosamente ${count} eventos al estado "historical".`)
      } else {
        this.logger.info('ℹ️ No se encontraron eventos finalizados para archivar en este momento.')
      }
    } catch (error) {
      this.logger.error('❌ Fallo crítico al intentar archivar eventos finalizados.')
      this.logger.error(error instanceof Error ? error.stack || error.message : String(error))
      
      // Lanzamos la excepción para asegurarnos que la terminal (o Cron Manager) detecte la falla de salida
      this.exitCode = 1
    }
  }
}