<template>
  <div class="goods-consult-list prop-box">
    <!--商品咨询-->
    <div class="m-goods-consult-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>商品咨询列表
        <!--<el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_member('','')">添加会员
        </el-button>-->
        <div class="u-right">
          <el-select class="sele-s" v-model="status" placeholder="状态" :clearable="true">
            <el-option label="未回复" value="0"></el-option>
            <el-option label="已回复" value="1"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="咨询人" value="0"></el-option>
            <el-option label="商品名称" value="1"></el-option>
            <!--<el-option label="订单编号" value="2"></el-option>-->
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_goods_consult"></el-button>
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
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="0"><i
                  class="iconfont icon-wancheng1 c-danger"></i>回复
                </el-dropdown-item>
                <el-dropdown-item command="1"><i class="iconfont icon-shanchu c-danger"></i>&nbsp;&nbsp;删除
                </el-dropdown-item>
                <!--<el-dropdown-item command="0"><i class="iconfont icon-chongzhi1 c-danger"></i>&nbsp;充值
                </el-dropdown-item>
                <el-dropdown-item command="2"><i class="iconfont icon-tixian c-danger"></i>&nbsp;扣款</el-dropdown-item>
                <el-dropdown-item v-if="tableData[scope.$index].status != 2 && tableData[scope.$index].status != 3"
                                  command="3"><i class="iconfont icon-zichan c-danger"></i>&nbsp;冻结
                </el-dropdown-item>
                <el-dropdown-item command="4"><i class="iconfont icon-wancheng1 c-danger"></i>编辑</el-dropdown-item>
                <el-dropdown-item v-if="tableData[scope.$index].status != 1 && tableData[scope.$index].status != 3"
                                  command="5"><i class="iconfont icon-shanchu4 c-danger"></i>&nbsp;禁用
                </el-dropdown-item>
                <el-dropdown-item command="6"><i class="iconfont icon-shanchu c-danger"></i>&nbsp;删除</el-dropdown-item>
                <el-dropdown-item v-if="tableData[scope.$index].status == 2 || tableData[scope.$index].status == 3"
                                  command="7"><i class="iconfont icon-zhengque c-danger"></i>&nbsp;解冻
                </el-dropdown-item>
                <el-dropdown-item v-if="tableData[scope.$index].status == 1 || tableData[scope.$index].status == 3"
                                  command="8"><i class="iconfont icon-zhengque c-danger"></i>&nbsp;解禁
                </el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="咨询人"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="question"
          label="咨询内容"
          min-width="240">
        </el-table-column>
        <el-table-column
          prop="good_name"
          label="商品名称"
          min-width="240">
        </el-table-column>
        <el-table-column
          prop="good_link"
          label="商品链接"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="ask_time"
          label="咨询时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="status"
          label="回复状态"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">已回复</span>
            <span class="c-danger" v-else>未回复</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reply_time"
          label="回复时间"
          min-width="160">
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_goods_consult('all')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--操作-->
    <el-dialog
      title="咨询回复"
      :visible.sync="dialogVisible">
      <div class="cao-zuo">
        <h3>咨询信息详情：</h3>
        <ul class="order-info-ul">
          <li><span>咨询人：</span>{{info.username}}</li>
          <li><span>咨询内容：</span>{{info.question}}</li>
          <li><span>商品名称：</span>{{info.good_name}}</li>
          <li><span>商品链接：</span>{{info.good_link}}</li>
          <li><span>咨询时间：</span>{{info.ask_time}}</li>
          <li>
            <span>管理员回复内容：</span>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="info.content">
            </el-input>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_do_ok">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  //  import crumb from '../common/crumb.vue'
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `用户可在商品信息页对商品进行咨询。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        type: '', // 事件类型 0=订单支付 1=用户充值 2=管理员充值 3=提现 4=转账
        status: '', // 状态  0=未回复 1=已回复
        search_type: '', // 搜索类型 0=咨询人 1=商品名称
        search_str: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        dialogVisible: false, // 是否弹出
        info: {}, // 咨询回复信息
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_goods_consult()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page() {
        this.get_goods_consult()
      },
      // 获取商品咨询列表
      get_goods_consult() {
        window.axiox.post(this.getApi('root/auth/ask_list'),
          this.dafa({
            index: this.index,
            status: this.status,
            search_type: this.search_type,
            search_str: this.search_str
          })
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
      // 操作
      handle(val, id) {
        this.id = id;
        switch (val) {
          case '0':
            this.edit_goods_consult();
            break;
          case '1':
            this.del_goods_consult(id);
            break;
        }
      },
      // 操作结束 - 回复
      to_do_ok() {
        if (this.info.content) {
          this.antiShake.antiShake((resolve, reject) => {
            axiox.post(this.getApi('root/auth/ask_save'),
              this.dafa({
                id: this.id,
                content: this.info.content
              })
            ).then(res => {
              resolve(res);
              if (res.data.code === 0) {
                this.get_goods_consult();
                this.dialogVisible = false;
              }
            }).catch(err => {
              reject(err);
            })
          })
        } else {
          this.$message('请填写回复内容');
        }
      },
      // 咨询回复
      edit_goods_consult() {
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/ask_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.dialogVisible = true;
              this.info = res.data.info;
              this.get_goods_consult();
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
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
      // 删除评价
      del_goods_consult(id) {
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
            window.axiox.post(this.getApi('root/auth/ask_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_goods_consult();
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
      }
    },
    computed: {
      index() {
        return this.$store.state.index
      }
    },
    components: {
      hint, page
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
