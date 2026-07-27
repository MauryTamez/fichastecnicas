import { BaseSeeder } from '@adonisjs/lucid/seeders'
import EventType from '#models/event_type'

export default class extends BaseSeeder {
  async run() {
    await EventType.createMany([
      {
        name: 'Seminario',
        description: 'Seminario académico o de investigación para profesores y estudiantes.',
        organizationId: 1,
      },
      {
        name: 'Conferencia',
        description: 'Conferencia magistral, charla o ponencia con invitados especiales.',
        organizationId: 1,
      },
      {
        name: 'Taller',
        description: 'Taller práctico, curso intensivo o sesión de laboratorio.',
        organizationId: 1,
      },
      {
        name: 'Ceremonia',
        description: 'Ceremonias formales como graduaciones, entregas de premios o inauguraciones.',
        organizationId: 1,
      },
      {
        name: 'Simposio',
        description: 'Simposio, congreso o foro de debate académico y estudiantil.',
        organizationId: 1,
      },
      {
        name: 'Presentación',
        description: 'Presentación de proyectos finales, trabajos de grado o lanzamientos de libros.',
        organizationId: 1,
      },
      {
        name: 'Reunión',
        description: 'Reuniones de consejo universitario, asambleas o reuniones de academia.',
        organizationId: 1,
      },
      {
        name: 'Exposición',
        description: 'Exposición de arte, ciencia, ferias de emprendimiento o muestras culturales.',
        organizationId: 1,
      }
    ])
  }
}