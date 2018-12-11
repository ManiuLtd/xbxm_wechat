import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import index from './views/index.vue'

import marketList from './views/marketManage/marketList.vue'
import addMarket from './views/marketManage/addMarket.vue'
import editMarket from './views/marketManage/editMarket.vue'
import marketInfo from './views/marketManage/marketInfo.vue'

import merchantList from './views/merchantManage/merchantList.vue'
import addMerchant from './views/merchantManage/addMerchant.vue'
import editMerchant from './views/merchantManage/editMerchant.vue'
import merchantInfo from './views/merchantManage/merchantInfo.vue'

import couponList from './views/couponManage/couponList.vue'
import addCoupon from './views/couponManage/addCoupon.vue'
import editCoupon from './views/couponManage/editCoupon.vue'
import checkReceive from './views/couponManage/checkReceive.vue'
import couponInfo from './views/couponManage/couponInfo.vue'


import UserList from './views/userManage/UserList.vue'

import transactionRecord from './views/transactionRecord/transactionRecord.vue'

let routes = [
    {
        path: '/',
        component: Login,
        name: 'login',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '404',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        hidden: true,
        name: 'index',
        children: [
            { path: '/index', component: index, name: '首页', hidden: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商场管理',
        children: [
            { path: '/marketList', component: marketList, name: '商场列表'},
            { path: '/addMarket', component: addMarket, name: '新增商场', hidden: true ,meta: { keepAlive: true }},
            { path: '/editMarket/:marketId', component: editMarket, name: '编辑商场', hidden: true },
            { path: '/marketInfo/:marketId', component: marketInfo, name: '商场详情', hidden: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商户管理',
        children: [
            { path: '/merchantList', component: merchantList, name: '商户列表' },
            { path: '/addMerchant', component: addMerchant, name: '新增商户', hidden: true, meta: { keepAlive: true },},
            { path: '/editMerchant/:storeId', component: editMerchant, name: '编辑商户', hidden: true },
            { path: '/merchantInfo/:storeId', component: merchantInfo, name: '商户详情', hidden: true},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        // leaf: true,//只有一个节点
        children: [
            { path: '/UserList', component: UserList, name: '用户列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '优惠券管理',
        children: [
            { path: '/couponList', component: couponList, name: '优惠券列表' },
            { path: '/addCoupon', component: addCoupon, name: '优惠券新增',  hidden: true, meta: { keepAlive: true },},
            { path: '/editCoupon/:couponId', component: editCoupon, name: '编辑优惠券', hidden: true },
            { path: '/checkReceive/:batchNum', component: checkReceive, name: '查看领取', hidden: true },
            { path: '/couponInfo/:batchNum', component: couponInfo, name: '优惠券详情', hidden: true }
        ]
    },
    {
        path: '/',
        component: Home,
        name: "",
        leaf: true,//只有一个节点
        children: [
            { path: '/transactionRecord', component: transactionRecord, name: '交易记录' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' },
        name:"true"
    }
];

export default routes;