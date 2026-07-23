import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'version_contents'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('microfono_inalambrico_mesa').defaultTo(false)
      table.boolean('microfono_presidencial').defaultTo(false)
      table.boolean('microfono_diadema').defaultTo(false)
      table.boolean('microfono_alambrico').defaultTo(false)
      table.boolean('proyeccion_video').defaultTo(false)
      table.boolean('videograbacion').defaultTo(false)
      table.boolean('apuntador').defaultTo(false)

      table.boolean('mesa_coffee_break').defaultTo(false)
      table.boolean('estacionamiento').defaultTo(false)
      table.boolean('podium').defaultTo(false)
      table.boolean('presidium').defaultTo(false)
      table.boolean('edecanes').defaultTo(false)
      table.boolean('himno_uanl').defaultTo(false)
      table.boolean('separador_himno').defaultTo(false)

      table.text('otros_observaciones').nullable()

      table.json('lista_estacionamiento').nullable()
      table.string('hora_fotografia').nullable()
      table.json('lista_presidium').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'microfono_inalambrico_mesa',
        'microfono_presidencial',
        'microfono_diadema',
        'microfono_alambrico',
        'proyeccion_video',
        'videograbacion',
        'apuntador',
        'mesa_coffee_break',
        'estacionamiento',
        'podium',
        'presidium',
        'edecanes',
        'himno_uanl',
        'separador_himno',
        'otros_observaciones',
        'lista_estacionamiento',
        'hora_fotografia',
        'lista_presidium'
      )
    })
  }
}
