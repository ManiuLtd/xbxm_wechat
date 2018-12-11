<template>
<el-form :model="mercantInfo_form"  ref="mercantInfo_form" label-width="105px" class="demo-ruleForm m-addmerchant-form m-merchantInfo" >
  <el-form-item label="店面编码" prop="merchantId" >
	  <span>{{mercantInfo_form.storeUniqueCode}}</span>
  </el-form-item>
  <el-form-item label="选择商场" prop="marketName">
	  <span>{{mercantInfo_form.marketName}}</span>
  </el-form-item>
   <el-form-item label="商户名称" prop="merchantName">
     <span>{{mercantInfo_form.merchantName}}</span>
  </el-form-item>
   <el-form-item label="店面名称" prop="storeName">
    <span>{{mercantInfo_form.storeName}}</span>
    <span class="u-alerting-user"><i class="el-icon-warning u-special-font"></i>显示给用户</span> 
  </el-form-item>
   <el-form-item label="负责人" prop="responsiblePerson">
    <span>{{mercantInfo_form.responsiblePerson}}</span>
  </el-form-item>
  <el-form-item label="负责人电话" prop="responsiblePersonPhone">
    <span>{{mercantInfo_form.responsiblePersonPhone}}</span>
     <span class="u-alerting-user"><i class="el-icon-warning u-special-font"></i>显示给用户</span> 
  </el-form-item>
     <el-form-item label="银行卡号" prop="bankCardNumber">
    <span>{{mercantInfo_form.bankCardNumber}}</span>
  </el-form-item>
  <el-form-item label="账户姓名" prop="accountName">
    <span>{{mercantInfo_form.accountName}}</span>
  </el-form-item>
     <el-form-item label="开户行" prop="bankName">
    <span>{{mercantInfo_form.bankName}}</span>
  </el-form-item>
   <el-form-item label="所在楼层" prop="storeFloor"  class="u-other-grid">
    <span>{{mercantInfo_form.storeFloor}}</span>
    <span class="u-alerting-user"><i class="el-icon-warning u-special-font"></i>显示给用户</span> 
  </el-form-item>
  <el-form-item label="详细摊位" prop="storeBooth" class="u-other-grid">
   <span>{{mercantInfo_form.storeBooth}}</span>  
    <span class="u-alerting-user"><i class="el-icon-warning u-special-font"></i> 显示给用户</span> 
  </el-form-item>
  <el-form-item label="状 态" prop="storeStatus" class="u-other-grid u-state-radio">
     <span v-if="mercantInfo_form.storeStatus==1">启用</span>
     <span v-else-if="mercantInfo_form.storeStatus==0">禁用</span>
  </el-form-item>
  <el-form-item label="门头图片" prop="storeImageUrl" class="u-other-grid">
    <img width="100%" :src="mercantInfo_form.storeImageUrl" alt="">
  </el-form-item>
  <el-form-item class="u-other-grid u-operation-button">
    <el-button type="primary" @click="return_merchantList">返回</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import ApiSetting from "../../common/js/apiSetting.js";
export default {
  data() {
    return {
      // 图片上传ip
      uploadShopPhoto: "",
      // 添加表单
      mercantInfo_form: {
      }
    };
  },
  mounted(){
    this.merchantInfo_dealdata;
  },
  methods: {
    merchantInfo_GetData() {
      let param = { storeId:this.$route.params.storeId};
      ApiSetting.merchantInfo.data = param;
      this.$http(ApiSetting.merchantInfo).then(msg => {
        if(!msg || msg.data.errCode !== 0 || msg === undefined ||msg === null) return
        this.merchantInfo_dealdata(msg.data.data);
      });
    },
    
    merchantInfo_dealdata(data) {
      this.mercantInfo_form={
        ...data
      }
      this.mercantInfo_form.storeFloor = data.storeFloor.replace(/\|/g, ",");
    },
    // 返回到列表
    return_merchantList() {
      this.$router.push("/merchantList")
    }
  },

  created() {
    // 显示所有信息
    this.merchantInfo_GetData();
  }
};
</script>
<style>

.m-addmerchant-form {
  margin-left: 20px;
}
.m-addmerchant-form div {
  display: inline-block;
}
.m-addmerchant-form .el-form-item__label {
  font-weight: 500;
  font-size: 16px;
  color: #000;
  text-align: left;
}
.m-addmerchant-form .el-form-item {
  width: 33%;
}
.m-addmerchant-form .u-alerting-mes {
  width: 10%;
}
.m-addmerchant-form .el-form-item__content {
  margin-left: 0 !important;
}
.m-addmerchant-form .u-other-grid {
  width: 60%;
}
.u-radio-type .el-form-item__content > span {
  display: inline-block;
  margin-top: 40px;
  margin-left: 20px;
  font-size: 12px;
  color: #000;
}
.m-addmerchant-form .u-operation-button button {
  margin-left:100px;
  width: 190px;
  height: 40px;
}

.m-addmerchant-form .u-alerting-user {
  font-size: 12px;
  font-weight: 500;
  color: #000;
  margin-left: 18px;
}
.u-special-font {
  color: #ff7623;
}

.m-addmerchant-form .el-input.is-disabled .el-input__inner,
.m-addmerchant-form .el-input__inner,
.m-addmerchant-form .el-radio__inner {
  border: 1px solid #9b9b9b;
}

.m-addmerchant-form .u-alerting-user {
  width: 45%;
}
.m-addmerchant-form .el-form-item:nth-child(even) {
  width: 65%;
}
.m-addmerchant-form .el-input {
  width: 180px;
}
.u-other-grid img {
  width: 160px;
  height: 160px;
}
.m-merchantInfo .el-form-item__content{
  color:#9b9b9b
}
</style>
