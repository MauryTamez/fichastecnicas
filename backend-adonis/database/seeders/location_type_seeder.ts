import { BaseSeeder } from '@adonisjs/lucid/seeders'
import LocationType from '#models/location_type'

export default class extends BaseSeeder {
  async run() {
    await LocationType.updateOrCreate(
      { id: 1 },
      {
        id: 1,
        name: 'Auditorio',
        allowsExternalStaff: true,
        organizationId: 1
      }
    )
  }
}