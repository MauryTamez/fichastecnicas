import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Department from '#models/department'
import Organization from '#models/organization'

export default class extends BaseSeeder {
  async run() {
    const fime = await Organization.findBy('slug', 'fime')
    
    if (fime) {
      const departments = [
        {
          name: 'Direccion',
          priority: 1,
          organization_id: fime.id,
        },
        {
          name: 'Subdireccion',
          priority: 2,
          organization_id: fime.id,
        },
        {
          name: 'Academia',
          priority: 3,
          organization_id: fime.id,
        },
        {
          name: 'SAFIME',
          priority: 4,
          organizationId: fime.id,
        },
      ]

      for (const dept of departments) {
        await Department.updateOrCreate(
          { name: dept.name, organizationId: dept.organizationId },
          dept
        )
      }
    }
  }
}