//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        serachData: wx.getStorageSync('searchData') || [],  //缓存搜索记录
        value:'',
        serachFla:false,
        marketid:1,    //搜索商场ID
        marketUniqueCode:'1',    //搜索商场编码
        storeLists:[],   //商户数据
        defaultFla:false,
        pageNum: 1,  //分页数
        pageText: '1楼',    //分页楼层文字
        pageCount: 2,    //分页总数
    },
    onLoad: function () {

        var _this=this;
        _this.setData({
            marketid: _this.options.marketid || 1,
            marketUniqueCode: _this.options.marketUniqueCode || 1
        })
        
    },
    returnClick:function(e){ //点击取消返回首页
        var _this=this;
        wx.navigateBack({ changed: true });
    },
    scrollStore: function (e) {    //滑动到底部加载下一页
        var _this = this;
        if (_this.data.pageNum <= _this.data.pageCount) {
            _this.storeData(_this.data.marketid, _this.data.value, _this.data.pageNum)
        }

    },
    storeData: function (marketId, keyWord, pageNum) { //封装商户调用
        var _this = this;
        // _this.setData({
        //     storeLists: []
        // })
        wx.request({
            url: app.globalData.ip + 'smallprogram/search/adopt/marketId',
            data: { marketId: marketId, keyWord: keyWord, pageNum: pageNum, pageSize: 8 },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (e) {
                if (!e.data.errCode) {
                    var info = e.data.data.info;
                    var storeLists = _this.data.storeLists.concat(info);

                    _this.setData({
                        pageNum: _this.data.pageNum + 1,
                        pageCount: e.data.data.pageCount,
                        storeLists: storeLists
                    })
                } else if (e.data.errCode == 213) {
                    app.wxlogin();
                }
            }
        })
    },
    historyClick:function(e){    //点击历史记录数据调用j接口
        var _this = this;
        this.setData({
            value: e.target.dataset.value,
            storeLists: []
        })
        _this.storeData(_this.data.marketid, e.target.dataset.value, 1);

        var getData = wx.getStorageSync('searchData') || [];
        for (var i = 0; i < getData.length; i++) {
            if (getData[i] === e.target.dataset.value) {
                getData.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
                break;
            }
        }
        getData.unshift(e.target.dataset.value); // 再添加到第一个位置
        wx.setStorageSync('searchData', getData);
        
    },
    searchFocus:function(e){
        this.setData({
            serachFla:true,
            serachData: wx.getStorageSync('searchData')
        })
    },
    searchBlur:function(e){    //搜索获得失去
        this.setData({
            serachFla: false
        })
        
    },
    searchConfirm:function(e){  //输入框点击搜索触发
        this.setData({
            value: e.detail.value,
            storeLists: []
        })

        var _this = this;
        wx.request({
            url: app.globalData.ip + 'smallprogram/search/adopt/marketId',
            data: { marketId: _this.data.marketid, keyWord: e.detail.value, pageNum: 1, pageSize: 8 },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (e) {
                if (!e.data.errCode) {
                    // 缓存历史记录
                    var getData = wx.getStorageSync('searchData') || [];
                    if (_this.data.value && getData.indexOf(_this.data.value) == -1) {
                        if (getData.length >= 3) {
                            getData.pop();
                        }
                        getData.unshift(_this.data.value);
                        wx.setStorageSync('searchData', getData);
                    }else{
                        console.log(getData)
                        for (var i = 0; i < getData.length; i++) {
                            if (getData[i] === _this.data.value) {
                                getData.splice(i, 1); // 如果数据组存在该元素，则把该元素删除
                                break;
                            }
                        }
                        getData.unshift(_this.data.value); // 再添加到第一个位置
                        wx.setStorageSync('searchData', getData);
                    }
                    _this.setData({
                        serachData: wx.getStorageSync('searchData'),
                        storeLists: e.data.data.info,
                        pageNum: _this.data.pageNum+1,
                        pageCount: e.data.pageCount

                    })
                }

            }
        })

    },
    empty:function(e){
        wx.removeStorageSync('searchData');
        this.setData({
            serachData: wx.getStorageSync('searchData')
        })
    },
    call:function(e){   //打电话
        var _this=this;
        var phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    payClick:function (e) {
        var storeName = e.target.dataset.name
        var supplierId = e.target.dataset.id
        // wx.setStorageSync('gTicket', e.data.data.gTicket);
        var _this = this;
        wx.request({
            url: app.globalData.ip + 'customer/getUnionId',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: { thirdSession: app.globalData.third_session, encryptedData: e.detail.encryptedData, iv: e.detail.iv },
            success: function (e) {
                if (!e.data.errCode) {

                } else if (e.data.errCode == 102) {
                    wx.login({
                        success: function (res) {
                            if (res.code) {
                                app.code2openid(res.code)
                            } else {
                                console.log('获取用户登录态失败！' + res.errMsg)
                            }
                        }
                    });
                }
            }
        })

        if (wx.getStorageSync('gTicket')) {    //判断用户有没有登录
            wx.navigateTo({
                url: '../pay/pay?shopId=' + _this.data.marketUniqueCode + '&supplierId=' + e.target.dataset.id + '&storename=' + e.target.dataset.name + '&shortcut=0'
            })
            return
        } else {
            wx.navigateTo({
                url: '../login/login?shopId=' + _this.data.marketUniqueCode + '&supplierId=' + e.target.dataset.id + '&storename=' + e.target.dataset.name + '&user=0'
            })
            return
        }

    }


})
