var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var mail = require('./mail');

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

router.get('/search/:query',function (req,res) {
    var query = "select * from book where publisher like '%"+req.params.query+"%' or keywords like '%"+req.params.query+"%' or author like '%"+req.params.query+"%' or title like '%"+req.params.query+"%' and copies > 0 limit 10";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            res.send({"status":"200","data":results});
        }
    },query);
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
    var q = "select count(*) as count from checkout where book_id="+req.params.id+"";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            if(results[0].count != 0){
                res.send({"status": "403", "data": null});
            }
            else {
                var query1 = "delete from waitlist where book_id="+req.params.id+"";
                mysql.fetchData(function(err,results) {
                    if (err) {
                        res.send({"status": "401", "data": null});
                    }
                    else {
                        var query = "delete from book where id="+req.params.id+"";
                        mysql.fetchData(function(err,results) {
                            if (err) {
                                res.send({"status": "401", "data": null});
                            }
                            else {
                                res.send({"status":"200","data":results});
                            }
                        },query);
                    }
                },query1);
            }
        }
    },q);
});

router.post('/checkout',function (req,res) {
    var q = "select checkout_date from checkout where user_id='"+req.body.email+"'";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            console.log(JSON.stringify(results));
            if(results.length >= 9)
                res.send({"status":"403","data":results});
            else
            {
                var todayCount = 0;
                for(var i=0;i<results.length;i++){
                    if(new Date().toLocaleDateString() === (new Date(results[i].checkout_date).toLocaleDateString())){
                        ++todayCount;
                    }
                }
                console.log(todayCount);
                if(todayCount >= 3){
                    res.send({"status":"405","data":results});
                }
                var query1 = "update book set copies=(copies-1) where id="+req.body.id+"";
                mysql.fetchData(function(err,results) {
                    if (err) {
                        res.send({"status": "401", "data": null});
                    }
                    else {
                        var now = new Date();
                        now.setDate(now.getDate()+30);
                        var query2 = "insert into checkout values("+req.body.id+",'"+req.body.email+"','"+now+"','"+new Date()+"',0)";
                        mysql.fetchData(function(err,results) {
                            if (err) {
                                res.send({"status": "401", "data": null});
                            }
                            else {
                                var query3 = "select * from book where id = "+req.body.id+"";
                                mysql.fetchData(function (err,results) {
                                    if(results){
                                        mail.sendEmail(req.body.email,"Book Checkout","You successfully checked out book with below Details."
                                        +"\nTitle: "+results[0].title
                                        +"\nAuthor: "+results[0].author
                                        +"\nTransaction Date: "+new Date()
                                        +"\nReturn Date: "+now);
                                        res.send({"status":"200","data":results});
                                    }
                                },query3);
                            }
                        },query2);
                    }
                },query1);
            }
        }
    },q);
});

router.post('/return',function (req,res) {
    var query1 = "update book set copies=(copies+1) where id="+req.body.id+"";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            var now = new Date();
            now.setDate(now.getDate()+30);
            var query2 = "delete from checkout where book_id = "+req.body.id+" and user_id = '"+req.body.email+"'";
            mysql.fetchData(function(err,results) {
                if (err) {
                    res.send({"status": "401", "data": null});
                }
                else {
                    mail.sendEmail(req.body.email,"Book Returned","Your book returned successfully.");
                    res.send({"status":"200","data":results});
                }
            },query2);
        }
    },query1);
});


router.post('/joinWaitList',function (req,res) {
    var query1 = "insert into waitlist values("+req.body.id+",'"+req.body.email+"')";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            res.send({"status":"200","data":results});
        }
    },query1);
});

router.post('/renew',function (req,res) {
    var query1 = "select * from waitlist where book_id = "+req.body.id+"";
    mysql.fetchData(function(err,results) {
        if (err) {
            res.send({"status": "401", "data": null});
        }
        else {
            if (results.length != 0)
                res.send({"status": "405", "data": null});
            else {
                var query = "select * from checkout where book_id = " + req.body.id + " and user_id = '" + req.body.email + "'";
                mysql.fetchData(function (err, results) {
                    if (err) {
                        res.send({"status": "401", "data": err});
                    }
                    else {
                        if (results.length > 0 && results[0].renew < 2) {
                            var now = new Date(results[0].return_date);
                            now.setDate(now.getDate() + 30);
                            var q = "update checkout set return_date='" + now + "',renew = (renew+1) where book_id = " + req.body.id + " and user_id = '" + req.body.email + "'";
                            mysql.fetchData(function (err, results) {
                                if (err) {
                                    res.send({"status": "401", "data": null});
                                }
                                else {
                                    res.send({"status": "200", "data": results});
                                }
                            }, q);
                        }
                        else {
                            res.send({"status": "403", "data": null});
                        }
                    }
                }, query);
            }
        }
    },query1);
});

module.exports = router;