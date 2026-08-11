# Solicitud de Despliegue - Sistema de Fichas Técnicas (CAM)

**Fecha:** 10 de Agosto de 2026
**Para:** Equipo de Servidores de FIME
**De:** Equipo de Desarrollo (Sistema de Fichas Técnicas)
**Asunto:** Solicitud formal de actualización y despliegue de la versión `release/2026-07-28`

Estimado equipo de Servidores de FIME,

Por medio de la presente, solicitamos formalmente su apoyo para llevar a cabo la actualización y despliegue del **Sistema de Fichas Técnicas del Centro de Apoyo Multidisciplinario** a su versión más reciente, correspondiente a la rama `release/2026-07-28` (fecha de inicio de los cambios).

## 1. Resumen del Estado del Proyecto

El sistema actualmente cuenta con una arquitectura Headless (Backend en **AdonisJS 6** y Frontend en **React/Vite**), con el propósito principal de gestionar, revisar y aprobar las fichas técnicas para los eventos institucionales de la facultad. Se integra un sistema de IA (RAG) para asistir en la redacción, un sistema de control de roles (Administrador, Staff, Dirección, Auxiliar, Encargado de Departamento y Moderador) y la validación estricta de conflictos de horarios y aforos.

En esta nueva versión se ha logrado un hito importante en la estabilización y expansión de funcionalidades, dejando el sistema listo para una etapa operativa más completa.

## 2. Novedades y Modificaciones en esta Release

Basado en el registro de cambios de esta rama, las actualizaciones más destacables son:

1. **Sistema de Notificaciones Automáticas (NUEVO):** Implementación de integración con Brevo para el envío automático de correos (notificaciones sobre creación, retroalimentación y estado de eventos).
2. **Flujo de Feedback de Eventos:** Nuevo sistema para que los moderadores y directivos puedan enviar retroalimentación estructurada sobre los eventos en revisión.
3. **Validación Avanzada de Recintos:** Restricciones automatizadas por capacidad máxima y limitación de requerimientos audiovisuales dependiendo del recinto seleccionado (ej. cantidad de micrófonos).
4. **Generación de PDF Oficial:** Se implementó la maquetación y generación del PDF de logística final de la ficha técnica.
5. **Gestión Administrativa Completa:** Nuevos paneles CRUD para que el Administrador gestione Catálogos, Departamentos, Tipos de Eventos y Ubicaciones.
6. **Refactorización del Formulario y Experiencia de Usuario:** Separación del formulario de captura en múltiples secciones (General, Orden del Día, Requerimientos, Logística) y mejoras visuales sustanciales.
7. **Seguridad y Sesiones:** Implementación de un interceptor de Axios para cierre de sesión seguro cuando caduca el token JWT.

---

## 3. Instrucciones de Despliegue (Action Items)

Para garantizar que todos estos cambios impacten correctamente el entorno del servidor, por favor sigan estos pasos técnicos:

### A. Obtención de Cambios

1. Posicionarse en los directorios del proyecto y hacer un _pull_ de la rama `release/2026-07-28`.
   ```bash
   git fetch origin
   git checkout release/2026-07-28
   git pull origin release/2026-07-28
   ```

### B. Configuración de Variables de Entorno (Backend)

Se ha integrado un nuevo proveedor de correos (Brevo). Es **crítico** agregar las siguientes variables al archivo `.env` del backend (`backend-adonis/.env`):

```env
# Notification Settings
BREVO_API_KEY=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
MAIL_FROM_ADDRESS=dev.fichastecnicasfime@gmail.com
```

_(Nota: Sustituir la llave de Brevo por la llave de producción en caso de que aplique)._

### C. Actualización del Backend (AdonisJS)

1. Navegar a la carpeta del backend.
2. Instalar las nuevas dependencias (ej. módulos de correo):
   ```bash
   npm install
   ```
3. Ejecutar las migraciones y seeders para las nuevas tablas de notificaciones, departamentos y roles:
   ```bash
   node ace migration:run
   node ace db:seed
   ```
4. Reconstruir el proyecto si es necesario (o simplemente reiniciar el proceso):
   ```bash
   node ace build
   # Reiniciar usando pm2 o su gestor de procesos:
   pm2 restart backend-fichas
   ```

### D. Actualización del Frontend (React/Vite)

1. Navegar a la carpeta del frontend.
2. Instalar nuevas dependencias:
   ```bash
   npm install
   ```
3. Generar el nuevo empaquetado para producción:
   ```bash
   npm run build
   ```
4. Asegurarse de que el servidor web (Nginx/Apache) esté apuntando a la nueva carpeta `dist` generada.

## 4. Verificación Post-Despliegue

- Confirmar que se pueda iniciar sesión correctamente (sin errores 401 por caché antigua).
- Confirmar visualización de los nuevos paneles administrativos.
- Verificar que el servicio de correos y PDF esté en funcionamiento.

Agradecemos enormemente su apoyo y quedamos a su entera disposición ante cualquier duda o problema durante la ejecución de este despliegue.

Atentamente,
**Equipo de Desarrollo**
_Sistema de Fichas Técnicas - FIME_
