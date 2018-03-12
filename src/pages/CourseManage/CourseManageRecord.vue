<template>
    <div>
        <I-table
        title="排课记录"
        :isUpdate="true"
        :isBack="false"
        @update="doSearch">
            <template slot="head">
                <el-button size="smail" type="primary" class="confirm" @click="btnClickForAdd">新 增 排 课</el-button>
                <el-button size="smail" type="primary" class="confirm btnBatch" @click="dialogFormDelVisible=true" :disabled="waitForDelIdList.length==0">批 量 删 除</el-button>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    style="width: 100%"
                    row-class-name="table-row"
                    :height="props.maxHeight"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange">
                      <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="课程名称"></el-table-column>
                        <el-table-column
                        sortable
                        prop="grade"
                        label="排课年级"></el-table-column>
                        <el-table-column
                        sortable
                        prop="create_time"
                        label="排课时间"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button @click="btnClickForViewDetail(scope.row)" type="text" size="small">查看</el-button>
                            <el-button @click="btnClickForCopyAndUsed(scope.row)" type="text" size="small">套用</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 套用 -->
                <I-table-editor v-model="dialogFormVisible"
                :title="copyForm.title">
                    <template slot="content">
                        <el-form>
                            <el-form-item label="课表名称:" :label-width="formLabelWidth">
                                <el-input v-model="copyForm.targetName" auto-complete="off" style="width:93%;" placeholder="请输入课表名称"></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="btnClickForCopyAndUsedYes">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 删除 -->
                <I-table-editor v-model="dialogFormDelVisible" 
                title="删除">
                    <template slot="content">
                        <span>您是否确定要删除选择的排课记录？</span>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="dialogFormDelVisible = false">取 消</el-button>
                        <el-button type="success"
                        @click="btnClickForDelYes()">确 定</el-button>
                    </template>
                </I-table-editor>
            </template>
            <template slot="foot">
                <I-table-page
                :total="total"
                @change="pageChange"></I-table-page>
            </template>
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "100px",
      addImg: "../static/imgs/addBtn.png",
      total:1,
      pageIndex:1,
      pageSize:10,
      sort:"id",
      order:"desc",
      waitForDelIdList:[],    //待批量删除ID列表
      dialogFormDelVisible:false,
      copyForm: {
        sourceId: "",
        sourceName: "",
        targetName: "",
        title:"套用"
      },
      tableData: [],
    };
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor,
  },
  mounted() {
    this.doSearch();
  },
  methods: {
    doSearch() {
      this.copyForm.title = "套用";
      this.copyForm.sourceId = "";
      this.copyForm.sourceName = "";
      this.copyForm.targetName = "";
      this.$http.post("/Course/courseList ", {
          token:this.$tools.getToken(),
          page_number:this.pageIndex,
          page_size:this.pageSize,
          sort:this.sort,
          order:this.order
        })
        .then(res => {
            this.total = parseInt(res.data.page.total);
            this.pageSize = parseInt(res.data.page.page_size);
            res.data.row.forEach(element=>{
                element.create_time = this.$tools.formatDate(element.create_time);
            });
            this.tableData = res.data.row;
            if(this.tableData.length<1 && this.pageIndex>0){this.pageIndex--;this.doSearch();}
        });
    },
    //选择项目
    handleSelectionChange(val){
      this.waitForDelIdList = [];
      val.forEach(element => {
          this.waitForDelIdList.push(element.id);
      });
      console.log(this.waitForDelIdList);
    },
    sortChange({ column, prop, order }) {
      console.log("sortChange", column, prop, order);
    },
    pageChange(current) {
      this.pageIndex = current;
      this.doSearch();
    },
    //新增排课
    btnClickForAdd(){
      this.$router.push({ path: "/course-manage-record-add" });      
    },
    //批量删除 - 确定
    btnClickForDelYes(){
      console.log("批量删除 - 确定");
      console.log(this.waitForDelIdList);
      this.$http.post("/Course/courseDelete", {
          token:this.$tools.getToken(),
          id:this.waitForDelIdList.join(",")
        })
        .then(res => {
          this.dialogFormDelVisible = false;
          this.doSearch();
        });
    },
    //查看事件
    btnClickForViewDetail(obj) {
      //跳转到详情界面
      this.$router.push({ name: 'CourseManageRecordDetail', params: { id:  obj.id}});
    },
    //套用事件
    btnClickForCopyAndUsed(obj) {
      this.dialogFormVisible = true;
      this.copyForm.sourceId = obj.id;
      this.copyForm.sourceName = obj.name;
      this.copyForm.title ="套用排课[ " + obj.name + " ]";
      console.log("->请求套用课程[" + obj.id + "," + obj.name + "]");
    },
    //套用-确定
    btnClickForCopyAndUsedYes() {
      //调用AJAX请求，套用当前课程，传入ID进行套用
      if(this.copyForm.targetName.length<2){this.$message.error('请输入课表名称，至少2个字符！');return;}
      console.log("->套用课程提交:" + JSON.stringify(this.copyForm));
      this.$http.post("/Course/copy", {
          token:this.$tools.getToken(),
          id:this.copyForm.sourceId,
          name:this.copyForm.targetName
      }).then(res => {
          this.dialogFormVisible = false;
          this.doSearch();
      });
    }
  }
};
</script>
<style scoped lang="less">
.el-button--text {
  padding: 5px;
  background: #409eff;
  color: #fff;
}
.el-button--text:focus, .el-button--text:hover {
	background: #409EFF;
	color:#fff;
}
.btnBatch{
  background-color: red;
  border-color: red;
}
</style>
