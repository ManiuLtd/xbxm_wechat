<template>
  <el-row  id="u-container">
    <el-col :span="24" class="m-header">
      <el-col :span="10" class="m-logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <img src="../assets/images/logo.png" alt="" @click="toindex" class="u-special-point">
      </el-col>
      <el-col :span="10">
        <div class="tools">
          优选营销管理后台
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <span class="el-dropdown-link userinfo-inner">
          <img src="../assets/images/userimg.png"/>
          <i>{{sysUserName}}</i>
          <i><img src="../assets/images/loginOut.png" alt="" @click="login_out"></i>
        </span>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <el-aside class='menu-expanded'>
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
          unique-opened router v-show="!collapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" :key="index" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden" class="el-submenu__title">{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" :key="index"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li v-for="(item,index) in $router.options.routes" :key="index" v-if="!item.hidden" class="el-submenu item">
            <template v-if="!item.leaf">
              <div style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <i :class="item.iconCls"></i>
              </div>
              <ul :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''"
                  @click="$router.push(child.path)">{{child.name}}</li>
              </ul>
            </template>
            <template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
          </li>
        </ul>
      </el-aside>
      <section class="content-container">
        <div class="template-tabs">
          <el-tabs v-model="activeIndex" type="border-card" :closable=true  @tab-click="tabClick" v-if="options.length" @tab-remove="tabRemove">
            <el-tab-pane :key="index" v-for="(item, index) in options" :label="item.name" :name="item.route">
            </el-tab-pane>
          </el-tabs>
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <div>
                  <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                  </keep-alive>
                  <router-view v-if="!$route.meta.keepAlive"></router-view>
                </div>
              </transition>
            </el-col>
          </div>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      editableTabsValue: "1",
      collapsed: false,
      sysUserName: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  activated() {
    // console.log("dsajkd")
  },
  methods: {
    onSubmit() {},
    handleopen() {},
    handleclose() {},
    handleselect: function(a, b) {},
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },

    // tab切换时，动态的切换路由
    tabClick(tab) {
      let path = this.activeIndex;
      this.$router.push({ path: path });
      this.$store.commit("set_active_index", path);
    },
    tabRemove(targetName) {
      // 首页不可删除
      if (targetName == "/index") {
        return;
      }
      this.$store.commit("delete_tabs", targetName);
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.options && this.options.length >= 1) {
          this.$store.commit(
            "set_active_index",
            this.options[this.options.length - 1].route
          );
          this.$router.push({ path: this.activeIndex });
        } else {
          this.$router.push({ path: "/index" });
        }
      }
    },
    toindex() {
      this.$router.push({ path: "/index" });
    },
    login_out() {
      this.$confirm("请确认是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.push({ path: "/" });
      });
    }
  },

  mounted() {
    var user = "";
    var reg = new RegExp("(^| )" + "user" + "=([^;]*)(;|$)");
    var arr = document.cookie.match(reg);
    if (arr) {
      user = unescape(arr[2]);
    }
    if (user) {
      this.sysUserName = user || "";
    }
  },
  created() {
    if (this.$store.state.options.length == 0) {
      // 刷新时以当前路由做为tab加入tabs
      if (this.$route.path !== "/index") {
        this.$store.commit("add_tabs", { route: "/index", name: "首页" });
        this.$store.commit("add_tabs", {
          route: this.$route.path,
          name: this.$route.name
        });
        this.$store.commit("set_active_index", this.$route.path);
      } else {
        this.$store.commit("add_tabs", { route: "/index", name: "首页" });
        this.$store.commit("set_active_index", "/index");
        this.$router.push("/index");
      }
    }
  },
  computed: {
    // 选项卡
    options() {
      return this.$store.state.options;
    },
    // 当前选项卡
    activeIndex: {
      get() {
        return this.$store.state.activeIndex;
      },
      set(val) {
        this.$store.commit("set_active_index", val);
      }
    }
  },
  watch: {
    $route(to) {
      let flag = false;
      for (let option of this.options) {
        if (option.name === to.name) {
          flag = true;
          this.$store.commit("set_active_index", to.fullPath);
          break;
        }
      }
      if (!flag) {
        this.$store.commit("add_tabs", {
          route: to.fullPath,
          name: to.name
        });
        this.$store.commit("set_active_index", this.$route.path);
        this.$router.push(this.$route.path);
      }
    }
  }
};
</script>

