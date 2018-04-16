<template>
  <div class="type-list prop-box">
    <!--广告列表-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>广告列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_cms('','')">新增广告
        </el-button>
        <div class="u-right">
          <!--<el-select class="sele-s" v-model="article" placeholder="文章分类">
            <el-option label="全部文章" value="0">
            </el-option>
          </el-select>-->
          <el-input class="search"
                    placeholder="搜索关键词"
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
          prop="position_name"
          label="广告位置名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="ad_name"
          label="广告名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="ad_type"
          label="广告类型"
          min-width="160">
          <template slot-scope="scope">
            <span v-if=" scope.row.ad_type == 0 ">图片</span>
            <span v-else>flash</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="img"
          label="广告图片"
          min-width="200">
          <template slot-scope="scope">
            <img :src="scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="is_open"
          label="是否显示"
          min-width="100">
          <template slot-scope="scope">
            <span v-if=" scope.row.is_open == 0 ">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="80">
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
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="广告名称" prop="ad_name">
          <el-input v-model="ruleForm.ad_name"></el-input>
        </el-form-item>
        <el-form-item label="广告位置">
          <el-select v-model="ruleForm.position_id" placeholder="请选择">
            <el-option v-for="item in GGWZ" :key="item.id" :label="item.position_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告类型" prop="ad_type">
          <el-select v-model="ruleForm.ad_type" placeholder="请选择">
            <el-option label="图片" :value="0"></el-option>
            <el-option label="flash" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告图片">
          <!--<el-upload
            class="avatar-uploader"
            :action="getApi('coms/upload-img')"
            :data="{type:3}"
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
            :severType=3></item-upload>
        </el-form-item>
        <el-form-item label="广告链接地址" prop="link">
          <el-input v-model="ruleForm.link"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-select v-model="ruleForm.is_open" placeholder="请选择">
            <el-option label="不显示" :value="0"></el-option>
            <el-option label="显示" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="ruleForm.start_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="STIME"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="ruleForm.end_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="ETIME"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="ruleForm.sort"></el-input>
          <div class="c-danger">默认将排序显示，开启轮播模式后广告将轮播</div>
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
  import ItemUpload from '../common/upload.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `广告管理, 由平台设置新增分类、编辑图片与替换广告图片。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        article: '', // 文章分类
        search: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '广告管理',
          now: '广告编辑'
        }, // 面包屑模块参数
        ruleForm: {
          ad_name: '',
          position_id: '',
          ad_type: '',
          img: '',
          link: '',
          is_open: '',
          start_time: '',
          end_time: '',
          sort: null
        }, // 编辑页面表单数据
        imageUrl: '',
        fileList: [], // 已存在图片盒子
        GGWZ: [],
        rules: {
          ad_name: [
            {required: true, message: '请输入广告名', trigger: 'blur'}
          ],
          link: [
            {required: true, message: '请输入广告连接地址', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '排序必须选择'},
            {type: 'number', message: '必须为数字值'}
          ],
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_cms();
      this.get_GGWZ()
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
        window.axiox.post(this.getApi('root/auth/ad_list'),
          this.dafa({
            position_id: this.article,
            ad_name: this.search,
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
      // 获取广告位置
      get_GGWZ() {
        axiox.post(this.getApi('root/auth/position_list'),
          `index=1`
        ).then(res => {
          if (res.data.code === 0) {
            this.GGWZ = res.data.list
          }
        })
      },
      // 编辑
      edit_cms(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/ad_edit'),
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
                  ad_name: '',
                  position_id: '',
                  ad_type: '',
                  link: '',
                  is_open: '',
                  start_time: '',
                  end_time: '',
                  sort: null
                };
                this.imageUrl = '';
                this.fileList = []
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
      // 删除文章
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
            window.axiox.post(this.getApi('root/auth/ad_del'),
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
              window.axiox.post(this.getApi('root/auth/ad_save'),
                this.dafa({
                  id: this.id,
                  ad_name: this.ruleForm.ad_name,
                  position_id: this.ruleForm.position_id,
                  ad_type: this.ruleForm.ad_type,
                  img: this.ruleForm.img || this.imageUrl || '',
                  link: this.ruleForm.link,
                  is_open: this.ruleForm.is_open,
                  start_time: this.ruleForm.start_time,
                  end_time: this.ruleForm.end_time,
                  sort: this.ruleForm.sort
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
      },
      // 上传成功
      handleAvatarSuccess(res, file) {
        this.ruleForm.img = res.key;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      //删除图片
      handleRemove(file, fileList) {
        this.fileList = [];
      },
      // 上传前
      beforeAvatarUpload(file) {
        let isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片是 JPG 或 PNG格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 时间格式
      STIME(val) {
        this.ruleForm.start_time = val;
      },
      ETIME(val) {
        this.ruleForm.end_time = val;
      }
    },
    computed: {
      index() {
        return this.$store.state.index
      }
    },
    components: {
      hint, crumb, page, ItemUpload
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-table img {
    max-height: 60px;
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
  }
</style>
