var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


function sendEmail(to,subject,text) {
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'pandyabhavan134@gmail.com',
            pass: 'impoSSible'
        }
    }));

    var mailOptions = {
        from: 'pandyabhavan134@gmail.com',
        to: to,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log('Email sent: ' + info.response);
            return info.response;
        }
    });
}

exports.sendEmail = sendEmail;