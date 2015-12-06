/**
 * Created by izabela on 22/11/15.
 */
"use strict";

var mongoose = require ('mongoose');
var connection = mongoose.connection;

//Run when the connection is opened
connection.once('open', function(){
    console.info('Connected to MongDB');
})

//Run in the case of an error:
connection.on('error', function (err){
   console.log(err);
    process.exit(1);
});







mongoose.connect('mongodb://localhost/stocks');


module.export = connection;