/**
 * Created by izabela on 23/11/15.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Stock = mongoose.model('Stock3');
var async = require ('async');

router.get('/', function(req, res){
    console.log("Run GET stocks");
    var parameters = req.query;

    console.log('Parameters: ' + parameters.price + parameters.hasOwnProperty('price'));

    var query = Stock.find();

    //name
    if(parameters.hasOwnProperty("name")){
        query.where('name').equals(new RegExp('^' + parameters.name, "i"));
    }

    //symbol
    if(parameters.hasOwnProperty('symbol')){
        query.where('symbol').equals( new RegExp('^' + parameters.symbol.toUpperCase() + '$', 'i'));
    }

    if (parameters.hasOwnProperty('price')) {
        var price = parameters.price;
        if (price.match('^[0-9]+-[0-9]+$')) {
            var numbers = price.split("-");
            query.where('price').gt(numbers[0]).lt(numbers[1]);
        }
        else if (price.match("^[0-9]+-{1}$")) {
            query.where('price').gt(price.replace('-', ''));
        }
        else if (price.match("^\-{1}[0-9]+$")) {
            query.where('price').lt(price.replace("-", ""));
        }
        else if (!price.match("^[0-9]+$")) { //something different than number
            res.status(400).json({ok: false, error: 'Incorrect price value'});
            return;
        } else {
            query.where('price').equals(price);
        }
    }

        //default sort by data
        var sort = parameters.sort ||  'data';
        query.sort(sort);

        query.exec(function (err, data){
            if (err){
                console.log(err);
                res.status(500).json({ok:false, error:err});
                return;
            }
            else {
                console.log(data);
                res.status(200).json({ok:true, result: data});
                return;
            }
        })


})



router.post('/', function(req, res, next){
    console.log("Run POST stocks");

    var stocksRequest = req.body;

    if (stocksRequest.length != undefined){
        var savedStock = [];
        var noSavedStock = [];
        async.forEach(stocksRequest,
            function(elemento, callback){
                var stock = new Stock(elemento);
                stock.symbol=stock.symbol.toLowerCase();
                stock.setChangeValue(function (err, result){
                    if (err){
                        var error = { "symbol" : stock.symbol, "price" : stock.price, "error" : err }
                        noSavedStock.push(error);
                    }else{
                        stock.save(function(err, result){
                            if(err){
                                var error = { "symbol" : stock.symbol, "price" : stock.price, "error" : err }
                                noSavedStock.push(error);
                            }else {
                                savedStock.push(result);
                            }
                            return callback();
                        });

                    }

                    });

            },
            function(){
                if (noSavedStock.length>0) {
                    console.log(savedStock);
                    if (savedStock.length>0){
                        res.status(500).json({ok:false, reason:"saveIncompleted", stocksSaved: savedStock, stocksNoSaved : noSavedStock   });
                        return;
                    }
                    res.status(500).json({ok:false, stocksSaved:[], stocksNoSaved : noSavedStock });
                    return;
                }else {
                    res.status(200).json({ok:true, stocksSaved: savedStock});
                    return;
                }

        });
    }
    else{
        var stock = new Stock(stocksRequest);
        console.log(stock);
        stock.symbol=stock.symbol.toLowerCase();
        stock.setChangeValue(function (err, result){
            if (err){
                res.status(400).json({ok:false, error:err});
                return;
            }
            console.log(result);
            result.save(function(err, result){
                if(err){
                    console.log(err);
                    res.status(400).json({ok:false, error:err});
                    return;
                }
                //if success:
                res.status(200).json({ok:true, stocksSaved:result});
                return;
            });


        })



    }




});




module.exports = router;