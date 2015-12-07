/**
 * Created by izabela on 6/12/15.
 */
"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('Users');



//Create a new user
//POST apiv1/users/new
router.post("/new", function (req, res){
    if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('name')|| !req.body.hasOwnProperty('sendReport') ){
        res.status(400).json({ok: false, error : "Missing data"});
        return;
    }
    User.findOne({email:req.body.email}, function(err, data){
        if (err){
            res.status(500).json({'ok':'false', error:err});
            return;
        }
        if(data){
            res.status(400).json({ok:'false', error: "User with this email exists"});
            return;
        }
        var newUser= new Usuario({name: req.body.name, sendReport: req.body.sendReport, email: req.body.email});
        newUser.save(function(err, saved){
            if (err){
                console.log(err);
                res.status(500).json({ok:false, error: err});
                return;
            }
            console.log('User saved ' + saved.email);
            res.status(200).json({ok:true, result: "UserSaved", userEmail: saved.email});
            return;
        });
    });
});

module.exports = router;