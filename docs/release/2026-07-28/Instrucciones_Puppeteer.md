# Guía de Despliegue - Dependencias de Puppeteer (PDFs)

**Para:** Equipo de Servidores de FIME
**Asunto:** Configuración requerida para la generación de PDFs en el backend (Puppeteer)

El sistema de Fichas Técnicas ha incorporado una nueva funcionalidad para exportar la logística y requerimientos de los eventos a un formato PDF. Para lograr esto, el backend en Node.js utiliza **Puppeteer**, una librería que ejecuta una instancia de Chromium (navegador) en modo invisible (_headless_).

Dado que los servidores suelen no tener entorno gráfico instalado (como Ubuntu/Debian Server o contenedores Linux), es **estrictamente necesario** instalar ciertas dependencias del sistema operativo para que el navegador Chromium interno de Puppeteer pueda ejecutarse sin arrojar errores de bibliotecas compartidas (`libnss3.so`, `libatk-1.0.so.0`, etc.).

---

## 1. Instalación de Dependencias del Sistema Operativo

Si el servidor utiliza una distribución basada en **Debian o Ubuntu**, por favor ejecuten el siguiente comando como administrador (`root` o usando `sudo`) para instalar todas las bibliotecas gráficas y de fuentes requeridas por Chromium:

```bash
sudo apt-get update

sudo apt-get install -y \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libx11-xcb1 \
  libx11-6 \
  libxcb1 \
  libxext6 \
  fonts-liberation
```

*(Nota: Si el servidor utiliza RHEL/CentOS/AlmaLinux, las bibliotecas equivalentes pueden instalarse mediante `yum` o `dnf`, principalmente los paquetes `alsa-lib`, `atk`, `cups-libs`, `gtk3`, `libXcomposite`, `libXcursor`, `libXdamage`, `libXext`, `libXi`, `libXrandr`, `libXScrnSaver`, `libXtst`, `pango`, `at-spi2-atk`, `libXt`, `xorg-x11-server-Xvfb` y `nss`).*

## 2. Configuración en el Código (Información)

Para su tranquilidad en temas de seguridad y permisos, el equipo de desarrollo ya configuró Puppeteer para que se ejecute en el servidor con los _flags_ de seguridad adecuados para entornos Linux/Docker (evitando problemas de ejecución como usuario `root` si fuera el caso):

```javascript
// Ya configurado en events_pdf_controller.ts
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
```
No se requiere realizar modificaciones en el código, únicamente asegurar las dependencias a nivel de sistema operativo mencionadas arriba.

## 3. Pruebas Post-Despliegue

Para comprobar que Puppeteer se instaló y funciona correctamente:
1. Inicien el servidor Node.js del backend.
2. Ingresen al sistema de Fichas Técnicas desde el Frontend.
3. Abran el detalle de cualquier evento existente.
4. Hagan clic en el botón de "Exportar" (PDF).
5. Si el archivo se descarga correctamente, significa que el navegador _headless_ funciona. Si el backend arroja un error 500 y en los logs aparece algo como `error while loading shared libraries`, entonces falta instalar alguna de las dependencias mencionadas en el Paso 1.

Agradecemos su atención para habilitar este componente vital del sistema.
