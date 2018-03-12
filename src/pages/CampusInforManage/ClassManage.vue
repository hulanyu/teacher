<template>
    <div>
        <I-table
        title="班级管理"
		:isUpdate="false"
        >
            <template slot="head">
                    <div>
                        <el-button size="medium" type="success" class="confirm addbtn" @click="addbtn">新增</el-button>
                        <el-button size="medium" type="primary" @click="refresh">刷新</el-button>
                    </div>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    :height="props.maxHeight"
                    style="width: 100%;"
                    row-class-name="table-row"
                    :data="tableData"
                    >
                        <el-table-column
                        prop="grade_level"
                        label="入学年份"></el-table-column>
                        <el-table-column
                        prop="grade_title"
                        label="年级名称"></el-table-column>
                        <el-table-column
                        prop="grade"
                        label="所在年级"></el-table-column>
                        <el-table-column
                        prop="class"
                        label="班级"></el-table-column>
                        <el-table-column
                        prop="class_teacher"
                        label="班主任"></el-table-column>
                        <el-table-column
                        prop="create_time"
                        label="创建时间"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="300"
                        >
	                        <template slot-scope="scope">
	                        	<el-button  type="text" size="small" @click="editshow(scope.row)" class="operation_btn">编辑</el-button>
	                            <el-button  type="text" size="small" class="operation_btn" @click="deletebtn(scope.row)">删除</el-button>
	                        </template>
                        </el-table-column>
                    </el-table>
                	<!--新增、编辑班级-->
                	<I-table-editor v-model="dialogFormVisibleAdd" 
                	:title="title" width="500px">
	                   <template slot="content">
	                   		<el-form>
							  <el-form-item label="所在年级:" :label-width="formLabelWidth" :data="gradeListData">
							  	<el-select v-model="form.grade_id" placeholder="请选择" filterable>
							      <el-option v-for="(item,index) in gradeListData" :key="index" :label="item.grade" :value="item.id"></el-option>
							    </el-select>
							  </el-form-item>
							  <el-form-item label="班	级:" :label-width="formLabelWidth">
							    <el-input v-model="form.class"></el-input>
							  </el-form-item>
							  <el-form-item label="班主任:" :label-width="formLabelWidth" :data="leaderData">
							  	<el-select v-model="form.class_teacher" placeholder="请选择" filterable>
							      <el-option v-for="(item,index) in leaderData" :key="index" :label="item.name" :value="item.name"></el-option>
							    </el-select>
							  </el-form-item>
							</el-form>
	                    </template>
	                    <template slot="foot">
	                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
	                        <el-button v-if="isAdd == true" class="confirm" type="success"
	                        @click="addClass">保 存</el-button>
	                        <el-button v-if="isAdd == false" class="confirm" type="success"
	                        @click="addClass">保 存</el-button>
	                    </template>
                	</I-table-editor>
            		<!--删除-->
            		<I-table-editor v-model="dialogFormVisibleDelete" 
	                title="删除" width="500px">
	                    <template slot="content">
	                        <span>是否确定删除？</span>
	                    </template>
	                    <template slot="foot">
	                        <el-button 
	                        @click="dialogFormVisibleDelete = false">取 消</el-button>
	                        <el-button type="success"
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
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
    data() {
        return {
        	page_number:1,
        	sort:"",
        	order:"",
        	deleteId:"",//删除
        	
        	leaderData:"",
			title:"",//新增和编辑标题
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            dialogFormVisibleDetail:false,
            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:true,
            ids:[],//删除
            //搜索参数
            type:"",
            number:"",
            page_size:10,
            total_page:0,
          	//编辑添加参数
            form: {
                id:"",
                grade_id: '',
                class: '',
                class_teacher: ''
            },
            //获取的数据
            tableData: [
                
            ],
            //获取的年级列表数据
            gradeListData: {
            	
            }
        };
    },
    mounted() {
    	this.req();
    	this.getGrade();
    	this.getLeaderName();
    },
    methods: {
    	//刷新
    	refresh() {
            this.req()
        },
        //请求列表数据
        req() {
        	this.$http.post("/SchoolClass/lists",{
        		token: localStorage.jxtoken,
        		page_number: this.page_number,
        		sort: this.sort,
        		order: this.order,
        		page_size: this.page_size,
        	})
        	.then((res) => {
        		console.log(res);
        		if(this.page_number > 1) {
                    if(!res.data) {
                        this.page_number = this.page_number - 1
                        this.req()
                    }
                }
        		this.tableData = res.data.row;
        		for(let i=0;i<this.tableData.length;i++) {
                    this.tableData[i].create_time = this.$tools.formatDate(parseInt(this.tableData[i].create_time));
                }
                this.total_page = parseInt(res.data.page.total)
        	})
        	.catch((res) => {
        		this.$message.error(res.info);
        	})
        },
        //获取班主任
        getLeaderName() {
        	this.$http.post("/Staff/index",{
        		token: localStorage.jxtoken,
        		page_size:999999,
        		page_number:1
        	})
        	.then(res => {
        		this.leaderData = res.data.rows;
        		console.log("教职工数据",this.leaderData);
        	})
        },
        //确定新增班级
        addClass() {
			
        	if(this.form.grade == ""){
        		this.$message.error('请选择所在年级!'); 
        		return;
        	}
        	if(this.form.class.trim() == ""){
        		this.$message.error('请输入所在班级!');
        		return;
        	}
        	if(this.form.class_teacher == "" ){
        		this.$message.error('请输入班主任名字!');
        		return;
			}
        	//提交
        	if(this.isAdd){
        		this.$http.post("/SchoolClass/add",{
					token:localStorage.jxtoken,
					grade_id: this.form.grade_id,
					class: this.form.class,
					class_teacher: this.form.class_teacher
				})
        		.then((res) => {
        			this.$message.success(res.info);
        			this.dialogFormVisibleAdd = false;
        			this.req();
        		})
        		.catch((res) => {
        			this.$message.error(res.info);
        		})
        	} else {
        		this.$http.post("/SchoolClass/edit",{
					token: localStorage.jxtoken,
					grade_id: this.form.grade_id,
					class: this.form.class,
					class_teacher: this.form.class_teacher,
					id: this.form.id
				})
        		.then(res => {
        			this.$message.success(res.info);
        			this.dialogFormVisibleAdd = false;
        			this.req();
        		})
        		.catch(res => {
        			this.$message.error(res.info);
        		})
        	}
        	
        },
        //确认删除
        deleteconfirm() {
        	console.log(this.deleteId);
        	this.$http.post("/SchoolClass/delete",{
        		token: localStorage.jxtoken,
        		id: this.deleteId
        	})
        	.then(res => {
        		this.$message.success(res.info);
        		this.dialogFormVisibleDelete = false;
        		this.req();
        	})
        	.catch(res => {
        		this.$message.error(res.info);
        	})
        },
        //分页显示
        pageChange(current) {
            this.page_number = current
            this.req()
        },
        //显示新增窗口
        addbtn() {
        	this.form = {
				id:"",
                grade_id: '',
                class: '',
                class_teacher: ''
            }
			this.title = "新增班级";
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
        },
        //编辑
        editshow(val) {
			this.title = "编辑班级";
        	console.log(val);
            for (var key in this.form) {
                this.form[key] = val[key];
			}
			console.log(1111,this.form);
            this.isAdd = false;
            this.dialogFormVisibleAdd = true;
        },
        //显示删除窗口
        deletebtn(val) {
        	this.deleteId = val.id;
        	this.dialogFormVisibleDelete = true;
        },
        //获取所在年级
        getGrade () {
        	this.$http.post("/SchoolGrade/lists",{
        		token: localStorage.jxtoken,
        		page_size:999999,
        		page_number:1
        	})
        	.then(res => {
        		this.gradeListData = res.data.row;
        	})
        	.catch(res => {
        		this.$message.error(res.info);
        	})
        }
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    }
}
</script>
<style scoped lang="less">
    .addbtn {
        padding:11px 21px;
    }
    .el-button--text {
        padding:5px;
        background: #409EFF;
        color:#fff;
    }
    .el-button--text:focus, .el-button--text:hover {
    	background: #409EFF;
    	color:#fff;
    }
    .el-form .el-form-item {
    	margin-right:30px;
    	width:80%;
    	margin: 0 auto;
    	margin-bottom: 22px;
	    .el-form-item__label {
	    	width: 90px;
	    }
	    .el-input,.el-select {
	    	width: 217px;
	    }
    }
    .operation_btn {
    	margin-bottom: 0;
    }
</style>
