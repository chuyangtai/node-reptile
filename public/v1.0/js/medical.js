+function(){
    let weekData = [10, 52, 200, 334, 390, 330, 220];
    function Platforms (patients, referrals) {
        this.charts = [];
        this.options = [];
        this.doms = [
            { id: 'monthBar', sid: 'arrearage', type: 'line', name: '月欠费统计', yName:'元' },
            { id: 'distributionBar', sid: 'arrearage', type: 'bar', name: '欠费分布分析-统计', yName:'元' },
            { id: 'distributionPe', sid: 'arrearage', type: 'pie', name: '欠费分布分析-占比', yName:'' },
            { id: 'YPZEData', type: 'bar', sid: 'medical', name: '药占比', yName:'' },
            // { id: 'jyb', type: 'bar', sid: 'arrearage', sid: 'arrearage', name: '基药比' },
            // { id: 'syb', type: 'bar', sid: 'arrearage', name: '输液比' },
            // { id: 'kssb', type: 'bar', sid: 'arrearage', name: '抗生素比' }
        ];
        this.weekData = weekData;

        this.barTab = {bar:'统计', pie:'占比'}
        this.typeName = 'ageCount';
        this.payCount = 'payCount';
        this.daily = 'daily';

        // 欠费统计
        this.arrearage = {};

        //支付统计
        this.payChannel = {}
        this.hosChannel = []

        // 医政服务日报
        this.medicalNum = [];
        this.medicalFee = [];
        this.medicalRatio = {};
        this.monthlyReport = [];

        // 健康档案调阅统计
        this.health = {}
    }

    Platforms.prototype.setChartOption = function(opt){
        let _custom = {};
        let _base = {
            color: ['#3398DB'],
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: 0,
                containLabel: true
            },
            timeline: {
                show: false,
                axisType: 'category',
                autoPlay: false,
                data: [],
            }
        }
        switch (opt.type) {
            case 'bar':
                _custom = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        axisLabel: {
                            rotate: 30,
                            fontSize: 10
                        },
                        data: []
                    },
                    yAxis : {
                        type : 'value',
                        name: opt.yName,
                        nameGap: 8,
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E1E1E1'
                            }
                        }
                    },
                    series : {
                        type:'bar',
                        barWidth: '60%',
                        itemStyle: {
                            color: function(params) {
                                var colorList = ['#EF8D36','#FCCD57','#49B35B','#0C8EE9', '#BDD259','#42BAD2', '#BDD259','#42BAD2' ];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            break;
            case 'line':
                _custom = {
                    xAxis : {
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        axisLabel: {
                            rotate: 30,
                            fontSize: 10
                        },
                        data: []
                    },
                    yAxis : [
                        {
                            type : 'value',
                            name: opt.yName,
                            nameGap: 8,
                            axisLine: {
                                lineStyle: {
                                    color: '#666'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#E1E1E1'
                                }
                            }
                        }
                    ],
                    series: {
                        type: 'line',
                        itemStyle:{
                            borderColor: '#0078e3'
                        },
                        lineStyle:{
                            color: '#83A5F9'
                        },
                        areaStyle: {
                            color: 'rgba(131,165,249, 0.25)'
                        }
                    }
                }
            break;
            case 'pie':
            _custom = {
                tooltip: {
                    formatter: '{b}'
                },
                timeline: {
                    show: false,
                    axisType: 'category',
                    autoPlay: true,
                    data: new Array(7)
                },
                series:{
                    name: opt.name,
                    type: opt.type,
                    center: ['50%', '60%'],
                    radius: ['30%', '60%'],
                    label: {
                        normal: {
                            formatter: '{per|{d}%} {abg|}\n{hr|}\n  {b|{b}}    ',
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    color: '#666',
                                    lineHeight: 22
                                },
                                per: {
                                    color: '#333',
                                    lineHeight: 22,
                                    align: 'center'
                                }
                            }
                        }
                    }
                },
                color: ['#EF8D36','#FCCD57','#49B35B','#0C8EE9', '#BDD259','#42BAD2' ]
            };
            break;
        }
        this.options.push({
            baseOption: _.extend({}, _base, _custom),
            options: []
        });
    };

    Platforms.prototype.updateChart = function (id, timeline, chartIndex) {
        let _options = [];
        let _data = [];
        if(id == 'monthBar'){
            _data = timeline.yearArrearage.qfqs.source;
            this.options[chartIndex].baseOption.xAxis.data = timeline.yearArrearage.qfqs.xAxis;
        }
        if(id == 'distributionBar'){
            _data = timeline.yearArrearage.qffb.source;
            this.options[chartIndex].baseOption.xAxis.data = timeline.yearArrearage.qffb.xAxis;
        }
        if(id == 'distributionPe'){
            _data = timeline.yearArrearage.qffb.fbpie;
        }
        if(id == 'YPZEData'){
            for(key in timeline.source){
                _data.push(timeline.source[key].YPZEData)
            }
            this.options[chartIndex].baseOption.xAxis.data = timeline.xAxis;
        }
        if(id == 'ZBYWData'){
            for(key in timeline.source){
                _data.push(timeline.source[key].ZBYWData)
            }
            this.options[chartIndex].baseOption.xAxis.data = timeline.xAxis;
        }
        if(id == 'SYCFZRCData'){
            for(key in timeline.source){
                _data.push(timeline.source[key].SYCFZRCData)
            }
            this.options[chartIndex].baseOption.xAxis.data = timeline.xAxis;
        }
        if(id == 'KSSCFZRCData'){
            for(key in timeline.source){
                _data.push(timeline.source[key].KSSCFZRCData)
            }
            this.options[chartIndex].baseOption.xAxis.data = timeline.xAxis;
        }
        _options.push({
            series: [
                { data: _data }
            ]
        });

        _.merge(this.options[chartIndex], {
            baseOption: {},
            options: _options
        });

        this.charts[chartIndex].setOption(this.options[chartIndex]);
    };

    Platforms.prototype.setChartInit = function () {
        this.doms.forEach((item, index) => {
            let chart = echarts.init(document.getElementById(item.id));

            this.setChartOption(item);
            chart.setOption(this.options[index]);

            this.charts.push(chart);
        });

        window.onresize = () => {
            this.charts.forEach((o) => {
                o.resize();
            });
        };
    };

    Platforms.prototype.barTabTemplate = function () {
        let pf = this;
        return {
            props:{
                'order':Number,
                'list':{
                    default: function () {
                        return {bar:'统计', pie:'占比'}
                    }
                },
                'be': String
            },
            template:`<div class="bar-tab" ref="ttt">
                        <span v-for="(item,key,index) in list" :class="{active:index === number}" @click="change(index,key)">{{item}}</span>
                    </div>`,
            data () {
                return {
                    list: this.list,
                    number: 0
                }
            },
            methods:{
                change:function(index, key){
                    this.number= index;
                    if(this.order){
                        pf.setChartData(this.order, index, key)
                    }
                    if(this.be){
                        $('.'+this.be).hide().eq(index).show();
                    }

                }
            }
        }
    };
    Platforms.prototype.setChartData = function(order, index, key){
        if(order == 3){
            this.updateChart(key, this.medicalRatio, order)
        }else{
            $('.bar').eq(index == 0 ? order + 1 : order).hide();
            $('.bar').eq(order+index).show();
            this.charts[order+index].resize();
        }
    }


    window.Platforms = Platforms;
}();

