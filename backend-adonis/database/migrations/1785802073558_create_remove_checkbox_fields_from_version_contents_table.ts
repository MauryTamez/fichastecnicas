import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'version_contents'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sonido')
      table.dropColumn('microfono_inalambrico_mano')
      table.dropColumn('proyeccion_presentacion')
      table.dropColumn('personal_apoyo')
      table.dropColumn('musica_fondo')
      table.dropColumn('manteles')
      table.dropColumn('banderas')
      table.dropColumn('toma_fotografia')
      table.dropColumn('microfono_inalambrico_mesa')
      table.dropColumn('microfono_presidencial')
      table.dropColumn('microfono_diadema')
      table.dropColumn('microfono_alambrico')
      table.dropColumn('proyeccion_video')
      table.dropColumn('videograbacion')
      table.dropColumn('apuntador')
      table.dropColumn('mesa_coffee_break')
      table.dropColumn('estacionamiento')
      table.dropColumn('podium')
      table.dropColumn('presidium')
      table.dropColumn('edecanes')
      table.dropColumn('himno_uanl')
      table.dropColumn('separador_himno')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('sonido').defaultTo(false)
      table.boolean('microfono_inalambrico_mano').defaultTo(false)
      table.boolean('proyeccion_presentacion').defaultTo(false)
      table.boolean('personal_apoyo').defaultTo(false)
      table.boolean('musica_fondo').defaultTo(false)
      table.boolean('manteles').defaultTo(false)
      table.boolean('banderas').defaultTo(false)
      table.boolean('toma_fotografia').defaultTo(false)
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
    })
  }
}