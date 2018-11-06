// 'use strict';

+function () {
    'use strict';

    var weekData = [10, 52, 200, 334, 390, 330, 220];
    var week = ['10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7'];
    function Platforms(patients, referrals) {
        this.charts = [];
        this.options = [];
        this.doms = [{ id: 'register', sid: 'register', type: 'line', name: '预约挂号统计', yName: '人数' }, { id: 'ageCount', sid: 'register', type: 'bar', name: '预约挂号人群年龄段分析-统计', yName: '万人' }, { id: 'agePe', sid: 'register', type: 'pie', name: '预约挂号人群年龄段分析-占比', yName: '' }, { id: 'visitCount', sid: 'register', type: 'bar', name: '预约挂号按时就诊情况分析-统计', yName: '人数' }, { id: 'visitPe', sid: 'register', type: 'pie', name: '预约挂号按时就诊情况分析-占比', yName: '' }, { id: 'check', sid: 'register', type: 'line', name: '检查检验调阅次数统计', yName: '次数' }];
        this.week = week;
        this.weekData = weekData;

        this.barTab = { bar: '统计', pie: '占比'

            //预约挂号统计
        };this.register = {};

        //预约挂号人群年龄段分析
        //预约挂号按时就诊情况分析

        // 信用就医签约统计
        this.sign = {};

        // 家庭医生签约统计
        this.family = {};
    }

    Platforms.prototype.setChartOption = function (opt) {
        var _custom = {};
        var _base = {
            color: ['#3398DB'],
            grid: {
                left: 0,
                right: '5%',
                top: '20%',
                bottom: 0,
                containLabel: true
            },
            timeline: {
                show: false,
                axisType: 'category',
                autoPlay: false,
                data: []
            }
        };
        switch (opt.type) {
            case 'bar':
                _custom = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
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
                    yAxis: {
                        type: 'value',
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
                    series: {
                        type: 'bar',
                        barWidth: '60%',
                        itemStyle: {
                            color: function color(params) {
                                var colorList = ['#EF8D36', '#FCCD57', '#49B35B', '#0C8EE9', '#BDD259', '#42BAD2', '#BDD259', '#42BAD2'];
                                return colorList[params.dataIndex];
                            }
                        }
                    }
                };
                break;
            case 'line':
                _custom = {
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
                    yAxis: [{
                        type: 'value',
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
                    }],
                    series: {
                        type: 'line',
                        itemStyle: {
                            borderColor: '#0078e3'
                        },
                        lineStyle: {
                            color: '#83A5F9'
                        },
                        areaStyle: {
                            color: 'rgba(131,165,249, 0.25)'
                        }
                    }
                };
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
                    series: {
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
                    color: ['#EF8D36', '#FCCD57', '#49B35B', '#0C8EE9', '#BDD259', '#42BAD2']
                };
                break;
        }
        this.options.push({
            baseOption: _.extend({}, _base, _custom),
            options: []
        });
    };

    Platforms.prototype.updateChart = function (id, timeline, chartIndex) {
        var _options = [];
        var _data = [];

        if (id == 'register') {
            _data = timeline.number.source;
            this.options[chartIndex].baseOption.xAxis.data = timeline.number.xAxis;
        }

        if (id == 'ageCount') {
            _data = timeline.ageData.source;
            this.options[chartIndex].baseOption.xAxis.data = timeline.ageData.xAxis;
        }

        if (id == 'agePe') {
            _data = timeline.ageData.pie;
        }

        if (id == 'visitCount') {
            _data = timeline.rateData.source;
            this.options[chartIndex].baseOption.xAxis.data = timeline.rateData.xAxis;
        }

        if (id == 'visitPe') {
            _data = timeline.rateData.pie;
        }

        if (id == 'check') {
            _data = this.weekData;
            this.options[chartIndex].baseOption.xAxis.data = [10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7];
        }

        _options.push({
            series: [{ data: _data }]
        });

        _.merge(this.options[chartIndex], {
            baseOption: {},
            options: _options
        });

        this.charts[chartIndex].setOption(this.options[chartIndex]);
    };

    Platforms.prototype.setChartInit = function () {
        var _this = this;

        this.doms.forEach(function (item, index) {
            var chart = echarts.init(document.getElementById(item.id));

            _this.setChartOption(item);
            chart.setOption(_this.options[index]);

            _this.charts.push(chart);
        });

        window.onresize = function () {
            _this.charts.forEach(function (o) {
                o.resize();
            });
        };
    };

    Platforms.prototype.barTabTemplate = function () {
        var pf = this;
        return {
            props: ['order'],
            template: '<div class="bar-tab" ref="ttt">\n                        <span v-for="(item,key,index) in list" :class="{active:index === number}" @click="change(index,key)">{{item}}</span>\n                    </div>',
            data: function data() {
                return {
                    list: pf.barTab,
                    number: 0
                };
            },

            methods: {
                change: function change(index, key) {
                    this.number = index;
                    pf.setChartData(this.order, index);
                }
            }
        };
    };
    Platforms.prototype.setChartData = function (order, index) {
        $('.bar').eq(index == 0 ? order + 1 : order).hide();
        $('.bar').eq(order + index).show();
        this.charts[order + index].setOption(this.options[order + index]);
        this.charts[order + index].resize();
    };

    window.Platforms = Platforms;
}();

+function () {
    'use strict';

    Platforms.prototype.getRegister = function (callback) {
        var pf = this;
        return new Promise(function (resolve, reject) {
            axios.get('/registerPerYear').then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        });
    };

    Platforms.prototype.signStatistics = function (callback) {
        var pf = this;
        axios.get('/signStatistics').then(function (response) {
            pf.sign = response.data.creditSign;
            pf.family = response.data.familySign;
        }).catch(function (error) {
            console.log(error);
        });
    };

    Platforms.prototype.getData = function () {
        var _this2 = this;

        this.setChartInit();
        this.doms.forEach(function (o, i) {
            _this2.charts[i].showLoading();
        });
        this.getRegister().then(function (response) {
            _this2.doms.forEach(function (o, i) {
                _this2.updateChart(o.id, response, i);
                _this2.charts[i].hideLoading();
            });
        });
        this.signStatistics();
    };

    // Platforms.prototype.render = function () {
    //     this.setChartInit();
    //     this.signStatistics();
    // }
}();

+function () {
    'use strict';

    var pf = new Platforms();

    // vue
    var vm = new Vue({
        el: '#user-page',
        data: pf,
        components: {
            'bar-tab': pf.barTabTemplate()
        },
        // mounted: function () {
        //     this.$nextTick(function () {
        //         console.log('vm mounted');
        //         pf.render();
        //     });
        // }
        created: function created() {
            this.$nextTick(function () {
                pf.getData();
            });
        }
    });
}();