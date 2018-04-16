<template>
  <div class="member-level prop-box">
    <!--会员等级-->
    <div class="m-member-level-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>会员等级列表
        <el-button type="text" icon="plus" size="small" class="add-member-level-btn add-btn"
                   @click="edit_member_level('','')">
          添加会员等级
        </el-button>
        <!--<div class="u-right">
          <el-input placeholder="搜索规格名" v-model="search" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_spec"></el-button>
          </el-input>
        </div>-->
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
          prop="slug"
          label="唯一标识"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="等级名称"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="attrs"
          label="等级属性"
          min-width="340">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_member_level(scope.row.slug)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_member_level(scope.row.slug)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <!--<el-tooltip class="item" effect="dark" content="如分类下有下级分类或商品，自动过滤不删除" placement="top-start">-->
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_member_level('all')">删除
        </el-button>
        <!--</el-tooltip>-->
      </div>
      <!--<page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>-->
    </div>
    <!--添加会员等级-->
    <div class="add-member-level prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="等级标识" prop="slug">
          <el-input v-model="ruleForm.slug"></el-input>
        </el-form-item>
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-tooltip class="item" effect="dark" content="数值越大 排序越靠前" placement="top-start">
            <el-input v-model.number="ruleForm.sort"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="等级属性">
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
          <table class="attrs">
            <tr>
              <th>属性名</th>
              <th>属性值</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
            <tr v-for="item in ruleForm.attrs">
              <td class="sele-m">
                <el-input v-model="item.key" placeholder="请输入属性键名"></el-input>
              </td>
              <td class="sele-m">
                <el-input v-model="item.val" placeholder="请输入属性键值"></el-input>
              </td>
              <td>
                <el-input v-model="item.intro" placeholder="请输入备注介绍用途"></el-input>
              </td>
              <td class="sele-s">
                <el-button type="danger" size="small" icon="delete"
                           @click="del_attrs_value(item.key,item.date_key)">删除
                </el-button>
              </td>
            </tr>
          </table>
          <el-button @click="add_attrs_value">新增属性</el-button>
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
  //  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `通过会员等级可以添加或编辑会员等级级别。`
        }, // 提示模块参数
        tableData: [], // 表格数据
//        search: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '会员等级',
          now: '编辑会员等级'
        }, // 面包屑模块参数
        ruleForm: {
          slug: "",
          name: "",
          sort: null,
          attrs: []
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ],
          slug: [
            {required: true, message: '请输入等级标识', trigger: 'blur'}
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
      this.get_member_level()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_member_level()
      },
      // 获取会员等级列表
      get_member_level() {
        window.axiox.post(this.getApi('root/auth/vip_list'),
          this.dafa({
            index: this.index
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑会员等级
      edit_member_level(slug) {
        this.id = slug;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/vip_edit'),
            `slug=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              this.ruleForm.slug = res.data.slug || '';
              this.ruleForm.name = res.data.name || '';
              this.ruleForm.sort = res.data.sort;
              this.ruleForm.attrs = res.data.attrs || [];
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
            // this.$message('对不起！请稍后再试')
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
      // 删除会员等级
      del_member_level(slug) {
        this.$confirm('是否确认删除此会员等级?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (slug === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.slug)
            })
          } else {
            this.del_id.push(slug)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/vip_del'),
              this.dafa({
                slug_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_member_level();
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
      // 添加属性值
      add_attrs_value() {
        this.ruleForm.attrs.push({
          key: '',
          val: '',
          intro: '',
          date_key: Date.now()
        })
      },
      // 删除属性值
      del_attrs_value(k, date_k) {
        let arr = [];
        this.ruleForm.attrs.forEach(item => {
          if (item.key != k) {
            arr.push(item);
          }
        });
        this.ruleForm.attrs = arr;
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/vip_save'),
                this.dafa({
                  slug: this.ruleForm.slug,
                  name: this.ruleForm.name,
                  sort: this.ruleForm.sort,
                  attrs: this.ruleForm.attrs
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_member_level()
                }
              }).catch(err => {
                reject(err);
                // this.$message('对不起！请稍后再试 错误信息已在控制台打印')
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
      hint, crumb
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .attrs .el-button {
    width: 100px;
    margin: 0;
  }
</style>
