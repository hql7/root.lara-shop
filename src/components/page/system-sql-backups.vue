<template>
  <div class="type-list prop-box">
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>数据表列表
        <div class="u-right">
          <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            :plain="true"
            :disabled="multipleSelection.length==0"
            type="danger"
            @click="BF">备份
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
        <!-- <el-table-column
           label="操作"
           min-width="100">
           <template slot-scope="scope">
             <el-dropdown @command="handle($event,tableData[scope.$index].id)">
               <el-button type="primary" size="small">
                 处理<i class="el-icon-setting el-icon&#45;&#45;right"></i>
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
         </el-table-column>-->
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="表名"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="engine"
          label="存储引擎"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="rows"
          label="记录条数"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="data_length"
          label="占用空间"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="collation"
          label="编码"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="最后更新时间"
          min-width="180">
        </el-table-column>
        <!--   <el-table-column
             label="操作"
             min-width="200">
             <template slot-scope="scope">
               <el-button type="primary" size="small" icon="edit" @click="edit_system(scope.$index, tableData)">编辑
               </el-button>
               <el-button type="danger" size="small" icon="delete" @click="del_article(scope.$index, tableData)">删除
               </el-button>
             </template>
           </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `数据备份功能根据你的选择备份全部数据或指定数据，导出的数据文件可用“数据恢复”功能或 phpMyAdmin 导入建议定期备份数据库。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        del_id: [], // 储存数组
        fullscreenLoading: false,
        loading: true
      }
    },
    created() {
      this.get_system()
    },
    methods: {
      // 处理
      /*handle(val, id){
       this.id = id;
       switch (val) {
       case '0':
       this.edit_system();
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
       },*/
      // 获取
      get_system() {
        axiox.post(this.getApi('root/auth/tables_list')
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
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
      // 备份
      BF() {
        this.multipleSelection.forEach(item => {
          this.del_id.push(item.name)
        });
        this.fullscreenLoading = true;//加载
        axiox.post(this.getApi('root/auth/tables_backup'),
          this.dafa({
            tables_name: this.del_id
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.fullscreenLoading = false;
            this.$message(res.data.msg);
            this.del_id = []
          } else {
            this.fullscreenLoading = false;
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
      }
    },
    components: {
      hint
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
