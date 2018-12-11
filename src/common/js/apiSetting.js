// 接口统一归类
let url

switch (process.env.srconfig) {
    case 'trade'://生产
        url = "https://trade.uselect.com.cn/youxuan-coupon";
        break;
    case 'testdev'://测试
        url = "https://pro.uselect.com.cn/youxuan-coupon";
        break;
    default://默认开发
        url = "https://trade.uselect.com.cn/youxuan-coupon";
        break;
}


const serviceModule = {
    // 验证问题
    gTicket: function () {
        var reg = new RegExp('(^| )' + 'gTicket' + '=([^;]*)(;|$)');
        var arr = document.cookie.match(reg)
        if (arr) {
            return unescape(arr[2])
        }
    },
    //登陆接口
    login: `${url}/operator/login`,
    //首页接口
    index: {
        method: "post",
        url: `${url}/count/getAllStatistics`
    },

    //-------------------------------商场接口----------------------
    //商场列表
    marketList: `${url}/market/search/list`,
    //新增商场
    addMarket: `${url}/market/add/edit`,
    //商场省市区区域获取
    getRegion: `${url}/market/region/get`,
    //商场编辑展示
    marketInfo: `${url}/market/edit/info`,
    //导出excel
    market_download_excel: `${url}/market/derive/excel`,


    // ------------------------------商户接口------------------------
    // 商户获取数据
    merchantGetdata: {
        url: `${url}/merchant/search/all`,
        method: 'post',
    },
    // 获取所有商场的数据
    chooseMarketName: {
        url: `${url}/merchant/search/marketInfo`,
        method: 'post',
    },
    // 商户上传图片
    uploadShopPhoto: `${url}/merchant/upload/image`,
    // 商户excel导出
    merchant_download_excel: `${url}/merchant/download/excel`,
    // 商户二维码下载
    merchant_down_code: `${url}/merchant/download/WxACode`,
    //新增商户
    addMerchant: {
        url: `${url}/merchant/insert/info`,
        method: 'post',
    },
    // 编辑商户
    editMerchant: {
        url: `${url}/merchant/edit/info`,
        method: 'post',
    },
    // 商户详情
    merchantInfo: {
        url: `${url}/merchant/search/detaile`,
        method: 'post',
    },
    // 获取商场楼层
    marketFloor: {
        url: `${url}/market/floor`,
        method: 'post',
    },

    // --------------------------------用户接口-----------------------
    // 用户列表
    userListData: {
        url: `${url}/customerManage/list`,
        method: "post",
    },
    // 导出
    user_download_excel: `${url}/customerManage/download/excel`,



    // --------------------------------优惠券接口----------------------
    //1.优惠券列表页面
    couponList: {
        url: `${url}/coupon/couponList`,
        method: "post"
    },
    // 投放优惠券
    launchConpon: {
        url: `${url}/coupon/launchConpon`,
        method: "post"
    },
    //强制下线优惠券
    downline: {
        url: `${url}/coupon/downline`,
        method: "post"
    },
    // 复制领券链接
    copyLink: 'https://trade.uselect.com.cn/activity/html/coupon.html',


    // 2.优惠券新增页面msg
    // 获取商场
    getmarket: {
        url: `${url}/coupon/newCoupon`,
        method: "get",
    },
    // 商户列表
    getMerchant: {
        url: `${url}/coupon/merchants`,
        method: 'post',
    },
    //新增优惠券保存
    addCoupon: {
        url: `${url}/coupon/newCoupon`,
        method: 'post',
    },


    //3.查看领取页面
    checkReceive: `${url}/coupon/viewClaim`,
    //导出查看领取excel
    receive_download_excel: `${url}/coupon/viewClaimExport`,



    // 4.去详情
    couponInfo: {
        url: `${url}/coupon/couponDatails`,
        method: 'post',
    },

    // 5.编辑页面
    editCoupon: {
        url: `${url}/coupon/exitCoupon`,
        method: 'post',
    },

    // 交易记录
    transactionRecord: {
        url: `${url}/bill/getAllBillInfo`,
        method: 'post',
    },
    // 导出
    record_down_excel: `${url}/bill/download/excel`

}

const ApiSetting = { ...serviceModule }

export default ApiSetting