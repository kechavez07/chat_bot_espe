const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const faqController = require('./controllers/faqController');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa el cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(), // Autenticación local
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
    const response = faqController.getResponse(message.body);
    if (response) {
        await message.reply(response);
    } else {
        await message.reply('Lo siento, no entiendo la pregunta. Por favor, intenta de nuevo.');
    }
});

// Manejo de errores
client.on('auth_failure', (msg) => {
    console.error('Error de autenticación', msg);
});

// Inicia el cliente
client.initialize();

// Configuración básica de Express
app.get('/', (req, res) => {
    res.send('El bot de WhatsApp para la ESPE está en funcionamiento.');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
