import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
// trabajo 
const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD') || '$Uncharted171103',
        database: env.get('DB_DATABASE'),
        ...(env.get('NODE_ENV') === 'production' ? { ssl: { rejectUnauthorized: false } } : {}),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig