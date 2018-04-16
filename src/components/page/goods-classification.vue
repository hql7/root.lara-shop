<template>
  <div class="classify-list prop-box">
    <!--分类列表-->
    <div class="m-classify-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>分类列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn"
                   @click="edit_classify('')">添加分类
        </el-button>
        <div class="u-right">
          <el-select class="sele-s" v-model="lv1_id" @visible-change="getFL1"
                     @change="getFL2($event,'search')"
                     placeholder="一级分类">
            <el-option
              v-for="item in lv1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="sele-s" v-model="lv2_id" @change="getFL3" placeholder="二级分类">
            <el-option
              v-for="item in lv2"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
          label="电脑端分类名"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="phone_name"
          label="手机端分类名"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="parent_name"
          label="上级分类"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="产品类型"
          min-width="100">
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="alias"-->
        <!--label="别名"-->
        <!--min-width="100">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="nav_show"
          label="导航显示">
          <template slot-scope="scope">
            <span v-if="scope.row.nav_show == 0 ">隐藏</span>
            <span v-else>显示</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="list_show"
          label="列表显示">
          <template slot-scope="scope">
            <span v-if="scope.row.list_show == 0 ">隐藏</span>
            <span v-else>显示</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit"
                       @click="edit_classify(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete"
                       @click="del_classify(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-tooltip class="item" effect="dark" content="如分类下有下级分类或商品，自动过滤不删除" placement="top-start">
          <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                     @click="del_classify('all')">删除
          </el-button>
        </el-tooltip>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加分类-->
    <div class="add-good prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="电脑端分类名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机端分类名" prop="phone_name">
          <el-tooltip effect="dark" content="适用于手机端的商品分类"
                      placement="top-start">
            <el-input v-model="ruleForm.phone_name"></el-input>
          </el-tooltip>
        </el-form-item>
        <!--<el-form-item label="分类别名" prop="alias">-->
        <!--<el-tooltip class="item" effect="dark" content="方便url识别美化" placement="top-start">-->
        <!--<el-input v-model="ruleForm.alias"></el-input>-->
        <!--</el-tooltip>-->
        <!--</el-form-item>-->
        <el-form-item label="上级分类">
          <el-tooltip class="item" effect="dark" content="如果要设置为第二级, 只选择第一级即可,如不设置，保存为顶级分类"
                      placement="top-start">
            <el-select class="sele-s" @visible-change="getFL1" @change="getFL2" v-model="ruleForm.cly_1"
                       placeholder="顶级分类">
              <el-option v-for="item in lv1" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="如果要设置为第二级, 只选择第一级即可,如不设置，保存为顶级分类"
                      placement="top-start">
            <el-select class="sele-s" @change="getFL3" v-model="ruleForm.cly_2" placeholder="二级分类">
              <el-option v-for="item in lv2" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-tooltip>
          <em class="c-danger"> 分类下有分类不可编辑；不可选择自己为父级分类。</em>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="ruleForm.product_type" placeholder="请选择产品类型">
            <el-option v-for="item in info.type_list" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导航显示">
          <el-switch
            v-model="ruleForm.nav_show"
            active-color="#13ce66"
            inactive-color="#ccc"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="列表显示">
          <el-switch
            v-model="ruleForm.list_show"
            active-color="#13ce66"
            inactive-color="#ccc"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-tooltip class="item" effect="dark" content="数值越大 排序越靠前" placement="top-start">
            <el-input v-model.number="ruleForm.sort"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="分类展示图片" class="up_link">
          <!--<el-upload
            :action="getApi('coms/upload-img')"
            ref="upload"
            :multiple='true'
            :data="{type:2}"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="on_suc"
            :before-upload="beforeImgUpload"
            :auto-upload="true"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>-->
          <item-upload
            :onSuccess="on_suc"
            :onRemove="handleRemove"
            :fileList="fileList"
            :limit="1"
            :severType=2></item-upload>
          <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!--<el-input v-for="item in fileList" v-model="item.link"></el-input>-->
          <em class="c-danger"> 上传到APP、小程序商品分类广告位,一级分类280*110，二三级分类100*100</em>
        </el-form-item>
        <h2 class="seo-title">SEO信息</h2>
        <el-form-item label="页面标题">
          <el-input v-model="ruleForm.seo_title"></el-input>
        </el-form-item>
        <el-form-item label="页面关键词">
          <el-input v-model="ruleForm.seo_keywords"></el-input>
        </el-form-item>
        <el-form-item label="页面描述">
          <el-input v-model="ruleForm.seo_description"></el-input>
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
          content: `温馨提示：顶级分类（一级大类）设为推荐时才会在首页楼层中显示最多只能分类到三级；商品分类最多分为三级，商品分类可以关联商品类型，商品类型关联商品规格商品属性。`
        }, // 提示模块参数
        lv1_id: '', // 所选一级分类
        lv1: [], // 一级分类
        lv2_id: '', // 所选二级分类
        lv2: [], // 二级分类
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '商品分类',
          now: '分类编辑'
        }, // 面包屑模块参数
        info: {}, // 编辑页面信息
        ruleForm: {
          id: '', // 分类ID
          name: '', // 电脑端分类名
          cly_1: '', // 一级分类
          cly_2: '', // 二级分类
          product_type: '', // 产品类型
          nav_show: 1, // 导航显示
          list_show: 1, // 列表显示
          sort: null, // 排序
          seo_title: '', // 页面标题
          seo_keywords: '', // 页面标题
          seo_description: '', // 页面描述
          phone_name: '' //手机端分类名
        }, // 编辑页面表单数据
        fileList: [], // 图片列表
        imgs: [],
        del_pic: [],
        is_img_up: false, //是否上传图片
        dialogImageUrl: '',
        dialogVisible: false,
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '不能为空'},
            {type: 'number', message: '必须为数字'}
          ],
          phone_name: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        open_change: false, // 是否开启分类change事件
        loading: true
      }
    },
    created() {
      this.get_classify()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_classify()
      },
      // 获取商品列表
      get_classify(id = '') {
        window.axiox.post(this.getApi('root/auth/gc_list'),
          this.dafa({
            cate_id: id,
            index: this.index
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.gc_list;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑分类
      edit_classify(id) {
        this.add_show = true;
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/gc_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.info = res.data.info;
              if (res.data.info.id) {
                // 处理数据
                this.ruleForm.id = res.data.info.id;
                this.ruleForm.name = res.data.info.name;
                this.ruleForm.phone_name = res.data.info.phone_name;
                this.ruleForm.sort = res.data.info.sort;
                res.data.info.type_list.forEach(item => {
                  if (item.selected) {
                    this.ruleForm.product_type = item.id
                  }
                });
                this.ruleForm.nav_show = res.data.info.nav_show;
                this.ruleForm.list_show = res.data.info.list_show;
                this.ruleForm.seo_title = res.data.info.seo_title;
                this.ruleForm.seo_keywords = res.data.info.seo_keywords;
                this.ruleForm.seo_description = res.data.info.seo_description;
                // 判断分类等级并处理数据类型
                if (res.data.info.parent_list[0] instanceof Array) {
                  this.lv1 = [];
                  this.ruleForm.cly_1 = null;
                  this.lv2 = [];
                  this.ruleForm.cly_2 = null;
                } else if (res.data.info.parent_list[0].childs.length === 0) {
                  this.lv1 = res.data.info.parent_list;
                  this.ruleForm.cly_1 = res.data.info.parent_list[0].id;
                  this.lv2 = [];
                  this.ruleForm.cly_2 = null;
                } else {
                  this.lv1 = res.data.info.parent_list;
                  this.ruleForm.cly_1 = res.data.info.parent_list[0].id;
                  this.lv2 = res.data.info.parent_list[0].childs;
                  this.ruleForm.cly_2 = res.data.info.parent_list[0].childs[0].id
                }
                this.fileList = res.data.info.imgs
              } else {
                this.ruleForm = {
                  sort: null,
                  nav_show: 1,
                  list_show: 1,
                  seo_keywords: '',
                  seo_description: '',
                  cly_1: '',
                  cly_2: '',
                  phone_name: ''
                };
                this.fileList = [];
              }
            }
            this.$nextTick(() => {
              this.open_change = true
            })
          }).catch((err) => {
            reject(err);
            // console.log(err)
            // this.$message('对不起！请稍后再试')
          })
        })
      },
      // 获取分类
      getFL1(val = '') {
        if (val) {
          window.axiox.post(this.getApi('root/auth/get_cate')
          ).then(res => {
            if (res.data.code === 0) {
              this.lv1 = res.data.list
            } else {
              this.$message(res.data.msg)
            }
          }).catch(() => {
            this.$message('对不起！请稍后再试')
          })
        }
      },
      getFL2(val = '', search) {
        if (search) {
          window.axiox.post(this.getApi('root/auth/get_cate'),
            `id=${val}`
          ).then(res => {
            if (res.data.code === 0) {
              this.lv2 = res.data.list;
              if (this.add_show) {
                this.ruleForm.cly_2 = '';
                // this.ruleForm.product_type = res.data.gt_id
              } else {
                this.lv2_id = '';
                // 更新列表
                this.get_classify(val)
              }
            } else {
              this.$message(res.data.msg)
            }
          }).catch(() => {
            this.$message('对不起！请稍后再试')
          })
        } else {
          if (this.open_change) {
            window.axiox.post(this.getApi('root/auth/get_cate'),
              `id=${val}`
            ).then(res => {
              if (res.data.code === 0) {
                this.lv2 = res.data.list;
                if (this.add_show) {
                  this.ruleForm.cly_2 = '';
                  // this.ruleForm.product_type = res.data.gt_id
                } else {
                  this.lv2_id = '';
                  // 更新列表
                  this.get_classify(val)
                }
              } else {
                this.$message(res.data.msg)
              }
            }).catch(() => {
              this.$message('对不起！请稍后再试')
            })
          }
        }
      },
      getFL3(val = '') {
        if (!this.add_show) this.get_classify(val)
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
      // 删除分类
      del_classify(id) {
        this.$confirm('是否确认删除分类?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/gc_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_classify();
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
      // 点击预览时得到的数据
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true
      },
      // 图片上传前钩子函数
      beforeImgUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 1;
        let isType = false;
        switch (file.type) {
          case 'image/jpeg' :
            isType = true;
            break;
          case 'image/png' :
            isType = true;
            break;
          case 'image/gif' :
            isType = true
            break
        }

        if (!isLt2M) this.$message('请选择小于1M的图片');
        if (!isType) this.$message('不支持此图片类型');

        return isType && isLt2M
      },
      //图片上传成功回调函数
      on_suc(res, file) {
        this.is_img_up = true;
        this.imgs.push({'url': res.key, 'link': ''})
      },
      // 删除图片
      handleRemove(file, fileList) {
        if (file['response']) {
          this.del_pic.push(file['response']['key'])
        } else {
          this.del_pic.push(file['url'])
        }
      },
      // 提交
      submitForm(formName) {
        let pictures = [];
        let pic = [];
        if (this.fileList.length > 0) {
          this.fileList.forEach(item => {
            pictures.push({'url': item['url'], 'link': item['link']})
          })
        }
        pictures = pictures.concat(this.imgs);
        pictures.forEach(item => {
          if (this.del_pic.indexOf(item['url']) === -1) {
            pic.push({'url': item['url'], 'link': item['link']})
          }
        });
        if (pictures.length > 0) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.antiShake.antiShake((resolve, reject) => {
                window.axiox.post(this.getApi('root/auth/gc_save'),
                  this.dafa({
                    id: !this.ruleForm.id ? '' : this.ruleForm.id,
                    name: this.ruleForm.name,
                    parent_id: this.ruleForm.cly_2 || this.ruleForm.cly_1 || '',
                    type_id: !this.ruleForm.product_type ? '' : this.ruleForm.product_type,
                    sort: this.ruleForm.sort,
                    nav_show: this.ruleForm.nav_show,
                    seo_title: !this.ruleForm.seo_title ? '' : this.ruleForm.seo_title,
                    seo_keywords: this.ruleForm.seo_keywords,
                    seo_description: this.ruleForm.seo_description,
                    list_show: this.ruleForm.list_show,
                    phone_name: this.ruleForm.phone_name,
                    imgs: pic,
                    img: pic[0]
                  })
                ).then(res => {
                  resolve(res);
                  if (res.data.code === 0) {
                    this.add_show = false;
                    this.get_classify();
                    this.imgs = [];
                    this.del_pic = [];
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
        } else {
          this.$message('请上传图片')
        }
      }
    },
    watch: {
      add_show(val) {
        if (!val) {
          this.open_change = false
        }
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
  .seo-title {
    line-height: 40px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }

  .up_link .el-input {
    width: 150px;
  }
</style>
