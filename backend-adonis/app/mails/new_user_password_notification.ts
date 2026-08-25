import { BaseMail } from '@adonisjs/mail'

export default class NewUserPasswordNotification extends BaseMail {
  // Recibimos el correo y la contraseña desde el controlador
  constructor(private email: string, private rawPassword: string) {
    super()
  }

  public prepare() {
    // Usamos this.message directamente en lugar de pasarlo como parámetro
    this.message
      .subject('Bienvenido - Credenciales de acceso FIME')
      .from('camposmauricio820@gmai.com') // Aquí pon el correo que ya usan para las fichas
      .to(this.email)
      .html(`
        <h2>¡Hola! Tu cuenta ha sido creada exitosamente.</h2>
        <p>Para ingresar al Sistema de Fichas Técnicas, utiliza las siguientes credenciales:</p>
        <ul>
          <li><strong>Correo:</strong> ${this.email}</li>
          <li><strong>Contraseña temporal:</strong> ${this.rawPassword}</li>
        </ul>
        <p><em>Nota: Por protocolos de seguridad, el sistema te solicitará cambiar esta contraseña obligatoriamente la primera vez que inicies sesión.</em></p>
      `)
  }
}