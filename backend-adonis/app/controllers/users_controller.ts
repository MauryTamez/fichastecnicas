import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import NewUserPasswordNotification from '#mails/new_user_password_notification' // O la ruta relativa si no tienes el alias #mails configurado
import updatePasswordValidator from '#validators/update_password'

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

    await mail.send(new NewUserPasswordNotification(user.email, data.password))

    return response.created({ message: 'User created successfully', userId: user.id })
  }

  async updatePassword({ auth, request, response }: HttpContext) {
    try {
      // Usar auth.use('web').user ya que el jwtAuth middleware usa ese guard
      const user = auth.use('web').user
      if (!user) {
        return response.unauthorized({ message: 'Usuario no autenticado' })
      }

      // 1. Validar request
      const payload = await request.validateUsing(updatePasswordValidator)

      // 2. Verificar contraseña actual
      const isPasswordValid = await hash.verify(user.password, payload.currentPassword)
      if (!isPasswordValid) {
        return response.badRequest({ message: 'La contraseña actual es incorrecta' })
      }

      // 3. Asignar y guardar. Traemos al usuario de la BD para asegurar que Lucid trackee el cambio
      const dbUser = await User.findOrFail(user.id)
      dbUser.password = payload.newPassword
      dbUser.needsPasswordReset = false
      await dbUser.save()

      return response.ok({ message: 'Contraseña actualizada correctamente' })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({ message: 'Error de validación', errors: error.messages })
      }
      return response.internalServerError({ message: 'Ocurrió un error al cambiar la contraseña' })
    }
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

    const createdEventsQuery = await Event.query()
      .where('userId', user.id)
      .preload('eventType')
      .preload('location')
      .preload('eventVersions', (v) => v.where('isCurrentVersion', true).preload('versionContent'))
      .orderByRaw(`
        CASE current_state
          WHEN 'requested' THEN 1
          WHEN 'in_review' THEN 2
          WHEN 'scheduled' THEN 3
          WHEN 'draft' THEN 4
          WHEN 'cancelled' THEN 5
          WHEN 'rejected' THEN 6
          WHEN 'historical' THEN 7
          ELSE 8
        END ASC
      `)
      .orderBy('createdAt', 'desc')

    const responsibleEventsQuery = await Event.query()
      .where('mainResponsibleId', user.id)
      .preload('eventType')
      .preload('location')
      .preload('eventVersions', (v) => v.where('isCurrentVersion', true).preload('versionContent'))
      .orderByRaw(`
        CASE current_state
          WHEN 'requested' THEN 1
          WHEN 'in_review' THEN 2
          WHEN 'scheduled' THEN 3
          WHEN 'draft' THEN 4
          WHEN 'cancelled' THEN 5
          WHEN 'rejected' THEN 6
          WHEN 'historical' THEN 7
          ELSE 8
        END ASC
      `)
      .orderBy('createdAt', 'desc')

    const mapEvent = (e: any) => {
      const json = e.serialize()
      const content = e.eventVersions?.[0]?.versionContent
      return {
        ...json,
        titulo: content?.name || 'Sin Título',
        name: content?.name || 'Sin Título',
        descripcion: content?.description || '',
        description: content?.description || '',
        fecha_inicio: content?.startsAt || json.createdAt,
        startsAt: content?.startsAt || json.createdAt
      }
    }

    return response.json({
      createdEvents: createdEventsQuery.map(mapEvent),
      responsibleEvents: responsibleEventsQuery.map(mapEvent)
    })
  }
}

