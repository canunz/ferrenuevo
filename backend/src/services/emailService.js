const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: process.env.SMTP_SECURE === 'true', // true solo si es 'true' en el .env
  auth: {
    user: process.env.SMTP_USER || 'tucorreo@gmail.com',
    pass: process.env.SMTP_PASS || 'tu_contraseña',
  },
});

/**
 * Envía un correo electrónico con la boleta al cliente
 * @param {string} to - Correo del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 * @param {Array} [attachments] - Archivos adjuntos (opcional)
 */
async function enviarCorreo({ to, subject, html, attachments = [] }) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'Ferremas <no-reply@ferremas.cl>',
    to,
    subject,
    html,
    attachments,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  enviarCorreo,
}; 