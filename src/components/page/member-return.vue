<template>
  <div class="member-list prop-box">
    <!--会员回收站列表-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>会员回收站列表
        <!--<el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_member('','')">添加会员
        </el-button>-->
        <div class="u-right">
          <el-select class="sele-s" v-model="vip" placeholder="会员等级" @visible-change="get_vip" :clearable="true">
            <el-option
              v-for="item in vipObjs"
              :label="item.name"
              :key="item.slug"
              :value="item.slug"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="status" placeholder="账号状态" :clearable="true">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
            <el-option label="冻结" value="2"></el-option>
            <el-option label="禁用+冻结" value="3"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="用户名" value="0"></el-option>
            <el-option label="真实姓名" value="1"></el-option>
            <el-option label="联系电话" value="2"></el-option>
            <el-option label="邮箱地址" value="3"></el-option>
            <el-option label="手机号码" value="4"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_member"></el-button>
          </el-input>
        </div>
      </h2>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        stripe
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="0"><i class="iconfont icon-huifu-copy c-danger"></i>&nbsp;恢复
                </el-dropdown-item>
                <el-dropdown-item command="1"><i class="iconfont icon-shanchu c-danger"></i>&nbsp;删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="realname"
          label="真实姓名"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="账户余额"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="freeze_balance"
          label="冻结资金"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="point"
          label="积分"
          min-width="90">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="vip"
          label="会员等级"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="账号状态"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">禁用</span>
            <span v-else-if="scope.row.status==2">冻结</span>
            <span v-else-if="scope.row.status==3">禁用+冻结</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reg_time"
          label="注册日期"
          min-width="160">
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_member('all')">彻底删除
        </el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="info"
                   @click="return_member('all')">一键恢复
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import crumb from '../common/crumb.vue'
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `会员回收站可以进行从回收站恢复会员和彻底删除会员两个操作。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        vip: '', // 会员等级
        status: '', // 账号状态  0=正常 1=禁用 2=冻结 3=禁用+冻结  (禁用是禁止登录 冻结是禁止操作资金)
        search_type: '', // 搜索类型  0=用户名 1=真实姓名 2=联系电话 3=邮箱地址 4=手机号码
        search_str: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        vipObjs: [],
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_member()
    },
    methods: {
      //获取等级列表
      get_vip(val) {
        if (val) {
          axiox.post(this.getApi('root/auth/vip_list')
          ).then((res) => {
            if (res.data.code === 0) {
              this.vipObjs = res.data.list;
            } else {
              this.$message(res.data.msg);
            }
          }).catch(err => {
            this.$message("对不起，请稍后再试");
          })
        }
      },

      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_member()
      },
      // 获取商品规格列表
      get_member() {
        window.axiox.post(this.getApi('root/auth/user_list'),
          this.dafa({
            index: this.index,
            is_del: 1,
            search_str: this.search_str,
            vip: this.vip,
            status: this.status,
            search_type: this.search_type
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 操作
      handle(val, id) {
        this.id = id;
        switch (val) {
          case '0':
            this.return_member(id);
            break;
          case '1':
            this.del_member(id);
            break;
        }
      },
      // 取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      // 收集选中列
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 删除会员
      del_member(id) {
        this.$confirm('是否确认将此会员彻底删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (id === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(this.id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/user_del'),
              this.dafa({
                id_list: this.del_id,
                real_del: 1
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_member();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
              this.toggleSelection();
              this.del_id = []
            })
          })
        }).catch(() => {
          this.toggleSelection();
          this.del_id = [];
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 恢复会员
      return_member(id) {
        this.$confirm('是否确认将此会员从回收站恢复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (id === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(this.id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/user_recover'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_member();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
              this.toggleSelection();
              this.del_id = []
            })
          })
        }).catch(() => {
          this.toggleSelection();
          this.del_id = [];
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    computed: {
      index() {
        return this.$store.state.index
      }
    },
    components: {
      hint, crumb, page
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cao-zuo .el-select {
    width: 100%;
    margin-bottom: 20px;
  }
</style>