+function(){
    Platforms.prototype.getArrearage = function (callback) {
        var pf = this;
        return new Promise(function (resolve, reject) {
            axios.get('/arrearageStatistics')
            .then(function (response) {
                pf.arrearage = response.data;
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        });
    }

    Platforms.prototype.paymentStatistics = function (callback) {
        var pf = this;
        axios.get('/paymentStatistics')
            .then(function (response) {
                pf.payChannel = response.data.payChannel;
                pf.hosChannel = response.data.hosChannel;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    Platforms.prototype.getMedical = function (callback) {
        var pf = this;
        return new Promise(function (resolve, reject) {
            axios.get('/adminDaily')
            .then(function (response) {
                pf.medicalNum = response.data.dailyReport.medicalNum;
                pf.medicalFee = response.data.dailyReport.medicalFee;
                pf.medicalRatio = response.data.dailyReport.medicalRatio;
                pf.monthlyReport = response.data.monthlyReport;
                resolve(response.data.dailyReport.medicalRatio);
            })
            .catch(function (error) {
                console.log(error);
            });
        });
    }

    Platforms.prototype.healthRecords = function (callback) {
        var pf = this;
        axios.get('/healthRecords')
        .then(function (response) {
            pf.health = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    Platforms.prototype.render = function () {
        this.setChartInit();
        // this.arrearageStatistics();
    }



    Platforms.prototype.getData = function () {
        this.setChartInit();

        this.doms.forEach((o, i) => {
            this.charts[i].showLoading();
        });
        this.getArrearage().then(response => {
            this.doms.forEach((o, i) => {
                if(o.sid == 'arrearage'){
                    this.updateChart(o.id, response, i,);
                    this.charts[i].hideLoading();
                }
            });
        });
        this.getMedical().then(response => {
            this.doms.forEach((o, i) => {
                if(o.sid == 'medical'){
                    this.updateChart(o.id, response, i,);
                    this.charts[i].hideLoading();
                }
            });
        });

        this.paymentStatistics();
        this.getMedical();
        this.healthRecords();
    };
}();

+function () {
    'use strict';

    let pf = new Platforms();

    // vue
    let vm = new Vue({
        el: '#medical-page',
        data: pf,
        components: {
            'bar-tab': pf.barTabTemplate()
        },
        // mounted: function () {
        //     this.$nextTick(function () {
        //         console.log('vm mounted');
        //         pf.render();
        //     });
        // },
        created: function () {
            this.$nextTick(function () {
                pf.getData();
            });
        }
    });
}();
