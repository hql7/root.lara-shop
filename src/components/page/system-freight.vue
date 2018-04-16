<template>
  <div class="type-list prop-box">
    <!--运费模版-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>运费模版列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_system('','')">新增运费模版
        </el-button>
      </h2>
      <div class="yf" v-for="item in tableData">
        <h3><strong>{{item.name}}</strong> <i class="iconfont icon-shiyongzhong" v-if="item.is_default==1"></i><span
          class="u-right">
           <el-button v-if="item.is_default==0" type="warning" size="small" icon="setting" @click="set_system(item.id)">设为默认
            </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit_system(item.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="del_system(item.id)">删除
            </el-button></span>
        </h3>
        <h4><b>运送到</b><strong class="u-right"><em>首重(g)</em><em>运费(元)</em><em>续重(g)</em><em>运费(元)</em></strong>
        </h4>
        <p><b>全国</b><strong
          class="u-right"><em>{{item.first_weight}}</em><em>{{item.first_price}}</em><em>{{item.second_weight}}</em><em>{{item.second_price}}</em></strong>
        </p>
        <p v-for="ite in item.zoning"><b>{{ite.names}}</b> <strong
          class="u-right"><em>{{ite.f_weight}}</em><em>{{ite.f_price}}</em><em>{{ite.s_weight}}</em><em>{{ite.s_price}}</em></strong>
        </p>
      </div>
    </div>
    <!--添加运费模版-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="默认运费">
          <el-col :span="5">
            <el-form-item prop="first_weight">
              <el-input v-model.number="ruleForm.first_weight" placeholder="填写首重（g）"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="5">
            <el-form-item prop="first_price">
              <el-input v-model.number="ruleForm.first_price" placeholder="填写首重运费（元）"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="5">
            <el-form-item prop="second_weight">
              <el-input v-model.number="ruleForm.second_weight" placeholder="填写续重（g）"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="5">
            <el-form-item prop="second_price">
              <el-input v-model.number="ruleForm.second_price" placeholder="填写续重运费（元）"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-button @click="add_city_yf">设定指定城市运费</el-button>
        <div class="choice-SS">
          <h4><strong>运送到</strong><strong
            class="u-right"><em>首重(g)</em><em>运费(元)</em><em>续重(g)</em><em>运费(元)</em></strong></h4>
          <p v-for="(item,index) in ruleForm.zoning"><b>{{item.names}}</b><strong
            class="u-right">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="edit_city_yf(item.id,index)">
            </el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="del_city_yf(index)">
            </el-button>
            <em>
              <el-input v-model="item.f_weight"></el-input>
            </em><em>
            <el-input v-model="item.f_price"></el-input>
          </em><em>
            <el-input v-model="item.s_weight"></el-input>
          </em><em>
            <el-input v-model="item.s_price"></el-input>
          </em></strong>
          </p>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--弹出-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%">
      <div class="box">
        <div class="city_box" v-for="(item,index) in city" :key="item.id">
          <div class="city_left">
            <input type="checkbox" v-model="item.selected" @change="province_chick($event,index)"
                   :disabled="item.disabled"><label>{{item.name}}</label>
          </div>
          <div class="city_right">
              <span v-for="ite in item.childs" :key="ite.c_id">
                <input type="checkbox" v-model="ite.c_selected" @change="city_chick(index)"
                       :disabled="ite.c_disabled"><label>{{ite.c_name}}</label>
              </span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import crumb from '../common/crumb.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `全站所有涉及的地区均来源于此处，强烈建议对此处谨慎操作。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '运费模版列表',
          now: '编辑运费模版'
        }, // 面包屑模块参数
        ruleForm: {
          id: '',
          name: '',
          first_weight: 1000,
          first_price: null,
          second_weight: 1000,
          second_price: null,
          zoning: []
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '不可为空', trigger: 'blur'}
          ],
          first_weight: [
            {required: true, type: 'number', message: '不可为空', trigger: 'blur'}
          ],
          second_weight: [
            {required: true, type: 'number', message: '不可为空', trigger: 'blur'}
          ],
          second_price: [
            {required: true, type: 'number', message: '不可为空', trigger: 'blur'}
          ],
          first_price: [
            {required: true, type: 'number', message: '不可为空', trigger: 'blur'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        dialogVisible: false,
        city: [], // 可选城市
        city_index: '', // 所编辑模版的第几条指定城市
        chick: {}, //
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
      // 获取
      get_system() {
        axiox.post(this.getApi('root/auth/fare_list')
        ).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.list;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑
      edit_system(id) {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/fare_edit'),
            `id=${id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
              } else {
                this.ruleForm = {
                  id: '',
                  name: '',
                  first_weight: 1000,
                  first_price: null,
                  second_weight: 1000,
                  second_price: null,
                  zoning: []
                }
              }
            }
          }).catch((err) => {
            reject(err);
          })
        })
      },
      // 设定指定城市运费
      add_city_yf() {
        this.ruleForm.zoning.push({
          f_weight: '1000',
          s_weight: '1000'
        })
      },
      // 删除指定城市运费
      del_city_yf(index) {
        this.ruleForm.zoning.splice(index, 1)
      },
      // 编辑指定城市运费
      edit_city_yf(id, index) {
        this.city_index = index;
        // 处理数据
        let arr = JSON.parse(JSON.stringify(this.ruleForm.zoning));
        let checked_arr = arr.splice(index, 1);
        let selected_city = checked_arr[0].area || '';
        let disabled_city = '';
        arr.forEach(item => {
          disabled_city += item.area;
        });

        axiox.post(this.getApi('root/auth/fare_show_area'),
          this.dafa({
            selected_city: selected_city,
            disabled_city: disabled_city
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.dialogVisible = true;
            this.city = res.data.list;
          }
        }).catch(err => {
          this.$message('对不起!请稍后再试')
        })
      },
      // 设为默认
      set_system(id) {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/fare_use'),
            `id=${id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.get_system();
            }
          }).catch(err => {
            reject(err);
          })
        })
      },
      // 选中省关联市
      province_chick(val, index) {
        if (val.target.checked) {
          this.city[index].childs.forEach(item => {
            if (!item.c_disabled) item.c_selected = true;
          })
        } else {
          this.city[index].childs.forEach(item => {
            if (!item.c_disabled) item.c_selected = false;
          })
        }
      },
      // 选中市关联省
      city_chick(index) {
        let num = 0;
        this.city[index].childs.forEach(item => {
          if (!item.c_selected) {
            num++
          }
        });
        if (num == 0) {
          this.city[index].selected = true
        } else {
          this.city[index].selected = false
        }
      },
      // 编辑指定城市选择完毕
      to_sure() {
        this.ruleForm.zoning[this.city_index].names = '';
        this.ruleForm.zoning[this.city_index].area = '';
        for (let i in this.city) {
          if (this.city[i].selected) {
            this.ruleForm.zoning[this.city_index].names += `${this.city[i].name},`;
            this.ruleForm.zoning[this.city_index].area += `${this.city[i].id},`;
          }
          for (let j in this.city[i].childs) {
            if (this.city[i].childs[j].c_selected) {
              this.ruleForm.zoning[this.city_index].area += `${this.city[i].childs[j].c_id},`;
              if (!this.city[i].selected) this.ruleForm.zoning[this.city_index].names += `${this.city[i].childs[j].c_name},`;
            }
          }
        }
        this.dialogVisible = false
        console.log(this.ruleForm.zoning[this.city_index]);
      },
      // 删除
      del_system(id) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.antiShake.antiShake((resolve, reject) => {
            axiox.post(this.getApi('root/auth/fare_del'),
              `id=${id}`
            ).then(res => {
              resolve(res);
              if (res.data.code === 0) {
                this.get_system();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/fare_save'),
                this.dafa({
                  id: this.ruleForm.id,
                  name: this.ruleForm.name,
                  first_weight: this.ruleForm.first_weight,
                  first_price: this.ruleForm.first_price,
                  second_weight: this.ruleForm.second_weight,
                  second_price: this.ruleForm.second_price,
                  zoning: this.ruleForm.zoning
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
      hint, crumb
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .yf, .choice-SS {
    border: 1px solid #dfe6ec;
    margin-bottom: 35px;
  }

  .yf h3 {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background: #FAFAFA;
    position: relative;
  }

  .yf h3 strong {
    color: #ff4d51;
    font-size: 14px;
  }

  .yf h3 i {
    color: #ff4d51;
    font-size: 66px;
    position: absolute;
    top: 20px;
    left: 30%;
  }

  h4 {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background: #eef1f6;
  }

  .yf p {
    line-height: 20px;
    padding: 10px 20px;
    border-bottom: 1px solid #f7f7f7;
  }

  b {
    display: inline-block;
    width: 40%;
  }

  em {
    display: inline-block;
    width: 100px;
    text-align: center;
    margin: 0 15px;
  }

  .line {
    text-align: center;
  }

  .choice-SS {
    margin-top: 10px;
  }

  .choice-SS p {
    line-height: 20px;
    padding: 0 20px;
    border-bottom: 1px solid #f7f7f7;
    overflow: hidden;
  }

  .choice-SS b {
    padding: 10px 0;
  }

  .choice-SS em {
    height: 40px;
  }

  .choice-SS .el-button {
    width: 30px;
    margin: 0;
  }

  .box {
    border: 1px solid #f3f3f3;
  }

  .city_box {
    overflow: hidden;
    border-bottom: 1px solid #f3f3f3;
  }

  .city_left {
    width: 100px;
    line-height: 40px;
    padding-left: 20px;
    float: left;
    border-right: 1px solid #f3f3f3;
    box-sizing: border-box;
  }

  .box input {
    margin-right: 5px;
    vertical-align: -1px;
  }

  .city_right {
    margin-left: 110px;
    padding: 10px 20px;
  }

  .city_right span {
    line-height: 20px;
    margin: 0 15px 15px 0;
  }
</style>
