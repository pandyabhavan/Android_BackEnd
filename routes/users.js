var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login',function (req,res) {
    if(req.body.email == "bhavan" && req.body.password == "b")
        res.status(200);
    else
        res.status(401);
        res.send();
});


module.exports = router;
