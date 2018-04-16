<template>
  <div class="menu-nav">
    <!--头部-->
    <div class="header">
      <div class="logo" @click="to_index">
        <router-link to="/index">{{logo}}</router-link>
      </div>
      <div class="nav">
        <ul>
          <li v-for="item in navs" :key="item.id" @click="to_leave2(item.id)" :class="{leave1_act:item.id===lv1}">
            <router-link :to="{name:`${item.id}-1-1`}" tag="div"><p>{{item.title}}</p></router-link>
          </li>
        </ul>
      </div>
      <div class="admin">
        <ul>
          <li><a href="http://www.lara-shop.cn" target="_blank" class="to-pc">商城首页</a></li>
          <li class="last-li">
            <el-dropdown trigger="click" @command="handle">
              <span class="el-dropdown-link">
                快捷<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">清除缓存</el-dropdown-item>
                <el-dropdown-item command="1">安全退出</el-dropdown-item>
                <el-dropdown-item command="2">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </div>
    <!--左侧-->
    <div class="left">
      <div class="leave2">
        <ul>
          <li v-for="item in leave2" @click="to_leave3(item.id)">
            <router-link :to="{name:`${item.id}-1`}" tag="div" :class="{leave2_act:item.id===lv2}">{{item.title}}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="leave3">
        <ul>
          <li v-for="item in leave3">
            <router-link :to="{name:item.id}" tag="div" :class="{leave3_act:item.id === lv3}">{{item.title}}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        logo: '为尔盈商城系统1.0',
        navs: [], // 全部菜单
        leave2: [], // 二级菜单
        leave3: [], // 三级菜单
        lv1: '', // 当前一级菜单
        lv2: '', // 当前二级菜单
        lv3: '' // 当前三级菜单
      }
    },
    watch: {
      '$route'(to, from) {
        // 优化路由当前定位
        this.lv1 = this.$route.name.substr(0, 1);
        this.lv2 = this.$route.name.substr(0, 3);
        this.lv3 = this.$route.name;
        this.to_leave2(this.lv1);
        this.to_leave3(this.lv2);
      }
    },
    created() {
      // 请求菜单列表
      window.axiox.post(this.getApi('root/auth/menu')
      ).then(res => {
        if (res.data.code === 0) {
          this.navs = res.data.menu;

          // 获取菜单位置
          this.navs.forEach(item => {
            item.child.forEach(ite => {
              ite.child.forEach(it => {
                if (it.id === this.$route.name) {
                  // 高亮当前定位
                  this.lv1 = item.id;
                  this.lv2 = ite.id;
                  this.lv3 = it.id;
                  // 分配显示菜单
                  this.leave2 = item.child;
                  this.leave3 = ite.child
                }
              })
            })
          })
        } else {
          this.$message(res.data.msg)
        }
      }).catch(() => {
        this.$message('对不起！服务器出错啦，请刷新重试')
      })
    },
    mounted() {
      this.name = JSON.parse(sessionStorage.getItem('user')).name;
    },
    methods: {
      // 点击一级菜单分配二、三级菜单
      to_leave2(id) {
        this.navs.forEach(item => {
          if (item.id === id) {
            this.leave2 = item.child;
            this.leave3 = item.child[0].child
          }
        })
      },
      // 点击二级菜单分配三级菜单
      to_leave3(id) {
        this.leave2.forEach(item => {
          if (item.id === id) {
            this.leave3 = item.child
          }
        })
      },
      // 当前位置
      current(id) {
        this.lv3 = id
      },
      // 点击logo去首页
      to_index() {
        this.to_leave2('8')
      },
      // 清除缓存
      clearCache() {
        this.$message('清除成功')
      },
      // 安全退出
      exit() {
        axiox.post(this.getApi('root/login-exit')
        ).then(res => {
            if (res.data.code === 0) {
              this.$message(res.data.msg);
              this.$router.push('/login')
            } else {
              this.$message(res.data.msg)
            }
          }
        )
      },
      // 下来菜单操作
      handle(val) {
        switch (val) {
          case '0':
            this.clearCache();
            break;
          case '1':
            this.exit();
            break;
          case '2':
            this.$router.push({name: '8-3-1'});
            break;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /*头部*/
  .header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 111;
    height: 65px;
    width: 100%;
    min-width: 1400px;
    background-color: #1cadf1;
    color: #fff;
    box-sizing: border-box;
  }

  .header > div {
    float: left;
  }

  .logo {
    width: 265px;
    line-height: 65px;
    padding-left: 25px;
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
  }

  .logo a {
    display: block;
    color: #fff;
  }

  .nav li {
    float: left;
    width: 105px;
    height: 65px;
    text-align: center;
    font-size: 16px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .nav li > div {
    height: 65px;
    padding-top: 23px;
    box-sizing: border-box;
  }

  .nav li a {
    color: #fff;
  }

  .leave1_act {
    background-color: #0f86be;
  }

  .leave1_act p {
    border: none;
  }

  .nav li:last-child p {
    border: none;
  }

  .nav li p {
    height: 20px;
    line-height: 20px;
    border-right: 1px solid #5dc2f1;
  }

  .header .admin {
    line-height: 65px;
    text-align: center;
    float: right;
    margin-right: 20px;
    font-size: 14px;
    cursor: pointer;
  }

  .to-pc {
    color: #fff;
    font-size: 16px;
  }

  .admin li {
    float: left;
    width: 120px;
    border-right: 1px solid #4ac0f6;
  }

  .admin .last-li {
    border: none;
  }

  .el-dropdown-link {
    color: #fff;
  }

  /*左侧*/
  .left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    padding-top: 65px;
    width: 265px;
    height: 100%;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
  }

  .leave2 {
    float: left;
    width: 85px;
    height: 100%;
    background-color: #2399d0;
    color: #fff;
  }

  .leave2_act {
    background-color: #fdb61e;
  }

  .leave2 div {
    line-height: 50px;
    cursor: pointer;
  }

  .leave2 li, .leave3 li {
    height: 62px;
    padding-top: 12px;
    box-sizing: border-box;
  }

  .leave3 {
    margin-left: 85px;
    height: 100%;
    background-color: #ebedf1;
    border-right: 1px solid #d1dadc;
  }

  .leave3_act {
    background-color: #fff;
  }

  .leave3 li div {
    color: #333;
    cursor: pointer;
    line-height: 50px;
  }
</style>
