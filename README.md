# Chat Bot ESPE

Este proyecto es un **bot de WhatsApp** diseñado para responder preguntas frecuentes sobre la **Universidad de las Fuerzas Armadas ESPE**. Utiliza **Node.js** junto con la biblioteca **whatsapp-web.js**.

---

## **Requisitos Previos**

1. **Node.js** versión 18 o superior.
   - Descargar desde: [Node.js Official Site](https://nodejs.org/)

2. **npm** (administrador de paquetes de Node.js).
   - Se incluye al instalar Node.js.

3. **Google Chrome** o **Chromium** actualizado.
   - Requerido por **puppeteer**.

4. **Código QR** para iniciar sesión en WhatsApp Web.

---

## **Instalación**

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/kechavez07/chat_bot_espe.git
   cd chat_bot_espe/backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   - Crear un archivo llamado `.env` en la raíz del proyecto.
   - Añadir las siguientes variables:
     ```plaintext
     SESSION_NAME=whatsapp-session
     PORT=3000
     ```

---

## **Ejecución**

### **Modo desarrollo (reinicio automático):**
```bash
npm run dev
```

### **Modo producción:**
```bash
npm start
```

---

## **Primer uso:**

1. Al ejecutar el bot, aparecerá un **código QR** en la consola.
2. Escanea el QR con la app de **WhatsApp** en tu dispositivo móvil.
3. Espera a que se complete la autenticación.
4. El bot estará listo para responder mensajes.

---

## **Preguntas frecuentes predefinidas:**

Ejemplos de preguntas que el bot puede responder:
- **"¿Cuáles son las carreras disponibles?"**  
  *Respuesta:* "La ESPE ofrece ingeniería en software, electrónica, mecánica, entre otras. Visita el sitio web oficial para más información."

- **"¿Cómo puedo inscribirme?"**  
  *Respuesta:* "Puedes inscribirte a través del portal oficial de admisiones de la ESPE."

- **"¿Dónde están ubicados?"**  
  *Respuesta:* "La ESPE tiene su campus principal en Sangolquí, Ecuador."

---

## **Solución de problemas**

1. **Error de módulos no encontrados:**
   ```bash
   npm install
   ```
2. **Problemas con caché o sesión anterior:**
   ```bash
   rm -rf .wwebjs_auth session/
   npm start
   ```
3. **Errores de compatibilidad de dependencias:**
   ```bash
   npm audit fix --force
   ```

---

## **Dependencias principales**

- **whatsapp-web.js**: Librería para interactuar con WhatsApp Web.
- **qrcode-terminal**: Genera códigos QR en la terminal.
- **express**: Servidor web para la API.
- **puppeteer**: Automatiza el navegador para cargar WhatsApp Web.
- **nodemon** (solo desarrollo): Reinicio automático del servidor al detectar cambios.

---

## **Contribuciones**

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección:
   ```bash
   git checkout -b nombre-rama
   ```
3. Envía tus cambios con un Pull Request.

---

## **Licencia**

Este proyecto está licenciado bajo la Licencia MIT. Puedes encontrar más información en el archivo `LICENSE`.

---

## **Contacto**

Si tienes preguntas o sugerencias, puedes comunicarte al siguiente correo: **soporte@espe.edu.ec**.

