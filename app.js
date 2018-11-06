var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql_common = require('./routes/common/mysql-common');
var indexRouter = require('./routes/index');
var dataDispaly = require('./routes/data-display');
var dataLists = require('./routes/jzxx-list');
var payDispaly = require('./routes/pay-display');
var registerPerYear = require('./routes/register-per-year');
var signStatistics = require('./routes/sign-statistics');
var arrearageStatistics = require('./routes/arrearage-statistics');
var paymentStatistics = require('./routes/payment-statistics');
var adminDaily = require('./routes/admin-daily');
var healthRecords = require('./routes/health-records');

var app = express();
//跨域问题
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//30分钟保持session
app.use(session(
  { secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 1800000 } }
));
//console.log(req.baseUrl); // '/admin'
//console.log(req.path); // '/new'
//数据库有数据 则抽取数据库数据
app.use('/', function (req, res, next) {
   let methodName = req.originalUrl; // '/admin/new'
   let params = req.query;
   var sql = 'select t.datavalue,t.intime from static_data t  where  t.datakey=? and TO_DAYS(NOW()) - TO_DAYS(intime) <=? ORDER BY t.intime desc limit 1';
  if(params.appid && params.appid == 'redata'){
      next();
  }
  else if (methodName && methodName == '/registerPerYear') {
    let queryParam = ['registerPerYear', '30'];
    mysql_common.queryData(sql, queryParam, function (err, vals, feild) {
      if(err){
        console.log(err);
        next();
      }
      if (vals.length>0&&vals[0].datavalue) {
        res.send(vals[0].datavalue);
      } else {
        next();
      }
    });
  } else if (methodName && methodName == '/signStatistics') {
    let queryParam = ['signStatistics', '30'];
    mysql_common.queryData(sql, queryParam, function (err, vals, feild) {
      if(err){
        console.log(err);
        next();
      }
      if (vals.length>0&&vals[0].datavalue) {
        res.send(vals[0].datavalue);
      } else {
        next();
      }
    });
  } else if (methodName && methodName == '/arrearageStatistics') {
    let queryParam = ['arrearageStatistics', '30'];
    mysql_common.queryData(sql, queryParam, function (err, vals, feild) {
      if(err){
        console.log(err);
        next();
      }
      if (vals.length>0&&vals[0].datavalue) {
        res.send(vals[0].datavalue);
      } else {
        next();
      }
    });
  } else if (methodName && methodName == '/paymentStatistics') {
    let queryParam = ['paymentStatistics', '30'];
    mysql_common.queryData(sql, queryParam, function (err, vals, feild) {
      if(err){
        console.log(err);
        next();
      }
      if (vals.length>0&&vals[0].datavalue) {
        res.send(vals[0].datavalue);
      } else {
        next();
      }
    });
  } else if (methodName && methodName == '/adminDaily') {
    let queryParam = ['adminDaily', '1'];
    mysql_common.queryData(sql, queryParam, function (err, vals, feild) {
      if(err){
        console.log(err);
        next();
      }
      if (vals.length>0&&vals[0].datavalue) {
        res.send(vals[0].datavalue);
      } else {
        next();
      }
    });
  } else if (methodName && methodName == '/healthRecords') {
    let queryParam = ['healthRecords', '30'];
    mysql_common.queryData(sql, queryParam, function (err, vals, feild) {
      if(err){
        console.log(err);
        next();
      }
      if (vals.length>0&&vals[0].datavalue) {
        res.send(vals[0].datavalue);
      } else {
        next();
      }
    });
  } else {
    next();
  }
});
app.use('/', indexRouter);
app.use('/check', indexRouter);
app.use('/dataDispaly', dataDispaly);
app.use('/dataLists', dataLists);
app.use('/payDispaly', payDispaly);
app.use('/registerPerYear', registerPerYear);
app.use('/signStatistics', signStatistics);
app.use('/arrearageStatistics', arrearageStatistics);
app.use('/paymentStatistics', paymentStatistics);
app.use('/adminDaily', adminDaily);
app.use('/healthRecords', healthRecords);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    console.log('Caught exception: ' + err.stack);
});
module.exports = app;
