import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  // 1. Cambiamos el default a smtp
  default: 'smtp',

  mailers: {
    // 2. Agregamos el transportador SMTP
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME'),
        pass: env.get('SMTP_PASSWORD'),
      },
    }),
    
    // (Puedes dejar el de brevo aquí abajo sin problema, como está apagado en el default, no hará nada)
    brevo: transports.brevo({
      key: env.get('BREVO_API_KEY') || '',
      baseUrl: 'https://api.brevo.com/v3',
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}