import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import Event from '#models/event'
import User from '#models/user'
import VersionFeedback from '#models/version_feedback'

export interface EmailRecipient {
  email: string
  name: string
}

export class NotificationService {
  /**
   * Helper para obtener los detalles principales del evento (Nombre, Creador, etc.)
   */
  private static async getEventDetails(event: Event) {
    await event.load('user')
    await event.load('eventVersions', (query) => {
      query.where('isCurrentVersion', true).preload('versionContent')
    })

    const currentVersion = event.eventVersions?.[0]
    const eventName = currentVersion?.versionContent?.name || `Evento #${event.id}`
    const creatorName = event.user?.name || 'Creador de Evento'
    const creatorEmail = event.user?.email

    return {
      eventName,
      creatorName,
      creatorEmail,
      creator: event.user,
    }
  }

  /**
   * Obtiene los correos de los Subdirectores (encargado_departamento)
   */
  private static async getSubdirectors(departmentId?: number | null): Promise<User[]> {
    const query = User.query().whereHas('role', (builder) => {
      builder.whereIn('name', ['encargado_departamento', 'subdirector'])
    })

    if (departmentId) {
      query.where((sub) => {
        sub.where('departmentId', departmentId).orWhereNull('departmentId')
      })
    }

    return await query.exec()
  }

  /**
   * Obtiene los correos de los Moderadores
   */
  private static async getModerators(): Promise<User[]> {
    return await User.query()
      .whereHas('role', (builder) => {
        builder.where('name', 'moderador')
      })
      .exec()
  }

