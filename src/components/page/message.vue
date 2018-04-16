<template>
  <div class="message-list prop-box">
    <!--商品评价-->
    <div class="m-message-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>消息列表
        <el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_message('')">发送信息
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
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="1"><i class="iconfont icon-shanchu c-danger"></i>&nbsp;&nbsp;删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          min-width="240">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          min-width="240">
        </el-table-column>
        <!--<el-table-column
          prop="good_name"
          label="商品名称"
          min-width="240">
        </el-table-column>-->
        <el-table-column
          prop="time"
          label="时间"
          min-width="180">
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_message('all')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--操作-->
    <el-dialog
      title="发送信息"
      :visible.sync="dialogVisible">
      <div class="cao-zuo">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="信息标题" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="信息内容" prop="content">
            <editor @getEditor="getEditor"></editor>
          </el-form-item>
          <h3>筛选|选填 默认全部</h3>
          <el-form-item label="会员等级">
            <el-select @visible-change="get_vip" v-model="ruleForm.vip" placeholder="请选择" :clearable="true">
              <el-option
                v-for="item in vipObjs"
                :key="item.name"
                :label="item.name"
                :value="item.slug"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="ruleForm.realname"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="ruleForm.eamil"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio class="radio" v-model="ruleForm.sex" :label="0">女</el-radio>
            <el-radio class="radio" v-model="ruleForm.sex" :label="1">男</el-radio>
            <el-radio class="radio" v-model="ruleForm.sex" :label="2">保密</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_do_ok('ruleForm')">发 送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import Editor from '../common/editor.vue'
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `用户可在商品信息页对商品进行咨询。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        vip: '',
        vipObjs: [],
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        ruleForm: {
          title: "",
          content: "",
          vip: "",
          username: "",
          realname: "",
          eamil: "",
          mobile: "",
          sex: null,
        }, // 编辑页面表单数据
        rules: {
          title: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 5, message: '长度在 5 个字符以上', trigger: 'blur'}
          ]
        }, // 验证规则
        dialogVisible: false, // 是否弹出
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_message()
    },
    methods: {
      // 监听子组件 编辑器内容
      getEditor(data) {
        this.ruleForm.content = data
      },
      //请求会员等级
      get_vip(val) {
        if (val) {
          axiox.post(this.getApi('root/auth/vip_list')
          ).then(res => {
            if (res.data.code === 0) {
              this.vipObjs = res.data.list;
            } else {
              this.$message('请求错误');
            }
          }).catch(err => {
            this.$message('对不起，请稍后再试');
          })
        }
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_message()
      },
      // 获取信息列表
      get_message() {
        window.axiox.post(this.getApi('root/auth/message_list'),
          this.dafa({
            index: this.index
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount;
            this.ruleForm.title = '';
            this.ruleForm.content = '';
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
            this.edit_message(id);
            break;
          case '1':
            this.del_message(id);
            break;
        }
      },
      // 操作结束 - 发送
      to_do_ok(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/message_send'),
                this.dafa({
                  title: this.ruleForm.title,
                  content: this.ruleForm.content,
                  vip: this.ruleForm.vip,
                  username: this.ruleForm.username,
                  realname: this.ruleForm.realname,
                  eamil: this.ruleForm.eamil,
                  mobile: this.ruleForm.mobile,
                  sex: this.ruleForm.sex
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.dialogVisible = false;
                  this.get_message()
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
      },
      // 发送信息
      edit_message() {
        this.dialogVisible = true;
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
      // 删除评价
      del_message(id) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (id == 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(this.id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/message_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_message();
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
      hint, page, Editor
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-dialog h3 {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px dashed #eee;
    color: #333;
    background-color: #f0f0f0;
    padding-left: 15px;
    margin: 20px 0 10px;
  }

  .el-dialog h4 {
    line-height: 40px;
    color: #ff4d51;
    padding-left: 20px;
  }

  .order-info-ul {
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
  }

  .order-info-ul li {
    line-height: 38px;
    border-bottom: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    box-sizing: border-box;
  }

  .order-info-ul li span {
    display: inline-block;
    width: 140px;
    color: #333;
    background-color: #f1f2f3;
    margin-right: 10px;
    padding-left: 20px;
  }

  .order-info-ul em {
    margin-left: 10px;
    color: #ff4d51;
  }

</style>
