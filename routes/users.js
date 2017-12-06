var express = require('express');
var router = express.Router();
var users = [];
users = require('../users.json');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login',function (req,res) {
    console.log(JSON.stringify(users));
    for(var i=0;i<users.length;i++) {
        console.log(JSON.stringify(users[i]));

        if(req.body.email === users[i].email && req.body.password === users[i].password){
            res.send({"status":"200","data":users[i]})
        }
        else
            res.send({"status":"401","data":null})
    }
});

router.post('/register',function (req,res) {
    console.log(req.body);
    users.push(req.body);
    res.send({"status":"200","data":req.body});
});

module.exports = router;
