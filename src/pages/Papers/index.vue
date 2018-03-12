<template>
  <div class="papers">
    <I-table
    title="试卷管理"
    :isUpdate="true"
    @update="refresh">
        <template slot="head">
              <el-select v-model="getData.versions_id" @change="changeSelect('version')" placeholder="请选择版本">
                  <el-option
                  v-for="(item,index) in versionData"
                  :key="index"
                  :label="item.versions"
                  :value="item.id">
                  </el-option>
              </el-select> 
              <el-select v-model="getData.classes" @change="changeSelect('class')" placeholder="请选择班级">
                  <el-option
                  v-for="(item,index) in gradeData"
                  :key="index"
                  :label="item.class"
                  :value="item.id">
                  </el-option>
              </el-select>
              <el-select v-model="getData.subject" placeholder="请选择科目">
                  <el-option
                  v-for="item in sujectData"
                  :key="item.value"
                  :label="item.subject"
                  :value="item.id">
                  </el-option>
              </el-select>
              <el-input v-model="getData.keyword" size="smail" placeholder="试卷标题" style="width:200px;"></el-input>
              <el-button size="smail" type="primary" @click="searchfn">查询</el-button>
              <el-button size="smail" type="primary" class="add" @click="addShow">添加试卷</el-button>
        </template>
        <template slot="content" slot-scope="props">
              <el-table
              border
              row-class-name="table-row"
              ref="multipleTable"
              :height="props.maxHeight"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%;"
              >
                  <el-table-column
                  prop="id"
                  width='60'
                  label="序号"></el-table-column>
                  <el-table-column
                  sortable
                  width='100'
                  prop="clname"
                  label="年级"></el-table-column>
                  <el-table-column
                  prop="sname"
                  width='100'
                  label="科目"></el-table-column>
                  <el-table-column
                  prop="title"
                  label="试卷标题"></el-table-column>
                  <el-table-column
                  width='90'
                  prop="total_points"
                  label="总分"></el-table-column>
                  <el-table-column
                  width='110'
                  prop="exam_minutes"
                  label="考试时间"></el-table-column>
                  <el-table-column
                  prop="create_time"
                  label="添加时间"></el-table-column>
                  <el-table-column
                  label="操作"
                  width="320">
                  <template slot-scope="scope">
                      <el-button @click="linkPriview(scope.row)" type="text" size="small">查看</el-button>
                      <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
                      <el-button type="text" size="small" @click="addQestions(scope.row)">添加试题</el-button>
                      <el-button type="text" size="small" @click="deletefn(scope.row)">删除</el-button>
                      <el-button type="text" size="small" @click="priview(scope.row)">打印预览</el-button>
                  </template>
                  </el-table-column>
              </el-table>
              <!-- 打印 -->
          <I-table-editor v-model="importDialogVisible" 
          title="打印预览">
              <template slot="content">
                  <el-row>选择试卷样式：</el-row>
                  <el-row class="outportaddr-group">
                      <el-radio-group v-model="outportAddr">
                          <el-radio v-model="radio2" label="1">A4单栏</el-radio>
                          <el-radio v-model="radio2" label="2">A3双栏</el-radio>
                          <el-radio v-model="radio2" label="3">A3三栏</el-radio>
                      </el-radio-group>
                  </el-row>
              </template>
              <template slot="foot">
                  <el-button 
                  @click="importDialogVisible = false">取 消</el-button>
                  <el-button type="success"
                  @click="priviewConfirm">确 定</el-button>
              </template>
          </I-table-editor>
              <!-- 删除 -->
          <I-table-editor v-model="deleteDialogVisible" 
          title="删除">
              <template slot="content">
                <div class="outportaddr-group">
                  <span>是否确定删除试卷：[ {{deleteTitle}} ] ？</span>
                </div>
              </template>
              <template slot="foot">
                  <el-button 
                  @click="deleteDialogVisible = false">取 消</el-button>
                  <el-button type="success"
                  @click="deleteconfirm">确 定</el-button>
              </template>
          </I-table-editor>
          <!-- 添加试卷 -->
          <I-table-editor v-model="dialogFormVisible" 
          :title="showTitle">
            <template slot="content">
              <div class="list">
                <label class="titles">考试方式：</label>
                <el-radio v-model="addInfo.exam_type" label="1">闭卷</el-radio>
                <el-radio v-model="addInfo.exam_type" label="2">开卷</el-radio>
              </div>
              <div class="list">
                <label class="titles">版本：</label>
                <el-select @change="addChangeSelect('versions')" v-model="addInfo.versions_id" placeholder="请选择版本" :disabled="!edit_is">
                  <el-option
                    v-for="(item,index) in addVersionData"
                    :key="index"
                    :label="item.versions"
                    :value="item.id">
                  </el-option>
                </el-select>
                <label class="titles">年级：</label>
                <el-select @change="addChangeSelect('class')" v-model="addInfo.clid" placeholder="请选择年级" :disabled="!edit_is">
                  <el-option
                    v-for="(item,index) in addGradeData"
                    :key="index"
                    :label="item.class"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="list">
                <label class="titles">科目：</label>
                <el-select v-model="addInfo.sid" placeholder="请选择科目" :disabled="!edit_is">
                  <el-option
                    v-for="(item,index) in addSujectData"
                    :key="index"
                    :label="item.subject"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="list">
                <label class="titles">试卷标题：</label>
                <input type="text" maxlength="30" v-model="addInfo.title" class="paperTitle" placeholder="不超过30字">
              </div>
              <div class="list">
                <label class="titles">试题总分：</label>
                <input type="text" v-model="addInfo.total_points" placeholder="分数" :disabled="!edit_is">
                <label class="titles">考试时间：</label>
                <input type="text" v-model="addInfo.exam_minutes" placeholder="分钟">
              </div>
            </template>
            <template slot="foot">
                <el-button 
                @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="success"
                @click="addfn">确 定</el-button>
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
import { ITable, ITablePage, ITableEditor } from "@/components/Table/";

