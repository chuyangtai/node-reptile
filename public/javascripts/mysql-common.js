
var mysql = require('mysql');
//创建连接
// var connection = mysql.createConnection({
// host     : '115.236.176.108',
// user     : 'yyhj',
// password : 'SDTa123vrakdf',
// database : 'yyhj'
// });
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '115.236.176.108',
    user: 'yyhj',
    password: 'SDTa123vrakdf',
    database: 'yyhj',
    port: '10000'
});
function queryData(sql, params, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, params, function (qerr, vals, fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr, vals, fields);
            });
        }
    });

}
function addData( addParam) {
    let sql = "insert into static_data  (datakey,datavalue) values (?,?)";
    queryData(sql, addParam, function (err, vals, feild) {
        if (err) {
            console.log(err);
        }
    });
}
module.exports = {
    queryData: queryData,
    addData: addData
};