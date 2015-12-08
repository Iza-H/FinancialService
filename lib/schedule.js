/**
 * Created by izabela on 6/12/15.
 */
var cron = require ('node-schedule');
var nodemailer = require('nodemailer');
var async = require ('async');
var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Stock = mongoose.model('Stock');

var transporter = nodemailer.createTransport({
    service : 'Gmail',
    auth: {
        user: 'PUTEMAILHERE@gmail.com', //Change it!
        pass: 'PUTPASSWORDHER' //Change it!

    }
});

// setup e-mail:
var mailOptions = {
    from: 'Financial Service <fs@no-reply.com>', // sender address
    subject: 'Daily report', // Subject line
    html: '<h1>Finacial service - daily report</h1>' // html body
};

//time when emails will be sent:
var scheduleHour = 23
var scheduleMinutes = 55

console.log("Set sending reports at " + scheduleHour + ":" + scheduleMinutes);



cron.scheduleJob({hour: scheduleHour, minute: scheduleMinutes}, function() {
    //Emails sent to users with a value sendReport ==true
    User.find({sendReport : true}, function(err, data){
        if (err){
            console.log(err);
        }
        console.log(data);

        var sentEmials = [];
        var nosentEmials = [];
        async.forEach(data,
            function(element, callback){

                var query = Stock.find();

                //start date - beginning of the day:
                var startDate = new Date();
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                //ent date - end of the date:
                var endDate = new Date();
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                //take all data between startDate and endDate
                query.where('date').gt(startDate).lt(endDate);
                query.sort('date');

                query.exec(function (err, data){
                    if (err){
                        console.log(err);
                        return;
                    }
                    else {
                        console.log(data);

                        //Content email:
                        var html;

                        if(data.length>0){
                            html= "<table style=\"width:100%\; border: 1px solid black; text-align:center\"><tr><th>Symbol</th><th>Price</th><th>Date</th><th>LastChange</th> </tr>"
                        }
                        for (var i= 0; i<data.length; i++){
                            if (data[i].change==undefined){
                                data[i].change = 0;
                            }
                            html+="<tr><td>"+data[i].symbol.toUpperCase()+"</td><td>"+data[i].price+"</td><td>"+data[i].date+"</td><td>"+data[i].change+"</td></tr>"
                        }
                        html+="</table>";
                        //console.log(html);
                        mailOptions.html = mailOptions.html+html;


                        //Sent emial
                        mailOptions.to = element.email;
                        //console.log(mailOptions);

                        transporter.sendMail(mailOptions, (function (err, result){
                            if (err){
                                console.log(err);
                                var error = { "email" : element.email, "name" : element.name, "error" : err }
                                nosentEmials.push(error);
                            }else{
                                sentEmials.push(result);
                            }
                            return callback();

                        }))
                    }
                })





            },
            function(){
                //Show results ofsending:
                if (nosentEmials.length>0) {
                    if (sentEmials.length>0){
                        //some emials were not sent
                        console.log({ok:false, reason:"sentIncompleted", nosentEmials: nosentEmials, sentEmials : sentEmials  });
                        return;
                    }
                    //no one email was sent
                    console.log({ok:false, stocksSaved:[], nosentEmials: nosentEmials });
                    return;
                }else {
                    //everything was ok, sent all emials
                    console.log({ok:true, sentEmials: sentEmials});
                    return;
                }

            });
    });
});







