<template>
  <div class="type-list prop-box">
    <!--广告位-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>广告位置
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_cms('')">新增位置
        </el-button>
        <div class="u-right">
          <!--<el-select class="sele-s" v-model="article" placeholder="文章分类">
            <el-option label="全部文章" value="0">
            </el-option>
          </el-select>-->
          <el-input class="search"
                    placeholder="搜索关键词"
                    icon="el-icon-search"
                    v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="get_cms"></el-button>
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
          label="ID"
          min-width="50">
        </el-table-column>
        <el-table-column
          prop="position_name"
          label="广告位置名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="position_desc"
          label="广告位描述"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="ad_width"
          label="广告位宽度"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="ad_height"
          label="广告位高度"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="is_open"
          label="是否开启"
          min-width="100">
          <template slot-scope="scope">
            <span v-if=" scope.row.is_open == 0 ">关闭</span>
            <span v-else>开启</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_cms(scope.row.id)">编辑
            </el-button>
            <!--<el-button type="danger" size="small" icon="delete" @click="del_cms(scope.$index, tableData)">删除-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!--    <div class="select-all" v-if="tableData">
            <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
            <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                       @click="del_cms('all', '')">删除
            </el-button>
          </div>-->
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="广告位置名称" prop="position_name">
          <el-input v-model="ruleForm.position_name"></el-input>
        </el-form-item>
        <el-form-item label="广告位宽度" prop="ad_width">
          <el-input v-model.number="ruleForm.ad_width"></el-input>
          <em>必须为数值型 单位：px</em>
        </el-form-item>
        <el-form-item label="广告位高度" prop="ad_height">
          <el-input v-model.number="ruleForm.ad_height"></el-input>
          <em>必须为数值型 单位：px</em>
        </el-form-item>
        <el-form-item label="是否开启 ">
          <el-select v-model="ruleForm.is_open" placeholder="请选择">
            <el-option label="关闭" :value="0"></el-option>
            <el-option label="开启" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位描述">
          <el-input type="textarea"
                    :rows="2" v-model="ruleForm.position_desc"></el-input>
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
          content: `广告位置在广告管理，新增广告标签里面调用。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        search: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '广告位置',
          now: '位置编辑'
        }, // 面包屑模块参数
        ruleForm: {
          position_name: '',
          ad_width: null,
          ad_height: null,
          position_desc: '',
          is_open: null
        }, // 编辑页面表单数据
        rules: {
          position_name: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          ad_width: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字值'}
          ],
          ad_height: [
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
      this.get_cms();
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_cms()
      },
      // 获取列表
      get_cms() {
        window.axiox.post(this.getApi('root/auth/position_list'),
          this.dafa({
            position_name: this.search,
            index: this.index
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
      // 编辑
      edit_cms(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/position_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
              } else {
                this.ruleForm = {
                  position_name: '',
                  ad_width: null,
                  ad_height: null,
                  position_desc: '',
                  is_open: null
                }
              }
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
            // this.$message('对不起！请稍后再试')
          })
        });
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
      // 删除
      del_cms(id) {
        this.$confirm('是否确认删除?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/position_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_cms();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
              // this.$message('对不起！请稍后再试');
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
      },
      // 提交表单
      submitForm(formName) {
        // 处理提交所需规格数据格式
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/position_save'),
                this.dafa({
                  id: this.id,
                  position_name: this.ruleForm.position_name,
                  ad_width: this.ruleForm.ad_width,
                  ad_height: this.ruleForm.ad_height,
                  position_desc: this.ruleForm.position_desc,
                  is_open: this.ruleForm.is_open
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_cms()
                }
              }).catch(err => {
                reject(err);
                console.log(err);
                // this.$message('对不起！请稍后再试。具体错误已打印在控制台')
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

</style>
