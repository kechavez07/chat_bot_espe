const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { processMessage } = require('../controllers/messageController');
const fs = require('fs');

// Lista para rastrear usuarios que ya recibieron un mensaje de bienvenida
const greetedUsers = new Set();

// Cargar mensaje de bienvenida desde un archivo txt
const welcomeMessage = fs.readFileSync('messages/welcomeMessage.txt', 'utf8').trim();

// Cargar preguntas frecuentes desde un archivo txt
const faqMessage = fs.readFileSync('messages/faqMessage.txt', 'utf8').trim();

function initializeClient() {
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
    });

    // Muestra el código QR para iniciar sesión
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        console.log('Escanea este código QR con WhatsApp para conectarte.');
    });

    // Confirma cuando el cliente está listo
    client.on('ready', () => {
        console.log('Cliente de WhatsApp está listo.');
    });

    // Escucha los mensajes entrantes
    client.on('message', async (message) => {
        // Enviar mensaje de bienvenida con imagen si el usuario es nuevo
        if (!greetedUsers.has(message.from)) {
            const media = MessageMedia.fromFilePath('assets/welcomeImage.jpg'); 
            await client.sendMessage(message.from, media, { caption: welcomeMessage });
            greetedUsers.add(message.from);

            // Enviar mensaje con preguntas frecuentes
            await client.sendMessage(message.from, faqMessage);
        } else {
            // Procesar el mensaje con lógica separada en el controlador
            await processMessage(client, message);
        }
    });

    // Manejo de errores
    client.on('auth_failure', (msg) => {
        console.error('Error de autenticación', msg);
    });

    // Inicia el cliente
    client.initialize();

    return client;
}

module.exports = { initializeClient };

