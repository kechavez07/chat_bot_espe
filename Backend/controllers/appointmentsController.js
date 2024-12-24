const Appointment = require('../models/appointmentModel');

// Crear una cita
exports.createAppointment = async (req, res) => {
  try {
    const { clientId, numeroCita, fechaAgenda, horaAgenda, trabajo } = req.body;
    const newAppointment = new Appointment({
      clientId,
      numeroCita,
      fechaAgenda,
      horaAgenda,
      trabajo
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creando la cita', error });
  }
};

// Obtener todas las citas
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo citas', error });
  }
};

// Editar una cita solo si pertenece al cliente que la creó
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.body; // Suponiendo que obtienes el ID del cliente desde el cuerpo de la solicitud o autenticación
    
    // Buscar la cita por ID
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar si la cita pertenece al cliente
    if (appointment.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta cita' });
    }

    // Actualizar la cita
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando la cita', error });
  }
};


// Cancelar una cita
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Cita cancelada' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelando la cita', error });
  }
};

// Cancelar una cita
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.body; // Asegurar que se obtiene el clientId

    // Buscar la cita por ID
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar si la cita pertenece al cliente
    if (appointment.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta cita' });
    }

    // Cambiar el estado de la cita a "Cancelada"
    appointment.estado = 'Cancelada';
    const updatedAppointment = await appointment.save();

    res.status(200).json({ message: 'Cita cancelada', updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelando la cita', error });
  }
};