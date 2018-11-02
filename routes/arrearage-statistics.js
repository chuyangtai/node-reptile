//欠费统计（年度）
var express = require('express');
var router = express.Router();
const superagent = require('superagent');
const cheerio = require('cheerio');
const request=require('request');
var getLoginCookie = require('../public/javascripts/getLoginCookie');
const url= require('../public/javascripts/config').url;
var session = require('express-session');
var mysql_common = require('./common/mysql-common');
var browserMsg={
    "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
    'Content-Type':'application/x-www-form-urlencoded'
};
//http://10.8.78.12:8080/ReportChat/ArrearsInfo
//http://10.8.78.12:8080/Report/ArrearsAnalysis
//设置
function getData(cookie) {
    return new Promise(function(resolve, reject) {
        //传入cookie
        superagent.post(url+'/ReportChat/AreaTreatment').set("Cookie",cookie).set(browserMsg).send({'cmd':'alsumPay'}).end(function(err,res) {
            if(err){
                console.log("error exception occured !");
                return next(error);
            }else {
                console.log(res.text)
                var att=JSON.parse(res.text).Info;
                superagent.post(url+'/ReportChat/AreaTreatment').set("Cookie",cookie).set(browserMsg).send({'cmd':'seeDoctorNotPay'}).end(function(err,res) {
                    var att2=JSON.parse(res.text).Info;
                    superagent.post(url+'/ReportChat/AreaTreatment').set("Cookie",cookie).set(browserMsg).send({'cmd':'arrearsinfo'}).end(function(err,res) {
                        var atts=JSON.parse(JSON.parse(JSON.parse(res.text).Info).week.datas);
                        var att3=0;
                        atts.forEach(function (listItem,i) {
                            listItem.DataList.forEach(function (item,i) {
                                att3+=Number(item.Data);
                            })

                        });
                        var d=new Date();
                        var param={
                            'startDate':(d.getFullYear()-1)+'-'+(d.getMonth()+1)+'-'+d.getDate(),
                            'endDate':d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(),
                        };
                        superagent.post(url+'/Report/ArrearsAnalysis').set("Cookie",cookie).set(browserMsg).send(param).end(function(err,res) {
                            var att4=JSON.parse(JSON.parse(res.text).Info);
                            resolve({
                                'totle': att,
                                'totleArrearage':Number(att2).toFixed(2),
                                'weekArrearage':Number(att3).toFixed(2),
                                'yearArrearage':att4
                            });
                        })

                    })
                })
            }
        });
    });
}

router.get("/",function(req,resp){
    if(req.session && req.session.cookieData){
        getData(req.session.cookieData).then(function (data) {
            let addParam = ['arrearageStatistics', JSON.stringify(data)];
            mysql_common.addData(addParam);
            resp.send(data)
        });
    }else {
        getLoginCookie('黄军平', 'HJPmain').then(function (cookie) {
            req.session.cookieData=cookie;
            getData(cookie).then(function (data) {
                let addParam = ['arrearageStatistics', JSON.stringify(data)];
                mysql_common.addData(addParam);
                resp.send(data)
            });
        });
    }
});


module.exports = router;
