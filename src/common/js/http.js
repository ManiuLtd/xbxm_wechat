
import axios from 'axios'
import routes from '@/routes'
import { Message, Loading, OptionGroup } from 'element-ui'

var gTicketData = "";
var qs = require('qs');

export const http = axios.create({
  timeout: 1000 * 60,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' || 'application/x-msdownload;charset=utf-8',
  },
  transformRequest: [function (data) {
    return qs.stringify(data);
  }],
  data: { gTicket: gTicketData},
})


// 请求拦截器
http.interceptors.request.use(function (config) {
  var reg = new RegExp('(^| )' + 'gTicket' + '=([^;]*)(;|$)');
  var arr = document.cookie.match(reg)
  if (arr) {
    gTicketData = arr[2]
  }
  if (config.url !== '/login') {
    config.data.gTicket = gTicketData
  }
  return config
}, function (error) {
  Message.error('请求失败,请重试');
  loadingInstance.close();
  return Promise.reject(error)
})


//响应拦截器异常处理
http.interceptors.response.use(response => {
  let _this = this;
  if (response && response.data.errCode != 0) {
    switch (response.data.errCode) {
      case 400:
        Message.error('错误请求');
        break;
      case 404:
        Message.error('当前页面不存在');
        break;
      case 500:
        Message.error('服务器忙，请重试');
        break;
      case 213:
        location.href = '/#/'
        Message.error('登录超时，请重新登录');
        break;
      default:
        Message.error(`请求超时，请稍后重试`);
        break;
    }
  } else if (!response) {
    Message.error(`请求超时，请稍后重试`);
  }
    return response;
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        Message.error('错误请求');
        break;
      case 404:
        Message.error('当前资源不存在');
        break;
      case 500:
        Message.error('服务器忙，请重试');
        break;
      case 401:
        Message.error('未授权，请重新登录');
        break;
      case 403:
        Message.error('拒绝访问');
        break;
      case 408:
        Message.error('请求超时');
        break;
      case 502:
        Message.error('网络错误');
        break;
      case 503:
        Message.error('服务不可用');
        break;
      default:
        Message.error(`请求超时，请稍后重试`);
    }
  } else {
    Message.error(`当前网络不可用 请稍后重试`)
  }
  return Promise.resolve(err.response)
})

//定义插件的配置来扩展 Vue 本身
const httpPlugin = {}
httpPlugin.install = function (Vue, options) {
  Vue.prototype.$http = http
}

export default httpPlugin