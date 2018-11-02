+function(){
    'use strict';
    // 日就诊信息
    let visit = { ydzf: 0, sxzz: 0, rydj: 0, yygh: 0, mzjz: 0, jkdady: 0 };

    // 支付
    let pays = { zfb: 0, weixin: 0, yinlian: 0, weimai: 0, smkzh: 0 };

    function Platforms (patients, referrals) {
        // 日就诊信息
        this.visit = visit;

        // 支付
        this.pays = pays;

        // 实时就诊
        this.patients = [];
        this.idx = -1;
        this.removeIndex = 0;
    }

    // 数字格式化
    Platforms.prototype.numFormat = function (num, len) {
        len = len || 2;

        let dst = [];
        let orig = String(num),
            start = len - orig.length;

        if (start < 0) return orig;

        for (var i = 0; i < len; i++) {
            if (i < start) {
                dst.push(0);
                continue;
            }
            dst.push(orig.charAt(i - start));
        }
        return dst.join('')
    };

    // 日就诊信息
    Platforms.prototype.visitTemplate = function(){
        let pf = this;
        let li = {
            props: ['vis'],
            template:`<li class="flex items-center">
                            <img :src="url">
                            <div>
                                <div class="count up">
                                    <transition-group name="vis-fade" tag="span" mode="out-in">
                                        <i v-for="(item, index) in list" :key="'vis-key'+index+item" class="vis-fade-item vis-item" :class="'vis-fade-item'+index">
                                            {{item}}
                                        </i>
                                    </transition-group>
                                </div>
                                <div class="type">{{vis.value}}</div>
                            </div>
                        </li>`,
            computed: {
                url: function () {
                    return 'content/ic_'+this.vis.key+'@2x.png';
                },
                list: function () {
                    return pf.numFormat(pf.visit[this.vis.key], 4).split('');
                }
            },
        };

        return {
            template: `<ul class="visit flex wrap"><vis  v-for="(value,key) in list" :vis="{key:key,value:value}" :key="key"><vis></ul>`,
            data () {
                return {
                    list: { ydzf: '移动支付', sxzz: '双向转诊', rydj: '入院登记', yygh: '预约挂号', mzjz: '门诊就诊', jkdady: '健康档案调阅' }
                };
            },
            components: {
                vis: li
            }
        }
    }

    // referral 是否转诊
    Platforms.prototype.addPatients = function (list, referral) {
        if (list == null || list.length == 0) return;

        list.forEach((o) => {
            this.addPatient(o, referral);
        });
    };
    Platforms.prototype.addPatient = function (item, referral, remove) {
        let pf = this;

        let ctime = new Date().getTime();
        let x = ctime - this.startAt;
        let sIndex = referral ? 3 : 2;
        let rIndex = referral ? 'removeRIndex' : 'removeIndex';
        let payType = [,'门诊急诊','移动支付','入院人次,','预约挂号','双向转诊']
        if (!referral) {
            let _unshift = () => {
                this.patients.unshift({
                    type:payType[item.type],
                    patientName: item.name,
                    // sex: item.sex == '0' ? '男' : '女',
                    dept: item.dept,
                    hospitalName: item.type == 5 ? item.Dept_name : item.visit_organization_name,
                    visitTime: item.warehousing_dt,
                    pay:item.type == 5 ? '' : item.Dept_name,
                    index: this.idx++
                });
            };
            if (this.patients.length == 2) {
                this.patients.splice(1, 1);
                _unshift();
            }
            else {
                _unshift();
            }
        }
    };
    Platforms.prototype.findHospital = function (name) {
        return this.hospitals.find((item) => {
            if (item.name == name) {
                item.count++;
                return true;
            }
        });
    };

    // 实时就诊
    Platforms.prototype.patientsTemplate = function () {
        let pf = this;
        return {
            template: `<div class="patients">
                            <transition-group name="patients" tag="ul">
                                <li v-for="(item, index) in list" :key="\'patient-key\'+item.index">
                                    <p class="flex justify-between">
                                        <span class="blue">{{item.type}}</span>
                                        <span>{{item.visitTime}}</span>
                                    </p>
                                    <p>{{item.patientName}}在 {{item.hospitalName}} 通过{{item.pay}}</p>
                                </li>
                            </transition-group>
                        </div>`,
            data () {
                return {
                    list: pf.patients
                }
            }
        }
    };

    // 支付
    Platforms.prototype.paysTemplate = function () {
        let pf = this;
        let li = {
            props: ['pay'],
            template:`<li class="flex flex-basis">
                                <img :src="url">
                                <div>
                                    <div class="flex justify-between items-end">
                                        <span>{{pay.value}}</span>
                                        <div class="flex items-end">
                                            <div class="count">
                                                <transition-group name="vis-fade" tag="span" mode="out-in">
                                                    <i v-for="(item, index) in list" :key="'vis-key'+index+item" class="vis-fade-item vis-item" :class="'vis-fade-item'+index">
                                                        {{item}}
                                                    </i>
                                                </transition-group>
                                            </div>
                                            <span>笔</span>
                                        </div>
                                    </div>
                                    <div class="line-bar" :class="classObject"><i :style="styleObject"></i></div>
                                </div>
                            </li>`,
            computed: {
                styleObject:function(){
                    let pe = pf.pays[this.pay.key] / 9999 * 100;
                    return{
                        width: pe > 100 ? 100 : pe + '%'
                    }
                },
                classObject:function(){
                    return this.pay.key;
                },
                url:function(){
                    return 'content/ic_'+this.pay.key+'@2x.png'
                },
                list: function () {
                    return pf.numFormat(pf.pays[this.pay.key], 4).split('');
                }
            }
        };

        return {
            template: `<ul class="pay"><pay v-for="(value,key) in list" :pay="{key:key,value:value}" :key="key"></pay></ul>`,
            data () {
                return {
                    list: { zfb: '支付宝', weixin: '微信', yinlian: '银联', weimai: '第三方', smkzh: '市民卡账户' }
                };
            },
            components: {
                pay: li
            }
        }
    };

    window.Platforms = Platforms;
}();

