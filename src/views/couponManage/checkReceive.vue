<template>
  <div class="p-check-receive">
    <div>
      <el-form :model="receiveForm" ref="receiveForm" label-width="70px" class="c-search-form">
        <el-row :gutter="32">
          <el-col :span="8" :xs="24">
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="receiveForm.keyword" placeholder="用户手机" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="状态" class="f-status" prop="status">
              <el-select v-model="receiveForm.status" placeholder="全部" clearable>
                <el-option label="全部" value=' '></el-option>
                <el-option label="未使用" value="0"></el-option>
                <el-option label="已使用" value="1"></el-option>
                <el-option label="已失效" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12" :xs="24">
            <div class="m-button">
              <el-button icon="el-icon-wchat-daochu" v-if="coupons.length !== 0" @click="coupon_download_excel">导出</el-button>
            </div>
          </el-col>
            <el-col :span="12" :xs="24" id="u-button">
              <el-button type="primary" @click="receieveOnSubmit" icon="el-icon-search">搜索</el-button>
              <el-button type="primary" @click="receieveResetForm('receiveForm')" icon="el-icon-wchat-zhongzhi">重置</el-button>
            </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g-list-show">
      <div class="m-list-detail">
        <el-table :data="coupons" style="width: 100%" stripe v-loading="loading">
          <el-table-column label="序号" width="55" prop="rank">
          </el-table-column>
          <el-table-column label="优惠券券码">
            <template slot-scope="scope">
              {{scope.row.userCouponCode}}
            </template>
          </el-table-column>
          <el-table-column label="优惠券名称">
            <template slot-scope="scope">
              {{scope.row.couponName}}
            </template>
          </el-table-column>
          <el-table-column label="优惠券价格">
            <template slot-scope="scope">
              {{scope.row.couponPrice}}
            </template>
          </el-table-column>
          <el-table-column label="优惠券面值">
            <template slot-scope="scope">
              {{scope.row.couponMoney}}
            </template>
          </el-table-column>
          <el-table-column prop="userTel" label="用户">
          </el-table-column>
          <el-table-column prop="getTime" label="领取时间">
            <template slot-scope="scope">
              {{scope.row.getTime|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column prop="useTime" label="使用时间">
            <template slot-scope="scope">
              {{scope.row.useTime|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="55px">
            <template slot-scope="scope">
              <span :class="checkStatusMap[scope.row.status].css">{{checkStatusMap[scope.row.status].text}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 脚部分页 -->
      <footer v-if='coupons.length>0'>
        <span> 共{{count}}条 | 每页显示{{param.pageSize}}条 </span>
        <!--表格分页-->
        <el-pagination :current-page="param.pageNum" @current-change="handleCurrentChange" layout="prev, pager, next" :total="pageCount*10">
        </el-pagination>
      </footer>
    </div>
  </div>
</template>

<script>
  import ApiSetting from "../../common/js/apiSetting";
  import util from "../../common/js/util.js";
  export default {
    data() {
      return {
        coupons: [],
        pageCount: 10,
        count: 0,
        receiveForm: {
          keyword: "",
          status: ""
        },
        param: {
          keyword: "",
          batchNum: "",
          status: "",
          pageSize: 10,
          pageNum: 1
        },
        resetParam: {
          keyword: "",
          batchNum: "",
          status: "",
          pageSize: 10,
          pageNum: 1
        },
        loading: false,
        checkStatusMap: {
          0: {
            css: "red",
            text: "未使用"
          },
          1: {
            css: "green",
            text: "已使用"
          },
          2: {
            css: "red",
            text: "已失效"
          }
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.param.batchNum = this.$route.params.batchNum;
        this.$http({
          url: ApiSetting.checkReceive,
          data: this.param,
          method: "post"
        }).then(res => {
          this.loading = false;
          if (
            !res ||
            res.data.errCode !== 0 ||
            res === undefined ||
            res.data === null
          )
            return;
          this.coupons = res.data.data.info;
          this.coupons.map((item, index) => {
            item.rank = (this.param.pageNum - 1) * 10 + index + 1;
          });
          this.count = res.data.data.count;
          this.pageCount = res.data.data.pageCount;
        });
      },

      // 搜索提交
      receieveOnSubmit() {
        this.param.pageNum = 1;
        this.param.keyword = this.receiveForm.keyword;
        this.param.status = this.receiveForm.status;
        this.getData();
      },

      // 翻页
      handleCurrentChange(val) {
        this.param.pageNum = val;
        this.getData();
      },

      // 重置
      receieveResetForm(formName) {
        this.$refs[formName].resetFields();
        this.param = Object.assign({}, this.resetParam);
        this.getData();
      },

      // 导出Excel
      coupon_download_excel() {
        let param = {
          batchNum: this.$route.params.batchNum,
          keyword: this.param.keyword,
          status: this.param.status,
          gTicket: ApiSetting.gTicket()
        };
        param = util.objToStr(param);
        param = encodeURI(encodeURI(param))
        window.location.href = `${ApiSetting.receive_download_excel}?${param}`;
      }
    }
  };
</script>
<style lang="less">
  @import "../../styles/couponManage/checkReceive.less";
</style>