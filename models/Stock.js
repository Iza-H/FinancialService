/**
 * Created by izabela on 23/11/15.
 */
"use strict";
var mongoose = require('mongoose');


var stockSchema = mongoose.Schema ({
    name: {type: String, required : false},
    symbol: {type: String, required: true},
    price : {type: Number, required: true, min: 0},
    change : {type: Number, required: false},
    perChange : {tyepe: Number, required: false},
    date : {type: Date, required : true, default: Date.now }

}, { capped: 1024 });




var Stock = mongoose.model('Stock3', stockSchema);




module.exports = function(io){
    // open socket
    io.sockets.on("connection", function (socket) {
        socket.on('join', function(data) {
            console.log(data);
        });
        var startConnectionDate = new Date();



        //Entrance date:
        //Group by symbol and take max date
        mongoose.model('Stock3').collection.aggregate([{$group : {_id : "$symbol",  max_date : {$max : "$date"}}}],
            function (err, entranceData) {
            if (err) {
                return console.log(err)
            }
            console.log("Entrance data");
            entranceData.forEach(function (doc) {
                console.log(doc);
                if (doc!=undefined){
                    mongoose.model('Stock3').collection.find({"symbol" : doc._id, "date" : {$eq : doc.max_date}}, function (err, result) {
                        if (err) {
                            return console.log(err)
                        }
                        result.forEach(function (res) {
                            if (res!=undefined){
                                socket.emit('dbChange', res);
                            }

                        })
                    });

                }

            });
        })


        //Tailable cousor only checks changes that take place after startConncationDate
       mongoose.model('Stock3').collection.find({"date" : {$gt : startConnectionDate}}, {
            tailable: true,
            awaitdata: true,
            numberOfRetries: Number.MAX_VALUE
        }, function (err, cursor) {
            if (err) {
                return console.log(err)
            }
            console.log(startConnectionDate);
            cursor.each(function (err, doc) {
                console.log(doc);
                // do stuff to doc
                if (doc!=undefined){
                    //console.log(doc);
                    socket.emit('dbChange', doc);
                }

            })
        });

    });

};