export default {
  data() {
    return {
      showTitle: "添加",
      //下拉菜单
      versionData: [],
      gradeData: [],
      sujectData: [],
      //添加试卷下拉菜单
      addVersionData: [],
      addGradeData: [],
      addSujectData: [],

      //头部搜索和试卷列表
      getData: {
        page_size: 10,
        page_number: 1,
        sort: "",
        order: "asc",
        uid: localStorage.jxid,
        school_id: localStorage.jxschool_id,
        type: this.$route.params.type,
        keyword: "",
        versions_id: "",
        subject: "",
        classes: "",
        token: localStorage.jxtoken
        //clid:""
      },
      total: 0,
      //添加试卷
      addInfo: {
        exam_id: "",
        exam_type: "1",
        title: "",
        versions_id: "",
        clid: "",
        sid: "",
        total_points: "",
        exam_minutes: "",
        school_id: "",
        uid: ""
      },
      edit_is: true,
      //删除
      deleteExam_id: "",
      deleteTitle: "",
      value: "",
      tableData: [],

      //添加试卷弹窗数据
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      //删除弹窗数据
      deleteDialogVisible: false,
      //导出弹窗数据
      importDialogVisible: false,
      outportAddr: "1",
      radio: "1",
      radio2: "2",
      priviewId: ""
    };
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor
  },
  mounted() {
    localStorage.papers_type = this.$route.params.type;
    this.getVersions("versionData");
    this.req();
  },
  watch: {
    $route(to, from) {
      this.getData.type = this.$route.params.type;
      localStorage.papers_type = this.$route.params.type;
      this.req();
    }
  },
  methods: {
    //刷新
    refresh() {
      this.getData.versions_id = "";
      this.getData.clid = "";
      this.getData.subject = "";
      this.getData.keyword = "";
      this.getData.classes = "";
      this.gradeData = [];
      this.sujectData = [];
      this.req();
    },
    req() {
      this.tableData = [];
      this.$http.post("/ExamPaper/lists", this.getData).then(res => {
        // console.log(res)
        if (this.page_number > 1) {
          if (!res.data) {
            this.page_number = this.page_number - 1;
            this.req();
          }
        }
        this.total = parseInt(res.data.data.page.total);
        this.tableData = res.data.data.rows;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].create_time = this.$tools.formatDate(
            parseInt(this.tableData[i].create_time)
          );
        }
      });
    },
    //下拉改变
    changeSelect(name, val) {
      if (name == "version") {
        this.getClass("gradeData", this.getData.versions_id);
        this.getData.class_id = "";
        this.getData.subject = "";
        this.sujectData = [];
      }
      if (name == "class") {
        this.getSubject(
          "sujectData",
          this.getData.versions_id,
          this.getData.classes
        );
        this.getData.subject = "";
      }
    },
    //添加试卷时下拉改变
    addChangeSelect(name, val) {
      if (name == "versions") {
        this.getClass("addGradeData", this.addInfo.versions_id);
        this.addInfo.sid = "";
        this.addInfo.clid = "";
        this.addSujectData = [];
      }
      if (name == "class") {
        this.getSubject(
          "addSujectData",
          this.addInfo.versions_id,
          this.addInfo.clid
        );
        this.addInfo.sid = "";
      }
    },
    //获取版本
    getVersions(data) {
      this.$http
        .get("./Question/getVersions")
        .then(res => {
          // console.log(res);
          this[data] = res.data;
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //获取年级
    getClass(data, version_id) {
      this.$http
        .post("./Question/getClass", {
          token: localStorage.jxtoken,
          versions_id: version_id
        })
        .then(res => {
          // console.log(res);
          this[data] = [];
          this[data] = res.data;
          // console.log('打印',this[data])
        })
        .catch(res => {
          this[data] = [];
          this.$message.error(res.info);
        });
    },
    //获取科目
    getSubject(data, version_id, class_id) {
      this.$http
        .post("./Question/getSubject", {
          token: localStorage.jxtoken,
          versions_id: version_id,
          class_id: class_id
        })
        .then(res => {
          // console.log(res);
          this[data] = res.data;
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //查询
    searchfn() {
      this.req();
    },
    sortChange({ column, prop, order }) {
      this.sort = column.property;
      if (column.order == "ascending") {
        this.order = "asc";
      } else if (column.order == "descending") {
        this.order = "desc";
      }
      this.req();
    },
    //翻页
    pageChange(current) {
      this.getData.page_number = current;
      this.req();
    },
    //删除
    deletefn(val) {
      this.deleteExam_id = val.id;
      this.deleteTitle = val.title;
      this.deleteDialogVisible = true;
    },
    //确认删除
    deleteconfirm() {
      //提交删除
      this.$http
        .post("/ExamPaper/delete", {
          exam_id: this.deleteExam_id,
          token: localStorage.jxtoken
        })
        .then(res => {
          this.$message.success("操作成功！");
          this.deleteDialogVisible = false;
          this.req();
        });
    },
    //编辑
    handleClick(val) {
      // console.log('val',val)
      this.showTitle = "编辑";
      this.edit_is = true;
      if (val.exam_question_info != null) {
        this.edit_is = false;
      }
      this.addInfo.exam_id = val.id;
      this.addInfo.exam_type = val.exam_type;
      this.addInfo.title = val.title;
      this.addInfo.versions_id = val.versions_id;
      this.addInfo.clid = val.clid;
      this.addInfo.sid = val.sid;
      this.addInfo.total_points = val.total_points;
      this.addInfo.exam_minutes = val.exam_minutes;
      this.addInfo.school_id = val.school_id;
      this.addInfo.uid = val.uid;
      this.addInfo.type = val.type;

      this.isAdd = false;
      this.getVersions("addVersionData");
      this.getClass("addGradeData", val.versions_id);
      this.getSubject("addSujectData", val.versions_id, val.clid);
      this.addInfo.versions_id = val.versions_id;
      this.addInfo.clid = val.clid;
      this.addInfo.sid = val.sid;
      this.dialogFormVisible = true;
    },
    //显示添加
    addShow() {
      this.showTitle = "添加";
      this.addInfo = {
        exam_id: "",
        exam_type: "1",
        title: "",
        versions_id: "",
        clid: "",
        sid: "",
        total_points: "",
        exam_minutes: "",
        school_id: "",
        uid: "",
        type: this.$route.params.type
      };
      this.edit_is = true;
      this.getVersions("addVersionData");
      (this.addGradeData = []),
        (this.addSujectData = []),
        (this.dialogFormVisible = true);
    },
    //添加试题
    addfn() {
      if (this.addInfo.versions_id == "") {
        this.$message.error("请选择版本!");
        return;
      }
      if (this.addInfo.clid == "") {
        this.$message.error("请选择年级!");
        return;
      }
      if (this.addInfo.sid == "") {
        this.$message.error("请选择科目!");
        return;
      }
      if (
        this.addInfo.title.trim() == "" ||
        this.addInfo.title.toString().trim() == ""
      ) {
        this.$message.error("请输入试卷标题!");
        return;
      }
      //判断总分和考试时间
      if (this.addInfo.total_points > 300 || this.addInfo.total_points < 1) {
        this.$message.error("试题总分应在1到300之间");
        return;
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.addInfo.total_points)) {
        this.$message.error("试题总分应为整数");
        return;
      }
      if (this.addInfo.exam_minutes > 250 || this.addInfo.exam_minutes < 1) {
        this.$message.error("考试时间应在1到250之间");
        return;
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(this.addInfo.exam_minutes)) {
        this.$message.error("考试时间应为整数");
        return;
      }
      // console.log(this.addInfo);
      this.addInfo.school_id = localStorage.jxschool_id;
      this.addInfo.uid = localStorage.jxid;
      this.addInfo.token = localStorage.jxtoken;
      //提交
      this.$http
        .post("/ExamPaper/save", this.addInfo)
        .then(res => {
          this.dialogFormVisible = false;
          this.$message.success(res.info);
          this.req();
        })
        .catch(res => {
          this.$message.error(res.info);
        });
    },
    //跳转预览
    linkPriview(val) {
      //this.$router.push("/papers-add");
      localStorage.papers_id = val.id;
      window.open(
        "./static/paper/Question_previewPaperA4.html?paper_id=" +
          localStorage.papers_id +
          "&open_type=2"
      );
    },
    //跳转添加试题
    addQestions(val) {
      // console.log('val',val)
      localStorage.papers_versions_id = val.versions_id;
      localStorage.papers_clname = val.clname;
      localStorage.papers_clid = val.clid;
      localStorage.papers_sname = val.sname;
      localStorage.papers_sid = val.sid;
      localStorage.papers_id = val.id;
      localStorage.add_questions = 1;
      localStorage.removeItem("getData");
      localStorage.removeItem("questions");
      localStorage.removeItem("bigJson");
      this.$router.push("/papers-add");
    },
    //预览
    priview(val) {
      this.importDialogVisible = true;
      this.priviewId = val.id;
      localStorage.papers_id = val.id;
    },
    //预览选择
    priviewConfirm() {
      if (this.outportAddr == 1) {
        window.open(
          "./static/paper/Question_previewPaperA4.html?paper_id=" +
            localStorage.papers_id +
            "&open_type=2"
        );
      }
      if (this.outportAddr == 2) {
        window.open(
          "./static/paper/Question_previewPaperA4D.html?paper_id=" +
            localStorage.papers_id +
            "&open_type=2"
        );
      }
      if (this.outportAddr == 3) {
        window.open(
          "./static/paper/Question_previewPaperA3.html?paper_id=" +
            localStorage.papers_id +
            "&open_type=2"
        );
      }
      this.importDialogVisible = false;
    },
    handleClose() {}
  }
};
</script>
<style scoped lang="less">
.el-button--text {
  padding: 5px;
  background: #409eff;
  color: white;
}
.el-button--text:focus,
.el-button--text:hover {
  background: #409eff;
  color: #fff;
}
.add {
  float: right;
}
.confirm:hover {
  background: #41cac0;
}
.el-dialog input {
  width: 160px;
  padding: 5px;
  border: 1px solid #c0c4cc;
  outline: none;
  border-radius: 3px;
  padding: 10px;
  box-sizing: border-box;
}
.list .titles {
  width: 80px;
  display: inline-block;
  text-align: right;
}
.list {
  margin: 0 0 20px 0;
}
.paperTitle {
  width: 414px !important;
}
.el-dialog .el-select {
  width: 160px;
}
.el-select {
  width: 15%;
}
</style>
