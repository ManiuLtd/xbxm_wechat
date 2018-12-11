<template>
  <div id="m-record-content">
    <!-- 搜索部分 -->
    <header>
      <div>
        <el-form :inline="true" label-width="70px" :model="record_search_form" ref="record_search_form" class="demo-form-inline  c-search-form"
          action="" method="post">
          <el-row :gutter="32">
            <el-col :span="8" :xs="24">
              <el-form-item label="关键词" prop="keyWord">
                <el-input v-model="record_search_form.keyWord" placeholder="用户账号/第三方支付账号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="关键词" prop="merchantKeyWord" class="u-select">
                <el-input v-model="record_search_form.merchantKeyWord" placeholder="商户名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="商场" prop="marketUniqueCode" class="u-select">
                <el-select v-model="record_search_form.marketUniqueCode" placeholder="全部" clearable>
                  <el-option v-for="(item, index) in marketName" :key="index" :value="item.marketUniqueCode" :label="item.marketName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="8" :xs="24">
              <el-form-item label="状态" prop="state" class="u-select">
                <el-select v-model="record_search_form.state" placeholder="全部" clearable>
                  <el-option value=' ' label="全部"></el-option>
                  <el-option :value=1 label="失败"></el-option>
                  <el-option :value=2 label="成功"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="创建时间" prop="time">
                <el-date-picker v-model="record_search_form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                  value-format="timestamp" :default-time="['00:00:00', '23:59:59']" > 
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="32">
            <el-col :span="12" :xs="24">
              <div class="u-operation-button">
                <el-button icon="el-icon-wchat-daochu" @click="record_download_excel" v-if="recordList.length !== 0">导出</el-button>
              </div>
            </el-col>
            <el-col :span="12" :xs="24" id="u-button" class="u-special-button">
              <el-button type="primary" icon="el-icon-search" @click="record_serch('record_search_form')">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="record_reset('record_search_form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </header>

    <!-- 表格部分 -->
    <div class="m-content-table m-record—table">
      <el-table :data="recordList" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="rank" label="序号" width="55"></el-table-column>
        <el-table-column prop="billId" label="交易流水号" min-width="140px">
        </el-table-column>
        <el-table-column prop="transactionId" label="第三方支付单号" min-width="170px">
        </el-table-column>
        <el-table-column prop="phoneNum" label="用户账号" min-width="130px">
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间" min-width="130px">
          <template slot-scope="scope">
            <p>{{scope.row.payTime|moment("YYYY-MM-DD HH:mm:ss")}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" min-width="100px">
        </el-table-column>
        <el-table-column prop="payState" label="支付状态" min-width="100px">
          <template slot-scope="scope">
            <p v-if="scope.row.payState==1">失败</p>
            <p v-else-if="scope.row.payState==2">成功</p>
          </template>
        </el-table-column>
        <el-table-column prop="marketName" label="商场名称" min-width="100px">
        </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" min-width="100px">
        </el-table-column>
        <el-table-column prop="totalPrice" label="订单金额" min-width="100px">
        </el-table-column>
        <el-table-column prop="amountCoupon" label="优惠券面值" min-width="100px">
        </el-table-column>
        <el-table-column prop="amountRecieve" label="实付金额(订单金额-优惠券)" min-width="220px">
        </el-table-column>
      </el-table>
    </div>
    <!-- 脚部分页 -->
    <footer v-if='recordList.length>0'>
      <span> 共{{count}}条 | 每页显示{{param.pageSize}}条 </span>
      <el-pagination @current-change="merchant_handleCurrentChange" layout="prev, pager, next" :current-page="param.pageNum" :total="pageCount*10">
      </el-pagination>
    </footer>
  </div>
</template>
<script>
import ApiSetting from "../../common/js/apiSetting.js";
import util from "../../common/js/util.js";
export default {
  data() {
    return {
      loading: true,
      // 总页数
      pageCount: 1,
      // 总条数
      count: 1,
      // 搜索框商场名字
      marketName: [],
      // 搜索框
      record_search_form: {
        keyWord: "",
        merchantKeyWord: "",
        marketUniqueCode: "",
        time: [],
        state: 2
      },
      // 发送参数
      param: {
        pageNum: 1,
        pageSize: 10,
        keyWord: "",
        merchantKeyWord: "",
        marketUniqueCode: "",
        startTime: "",
        endTime: "",
        state: 2
      },
      // 重置参数
      resetParam: {
        pageNum: 1,
        pageSize: 10,
        keyWord: "",
        merchantKeyWord: "",
        marketUniqueCode: "",
        startTime: "",
        endTime: "",
        state: 2
      },
      // 商户列表
      recordList: []
    };
  },
  methods: {
    // 获取数据
    recordGetdata() {
      ApiSetting.transactionRecord.data = this.param;
      this.$http(ApiSetting.transactionRecord).then(msg => {
        if (!msg || msg.data.errCode !== 0 || msg === undefined) return;
        this.merchent_deal_data(msg.data.data);
      });
    },
    // 处理数据
    merchent_deal_data(data) {
      this.loading = false;
      this.recordList = data.info;
      this.recordList.map((item, index) => {
        item.rank = (this.param.pageNum - 1) * 10 + index + 1;
      });
      this.pageCount = data.pageCount;
      this.count = data.count;
    },
    // 获取所有商场名字
    chooseMarketName() {
      this.$http(ApiSetting.chooseMarketName).then(msg => {
        if (!msg || msg.data.errCode !== 0 || msg === undefined) return;
        this.marketName = msg.data.data;
      });
    },
    // 搜索
    record_serch(formName) {
      this.param = Object.assign({}, this.resetParam);
      this.param.keyWord = this.record_search_form.keyWord;
      this.param.merchantKeyWord = this.record_search_form.merchantKeyWord;
      this.param.marketUniqueCode = this.record_search_form.marketUniqueCode;
      this.param.state = this.record_search_form.state;
      if (this.record_search_form.time && this.record_search_form.time[0]) {
        this.param.startTime =
          new Date(this.record_search_form.time[0]).getTime() / 1000;
        this.param.endTime =
          new Date(this.record_search_form.time[1]).getTime() / 1000;
      } else {
        this.param.startTime = "";
        this.param.endTime = "";
      }
      this.recordGetdata();
    },
    // 重置表单
    record_reset(formName) {
      this.$refs[formName].resetFields();
      this.param = Object.assign({}, this.resetParam);

      this.recordGetdata();
    },
    // 导出Excel
    record_download_excel() {
      let param = {
        keyWord: this.param.keyWord,
        merchantKeyWord: this.param.merchantKeyWord,
        marketUniqueCode: this.param.marketUniqueCode,
        state: this.param.state,
        startTime: this.param.startTime,
        endTime: this.param.endTime,
        gTicket: ApiSetting.gTicket()
      };
      param = util.objToStr(param);
      param = encodeURI(encodeURI(param));
      console.log(param)
      window.location.href = `${ApiSetting.record_down_excel}?${param}`;
    },
    // 翻页
    merchant_handleCurrentChange(val) {
      this.param.pageNum = val;
      this.recordGetdata();
    }
  },
  created() {
    this.recordGetdata();
    this.chooseMarketName();
  }
};
</script>
<style lang="less">
#m-record-content {
  /* 操作 */
  .u-operation-button {
    clear: both;
    margin-bottom: 10px;
  }

  .u-operation-button .el-button {
    width: 110px;
    height: 40px;
    display: inline-block;
  }

  /* 表格部分 */
  .el-table::before {
    height: 0;
  }

  .el-table__body {
    border-collapse: separate;
    border-spacing: 0px 10px;
  }

  .el-table__body {
    border-collapse: separate;
    border-spacing: 0px 16px;
  }

  .el-table__row:nth-child(odd) {
    background: rgba(255, 118, 35, 0.1);
  }

  .el-table tr:nth-child(even) {
    border: 1px solid #ededee;
    background: #fff;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fff;
    border-bottom: 1px solid #ededee;
    border-top: 1px solid #ededee;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td:first-child {
    border-left: 1px solid #ededee;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td:last-child {
    border-right: 1px solid #ededee;
  }

  .el-table td {
    border: none;
  }

  .m-content-table .el-table {
    font-family: MicrosoftYaHei;
    margin-bottom: 80px;
    border: none;
  }

  .m-record—table .el-table th {
    min-width: 10px;
    background: #ff7623;
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 100;
    padding: 10px;
  }

  .m-content-table .el-table__footer-wrapper thead div,
  .el-table__header-wrapper thead div {
    background: #ff7623;
    color: #fff;
  }

  .m-record—table .el-table th {
    border: none;
    text-align: center;
  }

  .m-content-table .el-table tbody tr {
    height: 90px;
    border: 1px solid #999;
  }

  .m-content-table .el-table tbody tr td {
    margin-top: 20px;
    font-size: 12px;
    text-align: center;
  }

  .m-content-table .el-table tbody tr:nth-child(odd) {
    background: rgba(255, 118, 35, 0.1);
  }

  .m-content-table .el-table tbody tr:hover td {
    background: none;
  }

  .m-record—table .el-table tbody .cell {
    padding: 5px;
  }
  .m-record—table .el-table thead th > div {
    padding: 10px 0;
  }

  .m-record—table .el-table th:nth-child(5) > div {
    padding: 0 16px;
  }
  .m-record—table .el-table th:nth-child(3) > div {
    padding: 0 10px;
  }
  .m-record—table .el-table th:nth-child(4) > div,
  .m-record—table .el-table th:nth-child(2) > div {
    padding: 0 20px;
  }

  .m-content-table td p {
    margin: 0;
  }

  .m-content-table .el-table td {
    padding: 0px;
  }

  .u-specia-color {
    color: #3d68ff;
  }
  .u-special-button {
    margin-bottom: 14px;
  }
}
</style>