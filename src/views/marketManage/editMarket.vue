<template>
  <div class="p-add-market">
    <div class="m-add-marketcontent">
      <el-form :model="editMarket_form" :rules="rules" ref="editMarket_form" label-width="100px" class="demo-ruleForm m-addmarket-form">
        <el-form-item label="商场ID" prop="marketUniqueCode">
          <el-input v-model="editMarket_form.marketUniqueCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商场名称" prop="marketName">
          <el-input v-model="editMarket_form.marketName" placeholder="限填2-20个字符"></el-input>
          <span class="u-waring-tip">
            <i class="el-icon-warning"></i>显示给用户</span>
        </el-form-item>
        <el-form-item label="负责人" prop="personLiableName">
          <el-input v-model="editMarket_form.personLiableName" placeholder="限填2-6个字符"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话" prop="phoneNumber">
          <el-input v-model="editMarket_form.phoneNumber" placeholder="请填写正确可用的手机号"></el-input>
        </el-form-item>
        <el-form-item label="省市区" prop="selectedOptions" class="f-location">
          <el-cascader :options="options" :props="props" @change="handleItemChange" @active-item-change="handleItemChange" placeholder="省市区"
            v-model="selectedoption"></el-cascader>
          <span class="u-waring-tip">
            <i class="el-icon-warning"></i>显示给用户</span>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress" class="u-detail-address">
          <el-input v-model="editMarket_form.detailAddress" placeholder="限填2-20个字符"></el-input>
          <span class="u-waring-tip">
            <i class="el-icon-warning"></i>显示给用户</span>
        </el-form-item>
        <el-form-item label="所在楼层" prop="floor" class="u-other-grid u-radio-type">
          <div class="u-all-checked">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <el-checkbox-group v-model="editMarket_form.floor" @change="handleCheckedCitiesChange">
            <div>
              <el-checkbox label="-3楼"></el-checkbox>
              <el-checkbox label="-2楼"></el-checkbox>
              <el-checkbox label="-1楼"></el-checkbox>
              <el-checkbox label="1楼"></el-checkbox>
            </div>
            <div class="u-floor-margin">
              <el-checkbox label="2楼"></el-checkbox>
              <el-checkbox label="3楼"></el-checkbox>
              <el-checkbox label="4楼"></el-checkbox>
              <el-checkbox label="5楼"></el-checkbox>
            </div>
            <div class="u-floor-margin">
              <el-checkbox label="6楼"></el-checkbox>
              <el-checkbox label="7楼"></el-checkbox>
              <el-checkbox label="8楼"></el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <div class="u-other-grid">
          <el-form-item label="商场经度" prop="longtitude">
            <el-input v-model="editMarket_form.longtitude" placeholder="限填2-20个字符"></el-input>
          </el-form-item>
          <el-form-item label="商场纬度" prop="latitude">
            <el-input v-model="editMarket_form.latitude" placeholder="限填2-20个字符"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="状态" prop="status" class="u-other-grid">
          <el-radio-group v-model="editMarket_form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="u-other-grid u-operation-button">
          <el-button @click="addMarket_resetForm('editMarket_form')">取消</el-button>
          <el-button type="primary" @click="addMarket_submitForm('editMarket_form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import ApiSetting from "../../common/js/apiSetting";
