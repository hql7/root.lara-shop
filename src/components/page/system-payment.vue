<template>
  <div class="type-list prop-box">
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>支付方式列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_system('')">新增支付方式
        </el-button>
      </h2>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        stripe
        ref="multipleTable">
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="0"><i class="iconfont icon-wancheng1 c-danger"></i>编辑</el-dropdown-item>
                <el-dropdown-item command="1" v-if="scope.row.status==1"><i
                  class="iconfont icon-huifu-copy c-danger"></i>&nbsp;&nbsp;开启
                </el-dropdown-item>
                <el-dropdown-item command="2" v-else><i class="iconfont icon-jinzhi c-danger"></i>&nbsp;&nbsp;关闭
                </el-dropdown-item>
                <el-dropdown-item command="3"><i class="iconfont icon-shanchu4 c-danger"></i>&nbsp;&nbsp;删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="logo"
          label="LOGO"
          min-width="120">
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="" width="45" height="45">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="支付方式"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">开启</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="260">
        </el-table-column>
      </el-table>
    </div>
    <!--添加-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="支付方式名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="支付方式LOGO">
          <!--<el-upload
            class="avatar-uploader"
            :action="getApi('coms/upload-img')"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            &lt;!&ndash;<img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">&ndash;&gt;
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <item-upload
            :onSuccess="handleAvatarSuccess"
            :onRemove="handleRemove"
            :limit="1"
            :fileList="fileList"
            :severType=5></item-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="支付方式描述" prop="description">
          <el-input type="textarea"
                    :rows="2" v-model="ruleForm.description"></el-input>
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
  import ItemUpload from '../common/upload.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `支付方式是连接商城购买用的接口,关闭与开启是用来启动或关闭某个支付方式。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '支付方式',
          now: '编辑支付方式'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          logo: '',
          sort: '',
          description: ''
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '请输入支付方式名称', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '请输入排序'},
            {type: 'number', message: '必须为数字值'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        imageUrl: '',
        fileList: [], // 已存在图片列表
        loading: true
      }
    },
    created() {
      this.get_system()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 处理
      handle(val, id) {
        this.id = id;
        switch (val) {
          case '0':
            this.edit_system(id);
            break;
          case '1':
            this.turn_off(0);
            break;
          case '2':
            this.turn_off(1);
            break;
          case '3':
            this.del_system();
            break;
        }
      },
      // 获取
      get_system() {
        axiox.post(this.getApi('root/auth/payment_list')
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑
      edit_system(id) {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/payment_edit'),
            `id=${id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
                this.imageUrl = this.ruleForm.logo;
                this.fileList = [{url: this.ruleForm.logo}]
              } else {
                this.ruleForm = {
                  name: '',
                  logo: '',
                  sort: '',
                  description: ''
                };
                this.fileList = []
              }
            }
          }).catch((err) => {
            reject(err);
          })
        })
      },
      // 开启|关闭
      turn_off(tp) {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/payment_open'),
            this.dafa({
              id: this.id,
              type: tp
            })
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.get_system()
            }
          }).catch((err) => {
            reject(err);
          })
        })
      },
      // 删除
      del_system(id) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.antiShake.antiShake((resolve, reject) => {
            axiox.post(this.getApi('root/auth/payment_del'),
              `id=${this.id}`
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_system();
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
      // 上传成功
      handleAvatarSuccess(res, file) {
        this.ruleForm.logo = res.key;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 上传前
      beforeAvatarUpload(file) {
        let isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 1;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!');
        }
        return isJPG && isLt2M;
      },
      // 删除
      handleRemove() {
        this.fileList = []
      },
      // 提交表单
      submitForm(formName) {
        // 处理提交所需规格数据格式
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/payment_save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  logo: this.ruleForm.logo || this.imageUrl || '',
                  sort: this.ruleForm.sort,
                  description: this.ruleForm.description
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_system()
                }
              }).catch(err => {
                reject(err);
                console.log(err);
              })
            })
          } else {
            this.$message('请检查填写信息是否有误');
            return false
          }
        })
      }
    },
    components: {
      hint, crumb, ItemUpload
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
