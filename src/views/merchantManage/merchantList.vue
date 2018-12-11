<template>
  <div>
    <!-- 搜索部分 -->
    <header>
      <div class="m-search-condition">
        <el-form :inline="true" :model="merchant_search_form" ref="merchant_search_form" class="demo-form-inline c-search-form" label-width="70px" >
          <el-row :gutter="32">
            <el-col :span="8" :xs="24">
              <el-form-item label="关键词" prop="keyWord">
                <el-input v-model="merchant_search_form.keyWord" placeholder="商户名称/店面名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="状态" prop="storeStatus" class="u-select">
                <el-select v-model="merchant_search_form.storeStatus" placeholder="全部" clearable>
                  <el-option value="全部"></el-option>
                  <el-option value="启用"></el-option>
                  <el-option value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="商场" prop="marketId" class="u-select">
                <el-select v-model="merchant_search_form.marketId" placeholder="全部" clearable>
                  <el-option v-for="(item, index) in marketName" :key="index" :value="item.marketId" :label="item.marketName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="12" :xs="24">
              <el-form-item label="创建时间" prop="time">
                <el-date-picker v-model="merchant_search_form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24" id="u-button"> 
                <el-button type="primary" icon="el-icon-search" @click="merchant_serch('merchant_search_form')">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="merchant_reset('merchant_search_form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </header>
    <div class="u-operation-button">
      <el-button icon="el-icon-edit" @click="addMerchant_btn">新增</el-button>
      <el-button icon="el-icon-wchat-daochu" @click="merchant_download_excel" v-if="merchantList.length !== 0">导出</el-button>
    </div>

    <!-- 表格部分 -->
    <div class="m-content-table">
      <el-table :data="merchantList" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="rank" label="序号" width="50"></el-table-column>
        <el-table-column prop="storeUniqueCode" label="店面编码">
          <template slot-scope="scope">
            <p class="u-specia-color u-special-point" @click="merchant_info(scope.$index, scope.row)">{{scope.row.storeUniqueCode}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="店面名称">
        </el-table-column>
        <el-table-column prop="merchantName" label="商户名称">
        </el-table-column>
        <el-table-column prop="marketName" label="商场">
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="负责人">
        </el-table-column>
        <el-table-column prop="responsiblePersonPhone" label="负责人电话">
        </el-table-column>
        <el-table-column prop="storeFloor" label="楼层">
          <template slot-scope="scope">
            <p>{{scope.row.storeFloor.replace(/\|/g,",")}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="storeBooth" label="摊位" min-width="50px">
        </el-table-column>
        <el-table-column prop="storeStatus" label="状态" min-width="50px">
          <template slot-scope="scope">
            <p v-if="scope.row.storeStatus==1">启用</p>
            <p v-else-if="scope.row.storeStatus==0">禁用</p>
          </template>
        </el-table-column>
        <el-table-column prop="creatUserName" label="创始人">
        </el-table-column>
        <el-table-column prop="storecreatDate" label="创建时间">
          <template slot-scope="scope">
            <p>{{scope.row.storecreatDate|moment("YYYY-MM-DD HH:mm:ss")}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="编辑">
          <template slot-scope="scope">
            <p class="u-specia-color u-special-point" @click="merchant_down_code(scope.$index, scope.row)" v-if="scope.row.storeStatus==1">下载二维码</p>
            <p class="u-specia-color u-special-point" @click="merchant_edit(scope.$index, scope.row)" >编辑</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 脚部分页 -->
    <footer v-if='merchantList.length>0'>
      <span> 共{{count}}条 | 每页显示{{param.pageSize}}条 </span>
      <el-pagination :current-page="param.pageNum" @current-change="merchant_handleCurrentChange" layout="prev, pager, next" :total="pageCount*10">
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
        merchant_search_form: {
          keyWord: "",
          storeStatus: "",
          marketId: "",
          time:[],
        },
        // 发送参数
        param: {
          pageNum: 1,
          pageSize: 10,
          keyWord: "",
          marketId: "",
          storeStatus: "",
          createStartTime: "",
          createEndTime: ""
        },
        // 重置参数
        resetParam: {
          pageNum: 1,
          pageSize: 10,
          keyWord: "",
          marketId: "",
          storeStatus: "",
          createStartTime: "",
          createEndTime: ""
        },
        // 商户列表
        merchantList: []
      };
    },
    methods: {
      // 获取数据
      merchantGetdata() {
        ApiSetting.merchantGetdata.data = this.param;
        this.$http(ApiSetting.merchantGetdata).then(msg => {
          if (!msg || msg.data.errCode !== 0 || msg === undefined) return;
          this.merchent_deal_data(msg.data.data);
        });
      },
      // 处理数据
      merchent_deal_data(data) {
        this.loading = false;
        this.merchantList = data.info;
        this.merchantList.map((item, index) => {
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
      merchant_serch(formName) {
        this.param = Object.assign({}, this.resetParam);
        this.param.keyWord = this.merchant_search_form.keyWord;
        this.param.marketId = this.merchant_search_form.marketId;
        let state = this.merchant_search_form.storeStatus;
        if (state == "全部") {
          this.param.storeStatus = "";
        } else if (state == "启用") {
          this.param.storeStatus = "1";
        } else if (state == "禁用") {
          this.param.storeStatus = "0";
        }
        if (this.merchant_search_form.time) {
          this.param.createStartTime = this.merchant_search_form.time[0]
          this.param.createEndTime = this.merchant_search_form.time[1]
        }else{
           this.param.createStartTime =""
           this.param.createEndTime =""
        }
        this.merchantGetdata();
      },
      // 重置表单
      merchant_reset(formName) {
        this.$refs[formName].resetFields();
        this.param = Object.assign({}, this.resetParam);
        this.merchantGetdata();
      },
      // 新增
      addMerchant_btn() {
        this.$router.push("/addMerchant");
      },
      // 导出Excel
      merchant_download_excel() {
        let param = {
          keyWord: this.param.keyWord,
          marketId: this.param.marketId,
          storeStatus: this.param.storeStatus,
          createStartTime: this.param.createStartTime,
          createEndTime: this.param.createEndTime,
          gTicket: ApiSetting.gTicket()
        };
        param = util.objToStr(param);
        param=encodeURI(encodeURI(param));
        
        window.location.href = `${ApiSetting.merchant_download_excel}?${param}`;
      },
      // 下载二维码
      merchant_down_code(index, row) {
        let param = {
          gTicket: ApiSetting.gTicket(),
          storeUniqueCode: row.storeUniqueCode
        };
        param = util.objToStr(param);
        console.log(param)
        window.location.href = `${ApiSetting.merchant_down_code}?${param}`;
      },
      // 编辑
      merchant_edit(index, row) {
        this.$router.push({
          name: "编辑商户",
          params: {
            storeId: row.storeId
          }
        });
      },
      // 跳到详情页
      merchant_info(index, row) {
        this.$router.push({
          name: "商户详情",
          params: {
            storeId: row.storeId
          }
        });
      },
      // 翻页
      merchant_handleCurrentChange(val) {
        this.param.pageNum = val;
        this.merchantGetdata();
      }
    },
    created() {
      this.merchantGetdata();
      this.chooseMarketName();
    }
  };
</script>
<style>
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

  .m-content-table .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fff;
    border-bottom: 1px solid #ededee;
    border-top: 1px solid #ededee;
  }

  .m-content-table .el-table--striped .el-table__body tr.el-table__row--striped td:first-child {
    border-left: 1px solid #ededee;
  }

  .m-content-table .el-table--striped .el-table__body tr.el-table__row--striped td:last-child {
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

  .m-content-table .el-table th {
    min-width: 10px;
    background: #ff7623;
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 100;
  }

  .m-content-table .el-table__footer-wrapper thead div,
  .el-table__header-wrapper thead div {
    background: #ff7623;
    color: #fff;
  }

  .m-content-table .el-table th {
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

  .m-content-table .el-table .cell,
  .m-content-table .el-table th>div {
    padding: 0px;
  }

  .m-content-table td p {
    margin: 0;
  }

  .m-content-table .el-table td,
  .m-content-table .el-table th {
    padding: 0px;
  }

  .u-specia-color {
    color: #3d68ff;
  }
</style>