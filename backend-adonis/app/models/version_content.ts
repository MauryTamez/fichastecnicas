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

  @column()
  declare sonido: boolean

  @column({ columnName: 'microfono_inalambrico_mano' })
  declare microfonoInalambricoMano: boolean

  @column({ columnName: 'proyeccion_presentacion' })
  declare proyeccionPresentacion: boolean

  @column({ columnName: 'personal_apoyo' })
  declare personalApoyo: boolean

  @column({ columnName: 'musica_fondo' })
  declare musicaFondo: boolean

  @column()
  declare manteles: boolean

  @column()
  declare banderas: boolean

  @column({ columnName: 'microfono_inalambrico_mesa' })
declare microfonoInalambricoMesa: boolean

@column({ columnName: 'microfono_presidencial' })
declare microfonoPresidencial: boolean

@column({ columnName: 'microfono_diadema' })
declare microfonoDiadema: boolean

@column({ columnName: 'microfono_alambrico' })
declare microfonoAlambrico: boolean

@column({ columnName: 'proyeccion_video' })
declare proyeccionVideo: boolean

@column()
declare videograbacion: boolean

@column()
declare apuntador: boolean

@column({ columnName: 'mesa_coffee_break' })
declare mesaCoffeeBreak: boolean

@column()
declare estacionamiento: boolean

@column()
declare podium: boolean

@column()
declare presidium: boolean

@column()
declare edecanes: boolean

@column({ columnName: 'himno_uanl' })
declare himnoUanl: boolean

@column({ columnName: 'separador_himno' })
declare separadorHimno: boolean

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
  @column({ columnName: 'toma_fotografia' })
  declare tomaFotografia: boolean

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
