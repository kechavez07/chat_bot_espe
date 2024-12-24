const Client = require('../models/clientModel');

// Registrar cliente
exports.registerClient = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    const newClient = new Client({ nombre, apellido, email });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Error registrando el cliente', error });
  }
};

// Obtener todos los clientes
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo clientes', error });
  }
};

// Editar cliente
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando el cliente', error });
  }
};

// Eliminar cliente
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el cliente', error });
  }
};
