<template>
    <div>
        <I-table
        title="教学任务生成"    
        :isUpdate="true"
        :isBack="false"
        @update="init">
            <template slot="head">
                    <el-select v-model="qryForm.teaching_subject_id" filterable default-first-option placeholder="请选择教学科目" @change="selectChangeForSubject" style="width: 150px;">
                        <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="qryForm.grade_id" filterable default-first-option placeholder="请选择年级" style="width: 150px;">
                        <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="qryForm.status" placeholder="请选择状态" style="width: 150px;">
                        <el-option label="全部"   value=""></el-option>
                        <el-option label="已停用" value="0"></el-option>
                        <el-option label="已启用" value="1"></el-option>
                    </el-select>
                    <el-button size="smail" type="primary" class="confirm" @click="doSearch">查询</el-button>
                    <el-button size="smail" type="primary" @click="btnClickForAdd">新增</el-button>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    style="width: 100%"
                    row-class-name="table-row"
                    :height="props.maxHeight"
                    :data="tableData"
                    @sort-change="sortChange">
                        <!-- <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column> -->
                        <el-table-column
                        prop="subject"
                        label="科目"></el-table-column>
                        <el-table-column
                        prop="grade_name"
                        label="年级"></el-table-column>
                        <el-table-column
                        prop="total_class_hour"
                        label="总课时"></el-table-column>
                        <el-table-column
                        prop="teaching_week"
                        label="上课周数"></el-table-column>
                        <el-table-column
                        prop="status"
                        label="状态"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button @click="btnClickForEdit(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small" @click="btnClickForDel(scope.row)">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 新增 -->
                <I-table-editor v-model="dialogFormVisible" 
                :title="addAndEditForm.title">
                    <template slot="content">
                        <div class="item">
                            <label class="titles">科目：</label>
                            <el-select v-model="addAndEditForm.teaching_subject_id" placeholder="请选择教学科目" @change="selectChangeForSubjectAddAndEdit">
                                <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <label class="titles">年级：</label>
                            <el-select v-model="addAndEditForm.grade_id" placeholder="请选择年级">
                                <el-option v-for="(item,index) in addAndEditForm.gradeList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                        <div class="item">
                            <label class="titles">总课时数：</label>
                            <el-input :maxlength="3" v-model="addAndEditForm.total_class_hour" placeholder="请输入0-500的数字"></el-input>
                            <label class="titles">上课周数：</label>
                            <el-input :maxlength="2" v-model="addAndEditForm.teaching_week" placeholder="请输入0-50的数字"></el-input>
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="btnClickForAddAndEditYes">确 定</el-button>
                    </template>
                </I-table-editor>
                    <!-- 删除 -->
                <I-table-editor v-model="deleteDialogVisible" 
                title="删除">
                    <template slot="content">
                        <div class="outportaddr-group">是否确定删除该教学任务？</div>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="deleteDialogVisible = false">取 消</el-button>
                        <el-button type="success"
                        @click="btnClickForDelYes">确 定</el-button>
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
            deleteDialogVisible:false,
            formLabelWidth: '100px',
            addImg:'../static/imgs/addBtn.png',
            pageIndex: 1,
            pageSize:10,
            total:1,
            allData:[],     //接口未分页，前端兼容分页 - 后续删除
            qryForm:{
                token:this.$tools.getToken(),
                teaching_subject_id:"",
                school_id:localStorage.jxschool_id,
                grade_id:"",
                //status:"",   //全部,0停用，1启用
                page_number:this.current,
                page_size:999999999
            },
            addAndEditForm:{
                title:"新增教学任务生成",
                token:this.$tools.getToken(),
                teaching_subject_id:"",     // 	科目id
                grade_id:"",                // 	年级id
                total_class_hour:"",        // 	总课时数
                teaching_week:"",           // 	上课周数
                school_id:localStorage.jxschool_id,              // 	学校id
                id:"",                      // 	任务生成id，主键
                gradeList:[],               //  科目-联动年级列表
            },
            waitForDelJson:{},              //待删除对象
            subjectList:[],     //科目及对应年级列表{label:,value:,gradeList:[{label:,value:}]}
            gradeList:[],       //科目对应的年级列表  - 联动
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
            input:"",
            value:""
        };
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        this.init();
    },
    methods: {
        init(){
            this.qryForm.teaching_subject_id = "";
            this.qryForm.grade_id = "";
            // this.qryForm.status = "";

            this.addAndEditForm.title = "";
            this.addAndEditForm.teaching_subject_id = "";
            this.addAndEditForm.grade_id = "";
            this.addAndEditForm.total_class_hour="";
            this.addAndEditForm.teaching_week = "";
            this.addAndEditForm.id ="";

            //获取科目列表  - 及年级列表
            this.subjectList = [];
            this.gradeList = [];
            this.$http.post("/Teaching/lists",{
                token:this.$tools.getToken(),
                school_id:localStorage.jxschool_id,
                grade_id:"",
                subject_id:"",
                page_number:1,
                page_size:999999999
            }).then((res)=>{
                res.data.forEach(e=>{
                    //subjectList:[],     //科目及对应年级列表{label:,value:,gradeList:[{label:,value:}]}
                    var tmpObj = {label:e.subject_name,value:e.subject_id,gradeList:[]};
                    for(let info in e.infos){
                        tmpObj.gradeList.push({label:e.infos[info].grade_name,value:e.infos[info].grade_id});
                    }
                    this.subjectList.push(tmpObj);
                });
            }).catch((res)=>{
            });
            this.doSearch();
        },
        //查询数据
        doSearch(){
             this.$http.post("/Teaching/taskLists",
             this.qryForm).then((res)=>{
                 console.log('res',res)
                this.allData = res.data;
                this.allData.forEach(e=>{
                   if(e.status==""){e.status = "全部";}
                   if(e.status=="0"){e.status = "停用";}
                   if(e.status=="1"){e.status = "启用";}
                });
                //前端分页
                this.total = this.allData.length;
                this.pageChange(this.pageIndex);

            }).catch((res)=>{

            });
        },
        //科目切换 - 锁定年级列表
        selectChangeForSubject(){
            console.log(this.qryForm.teaching_subject_id);
            this.gradeList = [];
            this.qryForm.grade_id  = null;
            this.subjectList.forEach(e=>{
                if(e.value==this.qryForm.teaching_subject_id){
                    e.gradeList.forEach(ec=>{
                        console.log(JSON.stringify(ec));
                        if(ec.label==null)ec.label = "null";
                        this.gradeList.push({label:ec.label,value:ec.value});
                    });
                }
            });
            if(this.gradeList.length>0){
                this.qryForm.grade_id = this.gradeList[0].value;
            }
            this.doSearch();
        },
        //添加&编辑界面 科目切换
        selectChangeForSubjectAddAndEdit(){
            this.addAndEditForm.gradeList = [];
            this.subjectList.forEach(e=>{
                if(e.value==this.addAndEditForm.teaching_subject_id){
                    e.gradeList.forEach(ec=>{
                        console.log(JSON.stringify(ec));
                        if(ec.label==null)ec.label = "null";
                        this.addAndEditForm.gradeList.push({label:ec.label,value:ec.value});
                    });
                }
            });
            if(this.addAndEditForm.gradeList.length>0)this.addAndEditForm.grade_id = this.addAndEditForm.gradeList[0].value;
        },
        sortChange({ column, prop, order }) {
            console.log('sortChange', column, prop, order);
        },
        pageChange(current) {
            this.pageIndex = current;
            //前端分页
            this.tableData = this.allData.slice((this.pageIndex-1) * this.pageSize,this.pageIndex* this.pageSize);
        },
        //新增 - 进入
        btnClickForAdd(){
            this.addAndEditForm.title = "新增教学任务";
            this.addAndEditForm.teaching_subject_id = "";
            this.addAndEditForm.grade_id = "";
            this.addAndEditForm.total_class_hour="";
            this.addAndEditForm.teaching_week = "";
            this.addAndEditForm.id ="";
            this.dialogFormVisible = true;
        },
        //编辑 - 进入
        btnClickForEdit(obj){
            // console.log("obj",obj)
            this.subjectList.forEach(e=>{
                if(obj.teaching_subject_id==e.value){
                    this.addAndEditForm.gradeList = e.gradeList
                }
            });
            this.addAndEditForm.title = "编辑教学任务";//[ " + obj.subject; + " ]";
            this.addAndEditForm.teaching_subject_id = obj.teaching_subject_id;
            this.addAndEditForm.grade_id =  obj.grade_id;
            this.addAndEditForm.total_class_hour= obj.total_class_hour;
            this.addAndEditForm.teaching_week =  obj.teaching_week;
            this.addAndEditForm.id = obj.id;
            this.dialogFormVisible = true;
        },
        //新增 & 编辑 - 确定
        btnClickForAddAndEditYes(){
            if(this.addAndEditForm.teaching_subject_id.length == '') {
                this.$message.error('请选择科目!');
                return;
            }
            if(this.addAndEditForm.grade_id.length == '') {
                this.$message.error('请选择年级!');
                return;
            }
            if(this.addAndEditForm.total_class_hour.trim() == "" || this.addAndEditForm.total_class_hour.toString().trim() == "") {
                this.$message.error('请输入总课时数!');
                return;
            }
            if(this.addAndEditForm.teaching_week.trim() == "" || this.addAndEditForm.teaching_week.toString().trim() == "") {
                this.$message.error('请输入上课周数时数!');
                return;
            }
            if(isNaN(this.addAndEditForm.total_class_hour)){
                this.$message.error("总课时必须为数字，并且不能超过500");
                return;
            }
            if(this.addAndEditForm.total_class_hour<0 || this.addAndEditForm.total_class_hour>500){
                this.$message.error("总课时必须为数字，并且不能超过500");
                return;
            }
            if(isNaN(this.addAndEditForm.teaching_week)){
                this.$message.error("周课时必须为数字，并且不能超过50");
                return;
            }
            if(this.addAndEditForm.teaching_week<0 || this.addAndEditForm.teaching_week>500){
                this.$message.error("周课时必须为数字，并且不能超过50");
                return;
            }
            this.$http.post("/Teaching/saveTask",{
                token:this.addAndEditForm.token,
                teaching_subject_id:this.addAndEditForm.teaching_subject_id,
                grade_id:this.addAndEditForm.grade_id,
                total_class_hour:this.addAndEditForm.total_class_hour,
                teaching_week:this.addAndEditForm.teaching_week,
                school_id:this.addAndEditForm.school_id,
                id:this.addAndEditForm.id
            }).then((res)=>{
                this.$message.success(res.info);
                this.dialogFormVisible = false;
                this.doSearch();
            }).catch((res)=>{
            });
        },
        //删除 - 进入
        btnClickForDel(obj){
            if(obj.status=="启用"){
                this.$message.error("该任务已启用，请在学期结束后进行删除！");
                return;
            }
            this.waitForDelJson = obj;
            this.deleteDialogVisible = true;
        },
        //删除 - 确定
        btnClickForDelYes(){
             this.$http.post("/Teaching/deleteTask",{
                token:this.$tools.getToken(),
                id_str:this.waitForDelJson.id,
                school_id:this.addAndEditForm.school_id
            }).then((res)=>{
                this.$message.success(res.info);
                this.deleteDialogVisible = false;
                this.waitForDelJson = {};
                this.doSearch();
            }).catch((res)=>{

            });
        },
        //删除
        deletefn() {
            this.deleteDialogVisible = true;
        },
        //编辑
        handleClick() {
            this.dialogFormVisible = true;
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
    .el-button--text:focus, .el-button--text:hover {
    	background: #409EFF;
    	color:#fff;
    }
    .item {
        margin-bottom: 20px;
        .el-input,.el-select {
            width: 160px;
        }
        .titles {
            width: 70px;
            display: inline-block;
            text-align: right;
        }
    }
    
</style>
