# Guía de Instalación y Generación de APK - EM Servicios Eléctricos

Esta guía detalla los pasos para compilar, descargar e instalar la aplicación en cualquier dispositivo móvil Android.

---

## 1. Descarga Directa del APK desde AI Studio

1. En la barra superior derecha de **Google AI Studio**, haz clic en el menú de **Exportar / Configuración** (icono de opciones o menú desplegable).
2. Selecciona **Download APK** (Descargar APK) o **Export as ZIP**.
3. Transfiere el archivo `.apk` a tu teléfono Android (vía WhatsApp, Telegram, Google Drive, correo electrónico o cable USB).
4. En tu dispositivo móvil:
   - Abre el archivo descargado.
   - Si el sistema lo solicita, habilita el permiso de *"Instalar aplicaciones de fuentes desconocidas"* para el navegador o explorador de archivos.
   - Presiona **Instalar** y luego **Abrir**.

---

## 2. Instalación mediante Cable USB (Comando ADB)

Si tienes Android Studio o las herramientas de Android Platform Tools instaladas en tu computadora:

```bash
# Verificar que el teléfono esté conectado y reconocido
adb devices

# Instalar el archivo APK directamente en el dispositivo móvil
adb install -r app-debug.apk
```

---

## 3. Comandos de Compilación en Gradle (Terminal / Android Studio)

Para generar nuevos paquetes instalables desde la consola o terminal:

### Compilar APK en modo Depuración (Debug):
```bash
gradle :app:assembleDebug
# El APK generado se ubicará en:
# app/build/outputs/apk/debug/app-debug.apk
```

### Compilar APK en modo Producción (Release):
```bash
gradle :app:assembleRelease
# El APK generado se ubicará en:
# app/build/outputs/apk/release/app-release-unsigned.apk
```

### Generar Android App Bundle (AAB para Google Play Store):
```bash
gradle :app:bundleRelease
# El paquete AAB generado se ubicará en:
# app/build/outputs/bundle/release/app-release.aab
```

---

## 4. Requisitos del Dispositivo Android

- **Sistema Operativo**: Android 8.0 (Oreo / API 26) o superior (recomendado Android 10+).
- **Almacenamiento**: ~25 MB de espacio disponible.
- **Permisos requeridos**:
  - `INTERNET`: Para sincronización en la nube (Firestore) y consultas web.
  - `CALL_PHONE`: Acceso directo al marcador telefónico para contacto con clientes.
  - `POST_NOTIFICATIONS`: Alertas y avisos de facturas o cotizaciones.
