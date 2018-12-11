//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        shopId: 1,
        supplierId: 1,
        storeName:'',
        value: '',
        maxPlatForm: [], //显示平台最大优惠
        maxMerchant: [],    //显示商家最大优惠
        showCoupon: false,   //显示弹窗
        couponData: {},  //所有优惠券数据
        couponSelect: [],    //弹窗选择优惠券数据
        couponType: 1,   //弹窗数据类型(1平台、2商家)
        codePlatForm: '',    //平台优惠券码
        codeMerchant: '',    //商家优惠券码
        batchNums: '',    //正在使用的优惠券码
        countDotal :0,   //总金额
        payNum:0,    //实际支付金额
        amountCoupon:0,     //优惠总金额
        inputThis:{},
        shortcut: 0,  //快捷支付 1是0不是
        payDisabled:false,
        ConfirmText:'确认使用',
        noPlatFormCoupon:false,   //是否有使用平台优惠券
        noMerchantCoupon:false,   //是否有使用商家优惠券
        noNumPlatForm: true,   //平台优惠券未满住条件
        noNumMerchant: true,   //商家优惠券未满住条件
        oneLogin: 0   //第一次登录 1是0不是
    },

    onLoad: function (options) {
        var _this = this;
        wx.setNavigationBarTitle({
            title: '支付'
        })
        _this.setData({
            shopId: _this.options.shopId,
            supplierId: _this.options.supplierId,
            storeName: _this.options.storename,
            shortcut: parseInt(_this.options.shortcut), 
            oneLogin: _this.options.oneLogin || 0
        });
        if (_this.data.shortcut) {
            return
        }
        var scene = decodeURIComponent(options.scene)
        if (options.scene){
            // 扫码进入支付界面
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: app.globalData.ip + 'customer/code2openid',
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: { code: res.code },
                            success: function (e) {
                                app.globalData.third_session = e.data.data.third_session;
                                console.log(app.globalData.third_session)
                                wx.request({
                                    url: app.globalData.ip + 'weChat/gotoPayByACode',
                                    data: { storeUniqueCode: scene, thirdSession: app.globalData.third_session },
                                    method: 'POST',
                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    success: function (e) {
                                        if (!e.data.errCode) {
                                            wx.hideLoading()
                                            _this.setData({
                                                shopId: e.data.data.info.marketUniqueCode,
                                                supplierId: e.data.data.info.storeUniqueCode,
                                                storeName: e.data.data.info.storeName
                                            });
                                            if (e.data.data.isExist) {
                                                _this.setData({
                                                    shortcut: 1,
                                                    oneLogin: 1
                                                });
                                                return;
                                            } else {
                                                _this.setData({
                                                    shortcut: 0,
                                                    oneLogin: 1
                                                });
                                                wx.setStorageSync('gTicket', e.data.data.gTicket);
                                                // wx.reLaunch({
                                                //     url: '../index/index'
                                                // })
                                            }

                                            wx.request({
                                                url: app.globalData.ip + 'userCoupon/coupon',
                                                data: { gTicket: wx.getStorageSync('gTicket'), shopId: _this.data.shopId, supplierId: _this.data.supplierId },
                                                method: 'POST',
                                                header: {
                                                    'content-type': 'application/x-www-form-urlencoded'
                                                },
                                                success: function (e) {
                                                    if (!e.data.errCode) {
                                                        var merchant = e.data.data.merchant;
                                                        var platForm = e.data.data.platForm;
                                                        if (merchant.length) {
                                                            for (var i = 0; i < merchant.length; i++) {
                                                                merchant[i].validStartTime = util.formatTime(merchant[i].validStartTime);
                                                                merchant[i].validEndTime = util.formatTime(merchant[i].validEndTime);
                                                            }
                                                            setTimeout(function () {
                                                                _this.setData({
                                                                    maxMerchant: e.data.data.merchant[0],
                                                                    codeMerchant: e.data.data.merchant[0].batchNum
                                                                })
                                                            }, 200)
                                                        }
                                                        if (platForm.length) {
                                                            for (var i = 0; i < platForm.length; i++) {
                                                                platForm[i].validStartTime = util.formatTime(platForm[i].validStartTime);
                                                                platForm[i].validEndTime = util.formatTime(platForm[i].validEndTime);
                                                            }
                                                            setTimeout(function () {
                                                                _this.setData({
                                                                    maxPlatForm: e.data.data.platForm[0],
                                                                    codePlatForm: e.data.data.platForm[0].batchNum
                                                                })
                                                            }, 200)
                                                        }
                                                        _this.setData({
                                                            couponData: e.data.data
                                                        })

                                                    } else if (e.data.errCode == 213) {
                                                        app.wxlogin();
                                                    }

                                                }
                                            })

                                        } else if (e.data.errCode == 213) {
                                            app.wxlogin();
                                        }
                                    }
                                })

                            }
                        })
                    }
                }
            });
           


        }else{
            // 正常进入支付界面
            wx.request({
                url: app.globalData.ip + 'userCoupon/coupon',
                data: { gTicket: wx.getStorageSync('gTicket'), shopId: _this.data.shopId, supplierId: _this.data.supplierId },
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (e) {
                    if (!e.data.errCode) {
                        var merchant = e.data.data.merchant;
                        var platForm = e.data.data.platForm;
                        if (merchant.length) {
                            for (var i = 0; i < merchant.length; i++) {
                                merchant[i].validStartTime = util.formatTime(merchant[i].validStartTime);
                                merchant[i].validEndTime = util.formatTime(merchant[i].validEndTime);
                            }
                            setTimeout(function () {
                                _this.setData({
                                    maxMerchant: e.data.data.merchant[0],
                                    codeMerchant: e.data.data.merchant[0].batchNum
                                })
                            }, 200)
                        }
                        if (platForm.length) {
                            for (var i = 0; i < platForm.length; i++) {
                                platForm[i].validStartTime = util.formatTime(platForm[i].validStartTime);
                                platForm[i].validEndTime = util.formatTime(platForm[i].validEndTime);
                            }
                            setTimeout(function () {
                                _this.setData({
                                    maxPlatForm: e.data.data.platForm[0],
                                    codePlatForm: e.data.data.platForm[0].batchNum
                                })
                            }, 200)
                        }
                        _this.setData({
                            couponData: e.data.data
                        })

                    } else if (e.data.errCode == 213) {
                        app.wxlogin();
                    }

                }
            })

        }
        
        
        
    },
    pay:function(e){
        var _this=this;
        var totalPrice = _this.data.countDotal;
        var amountReceive = _this.data.payNum;
        console.log(amountReceive)
        if (parseFloat(amountReceive)<=0){
            wx.showToast({
                title: '请输入金额！',
                icon: 'none',
                duration: 2000,
                success: function (e) {

                }
            })
            return;
        }
        var data 
        if (_this.data.batchNums){
            data = { gTicket: wx.getStorageSync('gTicket'), merchantUniqueCode: _this.data.supplierId, marketUniqueCode: _this.data.shopId, totalPriceStr: totalPrice, amountReceiveStr: amountReceive, batchNums: _this.data.batchNums || '', amountCouponStr: _this.data.amountCoupon };
        }else{
            if (_this.data.shortcut){
                data = { thirdSession: app.globalData.third_session, merchantUniqueCode: _this.data.supplierId, marketUniqueCode: _this.data.shopId, totalPriceStr: totalPrice, amountReceiveStr: amountReceive };
            }else{
                data = { gTicket: wx.getStorageSync('gTicket'), merchantUniqueCode: _this.data.supplierId, marketUniqueCode: _this.data.shopId, totalPriceStr: totalPrice, amountReceiveStr: amountReceive };
            }
            
        }
        if (!_this.data.payDisabled){
            _this.setData({
                payDisabled: true
            })
            wx.request({
                url: app.globalData.ip + 'weChat/pay',
                data: data,
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (e) {
                    _this.setData({
                        payDisabled:false
                    })
                    if (!e.data.errCode) {
                        wx.requestPayment({
                            'timeStamp': e.data.data.timeStamp,
                            'nonceStr': e.data.data.nonceStr,
                            'package': e.data.data.package,
                            'signType': 'MD5',
                            'paySign': e.data.data.paySign,
                            'success': function (res) {
                                wx.showToast({
                                    title: '支付成功',
                                    icon: 'success',
                                    duration: 2000,
                                    success: function (e) {
                                        if (_this.data.oneLogin) {
                                            wx.reLaunch({
                                                url: '../index/index'
                                            })
                                        } else {
                                            wx.navigateBack({ changed: true });
                                        }
                                        
                                    }
                                })

                            },
                            'fail': function (res) {
                                wx.showToast({
                                    title: '支付失败！',
                                    icon: 'none',
                                    duration: 2000,
                                    success: function (e) {
                                        
                                    }
                                })
                            }
                        })
                    } else if (e.data.errCode==225){
                        wx.showToast({
                            title: '已超出单笔支付限额，请降低支付金额后再试',
                            icon: 'none',
                            duration: 2000,
                            success: function (e) {

                            }
                        })
                    } else if (e.data.errCode == 226) {
                        wx.showToast({
                            title: '未获取到支付商场或商户信息',
                            icon: 'none',
                            duration: 2000,
                            success: function (e) {

                            }
                        })
                    }

                }
            })
        }

        

    },
    selectCoupon: function (e) {    //选择优惠券
        var _this = this;
        var index = e.currentTarget.dataset.index;
        var data;
        var couponType = 1;
        if (index == 1) {
            data = _this.data.couponData.platForm;
            couponType = 1;
        } else {
            data = _this.data.couponData.merchant;
            couponType = 2;
        }
        this.setData({
            showCoupon: true,
            couponSelect: data,
            couponType: couponType
        })
    },
    inputBlur:function(e){
        var _this = this;
        if (!e.detail.value){
            return
        }
        // var payNum = _this.data.payNum.toFixed(2);
        var value = parseFloat(e.detail.value);
        // var pos = e.detail.cursor;
        // var left = e.detail.value.slice(0, pos);
        // pos = left.replace(/11/g, '2').length;

        console.log(value.toFixed(2))
        _this.setData({
            // payNum: payNum,
            countDotal: parseFloat(value),
            value: value.toFixed(2) || 0
        })
        _this.inputNum(_this.data.inputThis);

        // return {
        //     cursor: pos,
        //     value: value.toFixed(2).replace(/11/g, '2')
        // }
    },
    inputNum: function (e) {    //输入金额操作
        var _this=this;
        var value=e.detail.value || '';
        var payNum;
        var merchantNum = 0; //商户
        var platFormNum = 0;
        var amountCoupon;
        var batchNums='';
        var noNumP=true;
        var noNumM=true;
        if (!value || value.substr(0, 1) == '.'){
            console.log('a')
            _this.setData({
                payNum:0,
                value:'',
                noNumPlatForm: true,
                noNumMerchant: true
            })
            return
        }
        value = parseFloat(value).toFixed(2)
        
        if (parseFloat(value) >= parseFloat(_this.data.maxMerchant.minimumMoney) && _this.data.codeMerchant){
            console.log('a')
            if (_this.data.maxMerchant.couponType) {
                if (parseFloat(value) >= parseFloat(_this.data.maxMerchant.minimumMoney)) {
                    console.log('s')
                    merchantNum = _this.data.maxMerchant.couponMoney
                    noNumM = false
                }
            } else {
                merchantNum = _this.data.maxMerchant.couponMoney
                noNumM = false
            }
        }
        
        if (parseFloat(value) >= parseFloat(_this.data.maxPlatForm.minimumMoney) && _this.data.codePlatForm){
            if (_this.data.maxPlatForm.couponType) {
                if (parseFloat(value) >= parseFloat(_this.data.maxPlatForm.minimumMoney)) {
                    
                    platFormNum = _this.data.maxPlatForm.couponMoney
                    noNumP = false
                }
            } else {
                platFormNum = _this.data.maxPlatForm.couponMoney
                noNumP = false
            }
        }
        if (parseFloat(platFormNum) && parseFloat(merchantNum)) {
            batchNums = _this.data.codePlatForm + ',' + _this.data.codeMerchant
        } else if (parseFloat(platFormNum)) {
            batchNums = _this.data.codePlatForm
        } else if (parseFloat(merchantNum)) {
            batchNums = _this.data.codeMerchant
        }

        payNum = parseFloat(value) - parseFloat(platFormNum) - parseFloat(merchantNum);
        amountCoupon = parseFloat(platFormNum) + parseFloat(merchantNum);
        
        var value = parseFloat(value);
        if (payNum <=0){
            payNum='0.01'
        }
        if (parseFloat(value) <=0){
            payNum=0
        }
        payNum = parseFloat(payNum).toFixed(2);

        _this.setData({
            payNum: payNum,
            batchNums: batchNums,
            amountCoupon: amountCoupon,
            inputThis: e,
            countDotal: parseFloat(value),
            noNumPlatForm: noNumP,
            noNumMerchant: noNumM
        })

    },
    Confirm:function(e){    //选择优惠券确认
        var _this=this;
        if (_this.data.couponType == 1) {
            var data = _this.data.couponData.platForm;
            for(var i=0;i<data.length;i++){
                if (_this.data.codePlatForm == data[i].batchNum){
                    _this.setData({
                        maxPlatForm: data[i],
                        showCoupon: false,
                        noPlatFormCoupon: false
                    })
                    
                }
            }
            if (!_this.data.codePlatForm.length){
                _this.setData({
                    codePlatForm:'',
                    showCoupon: false,
                    noPlatFormCoupon: true
                })
            }
        }else{
            var data = _this.data.couponData.merchant;
            for (var i = 0; i < data.length; i++) {
                if (_this.data.codeMerchant == data[i].batchNum) {
                    
                    _this.setData({
                        maxMerchant: data[i],
                        showCoupon: false,
                        noMerchantCoupon: false
                    })
                }else{

                }
            }
            if (!_this.data.codeMerchant.length) {
                _this.setData({
                    codeMerchant: '',
                    showCoupon: false,
                    noMerchantCoupon:true
                })
            }
        }
        _this.inputNum(_this.data.inputThis);

        // _this.inputNum(this)
        
    },
    close: function (e) {
        this.setData({
            showCoupon: false
        })
    },
    radioChange: function (e) {
        var _this = this;
        var checkboxVal=''
        var Val= e.detail.value;
        if (Val.length>1){
            checkboxVal=Val[1]
        }else{
            checkboxVal=Val
        }
        if (checkboxVal.length){
            _this.setData({
                ConfirmText: '确认使用'
            })
        }else{
            _this.setData({
                ConfirmText: '确认'
            })
        }
        if (_this.data.couponType == 1) {  
            _this.setData({
                codePlatForm: checkboxVal
            })
        }else{
            _this.setData({
                codeMerchant: checkboxVal
            })
        }
        
    }
})
