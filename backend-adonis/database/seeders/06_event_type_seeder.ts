import { BaseSeeder } from '@adonisjs/lucid/seeders'
import EventType from '#models/event_type'
import Organization from '#models/organization'

export default class extends BaseSeeder {
  public async run() {
    const org = await Organization.findBy('slug', 'fime')
    const orgId = org ? org.id : 1

    await EventType.createMany([
      { name: 'Coloquio', description: 'Evento con presentaciones formales', organizationId: orgId },
      { name: 'Examen de Grado', description: 'Sesión práctica con asistentes', organizationId: orgId },
      { name: 'Graduación', description: 'Encuentro operativo o de coordinación', organizationId: orgId },
      { name: 'Seminario', description: 'Evento académico para público especializado', organizationId: orgId },
      { name: 'Entrega de Diplomas - Grupo de los 100', description: 'Evento académico para público especializado', organizationId: orgId },
    ])
  }
}
