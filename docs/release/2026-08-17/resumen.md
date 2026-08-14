# 📚 Registro de Actividad - Rama: release/2026-08-17
### 📦 Actualización: 2026-08-14 10:56:11 (Fallback por Error)
- **Error API:** google/gemini-2.0-flash is not a valid model ID
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
