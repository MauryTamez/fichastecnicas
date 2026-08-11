import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import EventVersion from './event_version.js'
import EventVersionEmbedding from './event_version_embedding.js'

export default class VersionContent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare versionNumber: number

  @column()
  declare name: string

  @column()
  declare objective: string | null

  @column()
  declare description: string | null

  @column()
  declare lugar: string | null

  @column({ columnName: 'departamento_solicitante' })
  declare departamentoSolicitante: string | null

  @column({ columnName: 'nombre_evento' })
  declare nombreEvento: string | null

  @column()
  declare fecha: string | null

  @column({ columnName: 'horario_inicio_fin' })
  declare horarioInicioFin: string | null

  @column()
  declare responsable: string | null

  @column()
  declare extension: string | null

  @column({ columnName: 'correo_electronico' })
  declare correoElectronico: string | null

  @column({ columnName: 'cantidad_personas' })
  declare cantidadPersonas: number | null

  @column({ columnName: 'acomodo_tipo' })
  declare acomodoTipo: string | null

  // Checkboxes have been migrated to version_items and catalog_items

@column({ columnName: 'otros_observaciones' })
declare otrosObservaciones: string | null

  @column({
    prepare: (value: any) => (value ? (typeof value === 'string' ? value : JSON.stringify(value)) : null),
    consume: (value: any) => {
      if (!value) return null
      if (typeof value === 'string') {
        try { return JSON.parse(value) } catch { return value }
      }
      return value
    },
  })
  declare listaEstacionamiento: any

  @column()
  declare horaFotografia: string | null

  @column({
    prepare: (value: any) => (value ? (typeof value === 'string' ? value : JSON.stringify(value)) : null),
    consume: (value: any) => {
      if (!value) return null
      if (typeof value === 'string') {
        try { return JSON.parse(value) } catch { return value }
      }
      return value
    },
  })
  declare listaPresidium: any


  @column.dateTime()
  declare startsAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime

  @column()
  declare dressCode: string | null

  @column()
  declare programImpacted: string | null

  @column()
  declare guestSpecifications: string | null

  @column({ columnName: 'presidium_details' })
  declare presidiumDetail: string | null

  @column()
  declare directorAction: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => EventVersion)
  declare eventVersions: HasMany<typeof EventVersion>

  @hasMany(() => EventVersionEmbedding)
  declare eventVersionEmbeddings: HasMany<typeof EventVersionEmbedding>

}
