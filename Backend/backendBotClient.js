const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { findClientByPhone, registerNewClient } = require('./modules/modClient');
const {
    createAppointmentInDB,
    editAppointmentInDB,
    getAppointmentsByClientId,
    cancelAppointmentInDB
} = require('./modules/modAppointment');
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
});

let conversationState = {};

whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea este código QR para iniciar sesión en WhatsApp');
});

whatsappClient.on('ready', () => {
    console.log('Bot de WhatsApp está listo.');
});

whatsappClient.on('message', async (msg) => {
    const chatId = msg.from;
    const userMessage = msg.body.toLowerCase();

    if (!conversationState[chatId]) {
        conversationState[chatId] = { step: 0 };
    }

    const userState = conversationState[chatId];
    let client = await findClientByPhone(chatId);

    // Si el cliente no está registrado, enviar la bienvenida con imagen
    if (!client && userState.step === 0) {
        const greetingMessagePath = path.join(__dirname, 'messages', 'greetingMessage.txt');
        const logoPath = path.join(__dirname, 'assets', 'logo.png');

        fs.readFile(greetingMessagePath, 'utf8', async (err, greetingData) => {
            if (err) {
                console.error('Error al leer el archivo de mensaje de bienvenida:', err);
                whatsappClient.sendMessage(chatId, 'Bienvenido, parece que no estás registrado.');
            } else {
                const greetingMessage = `${greetingData}`;
                const media = MessageMedia.fromFilePath(logoPath);

                await whatsappClient.sendMessage(chatId, media, { caption: greetingMessage });
                whatsappClient.sendMessage(chatId, 'Por favor, envía tu nombre:');
                userState.step = 'register_name';
            }
        });

        return;
    }

    // Flujo de registro
    if (userState.step === 'register_name') {
        userState.nombre = userMessage;
        whatsappClient.sendMessage(chatId, 'Ahora envía tu apellido:');
        userState.step = 'register_lastname';
    } else if (userState.step === 'register_lastname') {
        userState.apellido = userMessage;
        whatsappClient.sendMessage(chatId, 'Por favor, proporciona tu correo electrónico:');
        userState.step = 'register_email';
    } else if (userState.step === 'register_email') {
        userState.email = userMessage;
        client = await registerNewClient(userState, chatId);
        whatsappClient.sendMessage(chatId, 'Te has registrado exitosamente. Ahora puedes agendar una cita. Escribe "agendar cita" para continuar.');
        userState.step = 0;
    }

    // Flujo de agendar citas
    else if (userState.step === 0 && userMessage.includes('agendar cita')||userMessage.includes('agendar citas')) {
        whatsappClient.sendMessage(chatId, 'Por favor, proporciona la fecha de la cita (dd/mm/yyyy):');
        userState.step = 'appointment_date';
    } else if (userState.step === 'appointment_date') {
        userState.fecha = userMessage;
        whatsappClient.sendMessage(chatId, 'Por favor, proporciona la hora de la cita (hh:mm):');
        userState.step = 'appointment_time';
    } else if (userState.step === 'appointment_time') {
        userState.hora = userMessage;
        whatsappClient.sendMessage(chatId, 'Describe el trabajo que deseas realizar:');
        userState.step = 'appointment_work';
    } else if (userState.step === 'appointment_work') {
        userState.trabajo = userMessage;

        const result = await createAppointmentInDB(userState, client._id);

        if (result && result.newAppointment) {
            const { newAppointment, numeroCita } = result;

            const resumenCita =
                `Tu cita ha sido agendada correctamente.

Aquí están los detalles de tu cita:\n
🔢 *Numero de cita:* ${numeroCita}     
📅 *Fecha:* ${userState.fecha}
🕒 *Hora:* ${userState.hora}
📝 *Trabajo a realizar:* ${userState.trabajo}

_Gracias por usar nuestro servicio. ¡Nos vemos pronto!_

🤖 𝕭𝖔𝖙 𝕭𝖞: *🧐𝕶𝖎𝖇𝖔𝕿𝖊𝖈𝖍🧐* 🤖`;

            whatsappClient.sendMessage(chatId, resumenCita);
        } else {
            whatsappClient.sendMessage(chatId, 'Hubo un error al agendar tu cita. Por favor, intenta de nuevo.');
        }

        userState.step = 0;
    }

    // Flujo de editar citas
    else if (userState.step === 0 && userMessage.includes('editar cita')||userMessage.includes('editar citas')) {
        whatsappClient.sendMessage(chatId, 'Por favor, proporciona el número de la cita que deseas editar:');
        userState.step = 'edit_appointment_number';
    } else if (userState.step === 'edit_appointment_number') {
        userState.numeroCita = userMessage;
        whatsappClient.sendMessage(chatId, 'Por favor, proporciona la nueva fecha de la cita (dd/mm/yyyy):');
        userState.step = 'edit_appointment_date';
    } else if (userState.step === 'edit_appointment_date') {
        userState.fecha = userMessage;
        whatsappClient.sendMessage(chatId, 'Por favor, proporciona la nueva hora de la cita (hh:mm):');
        userState.step = 'edit_appointment_time';
    } else if (userState.step === 'edit_appointment_time') {
        userState.hora = userMessage;
        whatsappClient.sendMessage(chatId, 'Describe el nuevo trabajo a realizar:');
        userState.step = 'edit_appointment_work';
    } else if (userState.step === 'edit_appointment_work') {
        userState.trabajo = userMessage;

        const result = await editAppointmentInDB(userState, client._id);

        if (result && result.updatedAppointment) {
            const { updatedAppointment } = result;

            const resumenCita =
`Tu cita ha sido actualizada correctamente.

Aquí están los nuevos detalles de tu cita:\n
🔢 *Numero de cita:* ${userState.numeroCita}     
📅 *Fecha:* ${userState.fecha}
🕒 *Hora:* ${userState.hora}
📝 *Trabajo a realizar:* ${userState.trabajo}

_Gracias por usar nuestro servicio. ¡Nos vemos pronto!_

🤖 𝕭𝖔𝖙 𝕭𝖞: *🧐𝕶𝖎𝖇𝖔𝕿𝖊𝖈𝖍🧐* 🤖`;

            whatsappClient.sendMessage(chatId, resumenCita);
        } else {
            whatsappClient.sendMessage(chatId, 'Hubo un error al actualizar tu cita. Por favor, intenta de nuevo.');
        }

        userState.step = 0;
    }

    // Flujo de ver citas
    else if (userState.step === 0 && userMessage.includes('ver citas')||userMessage.includes('ver cita')) {
        const appointments = await getAppointmentsByClientId(client._id);

        if (appointments && appointments.length > 0) {
            let message = 'Aquí están tus citas:\n\n';
            appointments.forEach((appointment, index) => {
                message +=
                    `*Cita ${index + 1}:*\n` +
                    `🔢 *Numero de cita:* ${appointment.numeroCita}\n` +
                    `📅 *Fecha:* ${dayjs(appointment.fechaAgenda).format('DD/MM/YYYY')}\n` +
                    `🕒 *Hora:* ${appointment.horaAgenda}\n` +
                    `📝 *Trabajo:* ${appointment.trabajo}\n`+
                    `🚦 *Estado:* ${appointment.estado}\n\n`;
            });
            message += '\n🤖 𝕭𝖔𝖙 𝕭𝖞: *🧐𝕶𝖎𝖇𝖔𝕿𝖊𝖈𝖍🧐* 🤖';
            whatsappClient.sendMessage(chatId, message);
        } else {
            whatsappClient.sendMessage(chatId, 'No tienes citas agendadas.');
        }

        userState.step = 0;
    }

    // Flujo de cancelar citas
    else if (userState.step === 0 && userMessage.includes('cancelar cita')&&userMessage.includes('cancelar citas')) {
        whatsappClient.sendMessage(chatId, 'Por favor, proporciona el número de la cita que deseas cancelar:');
        userState.step = 'cancel_appointment_number';
    } else if (userState.step === 'cancel_appointment_number') {
        userState.numeroCita = userMessage;

        const result = await cancelAppointmentInDB(userState, client._id);

        if (result && result.updatedAppointment) {
            const { updatedAppointment } = result;

            const resumenCita =
                `Tu cita ha sido cancelada correctamente.

Aquí están los detalles de tu cita cancelada:\n
🔢 Numero de cita: ${userState.numeroCita}     
📅 Fecha: ${dayjs(updatedAppointment.fechaAgenda).format('DD/MM/YYYY')}
🕒 Hora: ${updatedAppointment.horaAgenda}
📝 Trabajo: ${updatedAppointment.trabajo}

_Gracias por usar nuestro servicio. ¡Nos vemos pronto!_

🤖 𝕭𝖔𝖙 𝕭𝖞: *🧐𝕶𝖎𝖇𝖔𝕿𝖊𝖈𝖍🧐* 🤖`;

            whatsappClient.sendMessage(chatId, resumenCita);
        } else {
            whatsappClient.sendMessage(chatId, 'Hubo un error al cancelar tu cita. Por favor, intenta de nuevo.');
        }

        userState.step = 0;
    }else{
        whatsappClient.sendMessage(chatId, 'Por favor, ingresa uno de los siguientes comandos:\n- "agendar cita"\n- "ver citas"\n- "cancelar cita"\n- "editar cita"\n\n🤖 𝕭𝖔𝖙 𝕭𝖞: *🧐𝕶𝖎𝖇𝖔𝕿𝖊𝖈𝖍🧐* 🤖');
    }
});
function initializeBot() {
    whatsappClient.initialize();
}

module.exports = { initializeBot };