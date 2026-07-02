import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Event from '#models/event'
import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'

@inject()

export default class EventsPdfController {
  async generatePdf({ params, response }: HttpContext) {
    const eventId = params.id
    
    const event = await Event.query()
      .where('id', eventId)
      .preload('location')
      .preload('user')
      .preload('eventVersions', (query) => {
        query.where('isCurrentVersion', true)
          .preload('versionContent')
          .preload('versionActivities', (q) => {
             q.orderBy('startsAt', 'asc')
          })
      })
      .firstOrFail()

    const currentVersion = event.eventVersions[0]
    const content = currentVersion?.versionContent
    const activities = currentVersion?.versionActivities || []

    const eventName = content?.name || ''
    const dateFormatted = content?.startsAt ? content.startsAt.toFormat('dd/MM/yyyy') : ''
    const timeFormatted = content?.startsAt ? content.startsAt.toFormat('HH:mm') : ''
    const dayOfWeek = content?.startsAt ? content.startsAt.setLocale('es').toFormat('EEEE') : ''
    const locationName = event.location?.name || ''
    const aforo = content?.guestSpecifications || 'N/A'
    const programImpacted = content?.programImpacted || ''
    const dressCode = content?.dressCode || ''
    const specialGuests = ''
    const guestCharacteristics = ''
    const directorAction = content?.directorAction || 'N/A'
    const receptionCommittee = ''
    const mc = ''
    const presidium = content?.presidiumDetail || ''
    const responsibleName = event.user?.name || ''
    const description = content?.description || ''
    const objectives = content?.objective || ''

    const activitiesRows = activities.map((act: any) => `
            <tr>
                <td style="text-align: center;">${act.startsAt ? act.startsAt.toFormat('HH:mm') : ''}</td>
                <td>${act.name || ''}</td>
                <td>${act.description || ''}</td>
                <td></td>
            </tr>
            `).join('')

    const emptyRows = Array.from({length: Math.max(0, 8 - activities.length)}).map(() => `
            <tr>
                <td style="height: 25px;"></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            `).join('')
    // Convierte las imágenes a Base64 en memoria
    const uanlPath = path.join(process.cwd(), 'public', 'uanl-logo.png')
    const fimePath = path.join(process.cwd(), 'public', 'fime-logo.png')
    // (Asegúrate de que la ruta coincida con donde guardaste las fotos)
    const uanlBase64 = fs.existsSync(uanlPath) ? fs.readFileSync(uanlPath, 'base64') : ''
    const fimeBase64 = fs.existsSync(fimePath) ? fs.readFileSync(fimePath, 'base64') : ''
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ficha Técnica</title>
    <style>
        @page {
            size: letter;
            margin: 15mm;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            color: #000;
            margin: 0;
            padding: 0;
            line-height: 1.3;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #ccc; /* Decorative border based on screenshot */
            padding-bottom: 10px;
        }
        .header-text {
            text-align: center;
            flex-grow: 1;
            font-weight: bold;
            color: #777;
        }
        .header-text h1 {
            font-size: 16px;
            margin: 0;
            text-transform: uppercase;
        }
        .header-text h2 {
            font-size: 16px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .doc-code {
            text-align: right;
            font-size: 10px;
            color: #888;
            margin-bottom: 5px;
        }
        .box {
            border: 1px solid #000;
            padding: 5px;
            margin-bottom: 5px;
        }
        .box-title {
            font-weight: bold;
        }
        .row {
            display: flex;
            border: 1px solid #000;
            margin-bottom: 5px;
        }
        .col {
            flex: 1;
            padding: 5px;
            border-right: 1px solid #000;
        }
        .col:last-child {
            border-right: none;
        }
        .col-2 {
            flex: 2;
        }
        .textarea-box {
            border: 1px solid #000;
            padding: 5px;
            min-height: 150px;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="doc-code">IT-8-DGE-02-R02</div>
    <div class="header">
        <img src="data:image/png;base64,${uanlBase64}" style="width: 160px; height: auto; object-fit: contain; border: none;" />       
         <div class="header-text">
            <h1>FACULTAD DE INGENIERÍA MECÁNICA Y ELÉCTRICA</h1>
            <h2>LOGÍSTICA</h2>
        </div>
        <img src="data:image/png;base64,${fimeBase64}" style="width: 80px; height: 80px; object-fit: contain; border: none;" />    </div>

    <div class="box">
        <span class="box-title">Nombre del Evento:</span> ${eventName}
    </div>

    <div class="row">
        <div class="col col-2">
            <span class="box-title">Fecha:</span> ${dateFormatted}
        </div>
        <div class="col">
            <span class="box-title">Horario:</span> ${timeFormatted}
        </div>
    </div>
    
    <div class="box">
        <span class="box-title">Lugar:</span> ${locationName}
    </div>
    
    <div class="box" style="margin-top: 10px;">
        <span class="box-title">Aforo:</span> ${aforo}
    </div>
    <div class="box">
        <span class="box-title">Programa Educativo al que impacta:</span> ${programImpacted}
    </div>
    <div class="row">
        <div class="col">
            <span class="box-title">Prensa:</span>
        </div>
        <div class="col">
            <span class="box-title">Vestimenta:</span> ${dressCode}
        </div>
    </div>

    <div class="textarea-box">
        <span class="box-title">Invitados y/o visitantes especiales:</span>
        <div style="margin-top: 5px;">${specialGuests}</div>
    </div>

    <div class="box">
        <span class="box-title">Características de los Invitados:</span> ${guestCharacteristics}
    </div>
    <div class="box">
        <span class="box-title">Acción a realizar por el Director:</span> ${directorAction}
    </div>
    <div class="box">
        <span class="box-title">Comité de recepción al Director:</span> ${receptionCommittee}
    </div>
    <div class="box">
        <span class="box-title">Maestros de Ceremonia:</span> ${mc}
    </div>
    <div style="margin-top: 220px; font-size: 13px; color: #888;">
        <strong>REVISIÓN No. 0</strong><br>
        VIGENTE A PARTIR DEL: 22 de febrero 2024
    </div>

    <!-- PAGE 2 -->
    <div class="page-break"></div>

    <div class="doc-code">IT-8-DGE-02-R02</div>

    <div style="margin-bottom: 5px;">
        <span class="box-title">Orden del día:</span> <span style="text-transform: capitalize;">${dayOfWeek}</span>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 10%;">Hora</th>
                <th style="width: 30%;">Actividad</th>
                <th style="width: 40%;">Descripción</th>
                <th style="width: 20%;">Responsable</th>
            </tr>
        </thead>
        <tbody>
            ${activitiesRows}
            ${emptyRows}
            <tr>
                <td colspan="4" style="text-align: center;">Fin del evento</td>
            </tr>
        </tbody>
    </table>

    <div class="box">
        <span class="box-title">PRESIDIUM:</span>
        <div style="margin-top: 5px;">${presidium}</div>
    </div>

    <div class="box">
        <span class="box-title">Responsable(s) del Evento:</span> ${responsibleName}
    </div>

    <div class="box">
        <span class="box-title">Descripción del evento:</span>
        <div style="margin-top: 5px;">${description}</div>
    </div>

    <div style="margin-top: 20px;">
        <span class="box-title">Objetivos:</span> ${objectives}
    </div>

</body>
</html>
    `

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'load' })
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    })
    await browser.close()

    response.header('Content-Type', 'application/pdf')
    response.header('Content-Disposition', `attachment; filename="ficha_${eventId}.pdf"`)
    
    // Convert Uint8Array back to Buffer for Adonis to send it correctly if needed
    return response.send(Buffer.from(pdfBuffer))
  }
}

