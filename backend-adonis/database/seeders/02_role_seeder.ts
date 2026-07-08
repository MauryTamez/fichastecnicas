import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('name', [
      {
        name: 'admin',
        description: 'Administrador del sistema',
      },
      {
        name: 'moderador',
        description: 'encargado de aceptar o rechazar las fichas técnicas y dar feedback a los creadores',
      },
      {
        name: 'encargado_departamento',
        description: 'encargado de aceptar o rechazar las solicitudes de su departamento',
      },
      {
        name: 'creador',
        description: 'Creadores de eventos - fichas tecnicas',
      },
      {
        name: 'auxiliares',
        description: 'Auxiliares y personal de apoyo',
      },
    ])
  }
}                        