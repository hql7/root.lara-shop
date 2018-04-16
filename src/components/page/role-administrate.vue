<template>
  <div class="role-administrate prop-box">
    <!--管理员列表-->
    <div class="m-role-administrate m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>角色列表<span>（共{{tableData.length}}条记录）</span>
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_role('')">添加角色
        </el-button>
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
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="角色创建时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="updated_at"
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
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger" @click="del_role('all')">删除
        </el-button>
      </div>
    </div>
    <!--添加角色-->
    <div class="add-role prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="ruleForm.say"></el-input>
        </el-form-item>
        <el-form-item label="权限分配" prop="list">
          <div v-for="(item,index) in powerList">
            <el-checkbox v-model="checkAll[item.id]" @change="handleCheckAllChange($event,item.id,index)">
              全选-{{item.title}}
            </el-checkbox>
            <el-checkbox-group v-model="checkeds[item.id]"
                               @change="handleCheckedChange($event,item.id,index)">
              <el-checkbox v-for="ite in item.grandson" :label="ite.id" :key="ite.id">
                {{ite.title}}
              </el-checkbox>
            </el-checkbox-group>
            <div style="margin: 15px 0;"></div>
          </div>
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
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        add_show: false, // 是否弹出管理员编辑页面
        crumb: {
          from: '角色管理',
          now: '添加角色'
        }, // 面包屑模块参数
        ruleForm: {
          id: '',
          name: '',
          say: '',
          list: []
        }, // 编辑页面表单数据
        checkAll: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
          8: false
        }, // 全选
        checkeds: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: []
        }, // 选中项列表
        powerList: [], // 权限列表
        rules: {
          name: [
            {required: true, message: '请输入角色名', trigger: 'blur'}
          ],
          list: [
            {validator: this.va.vaArrey, trigger: 'submit'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_roles()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false;
      },
      // 获取角色列表
      get_roles() {
        window.axiox.post(this.getApi('root/auth/roles')
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.roles
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 添加编辑角色
      edit_role(id) {
        this.add_show = true;
        this.id = id;
        // 清楚数据
        this.checkeds = {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: []
        };
        this.checkAll = {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
          8: false
        };
        // 发送请求
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/roles-edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.powerList = res.data.all_pers;
              this.ruleForm.name = res.data.name;
              this.ruleForm.say = res.data.description;
              this.ruleForm.id = res.data.id;

              // 处理权限列表中的选中项
              this.powerList.forEach(item => {
                this.checkAll[item.id] = item.checked;
                item.grandson.forEach(ite => {
                  if (ite.checked) {
                    this.checkeds[item.id].push(ite.id)
                  }
                })
              })
            }
          }).catch((err) => {
            reject(err);
            console.log(err)
            // this.$message('对不起！请稍后再试')
          })
        })
      },
      // 全选
      handleCheckAllChange(event, id, index) {
        if (event) {
          let arr = [];
          this.powerList[index].grandson.forEach(item => {
            arr.push(item.id)
          });
          this.checkeds[id] = arr
        } else {
          this.checkeds[id] = []
        }
      },
      // 多选列表
      handleCheckedChange(value, id, index) {
        this.checkAll[id] = value.length === this.powerList[index].grandson.length
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
      // 删除角色
      del_role(id) {
        this.$confirm('是否确认删除角色?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/roles-del'),
              this.dafa({
                id: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_roles();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              // this.$message('对不起！请稍后再试');
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
      // 保存角色
      submitForm(formName) {
        let arr = [];
        for (let i in this.checkeds) {
          arr = arr.concat(this.checkeds[i])
        }
        this.ruleForm.list = arr;

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/roles-save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  description: this.ruleForm.say,
                  permissions: this.ruleForm.list
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_roles()
                }
              }).catch(err => {
                reject(err);
              })
            })
          } else {
            this.$message('请检查填写信息是否有误');
            return false
          }
        })
      }
    },
    computed: {},
    components: {hint, crumb}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

