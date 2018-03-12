<template>
  <I-table
  title="教师考勤记录"
  @update="update">
      <template slot="head">
            <el-date-picker
            v-model="start_time"
            type="date"
            placeholder="选择开始日期"
            @change="startDatetimeChange">
            </el-date-picker>
            <el-date-picker
            v-model="end_time"
            type="date"
            placeholder="选择结束日期"
            @change="endDatetimeChange">
            </el-date-picker>
            <el-button size="primary"
            @click="searchChange">查询</el-button>
            <el-button size="primary" class="btns"
            @click="exprotShow">导出</el-button>
            <el-select v-model="status" placeholder="请选择状态" class="topRight">
                <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
      </template>
      <template slot="content" slot-scope="props">
            <el-table
            border
            row-class-name="table-row"
            :height="props.maxHeight"
            :data="tableData">
                <el-table-column
                prop="name"
                label="教师名称"></el-table-column>
                <el-table-column
                prop="sex"
                label="性别"></el-table-column>
                <el-table-column
                prop="device_name"
                label="终端"></el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                width="140"
                :filters="[{ text: '缺勤', value: '缺勤' }, { text: '正常', value: '正常' }, { text: '迟到', value: '迟到' }, { text: '早退', value: '早退' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.status === '正常' ? 'primary' : 'danger'"
                    close-transition>{{scope.row.status}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                prop="am_start"
                label="上午上班"></el-table-column>
                <el-table-column
                prop="am_end"
                label="上午下班"></el-table-column>
                <el-table-column
                prop="pm_start"
                label="下午上班"></el-table-column>
                <el-table-column
                prop="pm_end"
                label="下午下班"></el-table-column>
            </el-table>
            <!-- 导出 -->
            <I-table-editor v-model="dialogFormVisibleExport" 
            title="导出">
                <template slot="content">
                    <div class="outportaddr-group">
                        <div>
                            <el-date-picker
                            v-model="export_start"
                            type="date"
                            placeholder="选择开始日期"
                            @change="exportDatetimeChange">
                            </el-date-picker>
                            至
                            <el-date-picker
                            v-model="export_end"
                            type="date"
                            placeholder="选择结束日期"
                            @change="exportendDatetimeChange">
                            </el-date-picker>
                        </div>
                    </div>
                </template>
                <template slot="foot">
                    <el-button @click="dialogFormVisibleExport = false">取 消</el-button>
                    <el-button class="confirm" type="success"
                    @click="exprotfn">确 定</el-button>
                </template>
            </I-table-editor>
      </template>
      
      <template slot="foot">
          <I-table-page
          :total="total"
          @change="pageChange"></I-table-page>
      </template>
  </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from "@/components/Table/";

export default {
  data() {
    return {
      tableData: [],
      options: [
        {
          id: 0,
          name: "缺勤"
        },
        {
          id: 1,
          name: "正常"
        },
        {
          id: 2,
          name: "迟到"
        },
        {
          id: 3,
          name: "早退"
        }
      ],
      page_number: 1,
      page_size: 10,
      sort: "",
      order: "",
      start_time: "",
      end_time: "",
      search: "",
      status: "",
      current: 1,
      startDatetime: "",
      endDatetime: "",
      total: 0,
      dialogFormVisibleExport: false,
      //导出
      export_start: "",
      export_end: ""
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
    req() {
      this.tableData = [];
      this.$http
        .post("SchoolStaffAtt/att", {
          token: localStorage.jxtoken,
          page_number: this.page_number,
          page_size: this.page_size,
          sort: this.sort,
          order: this.order,
          status: this.status,
          start_time: this.start_time,
          end_time: this.end_time
        })
        .then(res => {
          console.log(res);
          if (this.page_number > 1) {
            if (!res.data) {
              this.page_number = this.page_number - 1;
              this.req();
            }
          }
          if (res.data.row.length > 0) {
            for (let i = 0; i < res.data.row.length; i++) {
              if (res.data.row[i].am_start != "0") {
                res.data.row[i].am_start = this.$tools.formatDate(
                  res.data.row[i].am_start,
                  "yyyy-MM-dd hh:mm:ss"
                );
              } else {
                res.data.row[i].am_start = "/";
              }
              if (res.data.row[i].am_end != "0") {
                res.data.row[i].am_end = this.$tools.formatDate(
                  res.data.row[i].am_end,
                  "yyyy-MM-dd hh:mm:ss"
                );
              } else {
                res.data.row[i].am_end = "/";
              }
              if (res.data.row[i].pm_start != "0") {
                res.data.row[i].pm_start = this.$tools.formatDate(
                  res.data.row[i].pm_start,
                  "yyyy-MM-dd hh:mm:ss"
                );
              } else {
                res.data.row[i].pm_start = "/";
              }
              if (res.data.row[i].pm_end != "0") {
                res.data.row[i].pm_end = this.$tools.formatDate(
                  res.data.row[i].pm_end,
                  "yyyy-MM-dd hh:mm:ss"
                );
              } else {
                res.data.row[i].pm_end = "/";
              }
              if (res.data.row[i].status == 0) {
                res.data.row[i].status = "缺勤";
              }
              if (res.data.row[i].status == 1) {
                res.data.row[i].status = "正常";
              }
              if (res.data.row[i].status == 2) {
                res.data.row[i].status = "迟到";
              }
              if (res.data.row[i].status == 3) {
                res.data.row[i].status = "早退";
              }

              if (res.data.row[i].sex == 1) {
                res.data.row[i].sex = "男";
              } else if (res.data.row[i].sex == 2) {
                res.data.row[i].sex = "女";
              } else {
                res.data.row[i].sex = "未知";
              }
            }
          }
          this.tableData = res.data.row;
          this.total = parseInt(res.data.page.total);
        });
    },
    //时间改变
    startDatetimeChange() {
      if (this.start_time == null || this.end_time == "") return;
      var start = this.$tools.formatDate(
        this.start_time.toString(),
        "yyyyMMdd"
      );
      var end = this.$tools.formatDate(this.end_time.toString(), "yyyyMMdd");
      if (start > end) {
        this.$message.error("开始日期不能大于结束日期！");
        this.start_time = this.end_time;
      }
    },
    endDatetimeChange() {
      if (this.start_time == "" || this.end_time == null) return;
      var start = this.$tools.formatDate(
        this.start_time.toString(),
        "yyyyMMdd"
      );
      var end = this.$tools.formatDate(this.end_time.toString(), "yyyyMMdd");
      if (start > end) {
        this.$message.error("开始日期不能大于结束日期！");
        this.start_time = this.end_time;
      }
    },
    exportDatetimeChange() {
      if (this.export_start == null || this.export_end == "") return;
      var start = this.$tools.formatDate(
        this.export_start.toString(),
        "yyyyMMdd"
      );
      var end = this.$tools.formatDate(this.export_end.toString(), "yyyyMMdd");
      if (start > end) {
        this.$message.error("开始日期不能大于结束日期！");
        this.export_start = this.export_end;
      }
    },
    exportendDatetimeChange() {
      if (this.export_start == "" || this.export_end == null) return;
      var start = this.$tools.formatDate(
        this.export_start.toString(),
        "yyyyMMdd"
      );
      var end = this.$tools.formatDate(this.export_end.toString(), "yyyyMMdd");
      if (start > end) {
        this.$message.error("开始日期不能大于结束日期！");
        this.export_start = this.export_end;
      }
    },
    update() {
      this.start_time = "";
      (this.end_time = ""), (this.status = "");
      this.req();
    },
    pageChange(current) {
      this.page_number = current;
      this.req();
    },
    searchChange() {
      if (this.start_time != "") {
        this.start_time = this.$tools.formatDate(
          this.start_time.toString(),
          "yyyy-MM-dd"
        );
      }
      if (this.end_time != "") {
        this.end_time = this.$tools.formatDate(
          this.end_time.toString(),
          "yyyy-MM-dd"
        );
      }
      this.req();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.status === value;
    },
    //显示导出
    exprotShow() {
      this.dialogFormVisibleExport = true;
      this.export_start = "";
      this.export_end = "";
    },
    //导出
    exprotfn() {
      if (this.export_start == "") {
        this.$message.error("请选择开始日期！");
        return;
      }
      if (this.export_end == "") {
        this.$message.error("请选择结束日期！");
        return;
      }
      this.$tools.exportFile("/SchoolStaffAtt/excel", {
        token: localStorage.jxtoken,
        page_number: this.page_number,
        page_size: this.page_size,
        sort: this.sort,
        order: this.order,
        status: "",
        start_time: this.$tools.formatDate(
          this.export_start.toString(),
          "yyyyMMdd"
        ),
        end_time: this.$tools.formatDate(this.export_end.toString(), "yyyyMMdd")
      });
      // .then(res=>{
      //     this.dialogFormVisibleExport = false
      // })
      // .catch(res=>{
      //     this.$message.error(res.info);
      //     this.dialogFormVisibleExport = false
      // })
    }
  }
};
</script>
<style lang="less" scoped>
.topRight {
  position: absolute;
  top: 0;
  right: 10px;
}
</style>

