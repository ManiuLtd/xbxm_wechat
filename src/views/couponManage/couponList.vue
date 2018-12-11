<template>
  <div class="g-coupon-container">
    <header>
      <div class="m-search-condition">
        <el-form :inline="true" :model="coupon_search_form" label-width="70px"  ref="coupon_search_form" class="demo-form-inline c-search-form">
          <el-row :gutter="32">
            <el-col :span="8" :xs="24">
              <el-form-item label="关键词" prop="keyword">
                <el-input v-model="coupon_search_form.keyword" placeholder="优惠券名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="状态" prop="dataFlag">
                <el-select v-model="coupon_search_form.dataFlag" placeholder="全部" clearable>
                  <el-option value=" " label="全部"></el-option>
                  <el-option value=0 label="待投放"></el-option>
                  <el-option value=1 label="已投放"></el-option>
                  <el-option value=2 label="已下线"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="类型" prop="couponClass">
                <el-select v-model="coupon_search_form.couponClass" placeholder="全部" clearable>
                  <el-option value=" " label="全部"></el-option>
                  <el-option value=0 label="平台"></el-option>
                  <el-option value=1 label="商家"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
              <el-col :span="12" :xs="24">
                <el-form-item label="创建时间"  prop="time">
                  <el-date-picker v-model="coupon_search_form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                    value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24" id="u-button">
                  <el-button type="primary" @click="coupon_serch('coupon_search_form')"  icon="el-icon-search">搜索</el-button>
                  <el-button type="primary" @click="coupon_reset('coupon_search_form')" icon="el-icon-wchat-zhongzhi">重置</el-button>
              </el-col>
            </el-row>
        </el-form>
      </div>
    </header>
    <div class="u-operation-button">
      <el-button icon="el-icon-edit" @click="addCoupon_btn">新增</el-button>
    </div>
    <div class="m-coupon-table">
      <el-table stripe v-loading="loading" :data="userCoupons" style="width: 100%">
        <el-table-column label="序号" prop="rank" min-width="30px">
        </el-table-column>
        <el-table-column prop="batchNum" label="批次号" min-width="30px">
          <template slot-scope="scope">
            <p @click="toCouponInfo(scope.$index, scope.row)" class="u-specia-color u-special-point">{{scope.row.batchNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="couponName" label="优惠券名称" min-width="30px">
          <template slot-scope="scope">
            <p>{{scope.row.couponName}}
              <span v-if="scope.row.couponClass==0">（平台券）</span>
              <span v-else>（商家券）</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="couponPrice" label="优惠券价格" min-width="30px">
        </el-table-column>
        <el-table-column prop="couponMoney" label="优惠券面值" min-width="30px">
        </el-table-column>
        <el-table-column prop="storeNum" label="剩余数量" min-width="24px">
        </el-table-column>
        <el-table-column prop="receiveNum" label="领取数量" min-width="24px">
          <template slot-scope="scope">
            <p v-if="scope.row.receiveNum">{{scope.row.receiveNum}}</p>
            <p v-else>0</p>
          </template>
        </el-table-column>
        <el-table-column prop="useCount" label="使用数量" min-width="24px">
        </el-table-column>
        <el-table-column prop="sendStartTime" label="领取有效期" min-width="32px" class="u-table-time">
          <template slot-scope="scope">
            <p>{{scope.row.sendStartTime|moment("YYYY-MM-DD HH:mm:ss")}}</p>
            <p>至</p>
            <p>{{scope.row.sendEndTime|moment("YYYY-MM-DD HH:mm:ss")}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="creatUserName" label="使用有效期" min-width="32px">
          <template slot-scope="scope">
            <p>{{scope.row.validStartTime|moment("YYYY-MM-DD HH:mm:ss")}}</p>
            <p>至</p>
            <p>{{scope.row.validEndTime|moment("YYYY-MM-DD HH:mm:ss")}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="30px">
          <template slot-scope="scope">
            <p>{{scope.row.createTime*1000|moment("YYYY-MM-DD HH:mm:ss")}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="dataFlag" label="状态" min-width="24px">
          <template slot-scope="scope">
            <p v-if="scope.row.dataFlag==0">待投放</p>
            <p v-else-if="scope.row.dataFlag==1">已投放</p>
            <p v-else-if="scope.row.dataFlag==2">已下线</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="40px">
          <template slot-scope="scope">
            <p class="u-specia-color u-special-point" @click="coupon_check(scope.$index, scope.row)" v-if="scope.row.dataFlag!=0">查看领取</p>
            <p class="u-specia-color u-special-point" @click="coupon_edit(scope.$index, scope.row) " v-if="scope.row.dataFlag==0">编辑</p>
            <p class="u-specia-color u-special-point" @click="conpon_launch(scope.$index, scope.row)" v-if="scope.row.dataFlag==0">投放</p>
            <p class="u-specia-color u-special-point" @click="coupon_downline(scope.$index, scope.row)" v-if="scope.row.dataFlag==1">强制下线</p>
            <p class="u-specia-color u-special-point" v-clipboard:copy="scope.row.message" @click="onCopy(scope.$index, scope.row)" v-clipboard:error="onError(scope.$index, scope.row)" v-if="scope.row.dataFlag==1">复制领券链接</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 脚部分页 -->
    <footer v-if='userCoupons.length>0'>
      <span> 共{{count}}条 | 每页显示{{param.pageSize}}条 </span>
      <el-pagination :current-page="param.pageNum" @current-change="coupon_handleCurrentChange" layout="prev, pager, next" :total="pageCount*10">
      </el-pagination>
    </footer>



    <!-- 强制下线弹窗 -->
    <el-dialog :modal="false" :visible.sync="downline_dialogVisible" class="m-couponList-dialog" width="30%">
      <p>确认强制下线</p>
      <span>该优惠券将在前台下线，无法领取</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downline_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm_downline">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 确认投放弹窗 -->
    <el-dialog :modal="false" class="m-couponList-dialog" :visible.sync="launch_dialogVisible" width="30%">
      <p>确认投放</p>
      <span>投放后，可以复制领券链接使用了</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="launch_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm_launch">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from "axios";
  import ApiSetting from "../../common/js/apiSetting.js";
  export default {
    data() {
      return {
        loading: true,
        // 总页数
        pageCount: 1,
        // 总条数
        count: 0,
        // 搜索框
        coupon_search_form: {
          keyword: "",
          dataFlag: "",
          time:[],
          couponClass: "",
        },
        // 发送参数
        param: {
          pageNum: 1,
          pageSize: 10,
          keyword: "",
          dataFlag: "",
          beginCreateTime: "",
          endCreateTime: ""
        },
        // 重置参数
        resetParam: {
          pageNum: 1,
          pageSize: 10,
          keyword: "",
          dataFlag: "",
          beginCreateTime: "",
          endCreateTime: ""
        },
        // 商户列表
        userCoupons: [],
        // 确认下线弹窗
        downline_dialogVisible: false,
        // 确认投放弹窗
        launch_dialogVisible: false,
        // 投放ID
        launchCouponId: "",
        // 下线ID
        downCouponId: ""
      };
    },
    methods: {
      // 获取数据
      couponGetdata() {
        ApiSetting.couponList.data = this.param;
        this.$http(ApiSetting.couponList).then(msg => {
          if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null)
            return;
          this.loading = false;
          this.coupon_deal_data(msg.data.data);
        });
      },

      // 处理数据
      coupon_deal_data(data) {
        data.info.map(item => {
          item.message = `${ApiSetting.copyLink}?batchNum=${item.batchNum}`;
        });
        this.userCoupons = data.info;
        this.userCoupons.map((item, index) => {
          item.rank = (this.param.pageNum - 1) * 10 + index + 1;
        });
        this.pageCount = data.pageCount;
        this.count = data.count;
      },

      // 搜索
      coupon_serch(formName) {
        this.param = Object.assign({}, this.resetParam);
        this.param.keyword = this.coupon_search_form.keyword;
        this.param.dataFlag = this.coupon_search_form.dataFlag;
        this.param.couponClass = this.coupon_search_form.couponClass;
        if (this.coupon_search_form.time&& this.coupon_search_form.time[0]) {
            this.param.beginCreateTime = new Date(this.coupon_search_form.time[0]).getTime()/1000;
          this.param.endCreateTime  = new Date(this.coupon_search_form.time[1]).getTime()/1000;
        }else{
           this.param.beginCreateTime =""
           this.param.endCreateTime =""
        }
        console.log(this.coupon_search_form)
        this.couponGetdata();
      },

      // 重置表单
      coupon_reset(formName) {
        this.$refs[formName].resetFields();
        this.param = Object.assign({}, this.resetParam);
        this.couponGetdata();
      },

      // 新增
      addCoupon_btn() {
        this.$router.push("/addCoupon");
      },
      // 去详情
      toCouponInfo(index, row) {
        this.$router.push({
          name: "优惠券详情",
          params: {
            batchNum: row.batchNum
          }
        });
      },
      // 编辑
      coupon_edit(index, row) {
        this.$router.push({
          name: "编辑优惠券",
          params: {
            couponId: row.couponId,
            batchNum: row.batchNum
          }
        });
      },
      //查看领取
      coupon_check(index, row) {

        this.$router.push({
          name: "查看领取",
          params: {
            batchNum: row.batchNum
          }
        });
      },
      // 翻页
      coupon_handleCurrentChange(val) {
        this.param.pageNum = val;
        this.couponGetdata();
      },
      // 点击投放
      conpon_launch(index, row) {
        this.launch_dialogVisible = true;
        this.launchCouponId = row.batchNum;
      },
      // 确认发放
      confirm_launch() {
        let param = {
          batchNum: this.launchCouponId
        };
        ApiSetting.launchConpon.data = param;
        this.$http(ApiSetting.launchConpon).then(msg => {
          if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null)
            return;
          if (msg.data.errCode == 0) {
            this.launch_dialogVisible = false;
            this.couponGetdata();
          }
        });
      },
      // 点击强制下线
      coupon_downline(index, row) {
        this.downline_dialogVisible = true;
        this.downCouponId = row.batchNum;
      },
      // 确认强制下线
      confirm_downline() {
        let param = {
          batchNum: this.downCouponId
        };
        ApiSetting.downline.data = param;
        this.$http(ApiSetting.downline).then(msg => {
          if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null)
            return;
          if (msg.data.errCode == 0) {
            this.downline_dialogVisible = false;
            this.couponGetdata();
          }
        });
      },
      onCopy: function (index, row) {
        this.$message({
          message: "复制链接成功",
          type: "success"
        });
      },
      onError: function (index, row) {
        //  this.$message.error('复制链接失败');
      }
    },
    created() {
      this.couponGetdata();
    }
  };
</script>
<style>
  /* 操作 */
  .g-coupon-container .u-operation-button {
    margin-bottom: 10px;
    float: left;
  }

  .g-coupon-container .u-operation-button .el-button {
    width: 100px;
    height: 40px;
    display: inline-block;
  }

  .g-coupon-container .m-search-operation {
    text-align: center;
    float: right;
  }

  .g-coupon-container .m-search-operation button {
    text-align: center;
    background: #ff7623;
    color: #fff;
    border-radius: 5px;
    border: none;
    outline: none;
    width: 180px;
    height: 40px;
    margin-left: 20px;
    margin-bottom: 20px;
  }

  /* 表格部分 */

  .m-coupon-table .el-table::before {
    height: 0;
  }

  .m-coupon-table .el-table__body {
    border-collapse: separate;
    border-spacing: 0px 10px;
  }

  .m-coupon-table .el-table__body {
    border-collapse: separate;
    border-spacing: 0px 16px;
  }

  .m-coupon-table .el-table__row:nth-child(odd) {
    background: rgba(255, 118, 35, 0.1);
  }

  .m-coupon-table .el-table__row:nth-child(even) {
    background: #fff;
    border: 1px solid #ededee;
  }

  .m-coupon-table .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fff;
    border-bottom: 1px solid #ededee;
    border-top: 1px solid #ededee;
  }

  .m-coupon-table .el-table--striped .el-table__body tr.el-table__row--striped td:first-child {
    border-left: 1px solid #ededee;
  }

  .m-coupon-table .el-table--striped .el-table__body tr.el-table__row--striped td:last-child {
    border-right: 1px solid #ededee;
  }

  .m-coupon-table .el-table td {
    border: none;
  }

  /* 表格部分 */

  .m-coupon-table .el-table .el-table_2_column_16 .cell {
    padding-right: 0;
  }

  .m-coupon-table .el-table {
    font-family: MicrosoftYaHei;
    margin-bottom: 80px;
    border: none;
  }

  .m-coupon-table .el-table th {
    min-width: 10px;
    background: #ff7623;
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 100;
  }

  .m-coupon-table .el-table__footer-wrapper thead div,
  .el-table__header-wrapper thead div {
    background: #ff7623;
    color: #fff;
  }

  .m-coupon-table .el-table th {
    border: none;
    text-align: center;
  }

  .g-coupon-container .m-coupon-table .el-table tbody tr {
    height: 145px;
  }

  .m-coupon-table .el-table tbody tr td {
    margin-top: 20px;
    font-size: 12px;
    text-align: center;
  }

  .m-coupon-table .el-table tbody tr:nth-child(odd) {
    background: rgba(255, 118, 35, 0.1);
  }

  .m-coupon-table .el-table tbody tr:hover td {
    background: none;
  }
  .g-coupon-container .m-coupon-table .el-table th:nth-child(1) div {
    padding: 0;
  }

  .m-coupon-table .el-table .cell {
    padding-right: 8px;
  }

  .m-coupon-table .el-table_1_column_11 .cell {
    padding-right: 0px;
  }

  .m-coupon-table td p {
    margin: 0;
  }

  .m-coupon-table .el-table td,
  .m-coupon-table .el-table th {
    padding: 10px 0;
  }

  .u-specia-color {
    color: #3d68ff;
  }

 

  /* 两个弹窗部分 */

  .m-couponList-dialog {
    text-align: center;
  }

  .m-couponList-dialog .el-dialog__body {
    padding-bottom: 20px;
  }

  .m-couponList-dialog p {
    font-size: 16px;
    color: #303133;
    text-align: center;
    margin-bottom: 20px;
  }

  .m-couponList-dialog .el-dialog__body span {
    font-size: 12px;
    color: #303133;
    text-align: center;
  }

  .m-couponList-dialog .el-dialog__footer {
    text-align: center;
  }

  .m-couponList-dialog .el-button {
    width: 120px;
    border-radius: 30px;
    margin-bottom: 20px;
  }
</style>