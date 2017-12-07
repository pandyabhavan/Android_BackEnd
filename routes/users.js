var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var mail = require('./mail');

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
    var query = "select * from user where university='"+req.body.university+"'";
    mysql.fetchData(function(err,results){
        if(err)
        {
            res.send({"status":"401","data":null});
        }
        else
        {
            if(results.length == 0)
            {
                var type = "patron";
                if(req.body.email.includes("@sjsu.edu"))
                    type="librarian";
                var query1 = "insert into user values('"+req.body.email+"','"+req.body.password+"','"+req.body.university+"',false,'"+type+"');";
                mysql.fetchData(function(err,results){
                    if(err)
                    {
                        res.send({"status":"401","data":null});
                    }
                    else
                    {
                        console.log(results);
                        var verification_code = Math.floor(Math.random()*10000);
                        if(verification_code < 1000)
                            verification_code += 1000;
                        mail.sendEmail(req.body.email,'Registration verfication','Your verification code is:'+verification_code);
                        req.body["verification_code"] = verification_code;
                        res.send({"status":"200","data":req.body});
                    }
                },query1);
            }
            else
                res.send({"status":"403","data":null});
        }
    },query);
});

router.post('/verify',function (req,res) {
    var query = "update user set verified=true where email='"+req.body.email+"'";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": err});
        }
        else {
            mail.sendEmail(req.body.email,'Verification Completed','Congratulations!! \n Your account is now verified');
            res.send({"status":"200"});
        }
    },query);
});

module.exports = router;