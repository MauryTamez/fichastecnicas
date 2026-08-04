import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CatalogItem from '#models/catalog_item'

export default class extends BaseSeeder {
  async run() {
    await CatalogItem.updateOrCreateMany('name', [
      { category: 'audio', name: 'Micrófono de mano' },
      { category: 'audio', name: 'Sistema de sonido lineal' },
      { category: 'iluminacion', name: 'Cabezas móviles' },
      { category: 'iluminacion', name: 'Reflectores LED' },
      { category: 'catering', name: 'Coffee break básico' },
      { category: 'mobiliario', name: 'Sillas ejecutivas' },
      { category: 'documentacion', name: 'Gafetes impresos' },
      { category: 'audio', name: 'Sonido' },
      { category: 'audio', name: 'Micrófono inalámbrico de mano' },
      { category: 'audiovisual', name: 'Proyección/Presentación' },
      { category: 'personal', name: 'Personal de apoyo' },
      { category: 'audio', name: 'Música de fondo' },
      { category: 'mobiliario', name: 'Manteles' },
      { category: 'logistica', name: 'Banderas' },
      { category: 'audiovisual', name: 'Toma de fotografía' },
      { category: 'audio', name: 'Micrófono inalámbrico de mesa' },
      { category: 'audio', name: 'Micrófono presidencial' },
      { category: 'audio', name: 'Micrófono de diadema' },
      { category: 'audio', name: 'Micrófono alámbrico' },
      { category: 'audiovisual', name: 'Proyección de video' },
      { category: 'audiovisual', name: 'Videograbación' },
      { category: 'audiovisual', name: 'Apuntador' },
      { category: 'mobiliario', name: 'Mesa de coffee break' },
      { category: 'logistica', name: 'Estacionamiento' },
      { category: 'mobiliario', name: 'Podium' },
      { category: 'mobiliario', name: 'Presidium' },
      { category: 'personal', name: 'Edecanes' },
      { category: 'logistica', name: 'Himno UANL' },
      { category: 'logistica', name: 'Separador de himno' },
    ])
  }
}