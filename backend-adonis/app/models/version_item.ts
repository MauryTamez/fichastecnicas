import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import VersionContent from './version_content.js'
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

  @belongsTo(() => VersionContent, { foreignKey: 'eventVersionId' })
  declare versionContent: BelongsTo<typeof VersionContent>

  @belongsTo(() => CatalogItem, { foreignKey: 'itemId' })
  declare catalogItem: BelongsTo<typeof CatalogItem>
}