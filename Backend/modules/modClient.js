const ClientModel = require('../models/clientModel'); // Importar el modelo de clientes

async function findClientByPhone(telefono) {
    return await ClientModel.findOne({ telefono });
}

async function registerNewClient(userState, chatId) {
    const newClient = new ClientModel({
        nombre: userState.nombre,
        apellido: userState.apellido,
        email: userState.email,
        telefono: chatId // Guardar el número de teléfono automáticamente
    });

    await newClient.save();
    return newClient;
}

module.exports = {
    findClientByPhone,
    registerNewClient,
};
