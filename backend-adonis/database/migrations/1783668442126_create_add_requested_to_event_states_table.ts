import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.raw('ALTER TABLE events DROP CONSTRAINT IF EXISTS events_current_state_check')
    this.schema.raw(`ALTER TABLE events ADD CONSTRAINT events_current_state_check CHECK (current_state IN ('draft', 'requested', 'in_review', 'scheduled', 'rejected', 'cancelled', 'historical'))`)
  }

  async down() {
    // Primero cambiamos cualquier evento que esté en 'requested' de regreso a 'draft'
    // para que PostgreSQL no lance error de constraint violation al restaurar el candado viejo.
    this.schema.raw(`UPDATE events SET current_state = 'draft' WHERE current_state = 'requested'`)
    this.schema.raw('ALTER TABLE events DROP CONSTRAINT IF EXISTS events_current_state_check')
    this.schema.raw(`ALTER TABLE events ADD CONSTRAINT events_current_state_check CHECK (current_state IN ('draft', 'in_review', 'scheduled', 'rejected', 'cancelled', 'historical'))`)
  }
}