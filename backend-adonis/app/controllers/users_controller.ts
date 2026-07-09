import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.query().preload('role')
    
    // Map to frontend legacy format
    const mapped = users.map(u => ({
      id: u.id,
      nombre: u.name,
      email: u.email,
      role: u.role?.name,
      nivel_permiso: u.roleId
    }))
    
    return response.json(mapped)
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()
    const user = new User()
    user.name = data.nombre
    user.email = data.email
    user.password = data.password
    
    // map role explicitly if passed or fallback to legacy numeric mapping
    let roleId = data.roleId || data.nivel_permiso
    if (data.roleName) {
      const role = await Role.findBy('name', data.roleName)
      if (role) roleId = role.id
    }
    user.roleId = roleId || 4 // Default to 'creador' if nothing else matches

    user.organizationId = 1
    user.isInternal = true
    await user.save()

    return response.created({ message: 'User created successfully', userId: user.id })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.all()

    if (data.nombre) user.name = data.nombre
    if (data.email) user.email = data.email
    if (data.password) user.password = data.password
    if (data.roleId || data.nivel_permiso) {
      user.roleId = data.roleId || data.nivel_permiso
    }
    if (data.roleName) {
      const role = await Role.findBy('name', data.roleName)
      if (role) user.roleId = role.id
    }
    
    await user.save()
    await user.load('role')
    
    return response.json({
      id: user.id,
      nombre: user.name,
      email: user.email,
      role: user.role?.name,
      nivel_permiso: user.roleId
    })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.json({ message: 'User deleted successfully' })
  }
}
