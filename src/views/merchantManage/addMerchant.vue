<template>
<div class="g-addmerchant-content">
  <el-form :model="addMercant_form" :rules="rules" ref="addMercant_form" label-width="105px" class="demo-ruleForm m-addmerchant-form" >
    <el-form-item label="店面编码" prop="storeUniqueCode">
      <el-input v-model="addMercant_form.storeUniqueCode" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="选择商场" prop="marketId">
      <el-select v-model="addMercant_form.marketId" placeholder="请选择商场" @change="getFloor">
        <el-option v-for="(item, index) in marketName" :key="index" :value="item.marketId" :label="item.marketName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商户名称" prop="merchantName">
      <el-input v-model="addMercant_form.merchantName" placeholder="限填2-20个字符"></el-input>
    </el-form-item>
    <el-form-item label="店面名称" prop="storeName">
      <el-input v-model="addMercant_form.storeName"  placeholder="限填2-20个字符"></el-input>
      <span class="u-alerting-user"><i class="el-icon-warning u-special-font"></i>显示给用户</span> 
    </el-form-item>
    <el-form-item label="负责人" prop="responsiblePerson">
      <el-input v-model="addMercant_form.responsiblePerson"  placeholder="限填2-20个字符"></el-input>
    </el-form-item>
      <el-form-item label="负责人电话" prop="responsiblePersonPhone">
      <el-input v-model="addMercant_form.responsiblePersonPhone"  placeholder="限填2-20个字符"></el-input>
       <span class="u-alerting-user"><i class="el-icon-warning u-special-font"></i>显示给用户</span> 
    </el-form-item>
      <el-form-item label="银行卡号" prop="bankCardNumber">
      <el-input v-model="addMercant_form.bankCardNumber"  placeholder="限填2-30个字符"></el-input>
    </el-form-item>
      <el-form-item label="账户姓名" prop="accountName">
      <el-input v-model="addMercant_form.accountName"  placeholder="限填2-30个字符"></el-input>
    </el-form-item>
    <el-form-item label="开户行" prop="bankName">
      <el-input v-model="addMercant_form.bankName"  placeholder="限填2-50个字符"></el-input>
    </el-form-item>
      <el-form-item label="状 态" prop="storeStatus" class="u-state-radio">
      <el-radio-group v-model="addMercant_form.storeStatus">
        <el-radio label="启用" value=1></el-radio>
        <el-radio label="禁用" value=0></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="所在楼层" prop="storeFloor"  class="u-other-grid u-floor-radio-type">
      <el-checkbox-group v-model="addMercant_form.storeFloor">
        <el-checkbox v-for="(item, index) in storeFloor" :key="index" :label="item.floorDetail" :disabled=item.state></el-checkbox>
      </el-checkbox-group>
      <span ><i class="el-icon-warning u-special-font"></i>显示给用户，必须先选择商场</span> 
    </el-form-item>
    <el-form-item label="详细摊位" prop="storeBooth" class="u-other-grid">
      <el-input v-model="addMercant_form.storeBooth"  placeholder="限填2-30个字符"></el-input> 
      <span class="u-alerting-user"></span>  
      <span class="u-alerting-user"><i class="el-icon-warning u-special-font"></i> 显示给用户 ，多个摊位以中英文逗号分隔，例：102,103</span> 
    </el-form-item>
    <el-form-item label="门头图片" prop="storeImageUrl" class="u-other-grid">
        <el-upload class="avatar-uploader"  :action="uploadShopPhoto"
            ref="shopPhotoUpload"
            :on-preview="handlePictureCardPreview" 
            :multiple="false"
            :limit="1"  
            list-type="picture-card"
            :on-success="addmerchent_upLoadPic" :before-upload="limit_image">
              <i  class="el-icon-plus" v-if="!addMercant_form.storeImageUrl"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="addMercant_form.storeImageUrl" alt="">
        </el-dialog>
        <div class="u-img-relation">
            <p>支持图片格式：jpg/jpeg/png/gif</p>
            <span><i class="el-icon-warning u-special-font"></i> 显示给用户</span> 
        </div>
    </el-form-item>
    <el-form-item class="u-other-grid u-operation-button">
      <el-button @click="addMerchant_resetForm('addMercant_form')" >取消</el-button>
      <el-button type="primary" @click="addMerchant_submitForm('addMercant_form')" >保存</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import ApiSetting from "../../common/js/apiSetting.js";
