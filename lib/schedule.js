/**
 * Created by izabela on 6/12/15.
 */
var cron = require ('node-schedule');
var nodemailer = require('nodemailer');
var async = require ('async');
var mongoose = require('mongoose');
var User = mongoose.model('Users');

var transporter = nodemailer.createTransport({
    service : 'Gmail',
    auth: {
        user: '@gmail.com',
        pass: ''

    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Financial Service ✔ <fs@no-reply.com>', // sender address
    subject: 'Daily report', // Subject line
    //text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};






//cron.scheduleJob({hour: 5, minute: 40}, function() {

    User.find({sendReport : true}, function(err, data){
        if (err){
            console.log(err);
        }
        console.log(data);

        var sentEmials = [];
        var nosentEmials = [];
        async.forEach(data,
            function(element, callback){
                //Sent emial
                mailOptions.to = data.email;
                transporter.sendMail(mailOptions, (function (err, result){
                    if (err){
                        var error = { "email" : element.email, "name" : element.name, "error" : err }
                        nosentEmials.push(error);
                    }else{
                        sentEmials.push(result);
                    }
                    return callback();

                }))
            },
            function(){
                if (nosentEmials.length>0) {
                    if (sentEmials.length>0){
                        console.log({ok:false, reason:"sentIncompleted", nosentEmials: nosentEmials, sentEmials : sentEmials  });
                        return;
                    }
                    console.log({ok:false, stocksSaved:[], nosentEmials: nosentEmials });
                    return;
                }else {
                    console.log({ok:true, sentEmials: sentEmials});
                    return;
                }

            });
    });







