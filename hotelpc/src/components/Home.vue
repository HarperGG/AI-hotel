<template>
  <el-container class="home-container">
    <el-header>
      <div class="home_header"  style="height:100%;">
        <img src="../assets/img/logo2.png" style="height:100%;" alt="">
        <span>智能酒店管理系统</span>
      </div>

      <div>
        <i class="iconfont icon-yonghu"></i>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            Admin
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" :split-button="true">
            <el-dropdown-item @click="logout" command="退出">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="istoggleCollapse ? '64px':'225px'">
        <!-- 折叠栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单选项 -->
        <!-- <el-menu :unique-opened="true" router :collapse="istoggleCollapse" :collapse-transition="false"
          background-color="rgba(0,0,0,0.2)" text-color="#fff" active-text-color="#fff" :default-active="activePath">
          
          <el-menu-item :index="item.path+''" v-for="item in menulist" :key="item.id" @click="saveNavState(item.path)"
            :class="item.path === activePath ? 'iscolor' : 'nocolor'">
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.name}}</span>
          </el-menu-item>
        </el-menu> -->


        <el-menu :unique-opened="true" router :collapse="istoggleCollapse" :collapse-transition="false"
          background-color="rgba(0,0,0,0.2)" text-color="#fff" active-text-color="#fff" :default-active="activePath">
          <el-menu-item :class="'/console' == activePath ? 'iscolor' : 'nocolor'" index="/console"
            @click="saveNavState('/console')">
            <i class="iconfont icon-icon_xinyong_xianxing_jijin-"></i>
            <span slot="title">控制台</span>
          </el-menu-item>
          <el-menu-item :class="'/orderManagement' == activePath ? 'iscolor' : 'nocolor'" index="/orderManagement"
            @click="saveNavState('/orderManagement')">
            <i class="iconfont icon-icon-"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item :class="'/staffManagement' == activePath ? 'iscolor' : 'nocolor'" index="/staffManagement"
            @click="saveNavState('/staffManagement')">
            <i class="iconfont icon-yuangongguanli"></i>
            <span slot="title">员工管理</span>
          </el-menu-item>
          <el-menu-item :class="'/pictureManagement' == activePath ? 'iscolor' : 'nocolor'" index="/pictureManagement"
            @click="saveNavState('/pictureManagement')">
            <i class="iconfont icon-tupian"></i>
            <span slot="title">图片管理</span>
          </el-menu-item>

          <el-submenu index="/restaurantManagement">
            <template slot="title">
              <i class="iconfont icon-navicon-ctxx"></i>
              <span>餐厅管理</span>
            </template>

            <el-menu-item-group>
              <el-menu-item @click="saveNavState('/restaurantOrderManagement')"
                :class="'/restaurantOrderManagement' == activePath ? 'iscolor' : 'nocolor'"
                index="/restaurantOrderManagement">
                <template slot="title">
                  <i class="iconfont icon-navicon-ctxx"></i>
                  <span>餐厅菜单管理</span>
                </template>
              </el-menu-item>
              <el-menu-item @click="saveNavState('/restaurantMenuManagement')"
                :class="'/restaurantMenuManagement' == activePath ? 'iscolor' : 'nocolor'"
                index="/restaurantMenuManagement">
                <template slot="title">
                  <i class="iconfont icon-navicon-ctxx"></i>
                  <span>餐厅订单管理</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>


          </el-submenu>

          <el-menu-item :class="'/dataManagement' == activePath ? 'iscolor' : 'nocolor'" index="/dataManagement"
            @click="saveNavState('/dataManagement')">
            <i class="iconfont icon-tupian"></i>
            <span slot="title">数据管理</span>
          </el-menu-item>

        </el-menu>


      </el-aside>
      <!-- 右侧主题部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    // 组件私有数据
    data() {
      return {
        // 是否折叠
        istoggleCollapse: false,
        // 权限1
        permission1: '',
        // 权限2
        permission2: '',
        // 保存当前页面
        activePath: '',
        // 激活的当前页面颜色
      }
    },
    // 生命周期函数
    created() {
      this.activePath = window.sessionStorage.getItem('activePath')

    },
    methods: {
      logout() {
        // 退出，清空token 跳转登录页面
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 修改密码
      alertPassword() {
        this.$router.push('/alertPassword')
      },

      //折叠左边菜单函数
      toggleCollapse() {
        this.istoggleCollapse = !this.istoggleCollapse
      },
      //点击一级标题，高亮
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath
      },

      // 点击下拉菜单事件
      handleCommand(command) {
        // 清空token 跳转修页面
        window.sessionStorage.clear()
        if (command === '修改密码') {
          this.$router.push('/alertPassword')
        } else this.$router.push('/login')
      },

    },
    // 监听路由改变
    watch: {
      '$route.path': function () {
        this.activePath = this.$route.path
        window.sessionStorage.setItem('activePath', this.$route.path)
      }
    }

  }
</script>
<style lang="less" scoped>
  // 是否是选中的一级标题
  .iscolor {
    background: linear-gradient(90deg, rgba(37, 117, 236, 1), rgba(116, 171, 253, 1));
  }

  .nocolor {
    background: rgba(0, 0, 0, 0);
  }

  .home-container {
    height: 100%;
    width: 100%;
  }

  .el-header {
    height: 10% !important;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    padding: 0 20px;
    z-index: 1000;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2) !important;

    >div {
      display: flex;
      align-items: center;
    }

    span {
      margin-left: 15px;
    }

    .item {
      margin-right: 40px;
      margin-top: 5px;

      i {
        font-size: 25px;
        margin-right: 0px;

        margin-top: -5px;
      }
    }

    // 登录退出下拉框
    .el-dropdown-link {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.9);
    }

    .el-icon-arrow-down {
      font-size: 12px;
    }

    .el-dropdown {
      font-size: 18px;
    }
  }

  .el-container {
    height: 100% !important;
    width: 100%;
    min-height: 650px;
  }

  // 用户头像
  .icon-yonghu {
    font-size: 25px;
  }

  .el-aside {
    background: url('../assets/img/侧边.png') no-repeat;
    background-size: cover;

    .el-menu {
      border-right: none;
      background: rgba(0, 0, 0, 0) !important;
    }


    .el-submenu {
      margin-bottom: 15px;

      i {
        font-size: 23px;
        font-weight: 500;
      }

      .el-menu-item {
        background-color: none !important;
        margin-bottom: 0;
        font-size: 14px;
        color: rgb(236, 236, 236);

        i {
          font-size: 18px;
          font-weight: 500;
        }
      }

      .el-menu-item:hover {
        color: #fff;
        background: linear-gradient(90deg, rgba(37, 117, 236, 1), rgba(116, 171, 253, 1));

        i {
          color: #fff;

        }
      }


    }

    .el-menu-item {
      margin-bottom: 15px;
      padding-left: 30px;
      font-size: 18px;
      color: rgb(236, 236, 236);

      i {
        font-size: 23px;
        font-weight: 500;
      }
    }

    .el-menu-item:hover {
      color: #fff;
      background: linear-gradient(90deg, rgba(37, 117, 236, 1), rgba(116, 171, 253, 1));

      i {
        color: #fff;

      }
    }
  }

  .el-main {
    background: #eaedf1;
    overflow: hidden;
  }

  .iconfont {
    margin-right: 15px;
  }

  .toggle-button {
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;

    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>