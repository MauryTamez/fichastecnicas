# 📚 Registro de Actividad - Rama: release/2026-08-17

### 📦 Actualización: 2026-08-14 13:32:42 (refactor: Mejoras en el modal de formulario en UserAdmin)

- **Frontend:**
  - Se ajustaron los estilos y la estructura del modal de formulario en `UserAdmin.jsx` para mejorar la usabilidad y la apariencia.
  - Se añadió un padding general (`p-4`) al contenedor principal del modal para asegurar un espaciado adecuado en diferentes tamaños de pantalla.
  - Se implementó la propiedad `max-h-[95vh]` y `overflow-y-auto` en el contenido del modal para permitir el scroll vertical en formularios largos, evitando que el modal exceda el 95% de la altura de la ventana.
  - Se modificó la estructura interna del modal para que el contenido principal (`div.w-full.max-w-md...`) sea un contenedor flexible (`flex flex-col`) que facilita la organización de sus elementos internos.
  - Se eliminó la clase `rounded-[2rem]` del contenedor principal del modal y se aplicó al contenido interno, asegurando que el borde redondeado se aplique correctamente al área visible del formulario.

### 📦 Actualización: 2026-08-14 12:56:44 (feat: Implementación de cambio de contraseña en backend y frontend)

- **Backend:**
  - Se refactorizó el método `updatePassword` en `UsersController` para incluir manejo de errores más robusto y asegurar la obtención del usuario correcto a través de `auth.use('web').user`.
  - Se añadió validación explícita para la contraseña actual y se utiliza `User.findOrFail(user.id)` para asegurar que se actualiza el registro correcto en la base de datos.
  - Se implementó un bloque `try-catch` para capturar y retornar errores de validación o errores internos del servidor.
- **Frontend:**
  - Se añadió un nuevo modal en el componente `Layout` para permitir a los usuarios cambiar su contraseña.
  - Se implementó la lógica para manejar el estado del formulario de cambio de contraseña (campos, carga, errores y éxito).
  - Se integró la llamada a la API (`api.put('/users/passwordChange')`) para enviar los datos del cambio de contraseña al backend.
  - Se añadió validación en el frontend para la coincidencia de contraseñas y la longitud mínima.
  - Se actualizaron las importaciones de `lucide-react` para usar `KeyRound` en lugar de `key`.
  - Se mejoró la experiencia de usuario al cerrar el modal de cambio de contraseña tras un éxito.
  - Se añadió manejo de errores y mensajes de éxito para la operación de cambio de contraseña.
  - Se ajustaron estilos y animaciones del modal y elementos relacionados.
  - Se corrigió un error tipográfico en el estado `isPassworfModalOpen` a `isPasswordModalOpen`.

### 📦 Actualización: 2026-08-14 21:59:21 (refactor: Migración de datos de eventos y corrección de seeder de departamentos)

- **Backend:**
  - **Seeder de Departamentos (`03_department_seeder.ts`):**
    - Se corrigió el uso de `organization_id` a `organizationId` para adherirse a las convenciones de nombres de propiedades en el modelo `Department`.
  - **Migración de Datos de Eventos (`08_event_seeder.ts`):**
    - Se introdujo un nuevo seeder (`08_event_seeder.ts`) para poblar la base de datos con datos históricos de eventos desde un archivo `eventosAnteriores.json`.
    - Se eliminó el seeder obsoleto `08_evento_seeder.ts`.
    - Se implementó un usuario "histórico" (`historico@sistema.local`) para asignar la responsabilidad de los eventos migrados, asegurando la integridad referencial sin depender de usuarios existentes en el sistema actual.
    - Se crearon helpers (`ensureOrganization`, `ensureEventType`, `ensureLocation`) para garantizar la existencia de registros en tablas relacionadas antes de insertar los datos de eventos.
    - Se mapearon los campos del JSON a los modelos correspondientes (`Event`, `VersionActivity`), asignando el `userId` y `mainResponsibleId` al usuario histórico.
    - Se añadió el manejo de la ruta del archivo JSON y una advertencia si no se encuentra.
  - **Archivo de Datos (`eventosAnteriores.json`):**
    - Se añadió un nuevo archivo JSON que contiene los datos de eventos históricos a ser migrados. Este archivo incluye información sobre eventos, sus tipos, organizaciones, creadores y responsables principales.

### 📦 Actualización: 2026-08-17 11:57:39 (refactor: Mejoras en el seeder de eventos y vectorización)

- **Backend:**
  - **Seeder de Eventos (`08_event_seeder.ts`):**
    - Se completó la lógica para el procesamiento de `VersionContent` y `EventVersion`, asegurando la correcta persistencia de los datos históricos de eventos.
    - Se implementó el manejo de los pivotes `event_version_to_version_activity` para establecer las relaciones entre versiones de eventos y actividades asociadas.
    - Se integró la funcionalidad de vectorización de eventos utilizando `RagService`. Tras la inserción de datos, se generan embeddings para las fichas técnicas de los eventos actuales (`isCurrentVersion: true`) para su posterior uso en búsquedas semánticas.
    - Se añadió la generación de contenido completo para la vectorización, incluyendo nombre, objetivo, descripción, dress code y agenda de actividades.
    - Se incluyó manejo de errores específico para la operación de vectorización.
    - Se implementó la sincronización de secuencias de bases de datos para las tablas relevantes (`organizations`, `departments`, `users`, `event_types`, `location_types`, `locations`, `events`, `version_contents`, `event_versions`, `version_activities`) para asegurar la correcta generación de IDs autoincrementales después de la inserción de datos.
  - **Dependencias:** Se importaron `VersionContent` y `EventVersion` para su uso en el seeder. Se añadió `db` para la sincronización de secuencias.

### 📦 Actualización: 2026-08-17 13:28:39 (feat: Ampliación de permisos para resolver feedbacks y mejora en el modal de usuario)

- **Backend:**
  - **Controlador de Feedbacks (`FeedbacksController.ts`):**
    - Se ha ampliado la lógica de permisos para la acción de marcar un feedback como resuelto. Ahora, además del creador del evento y los administradores, los usuarios con el rol de 'encargado_departamento' también pueden resolver feedbacks si pertenecen al mismo departamento que el creador del evento asociado.
    - Se ha mejorado el mensaje de error devuelto cuando un usuario no tiene permisos para resolver un feedback, haciéndolo más genérico y preciso.
- **Frontend:**
  - **Componente `UserAdmin.jsx`:**
    - Se ha implementado el uso de `createPortal` para renderizar el modal de formulario de usuario. Esto asegura que el modal se ancle directamente al `document.body`, resolviendo posibles problemas de apilamiento y clipping con elementos padres que tengan `overflow: hidden` o `z-index` restrictivos.
    - Se ajustó el `z-index` del modal a `z-[100]` para garantizar su visibilidad sobre otros elementos de la interfaz.
  - **Componente `EventFormFeedbacks.jsx`:**
    - Se ha reestructurado la presentación de la información de cada feedback para mejorar la legibilidad.
    - El estado del feedback (Resuelto/Pendiente) y la fecha de creación ahora se muestran en una línea separada y más compacta.
    - El botón "Marcar como Resuelto" ahora se muestra dentro de un contenedor con un borde superior y alineado a la derecha, mejorando la separación visual y la jerarquía de la acción.
    - Se ajustaron los estilos del botón "Marcar como Resuelto" para un aspecto más consistente con el resto de la interfaz.
