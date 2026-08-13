import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'version_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('event_version_id').unsigned().references('id').inTable('version_contents').onDelete('CASCADE')
      table.integer('item_id').unsigned().references('id').inTable('catalog_items').onDelete('CASCADE')
      table.integer('quantity').notNullable().defaultTo(1)
      table.unique(['event_version_id', 'item_id'])

      // Not adding timestamps as they are not in the schema snippet, or keep them?
      // actually let's not add them since they are not in the schema snippet.
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}