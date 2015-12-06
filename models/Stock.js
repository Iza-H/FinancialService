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

// open socket
/*iosocket.sockets.on("connection", function (socket) {

    mongoose.model('Stock1').collection.find({}, {
        tailable: true,
        awaitdata: true,
        numberOfRetries: 300
    }, function (err, cursor) {
        if (err) {
            return console.log(err)
        }
        cursor.each(function (err, doc) {
            // do stuff to doc
            console.log(doc.type);
        })
    });

});*/




module.exports = function(io){
    // open socket
    io.sockets.on("connection", function (socket) {
        socket.on('join', function(data) {
            console.log(data);
        });


        mongoose.model('Stock3').collection.find({}, {
            tailable: true,
            awaitdata: true,
            numberOfRetries: Number.MAX_VALUE
        }, function (err, cursor) {
            if (err) {
                return console.log(err)
            }
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