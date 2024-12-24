const Appointment = require('../models/appointmentModel');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

// Activar el plugin de dayjs
dayjs.extend(customParseFormat);
async function createAppointmentInDB(userState, clientId) {
    try {
        const formattedDate = dayjs(userState.fecha, 'DD/MM/YYYY'); // Asegurar que use 'DD/MM/YYYY'

        if (!formattedDate.isValid()) {
            throw new Error('La fecha proporcionada no es válida.');
        }

        const numeroCita = Math.floor(Math.random() * 1000); // Número de cita aleatorio

        const newAppointment = new Appointment({
            clientId: clientId,
            numeroCita: numeroCita, // Asignar numeroCita
            fechaAgenda: formattedDate.toDate(), // Convertir a objeto Date
            horaAgenda: userState.hora,
            trabajo: userState.trabajo
        });

        await newAppointment.save();
        return { newAppointment, numeroCita }; // Devolver numeroCita correctamente
    } catch (error) {
        console.error('Error al crear la cita:', error);
        return null;
    }
}
async function editAppointmentInDB(userState, clientId) {
    try {
        const formattedDate = dayjs(userState.fecha, 'DD/MM/YYYY'); // Asegurar que use 'DD/MM/YYYY'

        if (!formattedDate.isValid()) {
            throw new Error('La fecha proporcionada no es válida.');
        }

        // Buscar la cita por su número y asegurarse de que pertenezca al cliente
        const appointment = await Appointment.findOne({ numeroCita: userState.numeroCita, clientId: clientId });

        if (!appointment) {
            throw new Error('Cita no encontrada o no pertenece a este cliente.');
        }

        // Actualizar los datos de la cita
        appointment.fechaAgenda = formattedDate.toDate();
        appointment.horaAgenda = userState.hora;
        appointment.trabajo = userState.trabajo;

        const updatedAppointment = await appointment.save();

        return { updatedAppointment };
    } catch (error) {
        console.error('Error al editar la cita:', error);
        return null;
    }
}
async function getAppointmentsByClientId(clientId) {
    try {
        const appointments = await Appointment.find({ clientId });
        return appointments;
    } catch (error) {
        console.error('Error al obtener las citas:', error);
        return null;
    }
}
async function cancelAppointmentInDB(userState, clientId) {
    try {
        // Buscar la cita por número de cita y clientId
        const appointment = await Appointment.findOne({ numeroCita: userState.numeroCita, clientId: clientId });

        if (!appointment) {
            throw new Error('Cita no encontrada o no pertenece a este cliente.');
        }

        // Cambiar el estado de la cita a "Cancelada"
        appointment.estado = 'Cancelada';
        const updatedAppointment = await appointment.save();

        return { updatedAppointment };
    } catch (error) {
        console.error('Error al cancelar la cita:', error);
        return null;
    }
}

module.exports = {
    createAppointmentInDB,
    editAppointmentInDB,
    getAppointmentsByClientId,
    cancelAppointmentInDB, // Exportar la nueva función
};

