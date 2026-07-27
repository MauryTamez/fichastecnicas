import { BaseSeeder } from '@adonisjs/lucid/seeders'
import LocationType from '#models/location_type'
import Organization from '#models/organization'

export default class extends BaseSeeder {
  public async run() {
    const org = await Organization.findBy('slug', 'fime')
    const orgId = org ? org.id : 1

    await LocationType.createMany([
      { name: 'Auditorio', allowsExternalStaff: false, organizationId: orgId },
      { name: 'Sala', allowsExternalStaff: true, organizationId: orgId },
      { name: 'Patio', allowsExternalStaff: true, organizationId: orgId },
    ])
  }
}
