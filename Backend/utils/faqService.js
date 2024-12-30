const faq = {
    "¿cuáles son las carreras disponibles?": "La ESPE ofrece ingeniería en software, electrónica, mecánica, entre otras. Visita el sitio web oficial para más información.",
    "¿cómo puedo inscribirme?": "Puedes inscribirte a través del portal oficial de admisiones de la ESPE.",
    "¿cuál es el costo de matrícula?": "El costo varía según el programa. Para información actualizada, consulta la página web oficial o comunícate con admisiones.",
    "¿dónde están ubicados?": "La ESPE tiene su campus principal en Sangolquí, Ecuador.",
    "¿cuáles son los horarios de atención?": "La atención al público es de lunes a viernes, de 08:00 a 17:00.",
};

const getAnswer = (question) => {
    return faq[question] || null; // Devuelve la respuesta o null si no está definida.
};

module.exports = {
    getAnswer,
};
