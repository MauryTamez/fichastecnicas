import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'version_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['event_version_id'])
      table.foreign('event_version_id').references('event_versions.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['event_version_id'])
      table.foreign('event_version_id').references('version_contents.id').onDelete('CASCADE')
    })
  }
}