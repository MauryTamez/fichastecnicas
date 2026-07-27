import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import EventType from './event_type.js'
import EventVersion from './event_version.js'
import EventVersionEmbedding from './event_version_embedding.js'
import Location from './location.js'
import Organization from './organization.js'
import User from './user.js'
import { EventState } from '../enums/event_state.js'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare currentState: EventState

  @column()
  declare organizationId: number

  @column()
  declare userId: number

  @column({ columnName: 'main_responsible' })
  declare mainResponsibleId: number

  @column()
  declare eventTypeId: number

  @column()
  declare locationId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User)
  declare mainResponsible: BelongsTo<typeof User>

  @belongsTo(() => EventType)
  declare eventType: BelongsTo<typeof EventType>

  @belongsTo(() => Location)
  declare location: BelongsTo<typeof Location>

  @hasMany(() => EventVersion)
  declare eventVersions: HasMany<typeof EventVersion>

  @hasMany(() => EventVersionEmbedding)
  declare eventVersionEmbeddings: HasMany<typeof EventVersionEmbedding>
}
