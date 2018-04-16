<template>
  <div class="brand-list prop-box">
    <!--品牌列表-->
    <div class="m-brand-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>品牌列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_brand('')">添加品牌
        </el-button>
        <div class="u-right">
          <el-input class="search"
                    placeholder="搜索品牌名称"
                    icon="el-icon-search"
                    v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="get_brand"></el-button>
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
          prop="name"
          label="名称"
          min-width="100">
          <!--<template slot-scope="scope">-->
          <!--<a class="logo-url" :href="tableData[scope.$index].url">{{tableData[scope.$index].name}}</a>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="logo"
          label="LOGO"
          min-width="100">
          <template slot-scope="scope">
            <a class="logo-url" :href="scope.row.url"><img class="logo-img"
                                                           :src="scope.row.logo" alt="logo"
                                                           width="45" height="35"></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="100">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_brand(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_brand(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_brand('all')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--品牌编辑-->
    <div class="add-brand prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="官网链接" prop="url">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logo">
          <!--<el-upload
            class="avatar-uploader"
            :action="getApi('coms/upload-img')"
            :data="{type:1}"
            :show-file-list="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :auto-upload="true"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <item-upload
            :onSuccess="handleAvatarSuccess"
            :onRemove="handleRemove"
            :fileList="fileList"
            :limit="1"
            :severType=1></item-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="ruleForm.sort"></el-input>
        </el-form-item>
        <!--<h3>SEO信息</h3>-->
        <el-form-item label="SEO标题">
          <el-input v-model="ruleForm.seo_title"></el-input>
        </el-form-item>
        <el-form-item label="SEO关键词">
          <el-input v-model="ruleForm.seo_keywords"></el-input>
        </el-form-item>
        <el-form-item label="SEO描述">
          <el-input v-model="ruleForm.seo_description"></el-input>
        </el-form-item>
        <el-form-item label="详细信息">
          <editor @getEditor="getEditor" :content="content"></editor>
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
  import Editor from '../common/editor.vue'
  import ItemUpload from '../common/upload.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `同一个品牌可以添加多次。比如卖笔记本下面一个苹果品牌. 卖手机下面也有苹果牌,卖箱包下面也有苹果牌。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        search: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '品牌列表',
          now: '品牌编辑'
        }, // 面包屑模块参数
        ruleForm: {}, // 编辑页面表单数据
        logo: '', // 上传成功返回的路径用来提交表单时提交
        imageUrl: '',
        fileList: [], // 已存在图片盒子
        rules: {
          name: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请输入官网链接', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字值'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        content: '', //详细描述
        loading: true
      }
    },
    created() {
      this.get_brand()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_brand()
      },
      // 监听子组件 编辑器内容
      getEditor(data) {
        this.content = data
      },
      // 获取商品列表
      get_brand() {
        window.axiox.post(this.getApi('root/auth/brands_list'),
          this.dafa({
            search_str: this.search,
            index: this.index
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.brands;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑类型
      edit_brand(id) {
        this.add_show = true;
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/brands_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              res.data.brand = res.data.brand || {};
              this.ruleForm = res.data.brand;
              this.imageUrl = res.data.brand.logo;
              this.fileList = [{url: res.data.brand.logo}];
              this.content = res.data.brand.content
            }
          }).catch((err) => {
            reject(err);
            console.log(err)
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
      // 删除品牌
      del_brand(id) {
        this.$confirm('是否确认删除此品牌?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/brands_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_brand();
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
      // logo 上传
      handleAvatarSuccess(res, file) {
        this.logo = res.key;
        /* this.img = res.path;*/
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // logo上传前钩子函数
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 点击预览时得到的数据
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true
      },
      // 上传图片
      handleRemove(file, fileList) {
        this.fileList = []
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/brands_save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  url: this.ruleForm.url,
                  sort: this.ruleForm.sort,
                  seo_title: this.ruleForm.seo_title,
                  seo_keywords: this.ruleForm.seo_keywords,
                  seo_description: this.ruleForm.seo_description,
                  logo: this.logo || this.imageUrl || '',
                  content: this.content
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_brand()
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
      hint, crumb, page, Editor, ItemUpload
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logo-url {
    display: block;
  }

  .logo-img {
    width: 45px;
    height: 35px;
    vertical-align: -10px;
  }

  .avatar-uploader {
    width: 180px;
    height: 180px;
    padding: 1px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
  }

  .el-upload {
    cursor: pointer;
    position: relative;
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
