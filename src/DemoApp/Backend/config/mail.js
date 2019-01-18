const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'aaroncoc0010@gmail.com',
        pass: 'biztime12'
    },
    tls: {
    	rejectUnauthorized:false
    }
});

module.exports.sendMail = (mailOptions, callback) => {
    transporter.sendMail(mailOptions, callback);	
}