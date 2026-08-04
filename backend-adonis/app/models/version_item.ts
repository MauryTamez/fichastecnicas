import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import EventVersion from './event_version.js'
import CatalogItem from './catalog_item.js'

export default class VersionItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare eventVersionId: number

  @column()
  declare itemId: number

  @column()
  declare quantity: number

  @belongsTo(() => EventVersion, { foreignKey: 'eventVersionId' })
  declare eventVersion: BelongsTo<typeof EventVersion>

  @belongsTo(() => CatalogItem, { foreignKey: 'itemId' })
  declare catalogItem: BelongsTo<typeof CatalogItem>
}