import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import string from '@adonisjs/core/helpers/string' // Para generar contraseñas seguras
import Event from '#models/event'

import VersionActivity from '#models/version_activity'
import User from '#models/user'
import EventType from '#models/event_type'
import Location from '#models/location'
import Organization from '#models/organization'
import LocationType from '#models/location_type'
import Role from '#models/role'
import Department from '#models/department'
import { EventState } from '../../app/enums/event_state.js'

export default class extends BaseSeeder {
  async run() {
    const jsonPath = path.resolve('../eventosAnteriores.json')
    if (!fs.existsSync(jsonPath)) {
      console.warn(`No se encontro el archivo en: ${jsonPath}`)
      return
    }
    
    const rawData = fs.readFileSync(jsonPath, 'utf-8')
    const data = JSON.parse(rawData)

    // Helpers
    const ensureOrganization = async (id: number) => {
      return await Organization.firstOrCreate({ id }, { name: `Organización ${id}` })
    }

    // NUEVO: Helper para obtener el usuario histórico
    const getLegacyUser = async () => {
      const role = await Role.firstOrCreate({ name: 'creador' }, { name: 'creador', description: 'Creador' })
      const dept = await Department.firstOrCreate({ id: 1 }, { name: 'Departamento 1', priority: 1, organizationId: 1 })
      
      return await User.firstOrCreate(
        { email: 'historico@sistema.local' },
        {
          name: 'Datos Históricos', // Este nombre saldrá en la UI
          password: string.generateRandom(32), // Contraseña imposible de adivinar
          phone: '0000000000',
          isInternal: true,
          roleId: role.id,
          organizationId: 1,
          departmentId: dept.id
        }
      )
    }

    // Generamos o recuperamos el usuario histórico de golpe
    const legacyUser = await getLegacyUser()

    const ensureEventType = async (id: number) => {
      return await EventType.firstOrCreate(
        { id },
        { name: `Tipo de Evento ${id}`, description: `Importado ${id}`, organizationId: 1 }
      )
    }

    const ensureLocation = async (id: number) => {
      let locType = await LocationType.firstOrCreate({ id: 1 }, { name: 'Auditorio', allowsExternalStaff: true, organizationId: 1 })
      return await Location.firstOrCreate(
        { id },
        { name: `Recinto ${id}`, capacity: 100, organizationId: 1, locationTypeId: locType.id }
      )
    }

    // Process events - usando el legacyUser.id
    for (const evt of data.event) {
      await ensureOrganization(evt.organization_id)
      await ensureEventType(evt.event_type_id)

      await Event.updateOrCreate({ id: evt.id }, {
        id: evt.id,
        organizationId: evt.organization_id,
        eventTypeId: evt.event_type_id,
        userId: legacyUser.id,             // <-- Asignado al usuario histórico
        mainResponsibleId: legacyUser.id,  // <-- Asignado al usuario histórico
        currentState: EventState.HISTORICAL,
        createdAt: DateTime.fromISO(evt.created_at),
        updatedAt: DateTime.fromISO(evt.updated_at)
      })
    }

    // Process version data (VersionContent)
    // ... [Mismo código que ya tenías para VersionContent y EventVersion] ...

    // Process version activity - usando legacyUser.id
    for (const va of data.version_activity) {
      await ensureLocation(va.location_id)

      await VersionActivity.updateOrCreate({ id: va.id }, {
        id: va.id,
        responsibleId: legacyUser.id,      // <-- Asignado al usuario histórico
        locationId: va.location_id,
        startsAt: DateTime.fromISO(va.starts_at),
        endsAt: DateTime.fromISO(va.ends_at),
        name: va.name,
        description: va.description,
        createdAt: DateTime.fromISO(va.created_at),
        updatedAt: DateTime.fromISO(va.updated_at)
      })
    }

    // ... [Mismo código que ya tenías para pivots, ragService y sincronización de secuencias] ...
  }
}