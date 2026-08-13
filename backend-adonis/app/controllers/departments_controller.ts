import type { HttpContext } from '@adonisjs/core/http'
import Department from '#models/department'
import { createDepartmentValidator, updateDepartmentValidator } from '#validators/department'

export default class DepartmentsController {
  async index({ response }: HttpContext) {
    const departments = await Department.query().preload('organization').orderBy('priority', 'asc')
    return response.json(departments)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createDepartmentValidator)
    const department = await Department.create(payload)
    return response.created(department)
  }

  async show({ params, response }: HttpContext) {
    const department = await Department.findOrFail(params.id)
    await department.load('organization')
    return response.json(department)
  }

  async update({ params, request, response }: HttpContext) {
    const department = await Department.findOrFail(params.id)
    const payload = await request.validateUsing(updateDepartmentValidator)
    
    department.merge(payload)
    await department.save()
    
    return response.json(department)
  }

  async destroy({ params, response }: HttpContext) {
    const department = await Department.findOrFail(params.id)

    // Check if it's being used by users
    const usersCount = await department.related('users').query().count('* as total').first()
    if (usersCount && Number(usersCount.$extras.total) > 0) {
      return response.badRequest({ message: 'No se puede eliminar el departamento porque tiene usuarios asociados.' })
    }

    await department.delete()
    return response.ok({ message: 'Departamento eliminado correctamente' })
  }

  async organigram({ auth, response }: HttpContext) {
    const user = auth.use('web').user!
    
    if (!user.departmentId) {
      return response.badRequest({ message: 'El usuario no tiene un departamento asignado.' })
    }

    const department = await Department.query()
      .where('id', user.departmentId)
      .preload('users', (usersQuery) => {
        usersQuery.preload('role')
      })
      .firstOrFail()

    return response.json(department)
  }

  async organigramAll({ response }: HttpContext) {
    const departments = await Department.query()
      .preload('users', (usersQuery) => {
        usersQuery.preload('role')
      })
      .orderBy('priority', 'asc')
      
    return response.json(departments)
  }
}
