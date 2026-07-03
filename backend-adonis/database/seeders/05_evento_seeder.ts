import { BaseSeeder } from '@adonisjs/lucid/seeders'
import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import Event from '#models/event'
import VersionContent from '#models/version_content'
import EventVersion from '#models/event_version'
import VersionActivity from '#models/version_activity'
import User from '#models/user'
import EventType from '#models/event_type'
import Location from '#models/location'
import Organization from '#models/organization'
import LocationType from '#models/location_type'
import Role from '#models/role'
import Department from '#models/department'

export default class extends BaseSeeder {
  async run() {
    // Determine path to the JSON file
    const jsonPath = path.resolve('../eventosAnteriores.json')
    if (!fs.existsSync(jsonPath)) {
      console.warn(`No se encontro el archivo en: ${jsonPath}`)
      return
    }
    
    const rawData = fs.readFileSync(jsonPath, 'utf-8')
    const data = JSON.parse(rawData)

    // Helpers to ensure Foreign Keys exist
    const ensureOrganization = async (id: number) => {
      return await Organization.firstOrCreate({ id }, { name: `Organización ${id}` })
    }
    
    const ensureUser = async (id: number) => {
      const role = await Role.firstOrCreate({ name: 'creadores' }, { name: 'creadores', description: 'Creador' })
      const dept = await Department.firstOrCreate({ id: 1 }, { name: 'Departamento 1', organization_id: 1 })
      return await User.firstOrCreate(
        { id },
        {
          name: `Usuario Importado ${id}`,
          email: `user${id}@import.com`,
          password: 'password',
          phone: `00000000${id}`.slice(-10), // Ensures unique 10-digit phone
          isInternal: true,
          roleId: role.id,
          organizationId: 1,
          departmentId: dept.id
        }
      )
    }

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

    // Process events
    for (const evt of data.event) {
      await ensureOrganization(evt.organization_id)
      await ensureUser(evt.created_by)
      await ensureUser(evt.main_responsible)
      await ensureEventType(evt.event_type_id)

      await Event.updateOrCreate({ id: evt.id }, {
        id: evt.id,
        organizationId: evt.organization_id,
        eventTypeId: evt.event_type_id,
        userId: evt.created_by,
        mainResponsibleId: evt.main_responsible,
        currentState: 'historical',
        createdAt: DateTime.fromISO(evt.created_at),
        updatedAt: DateTime.fromISO(evt.updated_at)
      })
    }

    // Process version data (VersionContent)
    for (const vd of data.version_data) {
      await VersionContent.updateOrCreate({ id: vd.id }, {
        id: vd.id,
        versionNumber: vd.version_number,
        name: vd.name,
        objective: vd.objective,
        description: vd.description,
        startsAt: DateTime.fromISO(vd.starts_at),
        endsAt: DateTime.fromISO(vd.ends_at),
        guestSpecifications: vd.guest_specs,
        createdAt: DateTime.fromISO(vd.created_at),
        updatedAt: DateTime.fromISO(vd.updated_at)
      })
    }

    // Process event version
    for (const ev of data.event_version) {
      await EventVersion.updateOrCreate({ id: ev.id }, {
        id: ev.id,
        eventId: ev.event_id,
        versionContentId: ev.version_data_id,
        isCurrentVersion: ev.is_current_version,
        createdAt: DateTime.fromISO(ev.created_at),
        updatedAt: DateTime.fromISO(ev.updated_at)
      })
    }

    // Process version activity
    for (const va of data.version_activity) {
      await ensureUser(va.responsible_id)
      await ensureLocation(va.location_id)

      await VersionActivity.updateOrCreate({ id: va.id }, {
        id: va.id,
        responsibleId: va.responsible_id,
        locationId: va.location_id,
        startsAt: DateTime.fromISO(va.starts_at),
        endsAt: DateTime.fromISO(va.ends_at),
        name: va.name,
        description: va.description,
        createdAt: DateTime.fromISO(va.created_at),
        updatedAt: DateTime.fromISO(va.updated_at)
      })
    }

    // Process pivots (event_version_to_version_activity)
    for (const pivot of data.event_version_to_version_activity) {
      const eventVersion = await EventVersion.find(pivot.event_version_id)
      if (eventVersion) {
        await eventVersion.related('versionActivities').sync([pivot.activity_id], false)
      }
    }
  }
}