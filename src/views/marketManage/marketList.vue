<template>
  <div class="p-market-list">
      <el-form :model="marketForm" :inline="true" ref="marketForm" label-width="70px" class="c-search-form">
        <el-row :gutter="32">
          <el-col :span="8" :xs="24">
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="marketForm.keyword" placeholder="商场名称/商场负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="状态" prop="qStatus">
              <el-select v-model="marketForm.qStatus" placeholder="请选择商场状态" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="省市区">
              <el-cascader clearable  change-on-select :options="options" :props="props" v-model="selectedoption" @change="handleItemChange" @active-item-change="handleItemChange"
                placeholder="省市区"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12" :xs="24">
            <el-form-item label="创建时间"  prop="time">
              <el-date-picker v-model="marketForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                value-format="timestamp" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" id="u-button">
              <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
              <el-button type="primary" @click="resetForm('marketForm')" icon="el-icon-wchat-zhongzhi">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    <div class="g-list-show">
      <div class="m-button">
        <el-button icon="el-icon-edit" @click="addMarket">新增</el-button>
        <el-button icon="el-icon-wchat-daochu" v-if="marketList.tableData.length !== 0" @click="market_download_excel">导出</el-button>
      </div>
      <div class="m-list-detail">
        <el-table :data="marketList.tableData" style="width: 100%" stripe v-loading="loading">
          <el-table-column prop="rank" width="60" label="序号">
          </el-table-column>
          <el-table-column prop="marketUniqueCode" label="商场编号">
            <template slot-scope="scope">
              <p @click="toMarketInfo(scope.$index, scope.row)" class="u-special-font u-special-point">{{scope.row.marketUniqueCode}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="marketName" label="商场名称">
          </el-table-column>
          <el-table-column prop="personLiableName" label="商场负责人" min-width="100px">
          </el-table-column>
          <el-table-column prop="phoneNumber" label="负责人电话" min-width="100px">
          </el-table-column>
          <el-table-column prop="location" label="省市区">
          </el-table-column>
          <el-table-column prop="detailAddress" label="详细地址" min-width="100px">
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="60px">
            <template slot-scope="scope">
              <span :class="checkStatusMap[scope.row.status].css">{{checkStatusMap[scope.row.status].text}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="创建人">
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间">
            <template slot-scope="scope">
              {{scope.row.createdTime|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <p @click="toEditMarket(scope.$index, scope.row)" class="u-special-font u-special-point">编辑</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 脚部分页 -->
      <footer v-if="marketList.tableData.length !== 0">
        <span> 共{{marketList.totalSize}}条 | 每页显示{{marketList.query.pieces}}条 </span>
        <!--表格分页-->
        <el-pagination layout="prev, pager, next" :page-size="marketList.query.pieces" @current-change="handleCurrentChange" :current-page="marketList.query.page"
          :total="marketList.totalSize">
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
        selectedoption: [],
        marketList: {
          tableData: [],
          query: {}
        },
        marketForm: {
          time: [],
          keyword: "",
          firstLevArea: "",
          secondLevArea: "",
          thirdLevArea: "",
          fromTime: "",
          toTime: "",
          qStatus: "",
          pieces: "",
          page:"",
        },
        loading: true,
        checkStatusMap: {
          0: {
            css: "red",
            text: "禁用"
          },
          1: {
            css: "green",
            text: "启用"
          }
        },
        options: [],
        props: {
          value: "areaCodeId",
          label: "areaName",
          children: "areaList"
        },
        selectedOptions: ["", "", ""]
      };
    },
    created() {
      this.getData();
      this.handleItemChange([]);
    },
    methods: {
      getData(pageParam) {
        var page = this.marketForm.page || pageParam;
        if (this.marketForm.time) {
          this.marketForm.fromTime = this.marketForm.time[0];
          this.marketForm.toTime = this.marketForm.time[1];
        } else {
          this.marketForm.fromTime = ""
          this.marketForm.toTime = ""
        }
        var data = {
          ...this.marketForm,
          firstLevArea: this.selectedOptions[0],
          secondLevArea: this.selectedOptions[1],
          thirdLevArea: this.selectedOptions[2],
          page: page
        };
        delete data.time;
        this.$http({
          url: ApiSetting.marketList,
          data: data,
          method: "post"
        }).then(res => {
          if (
            !res ||
            res.data.errCode !== 0 ||
            res === undefined ||
            res.data === null
          )
            return;
          this.loading = false;
          this.marketList = res.data.data;
          this.marketList.tableData = res.data.data.marketList;
          this.marketList.tableData.map((item, index) => {
            item.rank = (this.marketList.query.page - 1) * 10 + index + 1
          })
          this.marketList.query = res.data.data.query;
        });
      },
      onSubmit() {
        this.getData();
      },
      handleItemChange(val) {
        this.$http({
          url: ApiSetting.getRegion,
          method: "post",
          data: { pid: val[val.length - 1] || -1 }
        }).then(res => {
          if (!res || res.data.errCode !== 0 || res === undefined) return;
          if (val && val.length === 0) {
            this.options = res.data.data.areaList;
            this.options.map((item, index) => {
              return this.$set(item, "areaList", []);
            });
          } else if (val && val.length === 1) {
            this.options.filter((item, index) => {
              if (
                item.areaCodeId === res.data.data.areaCodePid &&
                item.areaList.length === 0
              ) {
                item.areaList = res.data.data.areaList;
                return item.areaList.map((item1, index1) => {
                  this.$set(item1, "areaList", []);
                });
              }
            });
          } else if (val && val.length === 2) {
            this.options.forEach((item, index) => {
              item.areaList.filter((item1, index1) => {
                if (
                  item1.areaCodeId === res.data.data.areaCodePid &&
                  item1.areaList.length === 0
                ) {
                  return (item1.areaList = res.data.data.areaList);
                }
              });
            });
          }
        });
        this.selectedOptions = val;
      },
      handleCurrentChange(val) {

        this.getData(val);
      },
      resetForm(formName) {
        this.selectedOptions = [];
        this.selectedoption = [];
        this.$refs[formName].resetFields();
        this.getData();
      },
      addMarket() {
        this.$router.push("/addMarket");
      },
      // 导出Excel
      market_download_excel() {
        this.$delete(this.$data.marketForm, "pieces");
        this.$delete(this.$data.marketForm, "page");
        let data = {
          ...this.marketForm,
          firstLevArea: this.selectedOptions[0] || "",
          secondLevArea: this.selectedOptions[1] || "",
          thirdLevArea: this.selectedOptions[2] || "",
          gTicket: ApiSetting.gTicket()
        };
        
        let param = util.objToStr(data);
        param=encodeURI(encodeURI(param))
        console.log(param)
        window.location.href = `${ApiSetting.market_download_excel}?${param}`;
      },
      // 去商场详情
      toMarketInfo(index, row) {
        this.$router.push({
          name: "商场详情",
          params: {
            marketId: row.marketId
          }
        });
      },
      // 去编辑商场
      toEditMarket(index, row) {
        this.$router.push({
          name: "编辑商场",
          params: {
            marketId: row.marketId
          }
        });
      }
    }
  };
</script>
<style lang="less">
  @import "../../styles/marketManage/marketList.less";
</style>