import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

console.log(process.env.SMTP_USER)
console.log(process.env.SMTP_PASSWORD)
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
})

export default transporter

// ./config/nodemailer.config.js



// // Require nodemailer
// import nodemailer from 'nodemailer'


// // Require logger


// // Load environment variables
// import dotenv from 'dotenv'
// dotenv.config();


// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: process.env.EMAIL_PORT == 465,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//     },
//     tls: {
//         rejectUnauthorized: false
//     },
//     connectionTimeout: 20000,
//     greetingTimeout: 20000,
//     socketTimeout: 20000
// });
 


// transporter.verify((error, success) => {
//     if (error) {
//         console.error('❌ Nodemailer configuration error:', error);
//     } else {
//         console.info('✅ Nodemailer is ready to send emails');
//     }
// });


// export default transporter
