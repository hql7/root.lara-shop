<template>
  <div class="admin prop-box">
    <!--管理员列表-->
    <div class="m-admin m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>资源权限列表<span>（共{{tableData.length}}条记录）</span>
        <el-button type="text" icon="plus" size="small" class="add-admin-btn add-btn" @click="edit_admin('','')">添加管理员
        </el-button>
        <el-input placeholder="按管理员名称搜索" v-model="search" class="u-right search">
          <!--<template slot="append" @click="get_admins(true)">搜索</template>-->
          <el-button slot="append" icon="el-icon-search" @click="get_admins(true)"></el-button>
        </el-input>
      </h2>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        stripe
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="所属角色"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="last_ip"
          label="IP地址"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="login_time"
          label="登录时间"
          min-width="190">
        </el-table-column>
        <el-table-column
          prop="is_lock"
          label="是否锁定"
          min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.is_lock == 0">未锁定</span>
            <span v-else>未锁定</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          min-width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_admin(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_admin(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger" @click="del_admin('all')">
          删除
        </el-button>
      </div>
    </div>
    <!--添加管理员-->
    <div class="add-admin prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" lalabel-position="right" label-width="240px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请填写用户名"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" placeholder="请填写登录密码"></el-input>
          <em class="c-danger"></em>
        </el-form-item>
        <el-form-item label="确认登陆密码" prop="ckPass">
          <el-input v-model="ruleForm.ckPass" type="password" placeholder="请确认登录密码"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="role">
          <el-select v-model="ruleForm.role_id" placeholder="请选择所属角色">
            <el-option v-for="item in role_list" :label="item.name" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import crumb from '../common/crumb.vue'

  export default {
    data() {
      const ckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      };
      return {
        hint: {
          title: '操作提示',
          content: `网站系统管理员, 由总平台设置管理.点击列表里的删除按钮删除单个管理员时不受复选框的影响！复选框数据只在点击列表下方批量删除时有效`
        }, // 提示模块参数
        log_num: 3, // 记录条数
        tableData: [], // 表格数据
        search: '', // 搜索数据
        add_show: false, // 是否弹出管理员编辑页面
        crumb: {
          from: '管理员',
          now: '添加管理员'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          email: '',
          pass: '',
          ckPass: '',
//          role: null,
          role_id: null,
//          role_name:'',
        }, // 编辑页面表单数据
        role_list: [], // 角色所属列表
        multipleSelection: [], // 选中列
        rules: {
          name: [
            {validator: this.va.vaName, trigger: 'blur'}
          ],
          email: [
            {validator: this.va.vaEmail, trigger: 'blur'}
          ],
          pass: [
            {validator: this.va.vaPass, trigger: 'blur'}
          ],
          ckPass: [
            {validator: ckPass, trigger: 'blur'}
          ],
          role_id: [
            {required: true, message: '请选择所属角色',},
            {type: 'number'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_admins()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 请求管理员列表
      get_admins() {
        window.axiox.post(this.getApi('root/auth/admins'),
          this.dafa({
            search: this.search
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.admins
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑管理员
      edit_admin(id) {
        this.id = id;
        this.add_show = true;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/admin-edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.role_list = res.data.role_list;
              this.ruleForm = res.data
            }
          }).catch((err) => {
            reject(err);
            // this.$message('对不起！请稍后再试')
          })
        })
      },
      // 提交添加管理员
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/admins-save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  pass: this.ruleForm.pass,
                  repass: this.ruleForm.ckPass,
                  role_id: this.ruleForm.role_id
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_admins();
                  this.id = '';
                }
              }).catch((err) => {
                reject(err);
                // this.$message('对不起！请稍后再试')
              })
            })
          } else {
            this.$message('请检查填写信息是否有误');
            return false
          }
        })
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
      // 删除管理员
      del_admin(id) {
        this.$confirm('是否确认删除管理员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (id === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(id)
          }
          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/admins-del'),
              this.dafa({
                id: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_admins();
              } else {
                this.toggleSelection();
              }
            }).catch((res) => {
              reject(res);
              this.toggleSelection();
              this.del_id = [];
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
    components: {hint, crumb}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
