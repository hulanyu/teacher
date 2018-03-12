<template>
    <div>
        <I-table
        title="学生宿舍考勤配置"
        :isUpdate="true"
        @update="refresh"
        >
            <template slot="head">
                <div>
                    <el-button size="medium" type="success" class="addbtn" @click="addShow">新 增 规 则</el-button>
                </div>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    :height="props.maxHeight"
                    style="width: 100%;"
                    row-class-name="table-row"
                    :data="tableData"
                    @selection-change="changeFun">
                        <el-table-column
                        prop="name"
                        label="考勤规则名称"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="300"
                        >
	                        <template slot-scope="scope">
                                <el-button  type="text" size="small" @click="showAction(scope.row)" v-if="scope.row.is_effective == 0" style="background-color: #41cac0;color:white; ">启动</el-button>
                                <el-button  type="text" size="small" @click="showClose(scope.row)" v-if="scope.row.is_effective == 1">已启动</el-button>
	                        	<el-button  type="text" size="small" @click="editShow(scope.row)">编辑</el-button>
	                        	<el-button  type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
	                            <el-button  type="text" size="small" @click="deletefn(scope.row)">删除</el-button>
	                        </template>
                        </el-table-column>
                    </el-table>
                	<!--新增规则-->
                	<I-table-editor v-model="dialogFormVisibleAdd" 
                	:title="editTitle">
	                   <template slot="content">
	                   		<el-form >
	                            <el-form-item label="规则名称:" :label-width="formLabelWidth">
	                                <el-input v-model="form.name" :aria-modal="20" auto-complete="off"></el-input>
	                            </el-form-item>
		                        <el-form-item label="生效时间:" :label-width="formLabelWidth">
								    <el-col :span="11">
								      <el-date-picker @change="startDatetimeChange" :picker-options="startDatetimePickerOptions"
                                       type="date" placeholder="" v-model="form.effective_start_time" style="width: 100%;"></el-date-picker>
								    </el-col>
								    <el-col class="line" :span="2" style='text-align: center;'>至</el-col>
								    <el-col :span="11">
								      <el-date-picker type="date" @change="endDatetimeChange" :picker-options="endDateTimePickerOptions"
                                       placeholder="" v-model="form.effective_end_time" style="width: 100%;"></el-date-picker>
								    </el-col>
								</el-form-item>
								<el-form-item label="星   期:" :label-width="formLabelWidth">
								    <el-checkbox-group v-model="form.repeat">
								      <el-checkbox value="1" label="1" name="week">星期一</el-checkbox>
								      <el-checkbox value="2" label="2" name="week">星期二</el-checkbox>
								      <el-checkbox value="3" label="3" name="week">星期三</el-checkbox>
								      <el-checkbox value="4" label="4" name="week">星期四</el-checkbox>
								      <el-checkbox value="5" label="5" name="week">星期五</el-checkbox>
								      <el-checkbox value="6" label="6" name="week">星期六</el-checkbox>
								      <el-checkbox value="0" label="0" name="week">星期日</el-checkbox>
								    </el-checkbox-group>
								</el-form-item>
								<el-form-item label="考勤时间设置:" :label-width="formLabelWidth">
								    <el-col :span="11">
								        <el-time-select
                                        style="width: 100%;"
                                        v-model="form.in_time"
                                        :picker-options="{
                                            start: '08:00',
                                            step: '00:15',
                                            end: '20:00'
                                        }"
                                        placeholder="选择时间"
                                        @change="compareTime">
                                        </el-time-select>
								    </el-col>
								    <el-col class="line" :span="2" style='text-align: center;'>至</el-col>
								    <el-col :span="11">
								      <el-time-select
                                      style="width: 100%;"
                                        v-model="form.out_time"
                                        :picker-options="{
                                            start: '08:00',
                                            step: '00:15',
                                            end: '20:00'
                                        }"
                                        placeholder="选择时间"
                                        @change="compareTime">
                                        </el-time-select>
								    </el-col>
								</el-form-item>
								<el-form-item label="考勤年级:" :label-width="formLabelWidth">
                                    <el-checkbox-group v-model="form.grade_id">
                                        <el-checkbox v-for="(city,index) in classes" :label="city.id" :key="index">{{city.grade}}</el-checkbox>
                                    </el-checkbox-group> 
								</el-form-item>
                                
	                        </el-form>
	                    </template>
	                    <template slot="foot">
	                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
	                        <el-button v-if="isAdd == true" class="confirm" type="success" @click="addfn">保 存</el-button>
                            <el-button v-if="isAdd == false" class="confirm" type="success" @click="addfn">保 存</el-button>
	                    </template>
                	</I-table-editor>
                    <!-- 查看 -->
                    <I-table-editor v-model="dialogFormVisibleDetail" 
                    title="宿舍考勤配置查看">
                        <template slot="content">
                            <div class="details">
                                <div class="item">
                                    <label>名称：</label>
                                    <span>{{form.name}}</span>
                                </div>
                                <div class="item">
                                    <label>生效时间：</label>
                                    <span>
                                        <div>{{form.effective_start_time}} 至 {{form.effective_end_time}}</div>
                                        <div>{{form.repeat_title}}</div>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>考勤时间段：</label>
                                    <span>{{form.in_time}}-{{form.out_time}}</span>
                                </div>
                                <div class="item">
                                    <label>考勤年级：</label>
                                    <span>{{form.grade_title}}</span>
                                </div>
                            </div>
                            
                        </template>
                        <template slot="foot">
                            <el-button @click="dialogFormVisibleDetail = false">取 消</el-button>
                            <el-button class="confirm" type="success"
                            @click="dialogFormVisibleDetail = false">确 定</el-button>
                        </template>
                    </I-table-editor>
                    <!-- 删除 -->
                    <I-table-editor v-model="dialogFormVisibleDelete" 
                    title="删除">
                        <template slot="content">
                            <div class="outportaddr-group">
                                <span>是否确定删除{{deleteTitle}}规则？</span>
                            </div>
                        </template>
                        <template slot="foot">
                            <el-button @click="dialogFormVisibleDelete = false">取 消</el-button>
                            <el-button class="confirm" type="success"
                            @click="deleteconfirm">确 定</el-button>
                        </template>
                    </I-table-editor>
                    <!-- 启动 -->
                    <I-table-editor v-model="dialogFormVisibleAction" 
                    title="启动">
                        <template slot="content">
                            <div class="outportaddr-group">
                                <span>是否确定启动{{actionTitle}}规则？</span>
                            </div>
                        </template>
                        <template slot="foot">
                            <el-button @click="dialogFormVisibleAction = false">取 消</el-button>
                            <el-button class="confirm" type="success"
                            @click="actionFn">确 定</el-button>
                        </template>
                    </I-table-editor>
                    <!-- 关闭 -->
                    <I-table-editor v-model="dialogFormVisibleClose" 
                    title="关闭">
                        <template slot="content">
                            <div class="outportaddr-group">
                                <span>是否确定关闭{{actionTitle}}规则？</span>
                            </div>
                        </template>
                        <template slot="foot">
                            <el-button @click="dialogFormVisibleClose = false">取 消</el-button>
                            <el-button class="confirm" type="success"
                            @click="closeFn">确 定</el-button>
                        </template>
                    </I-table-editor>
            </template>
            <template slot="foot">
                <I-table-page
                :total="total_page"
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
      startDatetimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      endDateTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      dialogFormVisibleAdd: false,
      dialogFormVisibleDelete: false,
      dialogFormVisibleDetail: false,
      dialogFormVisibleAction: false,
      dialogFormVisibleClose: false,
      multipleSelection: [], //选中的数据
      formLabelWidth: "130px",
      isAdd: true,
      deleteId: "", //删除
      deleteTitle: "",
      //启动
      actionTitle: "",
      actionId: "",
      //搜索参数
      type: "",
      number: "",
      page_number: 1,
      page_size: 10,
      total_page: 0,
      sort: "",
      order: "",
      search: "",
      //编辑添加参数
      form: {
        token: localStorage.jxtoken,
        name: "",
        grade_id: [],
        repeat: [],
        in_time: "08:00",
        out_time: "17:00",
        effective_start_time: this.$tools.formatDate(
          new Date().getTime() / 1000,
          "yyyy-MM-dd"
        ),
        effective_end_time: this.$tools.formatDate(
          new Date().getTime() / 1000,
          "yyyy-MM-dd"
        )
      },
      value1: "",
      classSelect: ["初一", "初二"],
      classes: ["初一", "高一", "高二", "高三"],
      //获取的数据
      tableData: [],
      editTitle: "新增"
    };
  },
  mounted() {
    this.req();
    this.getSchoolGrade();
  },
  methods: {
    //刷新
    refresh() {
      this.req();
    },
    req() {
      this.tableData = [];
      this.$http
        .post("/SchoolStudentsAtt/setList", {
          token: localStorage.jxtoken,
          page_number: this.page_number,
          page_size: this.page_size,
          sort: this.sort,
          order: this.order,
          search: this.search
        })
        .then(res => {
          console.log(res);
          if (this.page_number > 1) {
            if (!res.data) {
              this.page_number = this.page_number - 1;
              this.req();
            }
          }
          this.tableData = res.data.row;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].create_time = this.$tools.formatDate(
              parseInt(this.tableData[i].create_time)
            );
          }
          this.total_page = parseInt(res.data.page.total);
        });
    },
    compareTime() {
      if (this.form.in_time != "" && this.form.out_time != "") {
        if (!this.compare(this.form.in_time, this.form.out_time)) {
          this.$message.error("开始时间不能小于结束时间！");
          this.form.in_time = "08:00";
          this.form.out_time = "17:00";
        }
      }
    },
    compare(t1, t2) {
      var date = new Date();
      var a = t1.split(":");
      var b = t2.split(":");
      return date.setHours(a[0], a[1]) < date.setHours(b[0], b[1]);
    },
    //获取年级
    getSchoolGrade() {
      this.$http
        .post("/SchoolGrade/lists", {
          token: localStorage.jxtoken,
          page_number: this.page_number,
          page_size: 50,
          sort: this.sort,
          order: this.order
        })
        .then(res => {
          console.log(res);
          this.classes = res.data.row;
        });
    },
    pageChange(current) {
      this.page_number = current;
      this.req();
    },
    changeFun(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    showAction(row) {
      this.actionTitle = row.name;
      this.actionId = row.id;
      this.dialogFormVisibleAction = true;
    },
    //启动/关闭
    actionFn(row) {
      this.$http
        .post("/SchoolStudentsAtt/startup", {
          token: localStorage.jxtoken,
          id: this.actionId
        })
        .then(res => {
          this.$message.success(res.info);
          this.dialogFormVisibleAction = false;
          this.req();
        })
        .catch(res => {
          //this.$message.error(res.info);
          this.dialogFormVisibleAction = false;
        });
    },
    showClose(row) {
      this.actionTitle = row.name;
      this.actionId = row.id;
      this.dialogFormVisibleClose = true;
    },
    //关闭
    closeFn(row) {
      this.$http
        .post("/SchoolStudentsAtt/close", {
          token: localStorage.jxtoken,
          id: this.actionId
        })
        .then(res => {
          this.$message.success(res.info);
          this.dialogFormVisibleClose = false;
          this.req();
        })
        .catch(res => {
          //this.$message.error(res.info);
          this.dialogFormVisibleClose = false;
        });
    },
    //显示编辑
    editShow(val) {
      this.form.id = val.id;
      this.form.name = val.name;
      this.form.grade_id = val.grade_id;
      this.repeat = val.repeat;
      this.in_time = val.in_time;
      this.out_time = val.out_time;
      this.effective_start_time = val.effective_start_time;
      this.effective_end_time = val.effective_end_time;
      if (val.grade_id instanceof Array == false) {
        this.form.grade_id = val.grade_id.split(",");
      }
      if (val.repeat instanceof Array == false) {
        this.form.repeat = val.repeat.split(",");
      }
      this.dialogFormVisibleAdd = true;
      (this.isAdd = false), (this.editTitle = "编辑");
    },
    //显示添加弹窗
    addShow() {
      this.editTitle = "新增";
      this.dialogFormVisibleAdd = true;
      this.isAdd = true;
      this.form = {
        token: localStorage.jxtoken,
        name: "",
        grade_id: [],
        repeat: [],
        in_time: "08:00",
        out_time: "17:00",
        effective_start_time: this.$tools.formatDate(
          new Date().getTime() / 1000,
          "yyyy-MM-dd"
        ),
        effective_end_time: this.$tools.formatDate(
          new Date().getTime() / 1000,
          "yyyy-MM-dd"
        )
      };
    },
    //新增
    addfn() {
      if (
        this.form.name.trim() == "" ||
        this.form.name.toString().trim() == ""
      ) {
        this.$message.error("请输入名称!");
        return;
      }
      if (this.form.name.length < 2) {
        this.$message.error("监控名称长度为2到10个字符!");
        return;
      }
      if (this.form.effective_start_time == "") {
        this.$message.error("请选择配置生效开始时间!");
        return;
      }
      if (this.form.effective_end_time == "") {
        this.$message.error("请选择配置生效结束时间!");
        return;
      }
      if (this.form.repeat == "") {
        this.$message.error("请选择星期!");
        return;
      }
      if (this.form.in_time == "") {
        this.$message.error("请选择考勤开始时间!");
        return;
      }
      if (this.form.out_time == "") {
        this.$message.error("请选择考勤结束时间!");
        return;
      }
      if (this.form.in_time != "" && this.form.out_time != "") {
        if (!this.compare(this.form.in_time, this.form.out_time)) {
          this.$message.error("开始不能小于结束时间！");
          return;
        }
      }
      if (this.form.grade_id == "") {
        this.$message.error("请选择年级!");
        return;
      }
      //console.log(this.form);
      this.form.repeat = this.form.repeat.join(",");
      this.form.grade_id = this.form.grade_id.join(",");
      this.form.effective_start_time = this.$tools.formatDate(
        this.form.effective_start_time.toString(),
        "yyyy-MM-dd"
      );
      this.form.effective_end_time = this.$tools.formatDate(
        this.form.effective_end_time.toString(),
        "yyyy-MM-dd"
      );
      this.form.token = localStorage.jxtoken;
      console.log(this.form);
      //提交
      if (this.isAdd) {
        this.$http
          .post("/SchoolStudentsAtt/setAdd", this.form)
          .then(res => {
            this.$message.success(res.info);
            this.dialogFormVisibleAdd = false;
            this.req();
          })
          .catch(res => {
            this.$message.success(res.info);
            this.dialogFormVisibleAdd = false;
          });
      } else {
        this.$http
          .post("/SchoolStudentsAtt/setEdit", this.form)
          .then(res => {
            this.$message.success(res.info);
            this.dialogFormVisibleAdd = false;
            this.req();
          })
          .catch(res => {
            this.$message.success(res.info);
            this.dialogFormVisibleAdd = false;
          });
      }
    },
    //时间改变
    startDatetimeChange() {
      console.log(this.form.effective_start_time);
      if (
        this.form.effective_end_time == "" ||
        this.form.effective_end_time == null
      )
        return;
      var start = this.$tools.formatDate(
        this.form.effective_start_time.toString(),
        "yyyyMMdd"
      );
      var end = this.$tools.formatDate(
        this.form.effective_end_time.toString(),
        "yyyyMMdd"
      );
      if (start > end) {
        this.$message.error("开始日期不能大于开始日期！");
        this.form.effective_start_time = this.form.effective_end_time;
      }
    },
    endDatetimeChange() {
      if (
        this.form.effective_start_time == "" ||
        this.form.effective_start_time == null
      )
        return;
      var start = this.$tools.formatDate(
        this.form.effective_start_time.toString(),
        "yyyyMMdd"
      );
      var end = this.$tools.formatDate(
        this.form.effective_end_time.toString(),
        "yyyyMMdd"
      );
      if (start > end) {
        this.$message.error("结束日期不能小于开始日期！");
        this.form.effective_start_time = this.form.effective_end_time;
      }
    },
    //查看详情
    handleClick: function(val) {
      this.$http
        .post("SchoolStudentsAtt/info", {
          id: val.id,
          token: localStorage.jxtoken
        })
        .then(res => {
          console.log(res);
          this.form = res.data;
          this.form.effective_start_time = this.$tools.formatDate(
            this.form.effective_start_time.toString(),
            "yyyy-MM-dd"
          );
          this.form.effective_end_time = this.$tools.formatDate(
            this.form.effective_end_time.toString(),
            "yyyy-MM-dd"
          );
          this.dialogFormVisibleDetail = true;
        });
    },
    //删除
    deletefn(val) {
      this.deleteTitle = val.name;
      this.deleteId = val.id;
      this.dialogFormVisibleDelete = true;
    },
    //确认删除
    deleteconfirm() {
      //console.log(this.ids);
      //提交删除
      this.$http
        .post("/SchoolStudentsAtt/delete", {
          id: this.deleteId,
          token: localStorage.jxtoken
        })
        .then(res => {
          this.$message.success("操作成功！");
          this.dialogFormVisibleDelete = false;
          this.req();
        })
        .catch(res => {
          this.$message.error(res.info);
          this.dialogFormVisibleDelete = false;
        });
    }
    //编辑
    //      editshow(val) {
    //          this.form = val;
    //          delete this.form.create_time;
    //          delete this.form.modify_time;
    //          delete this.form.is_delete;
    //          this.isAdd = false;
    //          this.dialogFormVisibleAdd = true;
    //      }
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor
  }
};
</script>
<style scoped lang="less">
.addbtn {
  padding: 11px 21px;
}
.margin_left {
  margin-left: 20px;
}
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
.el-checkbox {
  margin-left: 0;
  margin-right: 24px;
}
.plusbtn {
  font-size: 18px;
  margin-left: 10px;
  vertical-align: middle;
  padding: 1px 2px;
}
.el-icon-plus {
  font-weight: 900;
}
.details {
  line-height: 35px;
  .item {
    display: flex;
    label {
      width: 100px;
      text-align: right;
    }
  }
}
</style>
