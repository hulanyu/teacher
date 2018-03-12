<template>
  <I-table
  title="学生考勤记录"
  @update="update">
      <template slot="head">
            <el-date-picker
            v-model="start_time"
            type="date"
            placeholder="选择日期"
            @change="startDatetimeChange">
            </el-date-picker>
            <el-date-picker
            v-model="end_time"
            type="date"
            placeholder="选择日期"
            @change="endDatetimeChange">
            </el-date-picker>
            <el-button size="primary"
            @click="searchChange">查询</el-button>
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
                label="学生名称"></el-table-column>
                <el-table-column
                prop="student_no"
                label="学号"></el-table-column>
                <el-table-column
                prop="class"
                label="年级班级"></el-table-column>
                <el-table-column
                prop="staff_name"
                label="班主任"></el-table-column>
                <el-table-column
                prop="device_name"
                label="终端"></el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                width="100"
                :filters="[{ text: '正常', value: '正常' }, { text: '异常', value: '异常' }, { text: '未打卡', value: '未打卡' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.status === '正常' ? 'primary' : 'danger'"
                    close-transition>{{scope.row.status}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                prop="create_time"
                label="考勤时间"></el-table-column>
            </el-table>
      </template>
      <template slot="foot">
          <I-table-page
          :total="total"
          @change="pageChange"></I-table-page>
      </template>
  </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'

export default {
    data() {
        return {
            tableData: [],
            options:[
                {
                    id:1,
                    name:"正常"
                },
                {
                    id:2,
                    name:"异常"
                },
                {
                    id:0,
                    name:"未打卡"
                },
            ],
            page_number:1,
            page_size:10,
            sort:'',
            order:"",
            start_time:'',
            end_time:'',
            search: '',
            status:"",
            current: 1,
            startDatetime: '',
            endDatetime: '',
            total:0
        };
    },
    components: {
        ITable,
        ITablePage,
    },
    mounted () {
        this.req()
    },
    methods: {
        req() {
            this.tableData = []
            this.$http.post('/SchoolStudentsAtt/att', {
                token: localStorage.jxtoken,
                page_number: this.page_number,
                page_size: this.page_size,
                sort: this.sort,
                order: this.order,
                status: this.status,
                start_time:this.start_time,
                end_time:this.end_time
            })
            .then((res) => {
                console.log(res);
                if(this.page_number > 1) {
                    if(!res.data) {
                        this.page_number = this.page_number - 1
                        this.req()
                    }
                }
                if(res.data.row.length > 0) {
                    for(let i=0;i<res.data.row.length;i++) {
                        if(res.data.row[i].create_time != 0) {
                            res.data.row[i].create_time = this.$tools.formatDate(parseInt(res.data.row[i].create_time));
                        }else {
                            res.data.row[i].create_time = '/'
                        }
                        
                        if(res.data.row[i].status == 1) {
                            res.data.row[i].status = '正常'
                        }
                        if(res.data.row[i].status == 2) {
                            res.data.row[i].status = '异常'
                        }
                        if(res.data.row[i].status == 0) {
                            res.data.row[i].status = '未打卡'
                        }
                    }
                    this.tableData = res.data.row
                    this.total = parseInt(res.data.page.total)
                }
            });
        },
        //时间改变
        startDatetimeChange() {
            if(this.start_time==null || this.end_time=="")return;
            var start = this.$tools.formatDate(this.start_time.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.end_time.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('开始日期不能大于开始日期！');
                this.start_time = this.end_time;
            }
        },
        endDatetimeChange() {
            if(this.start_time=="" || this.end_time==null)return;
            var start = this.$tools.formatDate(this.start_time.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.end_time.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('开始日期不能大于开始日期！');
                this.start_time = this.end_time;
            }
        },
        update() {
            this.start_time = ''
            this.end_time = '',
            this.status = ''
            this.req()
        },
        pageChange(current) {
            this.page_number = current
            this.req()
        },
        searchChange() {
            if(this.start_time != '') {
                this.start_time = this.$tools.formatDate(this.start_time.toString(),"yyyy-MM-dd")
            }
            if(this.end_time != '') {
                this.end_time = this.$tools.formatDate(this.end_time.toString(),"yyyy-MM-dd")
            }
            this.req()
        },
        formatter(row, column) {
            return row.address;
        },
        filterTag(value, row) {
            return row.status === value;
        }
    }
}
</script>
<style lang="less" scoped>
.topRight {
    position: absolute;
    top:0;
    right:10px;
}
</style>