export default {
  data() {
    return {
      selectedoption: [],
      checkAll: false,
      isIndeterminate: true,
      floor: [
        "-3楼",
        "-2楼",
        "-1楼",
        "1楼",
        "2楼",
        "3楼",
        "4楼",
        "5楼",
        "6楼",
        "7楼",
        "8楼"
      ],
      editMarket_form: {
        location: "",
        marketId: "",
        marketUniqueCode: "",
        marketName: "",
        personLiableName: "",
        phoneNumber: "",
        selectedOptions: [],
        floor: ["1楼"],
        status: 1,
        longtitude: "",
        latitude: "",
        detailAddress: ""
      },
      marketInfo: {},
      rules: {
        marketName: [
          { required: true, message: "请填写商户名称", trigger: "blur" },
          { min: 2, message: "商场名称不能少于2个字符", trigger: "blur" },
          { max: 20, message: "商场名称不能多余20个字符", trigger: "blur" },
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
        personLiableName: [
          { required: true, message: "请填写负责人", trigger: "blur" },
          { min: 2, message: "负责人姓名不能少于2个字", trigger: "blur" },
          { max: 6, message: "负责人姓名不能多余6个字", trigger: "blur" },
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
        phoneNumber: [
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
        merchantState: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        detailAddress: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
          { min: 2, message: "详细地址不能少于2个字", trigger: "blur" },
          { max: 20, message: "详细地址不能多余20个字", trigger: "blur" },
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
        longtitude: [
          { required: true, message: "请填写商场经度", trigger: "blur" },
          { max: 20, message: "商场经度不能多于20个字", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (
                /^[-+]?[0-9]+([.]{1}[0-9]+){0,1}$/.test(value) == false ||
                value > 180
              ) {
                callback(new Error("请输入正确的经度值"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        latitude: [
          { required: true, message: "请填写商场纬度", trigger: "blur" },
          { max: 20, message: "商场纬度不能多于20个字", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (
                /^[-+]?[0-9]+([.]{1}[0-9]+){0,1}$/.test(value) == false ||
                value > 180
              ) {
                callback(new Error("请输入正确的纬度值"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        selectedOptions: [
          { required: true, message: "选择省市区", trigger: "change" }
        ],
        floor: [
          {
            type: "array",
            required: true,
            message: "请至少选择1层楼",
            trigger: "change"
          }
        ]
      },
      options: [],
      props: {
        value: "areaCodeId",
        label: "areaName",
        children: "areaList"
      }
    };
  },
  created() {
    this.getEditData();
    this.handleItemChange([]);
  },
  methods: {
    handleCheckAllChange(val) {
      this.editMarket_form.floor = val ? this.floor : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.floor.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.floor.length;
    },
    // 新增提交表单
    addMarket_submitForm(formName) {
      this.editMarket_form.selectedOptions = this.selectedoption;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editMarket_form.floor = this.editMarket_form.floor.join("|");
          var firstLevArea = this.editMarket_form.selectedOptions[0];
          var secondLevArea = this.editMarket_form.selectedOptions[1];
          var thirdLevArea = this.editMarket_form.selectedOptions[2];
          this.$delete(this.$data.editMarket_form, "selectedOptions");
          var data = {
            firstLevArea,
            secondLevArea,
            thirdLevArea,
            marketUniqueCode: this.editMarket_form.marketUniqueCode,
            ...this.editMarket_form
          };
          this.editMarket_form.floor = this.editMarket_form.floor.split("|");
          this.$http({
            url: ApiSetting.addMarket,
            method: "post",
            data: data
          }).then(res => {
            if (!res || res === undefined) {
              this.$message({
                message: "保存失败请重试",
                type: "error"
              });
            } else if (res.data.errCode == 1006) {
              this.$message({
                message: "商场名称重复",
                type: "error"
              });
            } else if (res.data.errCode == 0) {
              this.$router.push("/marketList");
              this.$message({
                message: "保存成功",
                type: "success"
              });
            }
          });
        } else {
          this.$message({
            message: "您有填写错误的信息，请检查后重试",
            type: "error"
          });
          return false;
        }
      });
    },
    // 新增重置表单并取消
    addMarket_resetForm(formName) {
      this.$router.push("/marketList");
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
              this.$set(item, "areaList", res.data.data.areaList);
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
                return this.$set(item1, "areaList", res.data.data.areaList);
              }
            });
          });
        }
      });
      this.editMarket_form.selectedOptions = val;
    },
    async getEditData() {
      var data = this.$route.params.marketId;
      this.$http({
        url: ApiSetting.marketInfo,
        data: { marketId: data },
        method: "post"
      }).then(res => {
        if (!res || res.data.errCode !== 0 || res === undefined) return;
        this.marketInfo = res.data.data.marketInfo;
        this.$set(this.marketInfo, "selectedOptions", []);
        this.$set(
          this.marketInfo.selectedOptions,
          "0",
          this.marketInfo.firstLevArea
        );

        this.$set(
          this.marketInfo.selectedOptions,
          "1",
          this.marketInfo.secondLevArea
        );

        this.$set(
          this.marketInfo.selectedOptions,
          "2",
          this.marketInfo.thirdLevArea
        );
        this.getEditArea(
          this.marketInfo.selectedOptions[0],
          this.marketInfo.selectedOptions[1]
        );
        this.editMarket_form.floor = this.marketInfo.floor.split("|");
        this.editMarket_form.selectedOptions = this.marketInfo.selectedOptions;
        this.selectedoption = this.marketInfo.selectedOptions;
        this.editMarket_form.location = this.marketInfo.location;
        this.editMarket_form.marketId = this.marketInfo.marketId;
        this.editMarket_form.marketUniqueCode = this.marketInfo.marketUniqueCode;
        this.editMarket_form.marketName = this.marketInfo.marketName;
        this.editMarket_form.personLiableName =
          this.marketInfo.personLiableName + "";
        this.editMarket_form.phoneNumber = this.marketInfo.phoneNumber;
        this.editMarket_form.status = this.marketInfo.status;
        this.editMarket_form.longtitude = this.marketInfo.longtitude + "";
        this.editMarket_form.latitude = this.marketInfo.latitude + "";
        this.editMarket_form.detailAddress = this.marketInfo.detailAddress + "";
      });
    },
    getEditArea(pId1, pId2) {
      this.$http({
        url: ApiSetting.getRegion,
        method: "post",
        data: { pid: pId1 }
      }).then(res => {
        if (!res || res.data.errCode !== 0 || res === undefined) return;
        this.options.filter((item, index) => {
          if (
            item.areaCodeId === res.data.data.areaCodePid &&
            item.areaList.length === 0
          ) {
            this.$set(item, "areaList", res.data.data.areaList);
            return item.areaList.map((item1, index1) => {
              this.$set(item1, "areaList", []);
            });
          }
        });
        this.$http({
          url: ApiSetting.getRegion,
          method: "post",
          data: { pid: pId2 }
        }).then(res => {
          if (!res || res.data.errCode !== 0 || res === undefined) return;
          this.options.forEach((item, index) => {
            item.areaList.filter((item1, index1) => {
              if (
                item1.areaCodeId === res.data.data.areaCodePid &&
                item1.areaList.length === 0
              ) {
                return this.$set(item1, "areaList", res.data.data.areaList);
              }
            });
          });
        });
      });
    }
  }
};
</script>
<style lang="less">
@import "../../styles/marketManage/addMarket.less";
</style>