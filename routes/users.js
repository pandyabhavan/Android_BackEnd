var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login',function (req,res) {
    var db = req.db;
    const users = db.get('users');
    users.find({email:req.body.email,password:req.body.password},{},function (err,docs) {
        if(docs.length != 0)
        {
            req.session.user = req.body.email;
            users.update({_id:docs[0]._id},{$set:{last_login:new Date()}},function (err,docs) {
                users.find({}, {},function (e,docs) {
                    res.sendStatus(200);
                });
            });
        }
        else
        {
            res.render('login',{msg:"Invalid Login",visible:"inline"});
        }
    });
});


module.exports = router;
