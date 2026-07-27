import type { HttpContext } from '@adonisjs/core/http'

export default class DepartmentsController {
  async organigram({ response }: HttpContext) {
    // Placeholder para la lógica del organigrama
    return response.json({
      message: 'Organigrama data will be loaded here.',
      data: []
    })
  }
}
