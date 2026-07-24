import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    const roles = await Role.all()
    const getRoleId = (roleName: string) => {
      const role = roles.find((r) => r.name === roleName)
      return role ? role.id : 1 // Fallback to 1 if not found
    }

    await User.updateOrCreateMany('email', [
      {
        name: 'Admin User',
        email: 'amdmin@mail.co',
        phone: '1234567890',
        password: 'password',
        isInternal: true,
        roleId: getRoleId('admin'),
        organizationId: 1,
        departmentId: 1,
      },
      {
        name: 'Moderador User',
        email: 'enrique.salazarmrs@uanl.edu.mx',
        phone: '1234567891',
        password: 'password',
        isInternal: true,
        roleId: getRoleId('moderador'),
        organizationId: 1,
        departmentId: 1,
      },
      {
        name: 'Subdirector User',
        email: 'salazar.mares.enrique.oliband@gmail.com',
        phone: '1234567892',
        password: 'password',
        isInternal: true,
        roleId: getRoleId('encargado_departamento'),
        organizationId: 1,
        departmentId: 1,
      },
      {
        name: 'Creador User',
        email: 'liosauriopro11@gmail.com',
        phone: '1234567893',
        password: 'password',
        isInternal: true,
        roleId: getRoleId('creador'),
        organizationId: 1,
        departmentId: 1,
      },
      {
        name: 'Auxiliar User',
        email: 'auxiliar@mail.com',
        phone: '1234567894',
        password: 'password',
        isInternal: true,
        roleId: getRoleId('auxiliar'),
        organizationId: 1,
        departmentId: 1,
      },
    ])
  }
}