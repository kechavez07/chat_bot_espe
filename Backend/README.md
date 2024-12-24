# Proyecto Backend para el Bot de WhatsApp

Este es el backend para un bot de WhatsApp que permite a los clientes agendar, ver y cancelar citas. Este proyecto utiliza varias tecnologías y bibliotecas, incluyendo Express, Mongoose y WhatsApp Web.js.

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado en tu sistema:

- **Node.js** (v14 o superior)
- **MongoDB** (puedes usar MongoDB Atlas o una instalación local)
- **npm** (v6 o superior, que se incluye con Node.js)

## Instalación

Sigue estos pasos para instalar y configurar el backend:

1. **Clona el repositorio** (si aún no lo has hecho):

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd backend

2. **Instala las dependencias:**
En el directorio del proyecto, ejecuta los siguientes comandos para instalar cada dependencia:
    ```bash
    npm install axios
    npm install body-parser
    npm install dotenv
    npm install express
    npm install firebase-admin
    npm install mongodb
    npm install mongoose
    npm install qrcode-terminal
    npm install whatsapp-web.js

O, para instalar todas las dependencias a la vez, puedes ejecutar:
    ```bash
    npm install

3. **Configura las variables de entorno:**
Crea un archivo .env en la raíz del proyecto. Este archivo debe contener las siguientes variables:
    ```bash
    MONGO_URI=<tu_uri_de_mongodb>   # URI de conexión a tu base de datos MongoDB
    PORT=5000                         # Puerto en el que se ejecutará el servidor

Reemplaza <tu_uri_de_mongodb> con la URI de conexión a tu base de datos MongoDB. Si estás utilizando MongoDB Atlas, puedes encontrar esta URI en tu consola de MongoDB Atlas.

4. **Ejecuta el servidor:**
Para iniciar el servidor, ejecuta el siguiente comando:
    ```bash
    npm start

Esto ejecutará el archivo server.js, donde está configurado tu bot de WhatsApp.

5. **Escanea el código QR:**
Al iniciar el servidor, verás un código QR en la terminal. Usa tu aplicación de WhatsApp en tu teléfono para escanear el código. Esto permitirá que el bot acceda a tu cuenta de WhatsApp.

## Uso
Una vez que el servidor esté en ejecución y hayas escaneado el código QR, podrás interactuar con el bot enviando mensajes a través de WhatsApp. Puedes utilizar los siguientes comandos:

    -Agendar cita: Envía un mensaje que contenga "agendar cita" y sigue las instrucciones del bot.
    -Ver citas: Envía un mensaje que contenga "ver citas" para ver tus citas agendadas.
    -Cancelar cita: Envía un mensaje que contenga "cancelar cita" y proporciona el número de cita que deseas cancelar.

## Dependencias
El proyecto utiliza las siguientes dependencias:

axios: Para realizar solicitudes HTTP.
body-parser: Para analizar el cuerpo de las solicitudes.
dotenv: Para gestionar variables de entorno.
express: Framework web para Node.js.
firebase-admin: SDK para Firebase.
mongodb: Driver para MongoDB.
mongoose: ODM para MongoDB.
qrcode-terminal: Generador de códigos QR en la terminal.
whatsapp-web.js: Librería para interactuar con WhatsApp Web.