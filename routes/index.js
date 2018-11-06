var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
/*登陆密码 fy123*/


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: '输入验证密码进入系统' ,password:'none'});
});
router.post('/check', function(req, res, next) {
    var check=req.body.check;
    if(check==='fy123'){
        console.log(req.body.check);
        res.render('index', { title: '接口文档' });
    }else {
        res.render('login', { title: '输入验证密码进入系统',password:'wrong' });
    }
});
module.exports = router;