export default {
  data() {
    return {
      // 商场名字
      marketName: [],
      // 图片上传ip
      uploadShopPhoto: "",
      // 多选框
      storeFloor: [
        { floorDetail: "-3楼", state: true },
        { floorDetail: "-2楼", state: true },
        { floorDetail: "-1楼", state: true },
        { floorDetail: "1楼", state: true },
        { floorDetail: "2楼", state: true },
        { floorDetail: "3楼", state: true },
        { floorDetail: "4楼", state: true },
        { floorDetail: "5楼", state: true },
        { floorDetail: "6楼", state: true },
        { floorDetail: "7楼", state: true },
        { floorDetail: "8楼", state: true },
        { floorDetail: "9楼", state: true }
      ],
      // 添加表单
      addMercant_form: {
        storeUniqueCode: "系统自动生成",
        marketId: "",
        merchantName: "",
        responsiblePerson: "",
        storeFloor: [],
        storeName: "",
        responsiblePersonPhone: "",
        storeBooth: "",
        storeImageUrl: "",
        storeStatus: "启用",
        bankName: "",
        bankCardNumber: "",
        bankName: ""
      },
      // 验证规则
      rules: {
        bankName: [
          { required: true, message: "请填写开户行", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
        ],
        bankCardNumber: [
          { required: true, message: "请填写银行卡号", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 30 个字符",
            trigger: "blur"
          },
          {
            validator: function(rule, value, callback) {
              if (/^\d{2,}$/.test(value) == false) {
                callback(new Error("请输入正确的银行卡号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        accountName: [
          { required: true, message: "请填写账户姓名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ],
        storeUniqueCode: [{ required: true, message: "", trigger: "blur" }],
        merchantName: [
          { required: true, message: "请填写商户名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        responsiblePerson: [
          { required: true, message: "请填写负责人", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        storeFloor: [
          { required: true, message: "请选择楼层", trigger: "change" }
        ],
        storeName: [
          { required: true, message: "请填写店面名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        responsiblePersonPhone: [
          { required: true, message: "请填写负责人电话", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (/^1[34578]\d{9}$/.test(value) == false) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        storeBooth: [
          { required: true, message: "请填写摊位", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 30 个字符",
            trigger: "blur"
          },
          {
            validator: function(rule, value, callback) {
              if (
                /^[-\w\u4e00-\u9fa5]+([,，]?[-\w\u4e00-\u9fa5]+){0,}$/.test(
                  value
                ) == false
              ) {
                callback(new Error("请输入正确的格式"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        storeImageUrl: [
          { required: true, message: "请上传图片", trigger: "change" }
        ],
        storeStatus: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        marketId: [{ required: true, message: "请选择商场", trigger: "change" }]
      },
      // 预览图片弹窗
      dialogVisible: false,
      // 发送最后参数
      param: {
        gTicket: "",
        merchant: {}
      }
    };
  },
  methods: {
    // 获取所有商场名字
    chooseMarketName() {
      ApiSetting.chooseMarketName.data = {
        qState: 1
      };
      this.$http(ApiSetting.chooseMarketName).then(msg => {
        if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null)
          return;
        this.marketName = msg.data.data;
      });
    },
    // 获取该商场楼层
    getFloor() {
      let param = { marketId: this.addMercant_form.marketId };
      ApiSetting.marketFloor.data = param;
      this.$http(ApiSetting.marketFloor).then(msg => {
        if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null)
          return;
        let marketFloor = msg.data.data.floors;
        this.storeFloor.map(item => {
          item.state = true;
        });
        this.addMercant_form.storeFloor=[];
        this.storeFloor.forEach(flooritem => {
          marketFloor.forEach(marketFlooritem => {
            if (flooritem.floorDetail == marketFlooritem) {
              flooritem.state = false;
            }
          });
        });
      });
    },
    // 新增de提交表单
    addMerchant_submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        } else {
          this.addMerchant_deal();
        }
      });
    },
    // 整合数据发送ajax
    addMerchant_deal() {
      if (
        this.addMercant_form.storeStatus == "启用" ||
        this.addMercant_form.storeStatus == 1
      ) {
        this.addMercant_form.storeStatus = 1;
      } else {
        this.addMercant_form.storeStatus = 0;
      }
      this.marketName.map(item => {
        if (item.marketId == this.addMercant_form.marketId) {
          this.addMercant_form.marketUniqueCode = item.marketUniqueCode;
        }
      });
      this.param.merchant = Object.assign({}, this.addMercant_form);
      delete this.param.merchant.merchantId;
      ApiSetting.addMerchant.data = this.param;
      ApiSetting.addMerchant.data.merchant.storeFloor = this.param.merchant.storeFloor.join(
        "|"
      );
      ApiSetting.addMerchant.data.merchant = JSON.stringify(
        ApiSetting.addMerchant.data.merchant
      );
      this.$http(ApiSetting.addMerchant).then(msg => {
        if (!msg || msg === undefined || msg === null) {
          this.$message.error("保存失败，请重试");
        } else if (msg.data.errCode == 126) {
          this.$message.error("该店面名称已存在");
        } else if (msg.data.errCode == 0) {
          this.$refs["addMercant_form"].resetFields();
          this.$refs.shopPhotoUpload.clearFiles();
          this.$router.push("/merchantList");
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          this.$message.error("保存失败，请重试");
        }
      });
    },

    // 新增重置表单并取消
    addMerchant_resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.shopPhotoUpload.clearFiles();
    },

    // 图片上传成功
    addmerchent_upLoadPic(res, file, fileList) {
      this.addMercant_form.storeImageUrl = res.data.imageURL;
    },

    // 预览图片
    handlePictureCardPreview(file) {
      // this.addMercant_form.shopPhotoUrl = file.url;
      this.dialogVisible = true;
    },

    // 上传前限制图片大小
    limit_image(file) {
      const isJPG =
        file.type === "image/jpeg" || "image/jpg" || "image/png" || "image/gif";
      if (!isJPG) {
        this.$message.error("上传门户图片只能是 jpg/jpeg/png/gif 格式!");
      }
      return isJPG;
    }
  },
  created() {
    this.chooseMarketName();
    let gTicket = ApiSetting.gTicket();
    this.uploadShopPhoto = `${ApiSetting.uploadShopPhoto}?gTicket=${gTicket}`;
  }
};
</script>
<style lang="less">
.g-addmerchant-content {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .m-addmerchant-form div {
    display: inline-block;
  }
  .m-addmerchant-form .u-state-radio .el-radio__label,
  .m-addmerchant-form .el-form-item__label {
    font-weight: 500;
    font-size: 16px;
    color: #000;
    text-align: right !important;
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
    width: 90% !important;
  }
  .m-addmerchant-form .u-floor-radio-type.el-checkbox-group div {
    display: block;
  }
  .u-floor-radio-type .el-checkbox-group div:nth-child(1) {
    margin-top: 0;
  }
  .u-floor-radio-type .el-checkbox-group {
    margin-top: 0;
  }
  .u-floor-radio-type .el-form-item__content .el-checkbox-group {
    width: 330px;
    float: left;
    text-align: center;
    padding: 10px 20px;
    border: 1px solid #9b9b9b;
    margin-top: 10px;
    border-radius: 5px;
  }
  .u-floor-radio-type .el-form-item__content > span {
    display: inline-block;
    margin-top: 40px;
    margin-left: 20px;
    font-size: 12px;
    color: #000;
  }
  .m-addmerchant-form .u-operation-button button {
    width: 190px;
    height: 40px;
    margin-left: 20px !important;
  }
  .m-addmerchant-form .el-input--suffix .el-input__inner,
  .m-addmerchant-form .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  .m-addmerchant-form .el-select .el-input__inner {
    padding-right: 15px;
  }
  .m-addmerchant-form .u-alerting-user {
    font-size: 12px;
    font-weight: 500;
    color: #000;
    margin-left: 18px;
  }
  .m-addmerchant-form .u-img-relation {
    line-height: 25px;
    font-size: 12px;
    float: right;
    margin-left: 30px;
    font-weight: 500;
    color: #000;
  }
  .u-special-font {
    color: #ff7623;
  }

  /* 改变边框颜色 */
  .m-addmerchant-form .avatar-uploader .el-upload {
    border-color: #9b9b9b;
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
  .m-addmerchant-form .el-checkbox-group .el-checkbox:nth-child(9),
  .m-addmerchant-form .el-checkbox-group .el-checkbox:nth-child(5) {
    margin-left: 0px;
  }
  .m-addmerchant-form
    .el-checkbox-group
    .el-checkbox:nth-child(n + 4)
    .el-checkbox__label {
    padding-left: 15px;
  }
  .m-addmerchant-form
    .el-checkbox-group
    .el-checkbox:nth-child(9)
    .el-checkbox__label {
    padding-left: 15px;
  }
  .m-addmerchant-form .el-form-item__content .u-checkbox {
    display: block;
    margin-top: 0px;
    margin-left: 392px;
  }
  .m-addmerchant-form .u-floor-radio-type {
    width: 80%;
  }

  .m-addmerchant-form .u-all-checked {
    display: block;
  }
  .el-dialog__wrapper {
    width: 600px;
    height: 600px;
    overflow: hidden;
    padding: 0;
    position: fixed;
    left: 35%;
    top: -10px;
    .el-dialog {
      width: 500px;
      height: 500px;
      padding: 0;
      img {
        width: 100%;
      }
    }
  }
}
</style>
