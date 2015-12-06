/**
 * Created by izabela on 29/11/15.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index', {title: 'FinancialService'})
});


module.exports = router;