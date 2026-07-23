import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'version_contents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('version_number').notNullable()
      table.string('name').notNullable()
      table.text('objective')
      table.text('description')
      table.dateTime('starts_at').notNullable()
      table.dateTime('ends_at').notNullable()
      table.string('dress_code')
      table.string('program_impacted')
      table.text('guest_specifications')
      table.text('presidium_details')
      table.text('director_action')
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

      // --- Plomitas / Checkboxes (Parte 2) ---
      table.boolean('sonido').defaultTo(false)
      table.boolean('microfono_inalambrico_mano').defaultTo(false)
      table.boolean('proyeccion_presentacion').defaultTo(false)
      table.boolean('personal_apoyo').defaultTo(false)
      table.boolean('musica_fondo').defaultTo(false)
      table.boolean('manteles').defaultTo(false)
      table.boolean('banderas').defaultTo(false)
      table.boolean('toma_fotografia').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
