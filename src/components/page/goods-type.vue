<template>
  <div class="type-list prop-box">
    <!--商品类型-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>商品类型
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_type('')">添加类型
        </el-button>
        <div class="u-right">
          <el-input class="search"
                    placeholder="搜索类型名称"
                    icon="el-icon-search"
                    v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="get_type"></el-button>
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
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_type(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_type(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_type('all')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加类型-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="属性">
          <table class="attr-table">
            <tr>
              <th class="ipt-th">属性名称</th>
              <th>属性值</th>
              <th class="btn-th">操作</th>
            </tr>
            <tr v-for="(item,index) in attr_tableData">
              <td class="sele-s">
                <el-input v-model="item.name" placeholder="请输入属性名"></el-input>
              </td>
              <td>
                <span v-for="ite in item.values">{{ite.name}} ,</span>
              </td>
              <td>
                <el-button type="primary" size="small" icon="edit" @click="edit_attr(index)">编辑
                </el-button>
                <el-button type="danger" size="small" icon="delete" @click="del_attr(item.id,item.key)">删除
                </el-button>
              </td>
            </tr>
          </table>
          <el-button @click="add_attr">新增属性</el-button>
        </el-form-item>
        <el-form-item label="规格">
          <el-table
            :data="spec_tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="name"
              label="规格名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="note"
              label="规格备注"
              width="180">
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
              min-width="250">
              <template slot-scope="scope">
                <el-button type="danger" size="small" icon="delete"
                           @click.native.prevent="del_spec(scope.$index, spec_tableData)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="add_spec">添加规格</el-button>
        </el-form-item>
        <!--<el-form-item label="品牌选择">-->
        <!--<el-checkbox-group v-model="brand_checkList">-->
        <!--<el-checkbox v-for="item in brands" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
        <el-form-item label="品牌选择" class="brand">
          <table>
            <tr v-for="(value, key) in brands">
              <td>
                <em>{{key}}</em>
                <el-checkbox-group v-model="brand_checkList">
                  <el-checkbox v-for="ite in value" :key="ite.id" :label="ite.id">{{ite.name}}</el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
          </table>
          <!--<template v-for="(value, key) in brands">-->
          <!--<em>{{key}}</em>-->
          <!--<el-checkbox-group v-model="brand_checkList">-->
          <!--<el-checkbox v-for="ite in value" :key="ite.id" :label="ite.id">{{ite.name}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</template>-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--编辑属性-->
    <el-dialog
      title="编辑属性值"
      :visible.sync="dialogVisible">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.name'"
          :rules="{required: true, message: '不能为空', trigger: 'blur'}">
          <el-input v-model="domain.name" placeholder="请填写属性值"></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增属性值</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="generate_attr_value">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑规格-->
    <el-dialog
      title="添加规格"
      :visible.sync="spec_dialogVisible">
      <div class="spec-box">
        <p><span>规格选择</span><span>规格预览</span></p>
        <div class="spec-box-left">
          <!--<ul>
            <li v-for="item in specs">
              <el-radio class="radio" @change="spec_choice" v-model="radio" :label="item.id">{{item.name}}</el-radio>
              <span v-if="item.note">({{item.note}})</span></li>
          </ul>-->
          <el-radio-group v-model="radio" @change="spec_choice">
            <el-radio v-for="item in specs" :key="item.id" :label="item.id">{{item.name}}<span
              v-if="item.note">({{item.note}})</span>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="spec-box-right">
          <span v-for="item in spec_value">{{item.name}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="spec_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="generate_add_spec">确 定</el-button>
      </span>
    </el-dialog>
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
          content: `商品类型是用来规定某一类商品共有规格和属性的集合，其中规格会影响商品价格，同一个商品不同的规格价格会不同。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        search: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '商品类型',
          now: '类型编辑'
        }, // 面包屑模块参数
        ruleForm: {
          id: '', // 分类ID
          name: '', // 分类名
          attr: [{
            value: ''
          }],
        }, // 编辑页面表单数据
        attr_tableData: [], // 属性表格
        attr_index: '', // 所编辑属性的索引
        dynamicValidateForm: {
          domains: [{
            name: ''
          }]
        }, // 添加属性
        specs: [], // 所有规格
        spec_value: [], // 点选规格下的所有值
        spec_tableData: [], // 规格表格
        radio: null, // 点选规格id
        brands: [], // 品牌列表
        brand_checkList: [], // 所选品牌
        dialogVisible: false, // 属性弹出
        spec_dialogVisible: false, // 规格弹出
        rules: {
          name: [
            {required: true, message: '请输入类型名称', trigger: 'blur'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_type()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_type()
      },
      // 获取商品列表
      get_type() {
        window.axiox.post(this.getApi('root/auth/gt_list'),
          this.dafa({
            search_str: this.search,
            index: this.index
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.gt_list;
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
      edit_type(id) {
        this.add_show = true;
        this.brand_checkList = [];
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/gt_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              if (res.data.info) {
                this.attr_tableData = res.data.info.attr;
                this.ruleForm.name = res.data.info.name;
                this.spec_tableData = res.data.info.spec;
                res.data.info.brand.forEach(item => {
                  this.brand_checkList.push(item.id)
                })
              } else {
                this.ruleForm = {
                  id: '',
                  name: '', // 分类名
                };
                this.attr_tableData = [];
                this.spec_tableData = [];
                this.brand_checkList = [];
              }
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
          })
        });
        this.getBrandList();
      },
      // 获取品牌列表
      getBrandList() {
        axiox.post(this.getApi('root/auth/brands_list'),
          `get_type=2`
        ).then(res => {
          if (res.data.code === 0) {
            this.brands = res.data.brands
          } else {
            this.$message(res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 增加属性
      add_attr() {
        this.attr_tableData.push({
          name: '',
          values: [],
          key: Date.now()
        })
      },
      // 删除属性
      del_attr(id, key) {
        let arr = [];
        if (id) {
          axiox.post(this.getApi('root/auth/gt_attr_del'),
            `id=${id}`
          ).then(res => {
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              this.attr_tableData.forEach(item => {
                if (item.id != id) {
                  arr.push(item)
                }
              });
              this.attr_tableData = arr;
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        } else {
          this.attr_tableData.forEach(item => {
            if (item.key != key) {
              arr.push(item)
            }
          });
          this.attr_tableData = arr;
        }
      },
      // 编辑属性
      edit_attr(index) {
        this.dialogVisible = true;
        this.attr_index = index;
        this.dynamicValidateForm.domains = this.attr_tableData[index].values
      },
      // 增加属性值
      addDomain() {
        this.dynamicValidateForm.domains.push({
          sort: '',
          key: Date.now()
        })
      },
      // 删除属性值
      removeDomain(item) {
        if (item.id) {
          axiox.post(this.getApi('root/auth/gt_value_del'),
            `id=${item.id}`
          ).then(res => {
            this.$message(res.data.msg);
            if (res.data.code === 0) {
              let index = this.dynamicValidateForm.domains.indexOf(item);
              if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1)
              }
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        } else {
          let index = this.dynamicValidateForm.domains.indexOf(item);
          if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1)
          }
        }
      },
      // 生成属性值
      generate_attr_value() {
        this.dialogVisible = false;
        this.attr_tableData[this.attr_index].values = this.dynamicValidateForm.domains;
      },
      // 添加规格
      add_spec() {
        this.spec_dialogVisible = true;
        axiox.post(this.getApi('root/auth/specs_list'),
          `get_type=1`
        ).then(res => {
          if (res.data.code === 0) {
            this.specs = res.data.specs
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 点选规格
      spec_choice(val) {
        this.specs.forEach(item => {
          if (item.id === val) {
            this.spec_value = item.value
          }
        })
      },
      // 生成规格
      generate_add_spec() {
        // 检查规格是否已存在
        let count = 0;
        this.spec_tableData.forEach(item => {
          if (item.id == this.radio) {
            this.$message('此规格已存在');
            count++
          }
        });
        // 不存在执行添加操作
        if (count == 0) {
          this.spec_dialogVisible = false;
          this.specs.forEach(ite => {
            if (ite.id == this.radio) {
              this.spec_tableData.push(ite)
            }
          })
        }
      },
      // 删除规格
      del_spec(index, rows) {
        rows.splice(index, 1)
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
      // 删除类型
      del_type(id) {
        this.$confirm('是否确认删除此类型?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/gt_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_type();
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
        let spec_arr = [];
        this.spec_tableData.forEach(item => {
          spec_arr.push(item.id)
        });

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/gt_save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  attr: this.attr_tableData,
                  spec_id: spec_arr,
                  brand: this.brand_checkList
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.brand_checkList = [];
                  this.get_type()
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
  .attr-table {
    width: 100%;
  }

  .attr-table {
    border: 1px solid #dfe6ec;
  }

  .attr-table th {
    border-bottom: 1px solid #dfe6ec;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #eef1f6;
    padding: 0 18px;
  }

  .attr-table td {
    padding: 10px 18px;
  }

  .attr-table .el-button {
    width: 100px;
    height: 36px;
    margin: 0;
  }

  .prop .el-table .el-button {
    width: 100px;
    height: 32px;
    margin: 0;
  }

  .el-dialog .el-input {
    width: 80%;
  }

  .btn-th {
    width: 245px;
  }

  .ipt-th {
    width: 160px;
  }

  .spec-box {
    overflow: hidden;
    border: 1px solid #eee;
    padding: 10px;
  }

  .spec-box > p {
    border-bottom: 1px solid #f3f3f3;
    padding-bottom: 10px;
  }

  .spec-box > p span {
    display: inline-block;
    width: 160px;
    line-height: 20px;
  }

  .spec-box-left {
    width: 160px;
    border-right: 1px solid #eee;
    float: left;
  }

  .spec-box-left .el-radio {
    padding-left: 15px;
    line-height: 32px;
    margin: 0;
  }

  .spec-box-right {
    margin-left: 160px;
    padding: 15px;
  }

  .spec-box-right span {
    padding: 5px 10px;
    background-color: #ff4949;
    color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .brand {
    height: 260px;
    overflow-y: scroll;
  }
</style>
