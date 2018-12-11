const app = getApp()
Page({
    data: {
        userImg:'',
        userName:'',
        userInfo: wx.getStorageSync('userInfo') || '',
        iphone: wx.getStorageSync('mobile') || ''
    },

    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '我的'
        })
        var _this = this;
        console.log(wx.getStorageSync('userInfo'))
        _this.setData({
            iphone: wx.getStorageSync('mobile') || '',
            userInfo: wx.getStorageSync('userInfo')
        })

    },
    clickMobile:function(e){    //修改手机
        if (wx.getStorageSync('gTicket')){
            wx.navigateTo({
                url: '../editMobile/editMobile'
            })
        }else{
            wx.navigateTo({
                url: '../login/login?user=1'
            })
        }
        
    },
    clickCoupon:function(e){    //查看我的优惠券
        wx.navigateTo({
            url: '../coupon/coupon'
        })
        
    }

})