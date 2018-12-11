const app = getApp()
var util = require('../../utils/util.js')
Page({
    data: {
        selectFla:true,
        unusedFla:true, //是否显示未使用切换
        couponData:[]   //优惠券
    },

    onLoad: function () {
        var _this = this;
        _this.coupon(0);
        wx.setNavigationBarTitle({
            title: '我的优惠券'
        })
    },
    selectTab:function(e){    //切换tab
        console.log(e);
        var _this=this;
        if(e.target.dataset.index == 0){
            _this.setData({
                selectFla:true,
                unusedFla:true
            })
        }else{
            _this.setData({
                selectFla: false,
                unusedFla:false
            })
        }
        _this.coupon(e.target.dataset.index);
    },
    coupon: function (status){
        var _this=this;
        wx.request({
            url: app.globalData.ip + 'userCoupon/allCoupon',
            data: { gTicket: wx.getStorageSync('gTicket'), status: status },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (e) {
                console.log(e)
                if (!e.data.errCode) {
                    var data = e.data.data;
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            data[i].validStartTime = util.formatTime(data[i].validStartTime);
                            data[i].validEndTime = util.formatTime(data[i].validEndTime);
                        }
                    }
                    _this.setData({
                        couponData: data
                    });
                } else if (e.data.errCode == 213) {
                    app.wxlogin();
                }

            }
        })

    }


})