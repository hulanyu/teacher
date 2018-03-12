<template>
  <I-table
  title="消费记录"
  @update="init">
      <template slot="head">
            <el-date-picker
            v-model="startDatetime"
            type="date"
            placeholder="开始日期"
            :picker-options="startDatetimePickerOptions"
            :editable="false"
            @change="startDatetimeChange">
            </el-date-picker>
            <el-date-picker
            v-model="endDatetime"
            type="date"
            placeholder="结束日期"
            :picker-options="endDateTimePickerOptions"
            :editable="false"
            @change="endDatetimeChange">
            </el-date-picker>
            <el-input v-model="search" size="smail" placeholder="请输入姓名" style="width:150px;"></el-input>
            <el-button size="primary"
            @click="searchChange">查询</el-button>
            <el-button size="smail" @click="exportFn" style="background-color: #41cac0;color: #fff;">导出消费记录</el-button>
      </template>
      <template slot="content" slot-scope="props">
            <el-table
            border
            row-class-name="table-row"
            :height="props.maxHeight"
            :data="tableData"
            @sort-change="sortChange">
                <el-table-column
                prop="name"
                label="学生名称"></el-table-column>
                <el-table-column
                sortable
                prop="class_name"
                label="班级"></el-table-column>
                <el-table-column
                prop="money"
                label="消费金额"></el-table-column>
                <el-table-column
                prop="create_datetime"
                label="消费时间"></el-table-column>
                <el-table-column
                prop="machine_sn"
                sortable=""
                label="消费终端"></el-table-column>
            </el-table>
      </template>
      <template slot="foot">
          <I-table-page v-model="page_number"
          :total="total_page"
          @change="pageChange"></I-table-page>
      </template>
  </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import config from '@/config'

export default {
    data() {
        return {
            startDatetimePickerOptions:{
                disabledDate(time) {return time.getTime() > Date.now();}
            },
            endDateTimePickerOptions:{
                disabledDate(time) {return time.getTime() > Date.now();}
            },
            tableData: [],
            search: '',
            startDatetime: this.$tools.formatDate(new Date().getTime()/1000 - 6*60*60*24,'yyyy-MM-dd'),
            endDatetime: this.$tools.formatDate(new Date().getTime()/1000,'yyyy-MM-dd'),
            page_number:1,
            page_size:10,
            sort:"",
            order:"",
            total_page:0
        };
    },
    components: {
        ITable,
        ITablePage,
    },
    mounted () {
        this.init();
    },
    methods: {
        init() {
            this.startDatetime = this.$tools.formatDate(new Date().getTime()/1000 - 6*60*60*24,'yyyy-MM-dd');
            this.endDatetime = this.$tools.formatDate(new Date().getTime()/1000,'yyyy-MM-dd');
            this.search="";
            this.sort="";
            this.page_current=1;
            this.page_size=10;
            this.order=0;
            this.total_page=0;
            //执行查询
            this.searchChange();
        },
        //时间改变
        startDatetimeChange() {
            console.log(this.startDatetime);
            if(this.endDatetime=="" || this.endDatetime==null)return;
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('开始日期不能大于开始日期！');
                this.startDatetime = this.endDatetime;
            }
        },
        endDatetimeChange() {
            if(this.startDatetime=="" || this.startDatetime==null)return;
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('结束日期不能小于开始日期！');
                this.startDatetime = this.endDatetime;
            }
        },
        sortChange({ column, prop, order }) {
            this.sort = column.property
            if(column.order == 'ascending') {
                this.order = 'asc'
            }else if(column.order == 'descending') {
                this.order = 'desc'
            }
            this.searchChange();
        },
        pageChange(current) {
            this.page_number = current
            this.searchChange()
        },
        searchChange() {
            this.$http.post('/ShopLog/index', {
                sort: this.sort,
                order: this.order,
                page_number: this.page_number,
                page_size: this.page_size,
                token:localStorage.jxtoken,
                start_date:this.$tools.formatDate(this.startDatetime.toString(),"yyyy-MM-dd"),
                end_date:this.$tools.formatDate(this.endDatetime.toString(),"yyyy-MM-dd"),
                search:this.search,
            })
            .then((res) => {
                console.log(res)
                if(res.data.rows) {
                    res.data.rows.forEach(e => {
                    e.create_datetime = this.$tools.formatDate(e.create_datetime,"yyyy-MM-dd hh:mm:ss");
                    });
                    this.tableData = res.data.rows;
                    this.total_page = parseInt(res.data.page.total);
                }else {
                    this.page_number = 1
                    this.total_page = 1
                    this.tableData = []
                }
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //导出消费记录
        exportFn() {
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyy-MM-dd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyy-MM-dd");
            this.$tools.exportFile('/ShopLog/export', {
                start_date:start,
                end_date:end,
                search:this.search,
                token:localStorage.jxtoken
            },{type: 'get'});
            
            // window.open(config.BASEURL+"/ShopLog/export?token="+localStorage.jxtoken+"&start_date="+
            // start+"&end_date="+end+"&search="+this.search);
        }
    }
}
</script>

