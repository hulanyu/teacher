<template>
    <div>
        <I-table
        title="教学科目管理"
        :isUpdate="true"
        :isBack="false"
        @update="init">
            <template slot="head">
                <el-button size="smail" type="primary" @click="btnClickForAdd">新增教学科目</el-button>
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
                        prop="subject_name"
                        label="科目"></el-table-column>
                        <el-table-column
                        sortable
                        prop="gradeNameStr"
                        label="年级"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button @click="btnClickForEdit(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small" @click="btnClickForDel(scope.row)">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 新增 & 编辑 -->
                <I-table-editor v-model="dialogFormVisible" :title="form.operTitle" width="660px">
                    <template slot="content">
                        <el-form>
                            <el-form-item label="科目名称:" :label-width="formLabelWidth">
                                <el-input v-model="form.subject_name" placeholder="请输入科目名称" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="年级：" :label-width="formLabelWidth">
                            <el-select v-model="form.grade_ids" placeholder="请选择年级" multiple style="width:520px;">
                                <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            </el-form-item>
                            <!-- <img class="addImg" :src="addImg" alt="" @click="btnClickForAddGradeItem"> -->
                        </el-form>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="btnClickForAddYes">确 定</el-button>
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
                        @click="btnClickForDelYes">确 定</el-button>
                    </template>
                </I-table-editor>
                

            </template>
            <!-- <template slot="foot">
                <I-table-page
                :total="1"
                @change="pageChange"></I-table-page>
            </template> -->
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
            gradeList:[],       //年级列表
            //查询提交参数结构体
            qryForm:{
                token:this.$tools.getToken(),
                school_id:localStorage.jxschool_id,
                grade_id:"",
                subject_id:"",
                page_number:this.current
            },
            form: {
                id:'',
                operTitle:"新增科目",   //新增编辑界面-标题
                subject_name:"",
                grade_ids:[],
                school_id:localStorage.jxschool_id,
                teaching_subject_id:""
            },
            deleteTitle:"",
            tableData: [],
            search: '',
            current: 1
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
            //获得所有的年级列表
            //获得年级列表
            this.gradeList = [];
            this.$http.post("/SchoolGrade/lists ",{
                token:this.$tools.getToken(),
                page_number:1,
                page_size:9999,
                sort:"",
                order:"asc"
            })
            .then((res)=>{
                res.data.row.forEach(element => {
                    this.gradeList.push({label:element.grade,value:element.id});
                }); 
            });
            //获得教学科目列表
            this.tableData = [];
            this.subjectList = [];
            this.$http.post("/Teaching/lists",{
                token:this.$tools.getToken(),
                school_id:localStorage.jxschool_id,
                grade_id:"",
                subject_id:"",
                page_number:1,
                page_size:999999999
            }).then((res)=>{
                console.log('res',res)
                res.data.forEach(e=>{
                    var tmpObj = {id:e.id,subject_id:e.subject_id,subject_name:e.subject_name,gradeIdStr:"",gradeNameStr:"",gradeIdList:[],gradeNameList:[]};
                    for(let info in e.infos){
                        tmpObj.gradeIdList.push(e.infos[info].grade_id);
                        tmpObj.gradeNameList.push(e.infos[info].grade_name);
                    }
                    tmpObj.gradeIdStr = tmpObj.gradeIdList.join("/")
                    tmpObj.gradeNameStr = tmpObj.gradeNameList.join("/");
                    this.tableData.push(tmpObj);
                });
            }).catch((res)=>{
            });
        },
        sortChange({ column, prop, order }) {
            console.log('sortChange', column, prop, order);
        },
        pageChange(current) {
            this.current = current
        },
        //新增进入
        btnClickForAdd(){
            this.form.operTitle = "新增教学科目";
            this.form.grade_ids=[];
            this.form.subject_name = "";
            this.dialogFormVisible = true;
            this.form.teaching_subject_id = "";
        },
        //新增&&编辑 - 确定
        btnClickForAddYes(){
            if(this.form.subject_name.trim() == "" || this.form.subject_name.toString().trim() == "") {
                this.$message.error('请输入科目名称!');
                return;
            }
            if(this.form.grade_ids.length == 0) {
                this.$message.error('请选择年级!');
                return;
            }
            this.$http.post("/Teaching/save ",{
                token:this.qryForm.token,
                school_id:this.qryForm.school_id,
                subject_name:this.form.subject_name,
                grade_ids:this.form.grade_ids.join(","),
                teaching_subject_id:this.form.subject_id
            })
            .then((res)=>{
                this.$message.success('操作成功');
                this.form.grade_ids=[];
                this.form.subject_name = "";
                this.form.operTitle = "新增教学科目";
                this.form.teaching_subject_id = "";
                this.dialogFormVisible = false;
                this.init();
            })
            .catch((res)=>{
            });
        },
        //进入编辑
        btnClickForEdit(row) {
            this.form.operTitle = "编辑教学科目";//[" + row.subject_name + "]";
            this.form.teaching_subject_id = row.subject_id;
            this.form.subject_name = row.subject_name;
            this.form.grade_ids = row.gradeIdList;
            this.form.subject_id = row.subject_id
            this.dialogFormVisible = true;
        },
        //删除
        btnClickForDel(row) {
            this.deleteTitle = row.subject_name
            this.form.teaching_subject_id = row.subject_id;
            this.deleteDialogVisible = true;
        },
        //删除 - 确定
        btnClickForDelYes() {
            this.$http.post("/Teaching/delete",{
                token:this.qryForm.token,
                school_id:this.qryForm.school_id,
                teaching_subject_id:this.form.teaching_subject_id
            })
            .then((res)=>{
                this.form.teaching_subject_id = "";
                this.deleteDialogVisible = false;
                this.init();
            });
        },
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
    .addImg {
        position: absolute;
        bottom: 125px;
        left:350px;
        cursor: pointer;
    }
</style>
