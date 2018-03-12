<template>
    <div>
        <I-table
        title="课件管理"
        @update="update">
            <template slot="head">
                    <el-input v-model="search" size="smail" placeholder="课件名称" style="width:150px;"></el-input>
                    <el-button size="smail" type="primary" class="confirm" @click="searchFn">查询</el-button>
                    <el-button size="smail" type="primary" @click="uploadShow">上传课件</el-button>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    style="width: 100%"
                    row-class-name="table-row"
                    :height="props.maxHeight"
                    :data="tableData"
                    @sort-change="sortChange">
                        <el-table-column
                        prop="courseware_name"
                        label="课件名称"></el-table-column>
                        <el-table-column
                        prop="cycle"
                        label="所属周数"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button @click="checkFn(scope.row)" type="text" size="small">查看</el-button>
                            <el-button @click="loadFn(scope.row)" type="text" size="small">下载</el-button>
                            <el-button @click="deleteFn(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 上传 -->
                <I-table-editor v-model="dialogFormVisibleupload" 
                title="上传课件">
                    <template slot="content">
                        <div class="item">
                            <label class="titles">课件名称</label>  
                            <el-input v-model="form.courseware_name" placeholder="请输入课件名称"></el-input>
                        </div>
                        <div class="item">
                            <label class="titles">所属周期</label>
                            <el-input v-model="form.cycle" placeholder="请输入所属周期"></el-input>
                        </div>
                        <div class="item">
                            <el-upload
                                class="upload-demo"
                                :accept="accept"
                                :action="uploadAction"
                                :on-preview="handlePreview"
                                :before-upload="handleCheck"
                                :limit="1"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                                :file-list="fileList"
                                :data="form">
                                <el-button size="small" type="primary">选择文件</el-button>
                                <span>(只能是PPT，pdf，word，excel)</span>
                            </el-upload>
                        </div>
                    </template>
                    <template slot="foot">
                        
                    </template>
                </I-table-editor>
                <!-- 删除 -->
                <I-table-editor v-model="deleteDialogVisible" 
                title="删除">
                    <template slot="content">
                        <div class="outportaddr-group">是否确定删除{{deleteTitle}}？</div>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="deleteDialogVisible = false">取 消</el-button>
                        <el-button type="success"
                        @click="deleteConfirm">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 查看 -->
                <I-table-editor v-model="checkDialogVisible" 
                title="查看">
                    <template slot="content">
                        <div class="item">
                            <label>课件名称：</label>
                            <span>{{showName}}</span>
                        </div>
                        <div class="item">
                            <label>所属周期：</label>
                            <span>{{showCycle}}</span>
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="checkDialogVisible = false">取 消</el-button>
                    </template>
                </I-table-editor>
            </template>
            <!-- <template slot="foot">
                <I-table-page
                :total="total"
                @change="pageChange"></I-table-page>
            </template> -->
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from "@/components/Table/";
import config from "@/config";
export default {
  data() {
    return {
      loadUrl: config.BASEURL,
      token: localStorage.jxtoken,
      //上传文件
      uploadAction: config.BASEURL + "/Teaching/uploadCourseware",
      upload_file: "upload_file",
      accept:
        "application/vnd.ms-excel,application/vnd.ms-powerpoint,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      //删除
      deleteTitle: "",
      deleteId: "",
      dialogFormVisible: false,
      checkDialogVisible: false,
      deleteDialogVisible: false,
      dialogFormVisibleupload: false,
      formLabelWidth: "100px",
      addImg: "../static/imgs/addBtn.png",
      form: {
        courseware_name: "",
        cycle: "",
        token: localStorage.jxtoken,
        school_id: localStorage.jxschool_id
      },
      fileList: [],
      tableData: [],
      current: 1,
      courseware_name: "",
      search: "",
      total: 0,
      showName: "",
      showCycle: ""
    };
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor
  },
  mounted() {
    this.req();
  },
  methods: {
    update() {
      this.courseware_name = "";
      this.req();
    },
    req() {
      this.$http
        .post("/Teaching/coursewareLists", {
          token: localStorage.jxtoken,
          courseware_name: this.search
        })
        .then(res => {
          console.log(res);
          if (this.page_number > 1) {
            if (!res.data) {
              this.page_number = this.page_number - 1;
              this.req();
            }
          }
          if (res.data) {
            this.tableData = res.data;
          }
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //查询
    searchFn() {
      this.req();
    },
    sortChange({ column, prop, order }) {
      console.log("sortChange", column, prop, order);
    },
    pageChange(current) {
      this.current = current;
    },
    //显示上传
    uploadShow() {
      this.dialogFormVisibleupload = true;
      this.form = {
        courseware_name: "",
        cycle: "",
        token: localStorage.jxtoken,
        school_id: localStorage.jxschool_id
      };
      this.fileList = [];
    },
    //上传文件检查
    handleCheck(file, fileList) {
      console.log(this.form.courseware_name);
      if (this.form.courseware_name == "") {
        this.$message.error("请输入课件名称");
        return false;
      }
      if (this.form.cycle == "") {
        this.$message.error("请输入所属周期");
        return false;
      }
    },
    handlePreview(file) {
      console.log(111);
    },
    //上传成功
    uploadSuccess(response, file, fileList) {
      console.log(response);
      if (response.status == 1) {
        this.dialogFormVisibleupload = false;
        this.$message.success(response.info);
        this.req();
      }
      if (response.status == 0) {
        this.dialogFormVisibleupload = false;
        this.$message.error(response.info);
      }
    },
    //上传失败
    uploadError(err, file, fileList) {
      console.log(err);
      this.dialogFormVisibleupload = false;
      this.$message.error(err.info);
    },
    //删除
    deleteFn(val) {
      this.deleteTitle = val.courseware_name;
      this.deleteId = val.id;
      this.deleteDialogVisible = true;
    },
    //确定删除
    deleteConfirm() {
      //提交删除
      this.$http
        .post("/Teaching/deleteCourseware", {
          token: localStorage.jxtoken,
          school_id: localStorage.jxschool_id,
          file_id: this.deleteId
        })
        .then(res => {
          this.$message.success("操作成功！");
          this.deleteDialogVisible = false;
          this.req();
        })
        .catch(res => {
          this.$message.error(res.info);
          this.deleteDialogVisible = false;
        });
    },
    //查看
    checkFn(val) {
      this.showName = val.courseware_name;
      this.showCycle = val.cycle;
      this.checkDialogVisible = true;
    },
    //下载
    loadFn(val) {
      this.$tools.exportFile("/Teaching/forceDownload", {
        token: localStorage.jxtoken,
        file_url_name: val.file_url + val.file_name
      });
      // this.$http.post('/Teaching/forceDownload',{
      //     token:localStorage.jxtoken,
      //     file_url_name:val.file_url+val.file_name
      // })
      // .then(res => {
      //     this.$message.success('操作成功！');
      //     this.deleteDialogVisible = false;
      //     this.req()
      // })
      // .catch(res=>{
      //     this.$message.error(res.info);
      //     this.deleteDialogVisible = false;
      // })
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
.el-button--text:focus,
.el-button--text:hover {
  background: #409eff;
  color: #fff;
}
.item {
  margin-bottom: 20px;
  .el-input {
    width: 250px;
  }
  .upload-demo {
    display: inline;
  }
}
</style>
