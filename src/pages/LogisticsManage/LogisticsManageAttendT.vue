<template>
    <div>
        <I-table
        title="教师考勤配置"
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
                        prop="is_effective"
                        label="状态"
                        width="100"
                        :filters="[{ text: '有效', value: '有效' }, { text: '无效', value: '无效' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                            :type="scope.row.is_effective === '有效' ? 'primary' : 'danger'"
                            close-transition>{{scope.row.is_effective}}</el-tag>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="操作"
                        width="300"
                        >
	                        <template slot-scope="scope">
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
	                                <el-input v-model="form.name" :maxlength="20" auto-complete="off"></el-input>
	                            </el-form-item>
		                        <el-form-item label="上午上班:" :label-width="formLabelWidth">
								    <el-col :span="11">
								        <el-time-select
                                        style="width: 100%;"
                                        v-model="form.am_start"
                                        :picker-options="{
                                            start: '08:00',
                                            step: '00:15',
                                            end: '20:00'
                                        }"
                                        placeholder="选择时间"
                                        @change="compareTime(form.am_start,form.am_end)">
                                        </el-time-select>
								    </el-col>
								</el-form-item>
                                <el-form-item label="上午下班:" :label-width="formLabelWidth">
								    <el-col :span="11">
								        <el-time-select
                                        style="width: 100%;"
                                        v-model="form.am_end"
                                        :picker-options="{
                                            start: '08:00',
                                            step: '00:15',
                                            end: '20:00'
                                        }"
                                        placeholder="选择时间"
                                        @change="compareTime(form.am_start,form.am_end)">
                                        </el-time-select>
								    </el-col>
								</el-form-item>
                                <el-form-item label="下午上班:" :label-width="formLabelWidth">
								    <el-col :span="11">
								        <el-time-select
                                        style="width: 100%;"
                                        v-model="form.pm_start"
                                        :picker-options="{
                                            start: '08:00',
                                            step: '00:15',
                                            end: '20:00'
                                        }"
                                        placeholder="选择时间"
                                        @change="compareTime(form.pm_start,form.pm_end)">
                                        </el-time-select>
								    </el-col>
								</el-form-item>
                                <el-form-item label="下午下班:" :label-width="formLabelWidth">
								    <el-col :span="11">
								        <el-time-select
                                        style="width: 100%;"
                                        v-model="form.pm_end"
                                        :picker-options="{
                                            start: '08:00',
                                            step: '00:15',
                                            end: '20:00'
                                        }"
                                        placeholder="选择时间"
                                        @change="compareTime(form.pm_start,form.pm_end)">
                                        </el-time-select>
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
                                <el-form-item label="是否有效:" :label-width="formLabelWidth">
                                    <el-select v-model="form.is_effective" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
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
                                    <label>上午上班：</label>
                                    <span>
                                        <div>{{form.am_start}}</div>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>上午下班：</label>
                                    <span>
                                        <div>{{form.am_end}}</div>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>下午上班：</label>
                                    <span>
                                        <div>{{form.pm_start}}</div>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>下午下班：</label>
                                    <span>
                                        <div>{{form.pm_end}}</div>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>星期：</label>
                                    <span>{{form.repeat_title}}</span>
                                </div>
                                <div class="item">
                                    <label>是否有效：</label>
                                    <span>{{form.is_effective}}</span>
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
      //搜索参数
      type: "",
      number: "",
      page_number: 1,
      page_size: 10,
      total_page: 0,
      sort: "",
      order: "",
      search: "",
      options: [
        {
          value: "0",
          label: "无效"
        },
        {
          value: "1",
          label: "有效"
        }
      ],
      //编辑添加参数
      form: {
        token: localStorage.jxtoken,
        name: "",
        is_effective: "0",
        repeat: [],
        am_start: "08:00",
        am_end: "12:00",
        pm_start: "13:00",
        pm_end: "17:00"
      },
      //获取的数据
      tableData: [],
      editTitle: "新增"
    };
  },
  mounted() {
    this.req();
  },
  methods: {
    //刷新
    refresh() {
      this.req();
    },
    req() {
      this.tableData = [];
      this.$http
        .post("/SchoolStaffAtt/setList", {
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
            if (this.tableData[i].is_effective == 0) {
              this.tableData[i].is_effective = "无效";
            }
            if (this.tableData[i].is_effective == 1) {
              this.tableData[i].is_effective = "有效";
            }
          }
          this.total_page = parseInt(res.data.page.total);
        });
    },
    compareTime(t1, t2) {
      if (t1 != "" && this.t2 != "") {
        if (!this.compare(t1, t2)) {
          this.$message.error("开始时间不能小于结束时间！");
        }
      }
    },
    compare(t1, t2) {
      var date = new Date();
      var a = t1.split(":");
      var b = t2.split(":");
      return date.setHours(a[0], a[1]) < date.setHours(b[0], b[1]);
    },
    pageChange(current) {
      this.page_current = current;
      //this.req()
    },
    filterTag(value, row) {
      return row.status === value;
    },
    changeFun(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //显示编辑
    editShow(val) {
      this.form.id = val.id;
      this.form.name = val.name;
      this.form.is_effective = val.is_effective;
      this.repeat = val.repeat;
      this.am_start = val.am_start;
      this.am_end = val.am_end;
      this.pm_start = val.pm_start;
      this.pm_end = val.pm_end;
      if (val.repeat instanceof Array == false) {
        this.form.repeat = val.repeat.split(",");
      }
      console.log(this.form);
      this.dialogFormVisibleAdd = true;
      (this.isAdd = false), (this.editTitle = "编辑");
    },
    //显示添加弹窗
    addShow() {
      this.dialogFormVisibleAdd = true;
      this.isAdd = true;
      this.form = {
        token: localStorage.jxtoken,
        name: "",
        is_effective: "0",
        repeat: [],
        am_start: "08:00",
        am_end: "12:00",
        pm_start: "13:00",
        pm_end: "17:00"
      };
      this.editTitle = "新增";
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
      if (this.form.am_start == "") {
        this.$message.error("请选择上午上课时间!");
        return;
      }
      if (this.form.am_end == "") {
        this.$message.error("请选择上午下课时间!");
        return;
      }
      if (this.form.pm_start == "") {
        this.$message.error("请选择下午上课时间!");
        return;
      }
      if (this.form.pm_end == "") {
        this.$message.error("请选择下午下课时间!");
        return;
      }
      if (this.form.am_start != "" && this.form.am_end != "") {
        if (!this.compare(this.form.am_start, this.form.am_end)) {
          this.$message.error("上午上课时间小于下课时间！");
          return;
        }
      }
      if (this.form.pm_start != "" && this.form.pm_end != "") {
        if (!this.compare(this.form.pm_start, this.form.pm_end)) {
          this.$message.error("下午上课时间小于下课时间！");
          return;
        }
      }
      //console.log(this.form);
      this.form.repeat = this.form.repeat.join(",");
      this.form.token = localStorage.jxtoken;
      console.log(this.form);
      //提交
      if (this.isAdd) {
        this.$http
          .post("/SchoolStaffAtt/setAdd", this.form)
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
        if (this.form.is_effective == "无效") {
          this.form.is_effective = 0;
        }
        if (this.form.is_effective == "有效") {
          this.form.is_effective = 1;
        }
        //debugger
        this.$http
          .post("/SchoolStaffAtt/setEdit", this.form)
          .then(res => {
            this.$message.success(res.info);
            this.dialogFormVisibleAdd = false;
            this.req();
          })
          .catch(res => {
            //this.$message.success(res.info);
            this.dialogFormVisibleAdd = false;
          });
      }
    },
    //查看详情
    handleClick: function(val) {
      this.$http
        .post("/SchoolStaffAtt/info", {
          id: val.id,
          token: localStorage.jxtoken
        })
        .then(res => {
          console.log(res);
          this.form = res.data;
          if (this.form.is_effective == 0) {
            this.form.is_effective = "无效";
          }
          if (this.form.is_effective == 1) {
            this.form.is_effective = "有效";
          }
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
        .post("/SchoolStaffAtt/setDelete", {
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
