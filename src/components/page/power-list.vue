<template>
  <div class="power-list prop-box">
    <!--权限列表-->
    <div class="m-power-list">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>角色列表<span>（共{{log_num}}条记录）</span>
        <el-button type="text" icon="plus" size="small" class="add-forum-btn" @click="edit_role()">添加平台权限</el-button>
        <el-button type="text" icon="plus" size="small" class="add-forum-btn" @click="edit_role()">添加商家权限</el-button>
      </h2>
      <el-table
        :data="tableData"
        stripe
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
          label="角色名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="角色创建时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="角色更新时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          min-width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_role(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_role(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" type="danger" @click="del_admin('all')">删除</el-button>
      </div>
    </div>
    <!--添加权限-->
    <div class="add-power prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="say">
          <el-input type="textarea" v-model="ruleForm.say"></el-input>
        </el-form-item>
        <el-form-item label="权限分配" prop="type">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <el-checkbox-group v-model="ruleForm.list" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in powerList" :value="item.id" :label="item.name" :key="item.id">{{cities}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
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
      return {
        hint: {
          title: '操作提示',
          content: `网站系统管理员, 由总平台设置管理.点击列表里的删除按钮删除单个管理员时不受复选框的影响！复选框数据只在点击列表下方批量删除时有效`
        }, // 提示模块参数
        log_num: 3, // 记录条数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        add_show: false, // 是否弹出管理员编辑页面
        crumb: {
          from: '管理员',
          now: '添加管理员'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          say: '',
          list: []
        }, // 编辑页面表单数据
        checkAll: true,
        powerList: [], // 权限列表
        cities: this.powerList,
        isIndeterminate: true,
        rules: {
          name: [
            {validator: this.va.vaName, trigger: 'blur'}
          ],
          email: [
            {validator: this.va.vaEmail, trigger: 'blur'}
          ],
          pass: [
            {validator: this.va.vaPass, trigger: 'blur'}
          ]
        }, // 验证规则
        id: '' // 所编辑id
      }
    },
    mounted() {
      this.get_roles()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 获取角色列表
      get_roles() {
        window.axiox.post(this.getApi('root/auth/roles')
        ).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.roles
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 添加编辑角色
      edit_role(id) {
        this.id = id;
        this.add_show = true;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/roles-edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.powerList = res.data.permissions
            }
          }).catch((err) => {
            reject(err);
            // this.$message('对不起！请稍后再试')
          })
        })
      },
      handleCheckAllChange(event) {
        this.checkedCities = event.target.checked ? this.ruleForm.list : [];
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
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
      }
    },
    components: {hint, crumb}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*管理员*/
  .m-power-list > h2 {
    font-size: 16px;
    line-height: 36px;
    margin-bottom: 10px;
  }

  .add-forum-btn {
    margin-left: 10px;
    padding-left: 12px;
    padding-right: 12px;
    border: 1px solid #1cadf1;
  }

  /*添加管理员*/
</style>
