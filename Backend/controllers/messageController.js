const faqController = require('./faqController');
const fs = require('fs');

// Cargar variaciones de preguntas desde un archivo txt
const questionVariants = JSON.parse(fs.readFileSync('messages/questionVariants.json', 'utf8'));

// Validar y procesar el mensaje
async function processMessage(client, message) {
    const question = message.body.toLowerCase().trim();
    let response = faqController.getResponse(question);

    // Detectar preguntas por número
    if (!response) {
        switch (question) {
            case '1':
                response = faqController.getResponse('¿cuáles son las carreras disponibles?');
                break;
            case '2':
                response = faqController.getResponse('¿cómo puedo inscribirme?');
                break;
            case '3':
                response = faqController.getResponse('¿cuál es el costo de matrícula?');
                break;
            case '4':
                response = faqController.getResponse('¿dónde están ubicados?');
                break;
            case '5':
                response = faqController.getResponse('¿cuáles son los horarios de atención?');
                break;
        }
    }

    // Detectar variaciones de preguntas
    if (!response) {
        for (const [key, variants] of Object.entries(questionVariants)) {
            if (variants.some(variant => question.includes(variant.toLowerCase()))) {
                response = faqController.getResponse(key);
                break;
            }
        }
    }

    // Responder o mostrar mensaje de error
    if (response) {
        await message.reply(response);
    } else {
        await message.reply('Por favor, selecciona una de las opciones proporcionadas en las preguntas frecuentes o ingresa una pregunta relacionada.');
    }
}

module.exports = { processMessage };

