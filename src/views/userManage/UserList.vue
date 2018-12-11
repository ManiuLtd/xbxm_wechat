<template>
  <div>
    <!-- 搜索部分 -->
    <header>
      <div>
        <el-form :inline="true"  label-width="70px" :model="user_search_form" class="demo-form-inline c-search-form" ref="user_search_form">
             <el-row :gutter="32">
            <el-col :span="12" :xs="24">
               <el-form-item label="关键词" prop="phoneNum">
            <el-input v-model="user_search_form.phoneNum" placeholder="用户账号" clearable></el-input>
          </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24" id="u-button">
                <el-button type="primary" icon="el-icon-search" @click="user_serach('user_search_form')">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="user_reset('user_search_form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </header>
    <div class="u-operation-button">
      <el-button icon="el-icon-wchat-daochu" v-if="userList.length !== 0" @click="user_download_excel">导出</el-button>
    </div>
    <!-- 数据表格部分 -->
    <div class="m-user-table">
      <el-table :data="userList" style="width: 100%" stripe v-loading="loading">
        <el-table-column label="序号" prop="rank" width="55"></el-table-column>
        <el-table-column prop="phoneNum" label="用户账号"> </el-table-column>
        <el-table-column prop="nickname" label="用户微信昵称"></el-table-column>
        <el-table-column prop="userCoupons" label="有效优惠券" align="center">
          <template slot-scope="scope">
            <div class="m-coupon-info" v-if="scope.row.userCoupons.length>3">
              <el-scrollbar style="height: 100%" >
                  <p v-for="(item, index) in scope.row.userCoupons" :key="index">{{item}}</p>
              </el-scrollbar>
            </div>
              <div class="u-couponname" v-else>
                  <p v-for="(item, index) in scope.row.userCoupons" :key="index">{{item}}</p>
                </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="60px">
          <template slot-scope="scope">
            <p>{{scope.row.createTime|moment("YYYY-MM-DD HH:mm:ss")}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 脚部分页 -->
    <footer v-if='userList.length>0'>
      <span> 共{{count}}条 | 每页显示{{param.pageSize}}条 </span>
      <el-pagination @current-change="user_handleCurrentChange" :current-page="param.pageNum" layout="prev, pager, next" :total="pageCount*10">
      </el-pagination>
    </footer>
  </div>
</template>

<script>
  import util from "../../common/js/util.js";
  import ApiSetting from "../../common/js/apiSetting.js";
  export default {
    data() {
      return {
        loading: true,
        // 总页数
        pageCount: 10,
        // 总条数
        count: 0,
        // 搜索表单
        user_search_form: {
          phoneNum: ""
        },
        // 发送参数
        param: {
          pageNum: 1,
          pageSize: 10,
          phoneNum: ""
        },
        // 重置参数
        resetParam: {
          pageNum: 1,
          pageSize: 10,
          phoneNum: ""
        },
        // 表格数据
        userList: []
        // 优惠券数据
      };
    },
    methods: {
      // 获取数据
      user_getData() {
        ApiSetting.userListData.data = this.param;
        this.$http(ApiSetting.userListData).then(msg => {
          if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null)
            return;
          this.user_deal_data(msg.data.data);
        });
      },
      // 处理数据
      user_deal_data(data) {
        this.loading = false;
        this.userList = data.info;
        this.userList.map((item, index) => {
          item.rank = (this.param.pageNum - 1) * 10 + index + 1;
        });
        this.pageCount = data.pageCount;
        this.count = data.count;
      },
      // 搜索
      user_serach() {
        this.param = Object.assign({}, this.resetParam);
        this.param.phoneNum = this.user_search_form.phoneNum;
        this.user_getData();
      },
      // 重置
      user_reset(formName) {
        this.$refs[formName].resetFields();
        this.param = Object.assign({}, this.resetParam);
        this.user_getData();
      },
      // 翻页
      user_handleCurrentChange(val) {
        this.param.pageNum = val;
        this.user_getData();
      },
      // 导出
      user_download_excel() {
        let param = {
          phoneNum: this.param.phoneNum,
          gTicket: ApiSetting.gTicket()
        };
        param = util.objToStr(param);
        param=encodeURI(encodeURI(param))
        window.location.href = `${ApiSetting.user_download_excel}?${param}`;
      }
    },
    created() {
      this.user_getData();
    }
  };
</script>
<style lang="less">

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

  .m-user-table .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fff;
    border-bottom: 1px solid #ededee;
    border-top: 1px solid #ededee;
    
  }

  .m-user-table .el-table--striped .el-table__body tr.el-table__row--striped td:first-child {
    border-left: 1px solid #ededee;
  }

 .m-user-table .el-table--striped .el-table__body tr.el-table__row--striped td:last-child {
    border-right: 1px solid #ededee;
  }

  .el-table td {
    border: none;
  }

  .m-user-table .el-table {
    font-family: MicrosoftYaHei;
    margin-bottom: 80px;
    border: none;
  }

  .m-user-table .el-table th {
    min-width: 10px;
    background: #ff7623;
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 100;
  }

  .m-user-table .el-table__footer-wrapper thead div,
  .el-table__header-wrapper thead div {
    background: #ff7623;
    color: #fff;
  }

  .m-user-table .el-table th {
    border: none;
    text-align: center;
  }

  .m-user-table .el-table tbody tr {
    height: 90px;
    border: 1px solid #999;
  }

  .m-user-table .el-table tbody tr td {
   
    margin-top: 20px;
    font-size: 12px;
    text-align: center;
  }

  .m-user-table .el-table tbody tr:nth-child(odd) {
    background: rgba(255, 118, 35, 0.1);
  }

  .m-user-table .el-table tbody tr:hover td {
    background: none;
  }

  .m-user-table .el-table .cell,
  .m-user-table .el-table th>div {
    padding: 0px;
  }

  .m-user-table td p {
    margin: 0;
  }

  .m-user-table .el-table td,
  .m-user-table .el-table th {
    padding: 0px;
  }
  .m-coupon-info {
    height: 80px;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .u-couponname{
      display:inline;
      vertical-align: middle
    }
  }
</style>