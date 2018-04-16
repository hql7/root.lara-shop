<template>
  <div class="type-list prop-box">
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>数据库备份列表
        <div class="u-right">
          <el-button :plain="true"  type="danger" v-if="admin_super == 1"
                     @click="dialogVisible = true">导入
          </el-button>
          <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
          <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"  v-if="admin_super == 1"
                     @click="XZ">下载
          </el-button>
          <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                     @click="SC">删除
          </el-button>
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
            <el-dropdown @command="handle($event,tableData[scope.$index].file_name)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box" v-if="admin_super == 1">
                <el-dropdown-item command="0"><i class="iconfont icon-huifu-copy c-danger"></i>&nbsp;还原
                </el-dropdown-item>
               <!-- <el-dropdown-item command="1"><i class="iconfont icon-import c-danger"></i>&nbsp;导入
                </el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="file_name"
          label="文件名"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="file_size"
          label="文件大小"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="备份时间"
          min-width="200">
        </el-table-column>
      </el-table>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--// 上传文件-->
    <el-dialog
      title="选择文件"
      :visible.sync="dialogVisible"
      size="tiny">
      <el-upload
        class="upload-demo"
        ref="upload"
        :on-success="on_suc"
        :on-error="on_err"
        :action="getApi('root/auth/sqls_import')"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import page from '../common/page.vue'

  export default {
    data () {
      return {
        hint: {
          title: '操作提示',
          content: `数据备份功能根据你的选择备份全部数据或指定数据，导出的数据文件可用“数据恢复”功能或 phpMyAdmin 导入建议定期备份数据库。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        dialogVisible: false, // 弹出
        totalPage: 1,
        name: '',
        del_id: [], // 储存数组
        loading: true,
        admin_super: null
      }
    },
    created () {
      this.get_system()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page () {
        this.get_system()
      },
      // 处理
      handle(val, name){
        this.name = name;
        switch (val) {
          case '0':
            this.HY();
            break;
          case '1':
            this.dialogVisible = true;
            break;
        }
      },
      // 获取
      get_system () {
        axiox.post(this.getApi('root/auth/sqls_list')
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount;
            this.admin_super = res.data.admin_super;
            console.log(this.admin_super);
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 取消选择
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      // 收集选中列
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 删除|下载
      SC () {
        this.multipleSelection.forEach(item => {
          this.del_id.push(item.file_name)
        });
        axiox.post(this.getApi('root/auth/sqls_del'),
          this.dafa({
            sql_names: this.del_id
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.get_system();
            this.$message(res.data.msg);
            this.del_id = []
          } else {
            this.$message(res.data.msg);
            this.toggleSelection();
            this.del_id = []
          }
        }).catch((err) => {
          console.log(err);
          this.$message('对不起！请稍后再试');
          this.toggleSelection();
          this.del_id = []
        })
      },
      XZ () {
        this.multipleSelection.forEach(item => {
          this.del_id.push(item.file_name)
        });
        axiox.post(this.getApi('root/auth/sqls_download'),
          this.dafa({
            sql_names: this.del_id
          })
        ).then(res => {
          if (res.data.code === 0) {
//            this.$message(res.data.msg);
            location.href = res.data.msg; // 下载文件
            this.toggleSelection();
            this.del_id = []
          } else {
            this.$message(res.data.msg);
            this.toggleSelection();
            this.del_id = []
          }
        }).catch((err) => {
          console.log(err);
          this.$message('对不起！请稍后再试');
          this.toggleSelection();
          this.del_id = []
        })
      },
      // 还原|导入
      HY(){
        this.$confirm('是否确认还原?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axiox.post(this.getApi('root/auth/sqls_recover'),
            `sql_name=${this.name}`
          ).then(res => {
            if (res.data.code == 0) {
              this.$message(res.data.msg);
            } else {
              this.$message(res.data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      upload () {
        this.$refs.upload.submit();
      },
      on_suc(res, file, list){
        if (res.code == 0) {
          this.$message(res.msg);
          this.get_system()
        } else {
          this.$message(res.msg)
        }
        this.dialogVisible = false;
      },
      on_err(err, file, list){
        this.dialogVisible = false;
        this.$message(err);
        console.log(err);
      }
    },
    computed: {
      index () {
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
