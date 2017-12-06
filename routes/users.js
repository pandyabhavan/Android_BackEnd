var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.post('/login',function (req,res) {
    var query = "select * from user where email='"+req.body.email+"' and password='"+req.body.password+"'";
    mysql.fetchData(function(err,results){
        if(err)
        {
            console.log('in error');
            res.send({"status":"401","data":err});
        }
        else
        {
            if(results.length > 0)
            {
                res.send({"status":"200","data":results[0]})
            }
            else
            {
                res.send({"status":"401","data":results})
            }
        }
    },query);
});

router.post('/register',function (req,res) {
    var query = "insert into user values('"+req.body.email+"','"+req.body.password+"','"+req.body.university+"');";
    mysql.fetchData(function(err,results){
        if(err)
        {
            res.send({"status":"401","data":null});
        }
        else
        {
            console.log(results);
            res.send({"status":"200","data":req.body});
        }
    },query);
});

module.exports = router;