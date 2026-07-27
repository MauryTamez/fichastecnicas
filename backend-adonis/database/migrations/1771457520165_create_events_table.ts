import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enum('current_state', [
          'draft',
          'requested',
          'in_review',
          'scheduled',
          'rejected',
          'cancelled',
          'historical',
        ])
        .notNullable()

      table.integer('organization_id').references('organizations.id').notNullable()
      table.integer('user_id').references('users.id').notNullable()
      table.integer('main_responsible').references('users.id').notNullable()
      table.integer('event_type_id').references('event_types.id').notNullable()
      // --- Datos de la Ficha Técnica (Parte 1) ---
      table.string('lugar').nullable()
      table.string('departamento_solicitante').nullable()
      table.string('nombre_evento').nullable()
      table.string('fecha').nullable()
      table.string('horario_inicio_fin').nullable()
      table.string('responsable').nullable()
      table.string('extension').nullable()
      table.string('correo_electronico').nullable()
      table.integer('cantidad_personas').nullable()
      table.string('acomodo_tipo').nullable()



      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