<style lang="less">
#u-container {
  min-width: 1280px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .m-header {
    height: 90px;
    line-height: 90px;
    color: #fff;
    border-bottom: 1px solid #e5e4e4;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .el-tabs__item .el-icon-close {
    margin-left: 10px;
  }

  .userinfo {
    padding-right: 35px;
    float: right !important;
    color: #000;
    height: 90px;
    line-height: 90px;
    position: relative;
  }
  .userinfo .userinfo-inner > img {
    position: absolute;
    margin-top: 6px;
    right: 160px;
  }
  .userinfo i:nth-child(2) {
    position: absolute;
    margin-top: 6px;
    right: 100px;
  }
  .userinfo i:nth-child(3) {
    position: absolute;
    margin-top: 6px;
    right: 70px;
  }

  .userinfo-inner > img:nth-child(1) {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 30px 0 0;
    display: inline-block;
  }
  .userinfo-inner i img {
    margin-left: 55px;
    margin-top: 38px;
    width: 14px;
    height: 14px;
    display: inline-block;
    cursor: pointer;
  }

  .m-logo {
    height: 90px;
    font-size: 22px;
    padding-left: 20px;
    padding-right: 20px;
    color: #ff7623;
  }

  .txt {
    color: #fff;
  }

  .m-logo img {
    width: 100%;
    float: left;
    margin: 20px 0;
  }

  .logo-width {
    width: 200px !important;
  }

  .logo-collapse-width {
    width: 90px;
  }

  .tools {
    padding: 0px 23px;
    color: #9b9b9b;
    font-size: 18px;
    height: 90px;
    line-height: 90px;
  }

  .main {
    display: flex;
    position: absolute;
    top: 90px;
    bottom: 0px;
    overflow: hidden;
  }

  .collapsed {
    width: 60px;
  }

  .submenu {
    position: absolute;
    top: 0px;
    left: 60px;
    z-index: 99999;
    height: auto;
    display: none;
  }

  .item {
    position: relative;
  }

  .menu-expanded {
    flex: 0 0 230px;
    width: 230px;
  }

  .menu-collapsed {
    flex: 0 0 60px;
    width: 60px;
  }

  .menu-expanded {
    flex: 0 0 230px;
    width: 230px;
  }

  .content-container {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
  }

  .el-menu {
    height: 100%;
    background: none;
  }

  aside .el-menu-vertical-demo > li:nth-child(1) {
    margin-top: 50px;
  }

  .el-submenu.is-active .el-menu-item {
    background: rgba(255, 118, 35, 0.1);
    color: #ff7623;
  }

  .content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
  }

  .breadcrumb-container .title {
    width: 200px;
    float: left !important;
    color: #475669;
  }

  .breadcrumb-container .breadcrumb-inner {
    float: right !important;
  }

  .el-tabs--border-card {
    padding: 6px;
  }

  .content-container {
    padding: 0;
  }

  .el-tabs__item {
    padding: 0px 10px 0 20px;
    background: #fff;
    border: 1px solid #d8dce5;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
  }

  .el-tabs--border-card {
    border: none;
    border-bottom: 1px solid #e5e4e4;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active:hover {
    color: #fff;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    background: #ff7623;
    color: #fff;
    border: none;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    margin: 0;
  }
  .el-tabs--border-card > .el-tabs__header {
    background: none;
    border: none;
  }

  .template-tabs .el-tabs {
    height: 30px;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    border: 1px solid #d8dce5;
    margin-right: 5px;
    /* box-sizing: border-box; */
  }

  .content-wrapper {
    padding: 15px 20px;
  }
}
.el-button--small {
  width: 80px !important;
}
</style>