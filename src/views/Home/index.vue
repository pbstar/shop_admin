<template>
  <el-container>
    <el-header>
      <img class="logo" src="../../assets/logo.png" alt="" />
      <span>初辰电商后台管理系统</span>
      <el-button
        type="primary"
        title="退出"
        icon="el-icon-user"
        circle
        @click="logout"
      ></el-button>
    </el-header>
    <el-container>
      <el-aside width="202px">
        <el-menu
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <el-submenu
            :index="menu.path"
            v-for="menu in menuListL"
            :key="menu.id"
          >
            <template slot="title">
              <i id="hticon" :class="iconList[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item
              :index="item.path"
              v-for="item in menu.children"
              :key="item.id"
              >{{ item.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuListL: [], // 左侧菜单列表
      isCollapse: true, // 左侧菜单是否折叠,默认值为 false（不折叠）
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpingouwudai',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-icon_fuben'
      }
    }
  },
  methods: {
    logout () {
      localStorage.clear()
      this.$router.push('/login')
    }
  },
  // 只有组件加载，就会执行这个函数
  async created () {
    const res = await this.$http.get('menus')
    this.menuListL = res.data.data
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #0b71a8;
    color: #fff;
    line-height: 60px;
    font-size: 25px;
    .logo {
      float: left;
      width: 30px;
      border-radius: 50%;
      display: inline-block;
      margin-top: 16px;
      margin-right: 10px;
    }
    span {
      float: left;
    }
    .el-button {
      float: right;
      margin-top: 10px;
    }
  }
  .el-aside {
    background-color: #fff;
    border-right: 1px solid #ccc;
    #hticon{
      margin-right: 10px;
      color: black;
      font-size: 18px;
    }
    .collapse {
      color: rgb(66, 185, 131);
      // text-align: center;

      padding: 10px 20px;
      cursor: pointer;
      box-sizing: border-box;
    }
    .collapse:hover {
      color: rgb(61, 141, 105);
    }
  }
  .el-main {
    background-color: #fff;
  }
}
</style>
