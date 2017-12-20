var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var mail = require('./mail');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


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
                var query1 = "select book_id,return_date from checkout where user_id='"+req.body.email+"'";
                mysql.fetchData(function(err,results1) {
                    if (err) {
                        console.log('in error');
                        res.send({"status": "401", "data": err});
                    }
                    else {
                        results[0].books = results1;
                        res.send({"status":"200","data":results[0]})
                    }
                },query1);
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
            res.send({"status":"401","data":err});
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
                        res.send({"status":"401","data":err});
                    }
                    else
                    {
                        console.log(results);
                        var verification_code = Math.floor(Math.random()*10000);
                        if(verification_code < 1000)
                            verification_code += 1000;
                        var res_data = mail.sendEmail(req.body.email,'Registration verfication','Your verification code is:'+verification_code);
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
            var res_data = mail.sendEmail(req.body.email,'Verification Completed','Congratulations!! \n Your account is now verified');
            res.send({"status":"200","data":res_data});
        }
    },query);
});

router.post('/setDate',function (req,res) {
    var date = new Date(req.body.date);
    date.setDate(date.getDate()+5);
    var query = "select * from waitlist where available is not null";
    mysql.fetchData(function (err,results) {
        for(var i = 0;i<results.length;i++){
            var available = new Date(results[i].available.toString());
            console.log("available"+ available);
            if(available < new Date(req.body.date))
            {
                mysql.fetchData(function (err,r) {},"delete from waitlist where book_id="+results[i].book_id+" and user_id='"+results[i].user_id+"'");
            }
        }
    },query);

    query = "select * from checkout";
    mysql.fetchData(function (err,results) {
        for(var i = 0;i<results.length;i++){
            if(new Date(results[i].return_date) < date){
                var days = Math.round((date.getTime() - new Date(results[i].return_date).getTime())/(1000*60*60*24));
                mail.sendEmail(results[0].user_id,"Book due","Hi there,Your book is due in "+days+" days");
            }
        }
    },query);
    res.send({"status":200,data:null});
});

module.exports = router;