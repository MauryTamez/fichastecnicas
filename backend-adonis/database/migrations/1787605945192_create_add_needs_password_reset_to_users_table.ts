import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddNeedsPasswordResetToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // Agregamos la columna booleana. 
      // defaultTo(true) asegura que todos los usuarios nuevos (y los actuales) nazcan con la obligación de cambiarla.
      table.boolean('needs_password_reset').defaultTo(true)
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      // El método down es el "Ctrl+Z". Si la regamos, esto borra la columna.
      table.dropColumn('needs_password_reset')
    })
  }
}