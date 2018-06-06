var nodemailer = require('nodemailer');
require('dotenv').config(); //importing node config

const appUtilMethods = function () {
  
    const sendEmail = (emailBody) =>{
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'huzoorittech@gmail.com',
            pass: ''
        }
        });

        var mailOptions = {
            from: 'mschool@mavibatechnologies.com',
            to: 'huzoorittech@gmail.com',
            subject: 'Sending Email using Node.js',
            html: '<h1>Welcome</h1><p>That was easy!</p>'
        }

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
    }
  
  return {
    sendEmail
  }
}
module.exports = appUtilMethods;
