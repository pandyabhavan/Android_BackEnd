var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

router.get('/getAll',function (req,res) {
    var query = "select * from book limit 10";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            res.send({"status":"200","data":results});
        }
    },query);
});

router.get('/get/:id',function (req,res) {
    var id = req.params.id;

});

router.post('/add',function (req,res) {
    var query = "select max(id) as id from book";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": err});
        }
        else {
            var id = Number(results[0].id)+1;
            console.log(results);
            var query1 = "insert into book values("+id+",'"+req.body.author+"','"+req.body.title+"','"+req.body.call_number+"','"+req.body.publisher+"',"+req.body.publication_year+",'"+req.body.location+"',"+req.body.copies+",'"+req.body.status+"','"+req.body.keywords+"','"+req.body.image+"')";
            mysql.fetchData(function(err,results) {
                if (err) {
                    res.send({"status": "401", "data": err});
                }
                else {
                    res.send({"status":"200","data":results});
                }
            },query1);
        }
    },query);
});

router.post('/update',function (req,res) {
    var query = "update book set author =  '"+req.body.author+"',title = '"+req.body.title+"',call_number = '"+req.body.call_number+"', publisher = '"+req.body.publisher+"',publication_year = "+req.body.publication_year+", location = '"+req.body.location+"', copies = "+req.body.copies+", status = '"+req.body.status+"',keywords = '"+req.body.keywords+"',image = '"+req.body.image+"'where id = "+req.body.id+"";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            res.send({"status":"200","data":results});
        }
    },query);
});

router.post('/delete/:id',function (req,res) {
    var query = "delete from book where id="+req.params.id+"";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            res.send({"status":"200","data":results});
        }
    },query);
});

router.post('/checkout',function (req,res) {
    var query = "";

});

module.exports = router;