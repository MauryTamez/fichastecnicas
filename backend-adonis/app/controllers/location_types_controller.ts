import type { HttpContext } from '@adonisjs/core/http'
import LocationType from '#models/location_type'

export default class LocationTypesController {
  async index({ response }: HttpContext) {
    const locationTypes = await LocationType.all()
    return response.json(locationTypes.map(lt => ({
      id: lt.id,
      name: lt.name,
      allowsExternalStaff: lt.allowsExternalStaff,
      organizationId: lt.organizationId
    })))
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()
    const locationType = new LocationType()
    locationType.name = data.name
    locationType.allowsExternalStaff = data.allowsExternalStaff || false
    locationType.organizationId = 1 // default for now, similar to other models
    await locationType.save()

    return response.created({
      id: locationType.id,
      name: locationType.name,
      allowsExternalStaff: locationType.allowsExternalStaff,
      organizationId: locationType.organizationId
    })
  }

  async update({ params, request, response }: HttpContext) {
    const locationType = await LocationType.findOrFail(params.id)
    const data = request.all()

    if (data.name !== undefined) locationType.name = data.name
    if (data.allowsExternalStaff !== undefined) locationType.allowsExternalStaff = data.allowsExternalStaff

    await locationType.save()

    return response.json({
      id: locationType.id,
      name: locationType.name,
      allowsExternalStaff: locationType.allowsExternalStaff,
      organizationId: locationType.organizationId
    })
  }

  async destroy({ params, response }: HttpContext) {
    const locationType = await LocationType.findOrFail(params.id)
    await locationType.delete()
    return response.json({ message: 'Location Type deleted successfully' })
  }
}
