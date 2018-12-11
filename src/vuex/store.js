import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * Vuex全局状态管理
 * @param options {Array} 用于渲染tabs的数组
 */
const store = new Vuex.Store({
  state: {
    options: [],
    activeIndex: '/user',
    // 商户详情
    merchantInfoId:"",
    editMerchantId:"",
    // 商场
    marketInfoId:"",
    editMarketId:"",
    // 优惠券、
    couponInfoId:"",
    couponeditId:"",
    checkbatchNum:"",
    batchNum:""
  },
  mutations: {
    // 改变商户ID
    changeMerchantInfoId(state,data){
      this.state.merchantInfoId=data;
    },
    changeeditMerchantId(state,data){
      this.state.editMerchantId=data;
    },
    // 商场
    changeMarketInfoId(state,data){
      this.state.marketInfoId=data;
    },
    changeeditMarketId(state,data){
      this.state.editMarketId=data;
      console.log(data);
    },
    // 优惠券
    changeeditcouponInfoId(state,data){
      this.state.couponInfoId=data;
    },

    changecouponeditId(state,data){
      this.state.couponeditId=data.couponId;
      this.state.batchNum=data.batchNum;
    },

    changecheckbatchNum(state,data){
      this.state.checkbatchNum=data;
    },

    // 删除所有的tabs
    delete_allTab(state,data){
      this.state.options=[];
    },
    // 添加tabs
    add_tabs(state, data) {
      this.state.options.push(data);
      this.state.options = Array.from(new Set(this.state.options))
    },
    // 删除tabs
    delete_tabs(state, route) {
      let index = 0;
      for (let option of state.options) {
        if (option.route === route) {
          break;
        }
        index++;
      }
      this.state.options.splice(index, 1);
    },
    // 设置当前激活的tab
    set_active_index(state, index) {
      this.state.activeIndex = index;
      
    },
    // 设置详情信息
    save_detail_info(state, info) {
      this.state.userInfo = info;
    }
  }
});

export default store;