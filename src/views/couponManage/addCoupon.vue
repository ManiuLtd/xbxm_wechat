<template>
  <div>
    <!-- 增加表单 -->
    <el-form :model="addCouponForm" label-width="110px" class="addCouponForm" :rules="addCouponFormRules" ref="addCouponForm">
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input v-model="addCouponForm.couponName" class="u-special-input" placeholder="限填2-20个字符"></el-input>
      </el-form-item>
      <el-form-item label="优惠券面值" prop="couponMoney">
        <el-input  v-model="addCouponForm.couponMoney" placeholder="范围：0.01-99999999"></el-input>
        <span class="u-special-font">元</span>
      </el-form-item>
      <el-form-item label="优惠券价格" prop="couponPrice">
        <el-input  v-model="addCouponForm.couponPrice" placeholder="范围：0.00-99999999" disabled></el-input>
        <span class="u-special-font">元</span>
        <span class="u-alerting-user">
          <i class="el-icon-warning u-special-font"></i> 用户领取优惠券需要支付的金额，类似定金膨胀玩法</span>
      </el-form-item>
      <el-form-item label="发放数量" prop="sendNum">
        <el-input type="number" v-model.number="addCouponForm.sendNum" placeholder="范围：0-1000000"></el-input>
        <span class="u-special-font">张</span>
      </el-form-item>
      <el-form-item label="领取有效期" prop="sendTime">
        <el-date-picker start=now :picker-options="pickerOptions1" v-model="addCouponForm.sendTime" type="datetimerange" range-separator="—"
          start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="使用有效期" prop="validTime">
        <el-date-picker v-model="addCouponForm.validTime" :picker-options="pickerOptions2" type="datetimerange" range-separator="—" :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商场范围" prop="shopId">
        <el-radio-group v-model="addCouponForm.shopId" @change="marketRangechange">
          <el-radio label="全场通用"></el-radio>
          <el-radio label="按商场可用"></el-radio>
        </el-radio-group>
        <el-card class="box-card" v-if="isshowMarket">
          <div class="box-card-div">
            <el-scrollbar style="height: 100%">
              <div v-for="(item, index) in market" :key="index">
                <p @click="addCoupon_choose_market(index)" :class="item.state?'u-marketItem': '' ">{{item.marketName}}
                  <span v-if="item.state" class="u-icon-check">
                    <i class="el-icon-check"></i>
                  </span>
                </p>
              </div>
            </el-scrollbar>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商户范围" prop="supplierId">
        <el-radio-group v-model="addCouponForm.supplierId" @change="merchantRangechange">
          <el-radio label="全场通用"></el-radio>
          <el-radio label="按商户可用"></el-radio>
          <el-button type="primary" class="u-choose-merchant" v-if="isshowMerchant" @click="choose_merchant">选择商户</el-button>
        </el-radio-group>
        <el-card class="box-card" v-if="isshowMerchant && afterMerchant.length>0" >
          <div class="box-card-div">
            <el-scrollbar style="height: 100%">
              <div v-for="(item,index) in afterMerchant" :key="index" class="text item">
                <p>
                  <span class="u-overflow-content u-select-merchant" :title="item.marketName+item.merchantName">{{item.marketName}}/{{item.merchantName}}</span>
                  <span class="u-cancel-merchant u-special-point" @click="cancel_choose_merchant(index)">取消</span>
                </p>
              </div>
            </el-scrollbar>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="使用条件" prop="couponType">
        <el-radio-group v-model="addCouponForm.couponType" class="u-special-radio-group">
          <el-radio label="不限制" value=1></el-radio>
          <el-radio class="u-special-radio" label="满" value=0>满
            <el-form-item prop='minimumMoney' class="u-special-item">
              <el-input  @focus="minimumMoney_change" v-model="addCouponForm.minimumMoney" class="u-radio-input" placeholder="范围：0.01-99999999"></el-input>
              <span class="u-special-font">元使用</span>
            </el-form-item>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" class="u-form-textarea" prop='remark'>
        <el-input type="textarea" v-model="addCouponForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirm_addCoupon('addCouponForm')" >保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="商户选择" :visible.sync="dialogTableVisible" :modal="false" width="500px" height="800px" class="m-merchant-dialog">
      <div class="u-search-input">
        <el-input v-model="serch_merchant_input" placeholder="商户/店面名称" clearable></el-input>
        <el-button type="primary" @click="search_merchant">搜索</el-button>
      </div>
      <div>
        <ul class="m-merchant-list" v-if="merchant.length>0">
          <li v-for="(item,index) in merchant" :key="index">
            <div>
              <p class="u-overflow-content" :title="item.merchantName">{{item.merchantName}}</p>
              <p class="u-overflow-content" :title="item.storeName">{{item.storeName}}</p>
              <p class="u-overflow-content" :title="item.marketName+item.storeFloor">{{item.marketName}}
                <span>{{item.storeFloor}}</span>
              </p>
            </div>
            <div>
              <el-button @click="join_choose_merchant(index)" v-if="item.isSelect=='1'" disabled>已加入</el-button>
              <el-button @click="join_choose_merchant(index)" v-else>加入</el-button>
            </div>
          </li>
        </ul>
        <div v-else class="u-nochooseMarket">
          <span class="el-icon-warning"></span>
          <p>未搜索到符合条件的商户</p>
        </div>
      </div>
      <div class="u-page">
        <el-pagination v-if="merchant.length>0" background @current-change="page_change" :current-page="param.pageNum" layout="prev, pager, next" :total="totalPage*10">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiSetting from "../../common/js/apiSetting.js";

