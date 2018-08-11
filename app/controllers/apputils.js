var nodemailer = require('nodemailer');
require('dotenv').config(); //importing node config

const appUtilMethods = function () {
  
    const sendEmail = (emailBody) =>{
        var transporter = nodemailer.createTransport({
        service: 'app3.bhashmail.com',
        auth: {
            user: 'mschool@mavibatechnologies.com',
            pass: 'mail@123'
        }
        });

        var mailOptions = {
            from: 'mschool@mavibatechnologies.com',
            to: 'huzoorittech@gmail.com',
            subject: 'Sending Email using Node.js',
            html: emailBody
        }

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
        });
    }
  
  return {
    sendEmail
  }
}
module.exports = appUtilMethods;
