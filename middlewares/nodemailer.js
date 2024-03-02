const nodemailer = require('nodemailer')
const {email} = require('../configs/keys')

const sendMail = (user_email)=>{
    const transporter = nodemailer.createTransport({
        host: email.HOST,
        port: email.PORT,
        auth: {
            user: email.USER,
            pass: email.PASS
        }
    });
    
    let mailoptions = {
        from: email.EMAIL_FROM,
        to: user_email,
        subject: email.EMAIL_SUB,
        html: email.EMAIL_TEXT
    };
    
    transporter.sendMail(mailoptions,(err,info) => {
        if(err) {
            console.log(err);
        }
        else
        {
            console.log("Email sent : " + info.response);
            return true;
        }
    })
}

module.exports = sendMail