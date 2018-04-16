<template>
  <div class="type-list prop-box">
    <!--广告位-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>导航管理
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_cms('')">添加导航
        </el-button>
        <div class="u-right">
          <el-select class="sele-s" v-model="type" placeholder="导航类型">
            <el-option label="全部导航" value="0"></el-option>
            <el-option label="主导航" value="1"></el-option>
            <el-option label="底部导航" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="get_cms"></el-button>
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
          label="导航名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="link"
          label="链接地址"
          min-width="220">
        </el-table-column>
        <el-table-column
          prop="img"
          label="导航图片"
          min-width="200">
          <template slot-scope="scope">
            <img :src="scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="导航类型"
          min-width="130">
          <template slot-scope="scope">
            <span v-if=" scope.row.type == 0 ">全部导航</span>
            <span v-else-if=" scope.row.type == 1 ">主导航</span>
            <span v-else>底部导航</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="open_type"
          label="打开方式"
          min-width="120">
          <template slot-scope="scope">
            <span v-if=" scope.row.open_type == 0 ">本窗口</span>
            <span v-else>新窗口</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="enable"
          label="是否开启"
          min-width="100">
          <template slot-scope="scope">
            <span v-if=" scope.row.enable == 0 ">关闭</span>
            <span v-else>开启</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_cms(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_cms(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_cms('all')">删除
        </el-button>
      </div>
      <!--<page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>-->
    </div>
    <!--添加-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="导航名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="导航链接地址">
          <el-input v-model="ruleForm.link"></el-input>
        </el-form-item>
        <el-form-item label="导航类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择">
            <el-option label="全部导航" :value="0"></el-option>
            <el-option label="主导航" :value="1"></el-option>
            <el-option label="底部导航" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打开方式 ">
          <el-select v-model="ruleForm.open_type" placeholder="请选择">
            <el-option label="本窗口" :value="0"></el-option>
            <el-option label="新窗口" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导航图片">
          <!--<el-upload
            class="avatar-uploader"
            :action="getApi('coms/upload-img')"
            :data="{type:10}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>-->
          <item-upload
            :onSuccess="handleAvatarSuccess"
            :onRemove="handleRemove"
            :fileList="fileList"
            :limit="1"
            :severType=10></item-upload>
          <em class="c-danger">请上传大小为：100*100 的图片，最好到矢量图库寻找</em>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否开启 ">
          <el-select v-model="ruleForm.enable" placeholder="请选择">
            <el-option label="关闭" :value="0"></el-option>
            <el-option label="开启" :value="1"></el-option>
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
  import ItemUpload from '../common/upload.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `导航管理，有平台设置管理。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        type: '', // 导航类型 0=全部导航 1=主导航 2=底部导航
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '导航管理',
          now: '导航编辑'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          link: '',
          type: '',
          open_type: 0,
          sort: 1,
          enable: 1
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '不能为空'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        imageUrl: '',
        fileList: [], // 已存在图片盒子
        loading: true
      }
    },
    created() {
      this.get_cms()
    },
    methods: {
      //图片接口
      handleAvatarSuccess(res, file) {
        this.ruleForm.img = res.key;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      //删除图片
      handleRemove(file, fileList) {
        this.fileList = []
      },
      // 上传前
      beforeAvatarUpload(file) {
        let isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 获取列表
      get_cms() {
        window.axiox.post(this.getApi('root/auth/nav_list'),
          `type=${this.type}`
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
      edit_cms(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/nav_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
                this.imageUrl = res.data.info.img;
                this.fileList = [{url: res.data.info.img}]
              } else {
                this.ruleForm = {
                  name: '',
                  link: '',
                  type: '',
                  open_type: 0,
                  sort: 1,
                  enable: 1
                };
                this.imageUrl = '';
                this.fileList = [];
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
            window.axiox.post(this.getApi('root/auth/nav_del'),
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
              window.axiox.post(this.getApi('root/auth/nav_save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  link: this.ruleForm.link,
                  type: this.ruleForm.type,
                  open_type: this.ruleForm.open_type,
                  sort: this.ruleForm.sort,
                  enable: this.ruleForm.enable,
                  img: this.ruleForm.img || this.imageUrl || '',
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
      /* index () {
       return this.$store.state.index
       }*/
    },
    components: {
      hint, crumb, ItemUpload
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-table img {
    width: 35px;
    height: 35px;
    background-color: #1cadf1;
  }

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
    background-color: #ededed;
  }
</style>

