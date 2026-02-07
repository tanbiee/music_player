import nodeMailer from 'nodemailer';
const sendMail = async({to, subject, html})=>{
    const transporter = nodeMailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    await transporter.sendMail({
        from: 'hello@musicplayer.com',
        to,
        subject,
        html,
    })
}

export default sendMail;