+function(){
    'use strict';

    Platforms.prototype.setVisit = function () {
        let pf = this;
        return new Promise(function (resolve, reject) {
            axios.get('/dataDispaly')
            .then(function (response) {
                pf.visit = response.data
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        });
    };

    // 实时就诊
    Platforms.prototype.setPatients = function () {
        var pIndex, pItv;

        var data;

        var _getPatitent = () => {
            this.getPatients((list) => {
                pIndex = 0; // 新数据 直接替换当前
                data = list;

                if (this.patients.length === 0) {
                    pIndex = data.length > 2 ? 2 : data.length;
                    this.addPatients(data.slice(0, pIndex));
                }
                if (!pItv) {
                    pItv = setInterval(() => {
                        // 暂停数据填充
                        if (pIndex === data.length) {
                            clearInterval(pItv);
                            pItv = null;
                            // 继续播放剩余数据
                            if (pIndex) {
                                this.patients.splice(10, 1);
                            }
                            return;
                        }
                        this.addPatient(data[pIndex], false, true);
                        pIndex++;
                    }, 2000);
                }

            });
        };

        // 初始化数据
        _getPatitent();
        // 定时获取数据
        setInterval(_getPatitent, 60000);
    };

    // 获取实时就诊数据
    Platforms.prototype.getPatients = function (callback) {
        axios.get('/dataLists')
          .then(function (response) {
            callback (response.data);
          })
          .catch(function (error) {
            console.log(error);
          });

    };

    Platforms.prototype.setPays = function () {
        let pf = this;
        return new Promise(function (resolve, reject) {
            axios.get('/payDispaly')
            .then(function (response) {
                pf.pays = response.data
                resolve(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        });
    };

    Platforms.prototype.dateVisit = function(){
        let pf = this;
        pf.setVisit().then(response => {
            setTimeout(() => {
                pf.dateVisit();
            }, 5000);
        }).catch(response => {
            setTimeout(() => {
                pf.dateVisit();
            }, 5000);
        });
    }

    Platforms.prototype.datePays = function(){
        let pf = this;
        pf.setPays().then(response => {
            setTimeout(() => {
                pf.datePays();
            }, 5000);
        }).catch(response => {
            setTimeout(() => {
                pf.dateVisit();
            }, 5000);
        });
    }

    Platforms.prototype.render = function () {
        let pf = this;

        pf.dateVisit();
        pf.setPatients();
        pf.datePays();
    }
}();

+function () {
    'use strict';

    let pf = new Platforms();

    // vue
    let vm = new Vue({
        el: '#index-page',
        data: pf,
        components: {
            'visit': pf.visitTemplate(),
            'patients': pf.patientsTemplate(),
            'pays': pf.paysTemplate()
        },
        mounted: function () {
            this.$nextTick(function () {
                console.log('vm mounted');
                pf.render();
            });
        }
    });
}();