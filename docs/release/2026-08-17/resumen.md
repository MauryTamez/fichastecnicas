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
