import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'

export default class UsersController {
  /**
   * List all available roles (for dropdowns)
   */
  async roles({ response }: HttpContext) {
    const roles = await Role.all()
    return response.json(roles.map(r => ({ id: r.id, name: r.name, description: r.description })))
  }

  async index({ response }: HttpContext) {
    const users = await User.query().preload('role').preload('department')
    
    const mapped = users.map(u => ({
      id: u.id,
      nombre: u.name,
      email: u.email,
      phone: u.phone,
      isInternal: u.isInternal,
      roleId: u.roleId,
      role: u.role?.name,
      roleDescription: u.role?.description,
      nivel_permiso: u.roleId, // Legacy compat
      departmentId: u.departmentId,
      department: u.department?.name,
    }))
    
    return response.json(mapped)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()
    const user = new User()
    user.name = data.nombre
    user.email = data.email
    user.password = data.password
    
    // Accept roleId directly or map from roleName
    let roleId = data.roleId || data.nivel_permiso
    if (data.roleName) {
      const role = await Role.findBy('name', data.roleName)
      if (role) roleId = role.id
    }
    user.roleId = roleId || 4 // Default to 'creador' if nothing else matches

    user.organizationId = 1
    user.isInternal = true
    if (data.departmentId) {
      user.departmentId = Number(data.departmentId)
    }
    await user.save()

    return response.created({ message: 'User created successfully', userId: user.id })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.all()

    if (data.nombre) user.name = data.nombre
    if (data.email) user.email = data.email
    if (data.password) user.password = data.password

    // Role update - accept roleId directly
    if (data.roleId) {
      user.roleId = Number(data.roleId)
    } else if (data.nivel_permiso) {
      user.roleId = Number(data.nivel_permiso)
    }

    if (data.roleName) {
      const role = await Role.findBy('name', data.roleName)
      if (role) user.roleId = role.id
    }

    if (data.departmentId !== undefined) {
      user.departmentId = data.departmentId ? Number(data.departmentId) : null
    }
    
    await user.save()
    await user.load('role')
    await user.load('department')
    
    return response.json({
      id: user.id,
      nombre: user.name,
      email: user.email,
      phone: user.phone,
      isInternal: user.isInternal,
      roleId: user.roleId,
      role: user.role?.name,
      roleDescription: user.role?.description,
      nivel_permiso: user.roleId,
      departmentId: user.departmentId,
      department: user.department?.name,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.json({ message: 'User deleted successfully' })
  }

  async userEventsSummary({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const Event = (await import('#models/event')).default

    const createdEvents = await Event.query()
      .where('userId', user.id)
      .preload('eventType')
      .preload('location')
      .orderBy('createdAt', 'desc')

    const responsibleEvents = await Event.query()
      .where('mainResponsibleId', user.id)
      .preload('eventType')
      .preload('location')
      .orderBy('createdAt', 'desc')

    return response.json({
      createdEvents,
      responsibleEvents
    })
  }
}

