<template>
  <div class="type-list prop-box">
    <!--全部文章分类-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>APP版本列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_APP('')">新增新版本
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
          prop="version_code"
          label="安卓版本号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="update_log"
          label="更新日志"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="system"
          label="操作系统"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="发布时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">已下架</span>
            <span v-else>发行中</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="260">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_APP(scope.row.id)">编辑
            </el-button>
            <el-button type="warning" size="small" icon="plus" @click="TD_APP(scope.row.id,1)"
                       v-if="scope.row.status==0">发行
            </el-button>
            <el-button type="warning" size="small" icon="minus" @click="TD_APP(scope.row.id,0)" v-else>下架
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_APP(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_APP('all')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加类型-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="安卓版本号" prop="version_code">
          <el-input v-model="ruleForm.version_code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            :multiple='false'
            :show-file-list="true"
            :action="getApi('coms/upload-apk')"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <em class="c-danger">只能上传apk文件</em>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="ruleForm.apk_path">{{ruleForm.apk_path}}</el-form-item>
        <el-form-item label="更新日志">
          <el-input type="textarea"
                    :rows="2" v-model="ruleForm.update_log"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="system">
          <el-input v-model.number="ruleForm.system"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="ruleForm.create_time"
            type="datetime"
            @change="upTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择">
            <el-option label="已下架" :value="0"></el-option>
            <el-option label="发行中" :value="1"></el-option>
          </el-select>
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
          content: `填写系统升级的信息。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: 'APP版本管理',
          now: '版本编辑'
        }, // 面包屑模块参数
        ruleForm: {
          version_code: '',
          update_log: '',
          system: '',
          create_time: '',
          status: '',
          apk_path: ''
        }, // 编辑页面表单数据
        rules: {
          version_code: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          system: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, type: 'number', message: '不能为空', trigger: 'blur'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        create_time: '', // 发布时间
        fileApk: '', // 文件路径
        loading: true
      }
    },
    created() {
      this.get_APP()
    },
    methods: {
      //发布时间
      upTime(val) {
        if (val) {
          this.ruleForm.create_time = val;
        }
      },
      //文件上传成功回调函数
      handleAvatarSuccess(res, file) {
        if (res.code === 0) {
          this.fileApk = res.path;
          this.ruleForm.apk_path = res.path.split('/').pop();
        } else {
          this.$message(res.msg);
        }
      },
      //文件上传前函数
      beforeAvatarUpload(file) {
        const isAPK = /.apk/.test(file.name);
        if (!isAPK) {
          this.$message.error('上传文件只能是 APK 格式!');
        }
        return isAPK;
      },
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_APP()
      },
      // 获取
      get_APP() {
        window.axiox.post(this.getApi('root/auth/android_list'),
          `index=${this.index}`
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
      // 编辑
      edit_APP(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/android_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
              } else {
                this.ruleForm = {
                  version_code: '',
                  update_log: '',
                  system: '',
                  create_time: '',
                  status: '',
                  apk_path: ''
                }
              }
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
            // this.$message('对不起！请稍后再试')
          })
        })
      },
      // 发行|下架
      TD_APP(id, val) {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/android_release'),
            this.dafa({
              id: id,
              type: val
            })
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.get_APP();
            }
          }).catch(err => {
            reject(err);
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
      // 删除
      del_APP(id) {
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
            window.axiox.post(this.getApi('root/auth/android_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_APP();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
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
      // 提交表单
      submitForm(formName) {
        // 处理提交所需规格数据格式
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/android_save'),
                this.dafa({
                  id: this.id,
                  version_code: this.ruleForm.version_code,
                  update_log: this.ruleForm.update_log,
                  system: this.ruleForm.system,
                  create_time: this.ruleForm.create_time,
                  status: this.ruleForm.status,
                  apk_path: this.fileApk || "app/" + this.ruleForm.apk_path
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  // this.$message(res.data.msg);
                  this.add_show = false;
                  this.get_APP()
                }
              }).catch(err => {
                reject(err);
                console.log(err);
                // this.$message('对不起！请稍后再试。具体错误已打印在控制台')
              })
            })
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
