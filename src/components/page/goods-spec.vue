<template>
  <div class="spec-list prop-box">
    <!--商品规格-->
    <div class="m-spec-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>商品规格
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_spec('')">添加规格
        </el-button>
        <div class="u-right">
          <el-input placeholder="搜索规格名" v-model="search" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_spec"></el-button>
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
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="规格名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="note"
          label="规格备注"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_spec(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_spec(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-tooltip class="item" effect="dark" content="如分类下有下级分类或商品，自动过滤不删除" placement="top-start">
          <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                     @click="del_spec('all')">删除
          </el-button>
        </el-tooltip>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加规格-->
    <div class="add-spec prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="规格备注" prop="note">
          <el-input v-model="ruleForm.note"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-tooltip class="item" effect="dark" content="数值越大 排序越靠前" placement="top-start">
            <el-input v-model.number="ruleForm.sort"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="规格值">
          <!--   <el-table
               :data="ruleForm.value"
               stripe
               style="width: 100%">
               <el-table-column
                 prop="name"
                 label="规格值名称"
                 width="180">
               </el-table-column>
               <template slot-scope="scope">
                 <el-input v-model="ruleForm.value[scope.$index].name" placeholder="请输入规格值名称"></el-input>
               </template>
               <el-table-column
                 prop="sort"
                 label="排序"
                 width="180">
               </el-table-column>
               <el-table-column
                 label="操作">
                 <template slot-scope="scope">
                   <el-button type="danger" size="small" icon="delete"
                              @click="del_spec_value(scope.$index, ruleForm.value)">删除
                   </el-button>
                 </template>
               </el-table-column>
             </el-table>-->
          <table>
            <tr>
              <th>规格值</th>
              <th>排序</th>
              <th>操作</th>
            </tr>
            <tr v-for="item in ruleForm.value">
              <td class="sele-s">
                <el-input v-model="item.name" placeholder="请输入规格值名称"></el-input>
              </td>
              <td class="sele-s">
                <el-input v-model="item.sort" placeholder="请输入排序数值"></el-input>
              </td>
              <td class="sele-s">
                <el-button type="danger" size="small" icon="delete"
                           @click="del_spec_value(item.id,item.key)">删除
                </el-button>
              </td>
            </tr>
          </table>
          <el-button @click="add_spec_value">新增属性</el-button>
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
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `商品规格是购买商品时用户可以选择的, 如衣服颜色, 尺寸等.`
        }, // 提示模块参数
        tableData: [], // 表格数据
        search: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '商品规格',
          now: '编辑规格'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          note: '',
          sort: null,
          value: []
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ],
          note: [
            {required: true, message: '请输入规格备注', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字值'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_spec()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_spec()
      },
      // 获取商品规格列表
      get_spec() {
        window.axiox.post(this.getApi('root/auth/specs_list'),
          this.dafa({
            search_str: this.search,
            index: this.index
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.specs;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑规格
      edit_spec(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/specs_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.specs) {
                this.ruleForm = res.data.specs
              } else {
                this.ruleForm = {
                  name: '',
                  note: '',
                  sort: null,
                  value: []
                }
              }
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
          })
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
      // 删除规格
      del_spec(id) {
        this.$confirm('是否确认删除规格?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/specs_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_spec();
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
      // 添加规格值
      add_spec_value() {
        this.ruleForm.value.push({
          name: '',
          img: '',
          sort: '',
          key: Date.now()
        })
      },
      // 删除规格值
      del_spec_value(id, key) {
        let arr = [];
        if (id) {
          axiox.post(this.getApi('root/auth/specs_value_del'),
            `id=${id}`
          ).then(res => {
            if (res.data.code === 0) {
              this.$message(res.data.msg);
              this.ruleForm.value.forEach(item => {
                if (item.id != id) {
                  arr.push(item);
                }
              });
              this.ruleForm.value = arr;
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        } else {
          this.ruleForm.value.forEach(item => {
            if (item.key != key) {
              arr.push(item);
            }
          });
          this.ruleForm.value = arr;
        }
      },
      // 提交保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/specs_save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  note: this.ruleForm.note,
                  sort: this.ruleForm.sort,
                  value: this.ruleForm.value
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_spec();
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
  .sele-s .el-button {
    width: 120px;
    height: 36px;
    margin: 0;
  }
</style>
