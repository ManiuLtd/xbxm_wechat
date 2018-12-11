<template>
	<div class="p-login">
    <img src="../assets/images/loginLogo.png" alt="" class="u-login-logo">
		<div class="m-login-box">
      
			<h1 class="u-title">
				新博新美优选营销管理后台
			</h1>
        
			<el-form :model="loginForm" ref="loginForm" class="demo-ruleForm">
				<el-form-item
				prop="username"
				:rules="[
				{ required: true, message: '用户名不能为空'},
				{ max:11, message:'用户名长度不能超过11个字符'}
				]"
				>
				<el-input type="text" v-model="loginForm.username" auto-complete="off"  placeholder="用户名/手机号">
					<i slot="prefix" class="el-input__icon el-icon-wchat-zhanghu"></i>
				</el-input>
			</el-form-item>
			<el-form-item
			prop="password"
			:rules="[
			{ required: true, message: '密码不能为空'},
			{ max:30, message:'密码长度不能超过30个字符'}
			]"
			>
			<el-input type="password" v-model="loginForm.password" auto-complete="off" icon="el-icon-wchat-password" placeholder="密码" @keyup.enter.native="submitForm('loginForm')">
				<i slot="prefix" class="el-input__icon el-icon-wchat-password"></i>
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
		</el-form-item>
	</el-form>	
</div>
</div>
</template>

<script>
import ApiSetting from "../common/js/apiSetting";
import util from "../common/js/util.js";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = this.loginForm;
          this.$http({
            url: ApiSetting.login,
            method: "post",
            data: data
          }).then(res => {
            if (!res || res === undefined || res === null) {
              this.$message({
                type: "error",
                message: "连接错误，请重试"
              });
              return;
            } else if (res.data.errCode == 1067) {
              this.$message({
                type: "error",
                message: "登录次数过多！请明日再试"
              });
            }else if (res.data.errCode == 1) {
              this.$message({
                type: "error",
                message: "您输入的用户名或密码有误，请重试"
              });
            } else if (res.data.errCode == 0) {
              // 先移除cookie里面本来的gticket;
              var exp = new Date();
              exp.setTime(exp.getTime() - 1);
              var cval = util.getCookie("gTicket");
              if (cval != null)
                document.cookie =
                  "gTicket =" + cval + ";expires=" + exp.toGMTString();
              // 存入gTicket
              const DAYS = 7;
              const EXP = new Date();
              EXP.setTime(EXP.getTime() + DAYS * 60 * 24 * 60 * 1000);
              document.cookie =
                "gTicket=" +
                res.data.gTicket +
                ";path=/;expires=" +
                EXP.toGMTString();
              document.cookie = "user=" + this.loginForm.username;
              const { redirect } = this.$route.query;
              if (redirect) {
                this.$router.push(redirect.substr(1));
              } else {
                this.$router.push("/index");
                this.$store.commit("delete_allTab");
                this.$store.commit("add_tabs", {
                  route: "/index",
                  name: "首页"
                });
                this.$store.commit("set_active_index", "/index");
              }
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
body {
  width: 100%;
  height: 100%;
}
.p-login {
  min-height:570px;
  min-width: 1280px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background: url("../assets/images/Bitmap.png") no-repeat;
  background-position: center;
  background-size: 100% 100%;
  .u-login-logo{
    position:absolute;
    left:20px;
    top:30px;
    width:160px;
  }
  .m-login-box {
    // width:25%;
    // height:350px;
    position: absolute;
    top: 60px;
    right: 8%;
    padding: 40px 40px 50px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 9px 0 rgba(166, 95, 70, 0.29);
    border-radius: 6px;
    .u-title {
      margin: 0 auto 33px;
      font-family: MicrosoftYaHei;
      font-size: 22px;
      color: #ffffff;
      letter-spacing: 2px;
    }
    .el-input__inner {
      height: 44px;
      line-height: 44px;
      padding-left: 41px;
      font-size: 16px;
      color: #fff;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      background-color: transparent;
    }
    .el-input__icon {
      left: 0;
      color: #fff;
    }
    .el-button--primary {
      width: 312px;
      height: 56px;
      margin-top: 43px;
      background: #ff7623;
      color: #fff;
      font-size: 16px;
    }
    .el-form-item:not(:first-child) {
      margin-bottom: 0px;
    }
  }
  /*表单的placeholder颜色*/
  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */

    color: rgba(255, 255, 255, 0.6);
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */

    color: rgba(255, 255, 255, 0.6);
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */

    color: rgba(255, 255, 255, 0.6);
  }
  .el-form-item__error {
    color: red;
  }
}
</style>