export default {
  data() {
    // 验证规则
    // 面值验证规则
    var vCouponMoney = (rule, value, callback) => {
      if (value > 100000000 || value < 0.01) {
        callback(new Error("输入有误"));
      } else {
        callback();
      }
    };
    var vCouponPrice = (rule, value, callback) => {
      if (value > 100000000 || value < 0.0) {
        callback(new Error("输入有误"));
      } else {
        callback();
      }
    };
    var vMinimumMoney = (rule, value, callback) => {
      if (this.addCouponForm.couponType == "不限制") {
        callback();
      } else {
        if (value > 100000000 || value < 0.01) {
          callback(new Error("输入有误"));
        } else {
          callback();
        }
        if (/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value) == false) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      }
    };
    var vSendNum = (rule, value, callback) => {
      if (value > 1000000 || value < 0) {
        callback(new Error("输入有误"));
      } else {
        callback();
      }
    };
    return {
      // 设置当前时间之前不可选
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      addCouponForm: {
        couponName: "",
        couponMoney: "",
        shopId: "全场通用",
        supplierId: "全场通用",
        couponType: "不限制",
        remark: "",
        couponDes: "",
        couponPrice: "0.00",
        sendTime: "",
        validTime: "",
        sendNum: "",
        minimumMoney: ""
      },

      addCouponFormRules: {
        minimumMoney: [{ validator: vMinimumMoney, trigger: "blur" }],
        couponName: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
         { min: 2, message: "优惠券名称不能少于2个字符", trigger: "blur" },
          { max: 20, message: "优惠券名称不能多余20个字符", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (/\s+/g.test(value) == true) {
                callback(new Error("请输入正确的格式"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        couponPrice: [
          { required: true, message: "请输入优惠券价格", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value) == false) {
                callback(new Error("请输入数字"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          },
          { validator: vCouponPrice, trigger: "blur" }
        ],
        shopId: [
          { required: true, message: "请选择商场范围", trigger: "change" }
        ],
        supplierId: [
          { required: true, message: "请选择商户范围", trigger: "change" }
        ],
        couponType: [
          { required: true, message: "请选择使用条件", trigger: "change" }
        ],
        couponMoney: [
          { required: true, message: "请输入优惠券面值", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value) == false) {
                callback(new Error("请输入数字"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          },
          { validator: vCouponMoney, trigger: "blur" }
        ],
        validTime: [
          { required: true, message: "请选择使用有效期", trigger: "blur" }
        ],
        sendTime: [
          { required: true, message: "请选择领取有效期", trigger: "blur" }
        ],
        sendNum: [
          { required: true, message: "请输入发放数量", trigger: "blur" },
          { type: "number", message: "请输入数字" },
          { validator: vSendNum, trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (/^[1-9]\d*$/.test(value) == false) {
                callback(new Error("请输入正整数"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      // 商场列表
      market: [],
      // 已选择的商场列表
      marketsIdArr: [],
      // 可选择的商户列表
      merchant: [],
      // 已选择的商户列表
      afterMerchant: [],
      // 显示颜色
      showColor: true,
      // 是否显示商场
      isshowMarket: false,
      // 是否显示商户
      isshowMerchant: false,
      // 是否显示弹窗
      dialogTableVisible: false,
      // 输入input
      serch_merchant_input: "",
      // 分页
      totalPage: 1,
      // 每页多少条
      param: {
        pageSize: 6,
        pageNum: 1,
        markets: "",
        keyWords: ""
      },

      // 当前页数

      // 是否通过
      ispass1: true,
      ispass2: true,
      ispass3: true,
      ispass4: true,
      ispass5: true
    };
  },
  methods: {
    // 确认添加
    confirm_addCoupon(formName) {
      this.ispass1 = true;
      this.ispass2 = true;
      this.ispass3 = true;
      this.ispass4 = true;
      this.ispass5 = true;
      this.addCouponForm.couponPrice == "" ||
      this.addCouponForm.couponPrice == "0.00"
        ? (this.addCouponForm.couponPrice = 0)
        : (this.addCouponForm.couponPrice = this.addCouponForm.couponPrice);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.add_dealData();
        } else {
          return false;
        }
      });
    },

    // 整合数据提交
    add_dealData() {
      let formObj = this.addCouponForm;
      let param = {
        couponName: formObj.couponName,
        couponMoney: Number(formObj.couponMoney).toFixed(2),
        couponType: formObj.couponType,
        remark: formObj.remark,
        couponPrice: Number(formObj.couponPrice).toFixed(2),
        sendNum: formObj.sendNum,
        sendStartTime: new Date(formObj.sendTime[0]).getTime() / 1000,
        sendEndTime: new Date(formObj.sendTime[1]).getTime() / 1000,
        validStartTime: new Date(formObj.validTime[0]).getTime() / 1000,
        validEndTime: new Date(formObj.validTime[1]).getTime() / 1000,
        supplierId: ""
      };
      // 验证时间
      if (param.sendStartTime > param.validStartTime || param.sendEndTime > param.validEndTime) {
        this.$message.error("保存失败，使用时间应大于领取时间");
        this.ispass1 = false;
      } else {
        this.ispass1 = true;
      }


      // 验证商场
      if (formObj.shopId == "全场通用") {
        param.shopId = 0;
      } else {
        this.marketsIdArr = [];
        this.market.map(item => {
          if (item.state == true) {
            this.marketsIdArr.push(item.marketUniqueCode);
          }
        });

        // 验证是否选择商场
        if (this.marketsIdArr.length <= 0) {
          this.ispass2 = false;
          this.$message.error("保存失败，未选择商场");
        } else {
          this.ispass2 = true;
          param.shopId = this.marketsIdArr.join("-");
        }
      }

      // 验证商户
      if (formObj.supplierId == "全场通用") {
        param.couponClass = 0;
        param.supplierId = "";
      } else {
        param.couponClass = 1;
        // 验证是否选择商户
        if (this.afterMerchant.length <= 0) {
          this.$message.error("保存失败，请选择商户");
          this.ispass3 = false;
        } else {
          this.ispass3 = true;
          // 判断商场与商户的对应关系
          if (formObj.shopId == "按商场可用") {
            let count = 0;
            this.afterMerchant.map(merchantitem => {
              this.marketsIdArr.map(marketitem => {
                if (merchantitem.marketUniqueCode == marketitem) {
                  count++;
                }
              });
            });
            if (count <= 0) {
              this.ispass4 = false;
              this.$message.error("保存失败，某些已选商户无对应商场");
            } else {
              this.ispass4 = true;
              param.supplierId = this.afterMerchant
                .map(item => {
                  return item.merchantUniqueCode;
                })
                .join("-");
            }
          } else {
            this.ispass4 = true;
            param.supplierId = this.afterMerchant
              .map(item => {
                return item.merchantUniqueCode;
              })
              .join("-");
          }
        }
      }
      // 满减验证
      if (formObj.couponType == "不限制") {
        param.couponType = 1;
        param.minimumMoney = 0;
      } else {
        param.couponType = 0;
        if (param.minimumMoney == "") {
          this.ispass5 = false;
          this.$message.error("保存失败，未输入满减金额");
        } else {
          this.ispass5 = true;
          param.minimumMoney = Number(formObj.minimumMoney).toFixed(2);
        }
      }
      // 验证完毕 提交增加请求
      if (
        this.ispass1 &&
        this.ispass2 &&
        this.ispass3 &&
        this.ispass4 &&
        this.ispass5
      ) {
        ApiSetting.addCoupon.data = param;

        this.$http(ApiSetting.addCoupon).then(msg => {
          if (!msg || msg === undefined || msg === null) {
            this.$message.error("保存失败");
            return;
          } else if (msg.data.errCode == 1064) {
            this.$message.error("优惠券名称重复");
          }else if (msg.data.errCode == 1062) {
            this.$message.error("输入的时间格式有误，请检查后重试");
          } else if (msg.data.errCode == 0) {
            this.$refs["addCouponForm"].resetFields();
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$router.push({
              path: "/couponList"
            });
            (this.isshowMarket = false),
              (this.isshowMerchant = false),
              (this.marketsIdArr = []);
            this.market.map(item => {
              item.state = false;
            });
            this.afterMerchant = [];
          } else if (msg.data.errCode !== 0) {
            this.$message.error("保存失败，请重试");
          }
        });
      }
    },

    // 获取所有商场
    getmarket() {
      ApiSetting.getmarket.params = {
        gTicket: ApiSetting.gTicket()
      };
      this.$http(ApiSetting.getmarket).then(msg => {
        if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null)
          return;
        msg.data.data.marketInfoList.map(item => {
          item.state = false;
        });
        this.market = msg.data.data.marketInfoList;
      });
    },

    //   商场范围改变事件
    marketRangechange(val) {
      val == "全场通用"
        ? (this.isshowMarket = false)
        : (this.isshowMarket = true);
    },

    // 按商场可用  选择商场
    addCoupon_choose_market(index) {
      this.market[index].state = !this.market[index].state;
    },

    // 商户范围改变事件
    merchantRangechange(val) {
      if (val == "全场通用") {
        this.isshowMerchant = false;
      } else {
        this.isshowMerchant = true;
      }
    },

    // 选择商户
    choose_merchant() {
      this.dialogTableVisible = true;
      this.param.pageNum=1;
      this.merchantList();
    },
    // 搜索商户
    search_merchant() {
      this.param.keyWords = this.serch_merchant_input;
      this.pageNum = 1;
      this.merchantList();
    },

    // 获取该商场范围下的商户
    merchantList() {
      let marketsIdArr = [],
        markets = "";
      if (this.addCouponForm.shopId == "全场通用") {
        this.market.map(item => {
          marketsIdArr.push(item.marketUniqueCode);
        });
        markets = marketsIdArr.join("-");
        this.param.markets = markets;
      } else {
        this.market.map(item => {
          if (item.state == true) {
            marketsIdArr.push(item.marketUniqueCode);
          }
        });
        markets = marketsIdArr.join("-");
        this.param.markets = markets;
      }
      let merchantarr = [];
      this.afterMerchant.map(item => {
        if (item.merchantUniqueCode) {
          merchantarr.push(item.merchantUniqueCode);
        }
      });
      let merchants = merchantarr.join("-");
      this.param.merchants = merchants;
      this.merchantRequst();
    },

    // 发送请求获取数据
    merchantRequst() {
      if (this.param.markets == "") {
        this.$message.error("请先选择商场");
         this.merchant=[];
          this.totalPage = 0;
      } else {
        ApiSetting.getMerchant.data = this.param;
        this.$http(ApiSetting.getMerchant).then(msg => {
          if (
            !msg ||
            msg.data.errCode !== 0 ||
            msg === undefined ||
            msg === null
          )
            return;
          this.merchant = msg.data.data.info;
          this.totalPage = msg.data.data.pageCount;
        });
      }
    },

    // 点击加入
    join_choose_merchant(index) {
      this.merchant = [...this.merchant];
      this.merchant[index].isSelect = 1;
      this.afterMerchant.push(this.merchant[index]);
      this.afterMerchant = Array.from(new Set(this.afterMerchant));
      this.afterMerchant = [...this.afterMerchant];
    },

    // 点击取消
    cancel_choose_merchant(index) {
      this.afterMerchant.splice(index, 1);
      this.afterMerchant = [...this.afterMerchant];
    },
    minimumMoney_change(){
      this.addCouponForm.couponType="满"
    },
    // 分页
    page_change(val) {
      this.param.pageNum = val;
      this.merchantRequst();
    }
  },
  created() {
    this.getmarket();
  }
};
</script>

<style>
.addCouponForm {
  margin-top: 25px;
}

.addCouponForm .el-input {
  width: 20%;
}

.addCouponForm .el-input__inner,
.addCouponForm .el-textarea__inner {
  border: 1px solid #9b9b9b;
}

.addCouponForm .u-special-input {
  width: 25%;
}

.addCouponForm .u-radio-input {
  margin-left:15px;
  width: 190px;
}

.addCouponForm .u-form-textarea {
  width: 40%;
  height: 80px;
}

.u-form-textarea .el-textarea {
  margin-top: 10px;
}

.addCouponForm .u-special-radio {
  display: block;
  margin-left: 0 !important;
  margin-top: 10px;
}

.addCouponForm .u-special-radio-group {
  margin-top: 10px;
}

.addCouponForm .el-form-item__label {
  font-size: 16px;
  color: #000;
}

.addCouponForm .u-special-font {
  display: inline-block;
  margin-left: 10px;
  color: #000;
  font-size: 14px;
}

.addCouponForm .box-card {
  width: 25%;
  height: 200px;
  margin-top: 10px;
  padding-bottom: 20px;
}

.addCouponForm .u-marketItem {
  color: #1989fa;
  position: relative;
}

.addCouponForm .u-icon-check {
  position: absolute;
  right: 10px;
  display: inline-block;
  font-weight: bolder;
}

.addCouponForm .u-choose-merchant {
  width: 90px;
  margin-left: 20px;
  height: 30px;
  position: relative;
  padding: 0;
  top: -4px;
}

.addCouponForm .u-choose-merchant span {
  position: absolute;
  top: 6px;
  left: 16px;
}

.u-cancel-merchant {
  position: absolute;
  right: 10px;
  color: #1989fa;
  display: inline-block;
}

.addCouponForm .el-radio__input.is-checked + .el-radio__label {
  color: #1989fa;
}

.addCouponForm .el-radio__input.is-checked .el-radio__inner {
  background: #1989fa;
  border-color: #1989fa;
}

/* 弹窗 */

.m-merchant-dialog .el-dialog__header {
  padding: 20px 30px 20px;
}

.m-merchant-dialog .el-dialog__body {
  padding-top: 0;
}

.u-search-input {
  text-align: left;
  padding-left: 10px;
}

.u-search-input .el-input {
  width: 65%;
}

.u-search-input .el-button {
  margin-left: 8%;
  width: 25%;
  margin-top: -4px;
}

.m-merchant-list {
  padding: 20px 10px 40px;
  overflow: hidden;
}

.m-merchant-list > li {
  clear: both;
  padding: 10px 0;
  width: 100%;
  border-top: 1px solid #e4e7ed;
}

.m-merchant-list > li > div {
  float: left;
  margin-bottom: 10px;
}

.m-merchant-list > li > div:nth-child(1) {
  width: 60%;
}

.m-merchant-list > li > div:nth-child(2) {
  width: 25%;
  margin-left: 20px;
  float: right;
}

.m-merchant-list > li > div:nth-child(2) p:nth-child(1) {
  color: #000;
}

.m-merchant-list > li > div:nth-child(2) {
  margin-top: 20px;
  text-align: right;
  /* width:15% */
  float: right;
}

.m-merchant-list > li > div:nth-child(2) .el-button {
  width: 90px;
  height: 30px;
  position: relative;
}

.m-merchant-list > li > div:nth-child(2) .el-button span {
  position: absolute;
  top: 6px;
  left: 30px;
}

.u-page {
  clear: both;
  text-align: center;
}

.u-page .el-pagination.is-background .btn-next,
.u-page .el-pagination.is-background .btn-prev,
.u-page .el-pagination.is-background .el-pager li {
  color: #ff7623;
  background: #ededee;
  border-radius: 5px;
  font-weight: 400;
}

.addCouponForm .u-alerting-user .u-special-font {
  color: #ff7623;
}

.addCouponForm .u-alerting-user {
  font-size: 12px;
}

.addCouponForm .box-card .box-card-div {
  width: 100%;
  height: 200px;
}

.addCouponForm .el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-card__body {
  padding-right: 0px;
}

.u-nochooseMarket {
  text-align: center;
  padding: 40px 0;
  color: #c9c9c9;
}

.u-nochooseMarket span {
  font-size: 30px;
}

.u-nochooseMarket p {
  margin-top: 30px;
  font-size: 16px;
}

.u-select-merchant {
  width: 80%;
  display: inline-block;
}
.u-special-item {
  display: inline-block;
}
</style>