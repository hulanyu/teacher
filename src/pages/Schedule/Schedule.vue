<template>
    <div>
        <I-table
        title="课表详情"
        :isUpdate="false">
            <template slot="head">
                <label>课程查看：</label>
                <el-form style="display:inline-block;margin-right:20px;">
                    <el-form-item label="">
                        <el-radio-group @change="searchChange" v-model="radio">
                        <el-radio label="1">教师课表</el-radio>
                        <el-radio label="2">班级课表</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <el-autocomplete
                v-if="radio == 1"
                v-model="queryString"
                :maxlength="10"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入教师姓名"
                @select="handleSelect"
                ></el-autocomplete>
                <el-select @change="searchClass" filterable v-model="classId" placeholder="选择班级" v-if="radio == 2">
                    <el-option
                    v-for="(item,index) in classOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button size="smail" type="primary" class="confirm" @click="searchFn">查询</el-button>
                <div class="right">
                    <!-- <el-button size="smail" type="primary" class="confirm">导入课表</el-button> -->
                    <el-button size="smail" type="primary" @click="exportFn">导出课表</el-button>
                </div>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    :span-method="arraySpanMethod"
                    style="width: 100%"
                    row-class-name="table-row"
                    :height="props.maxHeight"
                    :data="tableData">
                        <el-table-column
                        prop="time"
                        label=""></el-table-column>
                        <el-table-column
                        prop="section"
                        label="节次/课程"></el-table-column>
                        <el-table-column
                        prop="col1"
                        label="星期一"></el-table-column>
                        <el-table-column
                        prop="col2"
                        label="星期二"></el-table-column>
                        <el-table-column
                        prop="col3"
                        label="星期三"></el-table-column>
                        <el-table-column
                        prop="col4"
                        label="星期四"></el-table-column>
                        <el-table-column
                        prop="col5"
                        label="星期五"></el-table-column>
                        <el-table-column
                        prop="col6"
                        label="星期六"></el-table-column>
                    </el-table>
            </template>
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import config from '@/config.js'
export default {
    data() {
        return {
            radio:'1',
            searchInput:"",
            dialogFormVisible: false,
            deleteDialogVisible:false,
            dialogFormVisibleupload:false,
            formLabelWidth: '100px',
            addImg:'../static/imgs/addBtn.png',
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            tableData: [],
            classOptions:[],
            classId:"",
            search: '',
            flag:true,
            current: 1,
            teacherId:"",
            teacherIdData:[],
            queryString:localStorage.jxname
        };
    },
    components: {
        ITable,
        ITableEditor,
    },
    mounted () {
        this.getTeacherId()
        this.getClasses()
    },
    methods: {
        //点击查询
        searchFn() {
            if(this.radio == 1) {
                if(this.teacherId != '') {
                    this.req()
                }
            }
            if(this.radio == 2) {
                if(this.classId != "") {
                    this.reqClass()
                }
            }
        },
        //导出
        exportFn() {
            if(this.radio == 1) {
                if(this.teacherId != '') {
                    // this.$tools.exportFile('/TimeTable/export', {
                    //     staff_id:this.teacherId,
                    //     token:localStorage.jxtoken
                    // })
                    window.open(config.BASEURL+'/TimeTable/export?staff_id='+this.teacherId+'&token='+this.jxtoken)
                }
            }
            if(this.radio == 2) {
                if(this.classId != "") {
                    window.open(config.BASEURL+'/TimeTable/export?class_id='+this.classId+'&token='+this.jxtoken)
                }
            }
        },
        //输入搜索
        querySearchAsync(queryString, cb) {
            console.log(queryString)
            if(queryString != "") {
                this.queryString = queryString
                this.$http.post('/Staff/search', {
                    token: localStorage.jxtoken,
                    name: this.queryString
                },{showLoading:false})
                .then((res) => {
                    this.teacherIdData = []
                    if(res.data.length > 0) {
                        for(let i=0;i<res.data.length;i++) {
                            this.teacherIdData[i] = {}
                            this.teacherIdData[i].value = res.data[i].name
                            this.teacherIdData[i].id = res.data[i].id
                        }
                    }
                    cb(this.teacherIdData)
                })
                .catch(res=>{
                    this.$message.error(res.info)
                })
            }
        },
        //点击教师下拉选中
        handleSelect(item) {
            console.log(item.id)
            this.teacherId = item.id
            this.req()
        },
        //点击班级下拉框
        searchClass() {
            this.reqClass()
        },
        //获取教师id
        getTeacherId() {
            this.$http.post('/Staff/search', {
                token: localStorage.jxtoken,
                name: this.queryString
            })
            .then((res) => {
                console.log(res.data[0].id)
                if(this.flag) {
                    this.teacherId = res.data[0].id
                    this.req()
                    this.flag = false
                }
                this.teacherIdData = res.data
            })
            .catch(res=>{
                this.$message.error(res.info)
            })
        },
        //获取班级列表
        getClasses() {
            this.$http.post('/SchoolClass/lists', {
                token:localStorage.jxtoken,
                page_number:1,
                page_size:50
            })
            .then((res) => {
                console.log(res.data)
                this.classOptions = []
                for(let i=0;i<res.data.row.length;i++) {
                    this.classOptions[i] = {}
                    this.classOptions[i].value = res.data.row[i].id
                    this.classOptions[i].label = res.data.row[i].grade + res.data.row[i].class
                }
            })
            .catch(res=>{
                this.$message.error(res.info)
            })
        },
        //点击课程查看修改
        searchChange() {
            console.log(this.radio)
            if(this.radio == 1 && this.teacherId !="") {
                this.req();
            }else if(this.radio == 2 && this.classId!="") {
                this.reqClass();
            }else{
                this.tableData = [];
            }
        },
        //查看教师课表
        req() {
            this.tableData = []
            this.$http.post('/TimeTable/index', {
                token: localStorage.jxtoken,
                staff_id: this.teacherId
            })
            .then((res) => {
                var node1=[],node2=[],node3=[],node4=[];
                res.data.forEach(row=>{
                    let rowObj = {time:"",section:"",col1:"",col2:"",col3:"",col4:"",col5:"",col6:"",rowspan:1,colspan:1,spanIndex:0};
                    // console.log(row);
                    for(let index in row){
                         const colItem = row[index];
                         if(index==1){rowObj.time = colItem.type;rowObj.section = colItem.section;}
                         rowObj["col" + index] = colItem.subject_name + " " +  ((colItem.class==undefined || colItem.class==null)?"":colItem.class);
                         console.log(JSON.stringify(rowObj));
                    }
                    
                    if(rowObj.time=="早自习")node1.push(rowObj);
                    if(rowObj.time=="上午")node2.push(rowObj);
                    if(rowObj.time=="下午")node3.push(rowObj);
                    if(rowObj.time=="晚自习")node4.push(rowObj);
                });
                for (let k = 0; k < node1.length; k++) {
                        const element = node1[k];
                        element.spanIndex = k;
                        if(k==0){element.rowspan = node1.length;}else{  element.time  = element.section;}
                    }
                for (let k = 0; k < node2.length; k++) {
                    const element = node2[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node2.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node3.length; k++) {
                    const element = node3[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node3.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node4.length; k++) {
                    const element = node4[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node4.length;}else{element.time  = element.section;}
                }
                this.tableData = Array.concat(node1,node2,node3,node4);
            })
            .catch(res=>{
                this.$message.error(res.info)
            })
        },
        //查看班级课表
        reqClass() {
            this.tableData = []
            this.$http.post('/TimeTable/index', {
                token: localStorage.jxtoken,
                class_id: this.classId
            })
            .then((res) => {
                var node1=[],node2=[],node3=[],node4=[];
                res.data.forEach(row=>{
                    let rowObj = {time:"",section:"",col1:"",col2:"",col3:"",col4:"",col5:"",col6:"",rowspan:1,colspan:1,spanIndex:0};
                    for(let index in row){
                         const colItem = row[index];
                         if(index==1){rowObj.time = colItem.type;rowObj.section = colItem.section;}
                         rowObj["col" + index] = colItem.subject_name + " " +  colItem.name
                    }
                    if(rowObj.time=="早自习")node1.push(rowObj);
                    if(rowObj.time=="上午")node2.push(rowObj);
                    if(rowObj.time=="下午")node3.push(rowObj);
                    if(rowObj.time=="晚自习")node4.push(rowObj);
                });
                for (let k = 0; k < node1.length; k++) {
                    const element = node1[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node1.length;}else{  element.time  = element.section;}
                }
                for (let k = 0; k < node2.length; k++) {
                    const element = node2[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node2.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node3.length; k++) {
                    const element = node3[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node3.length;}else{element.time  = element.section;}
                }
                    for (let k = 0; k < node4.length; k++) {
                    const element = node4[k];
                    element.spanIndex = k;
                    if(k==0){element.rowspan = node4.length;}else{element.time  = element.section;}
                }
                this.tableData = Array.concat(this.tableData,node1,node2,node3,node4);
            })
            .catch(res=>{
                this.$message.error(res.info)
            })
        },
        //合并单元格
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if(columnIndex == 0){
                return [row.rowspan,row.colspan];
            }else if(columnIndex==1 && row.spanIndex>0  && row.time == row.section) {
                 return [0,0];
            }
        }
    }
}
</script>
<style scoped lang="less">
    .el-button--text {
        padding:5px;
        background: #409EFF;
        color:white;
    }
    .item{
        margin-bottom: 20px;
        .el-input {
            width: 250px;
        }
        .upload-demo {
            display: inline;
        }
    }
    .el-input {
        margin:0 20px;
    }
    .right {
        position: absolute;
        right: 10px;
        top:0;
    } 
</style>
