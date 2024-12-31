const express = require('express');
const { initializeClient } = require('./configs/whatsappClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa el cliente de WhatsApp
initializeClient();

// Configuración básica de Express
app.get('/', (req, res) => {
    res.send('El bot de WhatsApp para la ESPE está en funcionamiento.');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
