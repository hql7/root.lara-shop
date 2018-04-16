<template>
  <!--站点设置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <h2>站点设置</h2>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <el-form-item label="站点名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="商城LOGO">
        <!-- <el-upload
           class="avatar-uploader"
           :action="getApi('coms/upload-img')"
           :data="{type:11}"
           :show-file-list="false"
           list-type="picture-card"
           :on-preview="handlePreview"
           :on-success="handleAvatarSuccess"
           :auto-upload="true"
           :before-upload="beforeAvatarUpload">
           <img v-if="imageUrl" :src="imageUrl" class="avatar">
           <i v-else class="el-icon-plus avatar-uploader-icon"></i>
         </el-upload>-->
        <item-upload
          :onSuccess="handleAvatarSuccess"
          :onRemove="handleRemove"
          :limit="1"
          :fileList="fileList"
          :severType=11></item-upload>
      </el-form-item>
      <el-form-item label="网站标题">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input type="textarea"
                  :rows="2" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="网站关键字">
        <el-input v-model="ruleForm.keywords"></el-input>
      </el-form-item>
      <el-form-item label="网站备案号">
        <el-input v-model="ruleForm.record_no"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="ruleForm.contact"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="ruleForm.addr"></el-input>
      </el-form-item>
      <el-form-item label="站点开关">
        <el-switch
          v-model="ruleForm.site_open"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="关闭站点时显示的文字">
        <el-input type="textarea"
                  :rows="2" v-model="ruleForm.close_intro"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import ItemUpload from '../common/upload.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `网站全局基本设置，商城及其他模块相关内容在其各自栏目设置项内进行操作。`
        }, // 提示模块参数
        title: 'website',
        imageUrl: '',
        fileList: [], // 已有图片列表
        ruleForm: {
          name: '',
          logo: '',
          title: '',
          description: '',
          keywords: '',
          record_no: '',
          contact: '',
          phone: '',
          addr: '',
          site_open: '',
          close_intro: ''
        }, // 编辑页面表单数据
        imgFormat: false,//图片格式是否通过
        rules: {
          name: [
            {required: true, message: '不可为空', trigger: 'blur'}
          ]
        } // 验证规则
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      // 点击预览时得到的数据
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true
      },
      // logo 上传
      handleAvatarSuccess(res, file) {
        this.logo = res.key;
        /* this.img = res.path;*/
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      // logo上传前钩子函数
      beforeAvatarUpload(file) {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          this.imgFormat = true
        } else {
          this.imgFormat = false
        }

        const isLt2M = file.size / 1024 / 1024 < 21
        if (!this.imgFormat) {
          this.$message.error('上传logo必须是JPG或PNG格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传logo图片大小不能超过 1MB!')
        }
        return this.imgFormat && isLt2M
      },
      // 删除
      handleRemove() {
        this.fileList = []
      },
      // 获取
      get_data() {
        axiox.post(this.getApi('root/auth/config_page'),
          `title=website`
        ).then(res => {
          if (res.data.code === 0) {
            if (res.data.kv) {
              this.ruleForm = res.data.kv;
              this.imageUrl = res.data.kv.logo
            }
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 提交表单
      submitForm(formName) {
        this.ruleForm.logo = this.logo || this.imageUrl || '';
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/config_save'),
                this.dafa({
                  title: this.title,
                  kv: this.ruleForm
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.get_data()
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
      hint, ItemUpload
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-form .el-input, .el-textarea {
    width: 420px;
  }

  .el-button {
    width: 120px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
    width: 160px;
    height: 160px;
    display: block;
  }
</style>
