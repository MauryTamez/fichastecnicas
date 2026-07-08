import { BaseSeeder } from '@adonisjs/lucid/seeders'
import LocationType from '#models/location_type'
import Organization from '#models/organization'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  public async run() {
    const org = await Organization.findBy('slug', 'fime')
    const orgId = org ? org.id : 1

    await LocationType.updateOrCreate(
      { id: 1 },
      { name: 'Auditorio', allowsExternalStaff: false, organizationId: orgId }
    )
    await LocationType.updateOrCreate(
      { id: 2 },
      { name: 'Sala', allowsExternalStaff: true, organizationId: orgId }
    )
    await LocationType.updateOrCreate(
      { id: 3 },
      { name: 'Patio', allowsExternalStaff: true, organizationId: orgId }
    )

    // Sync database sequence to prevent future sequence collisions
    await db.rawQuery(
      "SELECT setval('location_types_id_seq', COALESCE((SELECT MAX(id) FROM location_types), 1))"
    )
  }
}