  /**
   * Genera el HTML responsive para el correo con estética premium
   */
  private static generateEmailTemplate(options: {
    title: string
    badgeText: string
    badgeColor: string
    message: string
    eventName: string
    creatorName: string
    statusText: string
    detailsHtml?: string
  }): string {
    const { title, badgeText, badgeColor, message, eventName, creatorName, statusText, detailsHtml } = options

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">CAM - Fichas Técnicas</h1>
              <p style="color: #c7d2fe; margin: 6px 0 0 0; font-size: 13px; font-weight: 400;">Sistema de Gestión y Control de Eventos</p>
            </td>
          </tr>

          <!-- Status Badge & Title -->
          <tr>
            <td style="padding: 32px 40px 16px 40px;">
              <div style="display: inline-block; background-color: ${badgeColor}; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
                ${badgeText}
              </div>
              <h2 style="color: #111827; margin: 0; font-size: 20px; font-weight: 700; line-height: 1.3;">
                ${title}
              </h2>
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-top: 12px;">
                ${message}
              </p>
            </td>
          </tr>

          <!-- Event Summary Box -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 10px; font-size: 14px; color: #64748b; font-weight: 600;">Evento:</td>
                  <td style="padding-bottom: 10px; font-size: 14px; color: #0f172a; font-weight: 700; text-align: right;">${eventName}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px; font-size: 14px; color: #64748b; font-weight: 600;">Solicitante / Creador:</td>
                  <td style="padding-bottom: 10px; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right;">${creatorName}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #64748b; font-weight: 600;">Estado Actual:</td>
                  <td style="font-size: 14px; color: #4338ca; font-weight: 700; text-align: right;">${statusText}</td>
                </tr>
              </table>

              ${detailsHtml ? `<div style="margin-top: 20px;">${detailsHtml}</div>` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.5;">
                Este es un mensaje automático generado por el sistema de Fichas Técnicas del CAM.<br>
                Por favor, no respondas a este correo.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }

  /**
   * Envia correo de manera segura atrapando posibles errores
   */
  private static async sendMailSafe(to: string, subject: string, html: string) {
    try {
      const fromAddress = env.get('MAIL_FROM_ADDRESS') || 'salazar.mares.enrique.oliband@gmail.com'
      await mail.send((message) => {
        message
          .to(to)
          .from(fromAddress, 'CAM Fichas Técnicas')
          .subject(subject)
          .html(html)
      })
      console.log(`[NotificationService] Correo enviado exitosamente a: ${to} | Asunto: "${subject}"`)
    } catch (error: any) {
      console.error(`[NotificationService] Error enviando correo a ${to}:`, error.message)
      if (error.cause) {
        console.error('[NotificationService] Causa del error de Brevo:', JSON.stringify(error.cause, null, 2))
      }
    }
  }

  /**
   * FLUTO 1: Creador solicita revisión al Subdirector (Draft -> Requested)
   */
  public static async notifyReviewRequested(event: Event) {
    const { eventName, creatorName, creatorEmail } = await this.getEventDetails(event)
    const subdirectors = await this.getSubdirectors(event.user?.departmentId)

    // 1. Notificar a Subdirector(es)
    const subdirectorHtml = this.generateEmailTemplate({
      title: 'Nueva Solicitud de Ficha Técnica',
      badgeText: 'Revisión Pendiente',
      badgeColor: '#f59e0b',
      message: `El usuario <strong>${creatorName}</strong> ha enviado una nueva ficha técnica para su revisión. Por favor revisa y aprueba la solicitud para pasarla a moderación.`,
      eventName,
      creatorName,
      statusText: 'Solicitado (Requested)',
    })

    for (const sub of subdirectors) {
      await this.sendMailSafe(sub.email, `[CAM] Solicitud de revisión: ${eventName}`, subdirectorHtml)
    }

    // 2. Confirmación al Creador
    if (creatorEmail) {
      const creatorHtml = this.generateEmailTemplate({
        title: 'Solicitud Enviada a Subdirección',
        badgeText: 'Enviado',
        badgeColor: '#3b82f6',
        message: `Tu ficha técnica <strong>"${eventName}"</strong> ha sido enviada con éxito a tu Subdirector de departamento para revisión inicial.`,
        eventName,
        creatorName,
        statusText: 'Solicitado (Requested)',
      })
      await this.sendMailSafe(creatorEmail, `[CAM] Solicitud enviada: ${eventName}`, creatorHtml)
    }
  }

  /**
   * FLUJO 2: Subdirector acepta la solicitud (Requested -> In_review) y pasa al Moderador
   */
  public static async notifyPassedToReview(event: Event) {
    const { eventName, creatorName, creatorEmail } = await this.getEventDetails(event)
    const moderators = await this.getModerators()

    // 1. Notificar a Moderador(es)
    const moderatorHtml = this.generateEmailTemplate({
      title: 'Ficha Lista para Moderación Final',
      badgeText: 'En Revisión',
      badgeColor: '#6366f1',
      message: `El Subdirector ha aprobado la ficha técnica <strong>"${eventName}"</strong>. Ahora está lista para tu revisión final y programación de recintado.`,
      eventName,
      creatorName,
      statusText: 'En Revisión (In Review)',
    })

    for (const mod of moderators) {
      await this.sendMailSafe(mod.email, `[CAM] Ficha lista para moderación: ${eventName}`, moderatorHtml)
    }

    // 2. Notificar al Creador
    if (creatorEmail) {
      const creatorHtml = this.generateEmailTemplate({
        title: 'Tu Ficha Avanzó a Moderación',
        badgeText: 'En Revisión',
        badgeColor: '#6366f1',
        message: `Tu Subdirector de departamento aprobó la solicitud de <strong>"${eventName}"</strong>. La ficha ahora está siendo evaluada por el Moderador.`,
        eventName,
        creatorName,
        statusText: 'En Revisión (In Review)',
      })
      await this.sendMailSafe(creatorEmail, `[CAM] Tu ficha pasó a revisión de Moderación: ${eventName}`, creatorHtml)
    }
  }

  /**
   * FLUJO 3: Moderador APRUEBA el evento (In_review -> Scheduled)
   */
  public static async notifyEventApproved(event: Event) {
    const { eventName, creatorName, creatorEmail } = await this.getEventDetails(event)
    const subdirectors = await this.getSubdirectors(event.user?.departmentId)

    // 1. Notificar al Creador
    if (creatorEmail) {
      const creatorHtml = this.generateEmailTemplate({
        title: '¡Ficha Técnica Aprobada y Agendada!',
        badgeText: 'Aprobado',
        badgeColor: '#10b981',
        message: `¡Buenas noticias! Tu evento <strong>"${eventName}"</strong> ha sido completamente aprobado por Moderación y agendado exitosamente.`,
        eventName,
        creatorName,
        statusText: 'Programado (Scheduled)',
      })
      await this.sendMailSafe(creatorEmail, `[CAM] ¡Ficha Aprobada!: ${eventName}`, creatorHtml)
    }

    // 2. Notificar al Subdirector
    const subdirectorHtml = this.generateEmailTemplate({
      title: 'Evento de tu Departamento Aprobado',
      badgeText: 'Programado',
      badgeColor: '#10b981',
      message: `El evento <strong>"${eventName}"</strong> creado por <strong>${creatorName}</strong> ha sido aprobado por el Moderador y programado.`,
      eventName,
      creatorName,
      statusText: 'Programado (Scheduled)',
    })

    for (const sub of subdirectors) {
      await this.sendMailSafe(sub.email, `[CAM] Evento Aprobado: ${eventName}`, subdirectorHtml)
    }
  }

  /**
   * FLUJO 4: Moderador RECHAZA el evento (In_review -> Rejected)
   */
  public static async notifyEventRejected(event: Event, reason?: string) {
    const { eventName, creatorName, creatorEmail } = await this.getEventDetails(event)
    const subdirectors = await this.getSubdirectors(event.user?.departmentId)

    const detailsHtml = reason ? `
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px;">
        <strong style="color: #991b1b; font-size: 13px;">Motivo de rechazo:</strong>
        <p style="color: #7f1d1d; font-size: 14px; margin: 4px 0 0 0;">${reason}</p>
      </div>
    ` : undefined

    // 1. Notificar al Creador
    if (creatorEmail) {
      const creatorHtml = this.generateEmailTemplate({
        title: 'Ficha Técnica Rechazada',
        badgeText: 'Rechazado',
        badgeColor: '#ef4444',
        message: `Lamentamos informarte que la ficha técnica <strong>"${eventName}"</strong> ha sido rechazada por el Moderador.`,
        eventName,
        creatorName,
        statusText: 'Rechazado (Rejected)',
        detailsHtml,
      })
      await this.sendMailSafe(creatorEmail, `[CAM] Ficha Rechazada: ${eventName}`, creatorHtml)
    }

    // 2. Notificar al Subdirector
    const subdirectorHtml = this.generateEmailTemplate({
      title: 'Ficha Técnica Rechazada por Moderador',
      badgeText: 'Rechazado',
      badgeColor: '#ef4444',
      message: `La ficha técnica <strong>"${eventName}"</strong> del usuario ${creatorName} ha sido rechazada por el Moderador.`,
      eventName,
      creatorName,
      statusText: 'Rechazado (Rejected)',
      detailsHtml,
    })

    for (const sub of subdirectors) {
      await this.sendMailSafe(sub.email, `[CAM] Ficha Rechazada: ${eventName}`, subdirectorHtml)
    }
  }

  /**
   * FLUJO 5: Nuevo Feedback Agregado
   */
  public static async notifyNewFeedback(event: Event, feedback: VersionFeedback, reviewer: User) {
    const { eventName, creatorName, creatorEmail } = await this.getEventDetails(event)

    if (creatorEmail) {
      const detailsHtml = `
        <div style="background-color: #fffbe6; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px;">
          <strong style="color: #92400e; font-size: 13px;">Comentario de ${reviewer.name} (${feedback.fieldName || 'General'}):</strong>
          <p style="color: #78350f; font-size: 14px; margin: 4px 0 0 0;">"${feedback.comment}"</p>
        </div>
      `

      const creatorHtml = this.generateEmailTemplate({
        title: 'Nuevo Comentario / Feedback Recibido',
        badgeText: 'Feedback',
        badgeColor: '#f59e0b',
        message: `El revisor <strong>${reviewer.name}</strong> ha agregado un comentario en tu ficha técnica <strong>"${eventName}"</strong>. Por favor atiende las observaciones.`,
        eventName,
        creatorName,
        statusText: event.currentState,
        detailsHtml,
      })

      await this.sendMailSafe(creatorEmail, `[CAM] Nuevo Feedback en tu ficha: ${eventName}`, creatorHtml)
    }
  }

  /**
   * FLUJO 6: Evento Cancelado
   */
  public static async notifyEventCancelled(event: Event) {
    const { eventName, creatorName, creatorEmail } = await this.getEventDetails(event)
    const subdirectors = await this.getSubdirectors(event.user?.departmentId)
    const moderators = await this.getModerators()

    const emailHtml = this.generateEmailTemplate({
      title: 'Evento Cancelado',
      badgeText: 'Cancelado',
      badgeColor: '#6b7280',
      message: `El evento <strong>"${eventName}"</strong> ha sido cancelado.`,
      eventName,
      creatorName,
      statusText: 'Cancelado (Cancelled)',
    })

    // Enviar a todos los involucrados
    const recipients = new Set<string>()
    if (creatorEmail) recipients.add(creatorEmail)
    subdirectors.forEach((s) => recipients.add(s.email))
    moderators.forEach((m) => recipients.add(m.email))

    for (const email of recipients) {
      await this.sendMailSafe(email, `[CAM] Evento Cancelado: ${eventName}`, emailHtml)
    }
  }
}
