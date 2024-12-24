const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  numeroCita: {
    type: Number,
    required: true
  },
  fechaAgenda: {
    type: Date,
    required: true
  },
  horaAgenda: {
    type: String,
    required: true
  },
  trabajo: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    default: 'Activa', // Estado inicial de la cita
    required: true
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
