<template>
    <div>
        <I-table
        title="年级管理"
		:isUpdate="false"
        >
            <template slot="head">
                    <div>
                        <el-button size="medium" type="success" class="confirm addbtn " @click="addShow">新增</el-button>
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
                        prop="grade"
                        label="所在年级"></el-table-column>
                        <el-table-column
                        prop="grade_type_title"
                        label="教育阶段"></el-table-column>
                        <el-table-column
                        prop="school_length_title"
                        label="学制"></el-table-column>
                        <el-table-column
                        prop="grade_leader_name"
                        label="年级主任"></el-table-column>
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
                	<!--新增年级-->
                	<I-table-editor v-model="dialogFormVisibleAdd" 
                	:title="title">
	                   <template slot="content">
	                   		<el-form :inline="true" :model="formInline" class="demo-form-inline">
							 <el-form-item label="教育阶段:" :label-width="formLabelWidth" class="el-label-text" >
							    <el-select v-model="formInline.grade_type" placeholder="请选择" @change="getSchoolType()">
							      <el-option v-for="(item,key) in gradeData" :label="item" :key="key"  :value="key"></el-option>
							    </el-select>
							  </el-form-item>
							  <el-form-item label="学        制:" :label-width="formLabelWidth">
							    <el-select v-model="formInline.school_length" placeholder="请选择" >
							      <el-option v-for="(item,key) in schoolData" :label="item" :key="key"  :value="key"></el-option>
							    </el-select>
							  </el-form-item>
							  <el-form-item label="所在年级:" :label-width="formLabelWidth">
							    <el-input v-model="formInline.grade"></el-input>
							  </el-form-item>
							  <el-form-item label="入学年份:" :label-width="formLabelWidth">
							    <el-input v-model="formInline.grade_level" placeholder="请输入年份 如：2008"></el-input>
							  </el-form-item>
							  <el-form-item label="年级主任:" :label-width="formLabelWidth">
							  	 <el-select v-model="formInline.grade_leader_name" placeholder="请选择" filterable>
							      <el-option v-for="(item,index) in leaderData" :label="item.name" :key="index"  :value="item.name"></el-option>
							    </el-select>
							  </el-form-item>
							</el-form>
	                    </template>
	                    <template slot="foot">
	                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
	                        <el-button v-if="isAdd == true" class="confirm" type="success"
	                        @click="addGrade">保 存</el-button>
	                        <el-button v-if="isAdd == false" class="confirm" type="success"
	                        @click="addGrade">保 存</el-button>
	                    </template>
                	</I-table-editor>
            		 <!-- 删除 -->
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
        	page_size:10,
        	sort:"",
        	order:"",
        	total:"",
        	leaderData:"",
			title:"",//新增和编辑的标题
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:true,
            deleteId:"",//删除
            number:"",
            total_page:0,
          	//编辑添加参数
            formInline: {
                id:"",
                grade_type_title:"",
                school_length_title:"",
                grade:"",
                grade_type:"",
                school_length:"",
                grade_level:"",
                grade_level_title:"",
                grade_leader_name:""
            },
            //获取的数据
            tableData: [
                
            ],
            //获取的教育阶段数据
            gradeData: {
            	
            },
            //获取的学制数据
            schoolData: {
            	
            }
        };
    },
    mounted() {
    	this.req();
    	this.getLeaderName();
    	this.getGradeType();
    },
    methods: {
    	//刷新
    	refresh() {
            this.search = ""
            this.req()
        },
    	req() {
	    	this.$http.post("/SchoolGrade/lists",{
	    		token: localStorage.jxtoken,
	    		page_number: this.page_number,
	    		page_size: this.page_size,
	    		sort: this.sort,
	    		order: this.order
    		})
	    	.then((res) => {
	    		console.log(res);
	    		if(this.page_number > 1) {
                    if(!res.data) {
                        this.page_number = this.page_number - 1
                        this.req()
                    }
                }
	    		res.data.row.forEach(e => {
	    			for(var m  in e.school_length_title) {
	    				if(m == e.school_length) {
	    					e.school_length_title = e.school_length_title[m];
	    				}
	    			}
	    		})
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
    	//新增年级
    	addGrade() {
    		console.log(this.formInline.grade_type)
    		if(this.formInline.grade_type == "") {
    			this.$message.error('请选择教育阶段!');
    			return;
    		}
    		if(this.formInline.school_length == "") {
    			this.$message.error('请选择学制!');
    			return;
    		}
    		if(this.formInline.grade.trim() == "") {
    			this.$message.error('请输入所在年级!');
    			return;
    		}
    		if(this.formInline.grade_level.trim() == "") {
    			this.$message.error('请输入入学年份');
    			return;
    		}
    		if(this.formInline.grade_leader_name == "") {
    			this.$message.error('请选择年级班主任!');
    			return;
    		}
    		this.formInline.token = localStorage.jxtoken;
    		//提交
    		if(this.isAdd){
        		this.$http.post("/SchoolGrade/add",{
        			token: localStorage.jxtoken,
	    			grade_type: this.formInline.grade_type,
	    			school_length: this.formInline.school_length,
	    			grade_level: this.formInline.grade_level,
	    			grade: this.formInline.grade,
	    			grade_leader_name: this.formInline.grade_leader_name
        		})
        		.then((res) => {
        			this.$message.success(res.info);
        			this.dialogFormVisibleAdd = false;
        			this.req();
        		})
        		.catch((res)=>{
        			this.$message.error(res.info);
        		})
            }  else {
            	this.$http.post("/SchoolGrade/edit",{
            		token: localStorage.jxtoken,
	    			grade_type: this.formInline.grade_type,
	    			school_length: this.formInline.school_length,
	    			grade_level: this.formInline.grade_level,
	    			grade: this.formInline.grade,
	    			grade_leader_name: this.formInline.grade_leader_name,
	    			id: this.formInline.id
            	})
            	.then(res => {
            		this.$message.success(res.info);
        			this.dialogFormVisibleAdd = false;
        			this.req();
            	})
            	.catch((res)=>{
        			this.$message.error(res.info);
        		})
            }
    	},
        //确认删除
        deleteconfirm() {
        	console.log(localStorage.jxtoken);
        	this.$http.post("/SchoolGrade/delete",{
        		id: this.deleteId,
        		token: localStorage.jxtoken
        	})
        	.then((res) => {
                this.$message.success(res.info);
                this.dialogFormVisibleDelete = false;
                this.req()
            })
        	.catch((res) => {
        		this.$message.error(res.info);
        	})
        },
        pageChange(current) {
            this.page_number = current
            this.req()
        },
        //显示新增
        addShow() {
            this.formInline = {
                grade_alias:"",
                grade_level:"",
                grade:"",
                grade_type:"",
                school_length:"",
                grade_leader_name:""
                }
			this.title = "新增年级";
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
        },
        //显示编辑
        editshow(val) {
			this.title = "编辑年级";
        	console.log(1111,val);
        	for (var key in val) {
                this.formInline[key] = val[key];
            }
        	this.getSchoolType(val.school_length);
            this.isAdd = false;
            this.dialogFormVisibleAdd = true;
        },
        //获取教育阶段和学制
        getGradeType() {
        	this.$http.post("/SchoolGrade/gradeType",{
        		token: localStorage.jxtoken,
        		type: "grade_type"
        	})
        	.then(res => {
        		console.log("学阶数据",res.data);
        		this.gradeData = res.data;
        	})
        	.catch(res => {
        		this.$message.error(res.info);
        	})
        	
        },
        getSchoolType(school_length) {
        	this.formInline.school_length = "";
        	this.$http.post("/SchoolGrade/gradeType",{
        		token: localStorage.jxtoken,
        		type: "school_length",
        		grade_type_id:this.formInline.grade_type
        	})
        	.then(res => {
        		console.log("学制数据",res.data);
        		this.schoolData = res.data;
        		for(var key in this.schoolData) {
        			if(key == school_length) {
        				this.formInline.school_length = this.schoolData[key];
        			}
        		}
        	})
        	.catch(res => {
        		this.$message.error(res.info);
        	})
        	
        },
        //获取年级主任
        getLeaderName() {
        	this.$http.post("/Staff/index",{
        		token: localStorage.jxtoken,
        		page_size:999999,
        		page_number:1
        	})
        	.then(res => {
        		this.leaderData = res.data.rows;
        		//console.log("教职工数据",this.leaderData);
        	})
        },
        
        //删除
        deletebtn(val) {
        	this.deleteId = val.id;
        	this.dialogFormVisibleDelete = true;
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
    .el-form--inline .el-form-item {
    	margin-right:30px;
    	.el-select {
	    	width: 202px;
	    }
	    .el-form-item__label {
	    	width: 90px;
	    }
    }
    .el-input {
    	width: 202px;
    }
    .operation_btn {
    	margin-bottom: 0;
    }
</style>
