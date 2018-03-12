<template>
    <div>
        <I-table
        title="科室管理"
        :isUpdate="false"
        >
            <template slot="head">
            	<el-input v-model="search" size="medium" placeholder="科室名称" style="width:200px;"></el-input>
                <el-button size="medium" type="primary" @click="searchbtn">查询</el-button>
                <div class="right">
                    <el-button size="medium" type="success" class="confirm addbtn" @click="addShow">新增</el-button>
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
                    @sort-change="sortChange"
                    @selection-change="changeFun">
                        <el-table-column
                        prop="name"
                        label="科室名称"></el-table-column>
                        <el-table-column
                        prop="position"
                        label="位置"></el-table-column>
                        <el-table-column
                        prop="use"
                        label="用途"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="300"
                        >
	                        <template slot-scope="scope">
	                        	<el-button  type="text" size="small" @click="editshow(scope.row)">编辑</el-button>
	                            <el-button  type="text" size="small" @click="deletebtn(scope.row)">删除</el-button>
	                        </template>
                        </el-table-column>
                    </el-table>
                	<!--新增科室-->
                	<I-table-editor v-model="dialogFormVisibleAdd" 
                	:title="title" width="600px">
	                   <template slot="content">
	                   		<el-form >
	                            <el-form-item label="科室名称:" :label-width="formLabelWidth">
	                                <el-input v-model="form.name" auto-complete="off"></el-input>
	                            </el-form-item>
	                            <el-form-item label="位  置:" :label-width="formLabelWidth" class="text-style">
	                                <el-input v-model="form.position" auto-complete="off"></el-input>
	                            </el-form-item>
	                            <el-form-item label="用  途:" :label-width="formLabelWidth">
	                                <el-input v-model="form.use" auto-complete="off"></el-input>
	                            </el-form-item>
	                        </el-form>
	                    </template>
	                    <template slot="foot">
	                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
	                        <el-button v-if="isAdd == true" class="confirm" type="success"
	                        @click="addDept">确 定</el-button>
	                        <el-button v-if="isAdd == false" class="confirm" type="success"
	                        @click="addDept">确 定</el-button>
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
        	sort:"",
        	order:"",
        	deleteId:"",//删除
        	
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:false,
            //搜索参数
            search:"",
            number:"",
            page_number:1,
            page_size:10,
            total_page:0,
            title:"",//新增和编辑的标题
          	//编辑添加参数
            form: {
                id:"",
                name: '',
                position:'',
                use:''
            },
             //获取的数据
	            tableData: [
	               
	            ]
        };
    },
    mounted() {
    	this.req();
    },
    methods: {
    	//刷新
    	refresh() {
            this.search = ""
            this.req()
        },
        //请求列表数据
        req() {
        	this.$http.post("/SchoolDept/lists",{
        		token: localStorage.jxtoken,
        		page_number: this.page_number,
        		sort: this.sort,
        		order: this.order,
        		page_size: this.page_size,
        		search: this.search
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
                this.total_page = parseInt(res.data.page.total)
        	})
        	.catch((res) => {
        		this.$message.error(res.info);
        	})
        },
        //确定增加科室
        addDept() {
        	if(this.form.name.trim() == ""){
        		this.$message.error('请输入科室名称!'); 
        		return;
        	}
        	if(this.form.position.trim() == ""){
        		this.$message.error('请输入位置!');
        		return;
        	}
        	if(this.form.use.trim() == "" ){
        		this.$message.error('请输入用途!');
        		return;
        	}
        	this.form.token = localStorage.jxtoken;
        	//console.log(this.form);
        	//提交
        	if(this.isAdd){
        		this.$http.post("/SchoolDept/add",this.form)
        		.then((res) => {
        			this.$message.success(res.info);
        			this.dialogFormVisibleAdd = false;
        			this.req();
        		})
        		.catch((res)=>{
        			this.$message.error(res.info);
        		})
        	} else {
        		this.$http.post("/SchoolDept/edit",this.form)
        		.then((res) => {
        			console.log("res:"+res)
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
        	this.$http.post("/SchoolDept/delete",{
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
    	sortChange({ column, prop, order }) {
            console.log('sortChange', column, prop, order);
        },
        pageChange(current) {
        	console.log(current);
            this.page_number = current
            this.req()
        },
        changeFun(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        //显示新增窗口
        addShow() {
        	this.form = {
                id:"",
                name: '',
                position:'',
                use:''
            }
            this.title = "新增科室";
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
        },
        //显示编辑窗口
        editshow(val) {
            this.title = "编辑科室";
            for (var key in this.form) {
                this.form[key] = val[key];
            }
            this.isAdd = false;
            this.dialogFormVisibleAdd = true;
        },
        //删除
        deletebtn(val) {
        	this.deleteId = val.id;
        	this.dialogFormVisibleDelete = true;
        },
        //查询
        searchbtn() {
            this.page_number = 1;
        	this.req();
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
    .add_grade {
    	text-align: center;
    }
    .el-button--text {
        padding:5px;
        background: #409EFF;
        color:#fff;
        margin-bottom: 0;
    }
   	.el-button--text:focus, .el-button--text:hover {
    	background: #409EFF;
        color:#fff;
    }
    .el-form .el-form-item {
    	width: 60%;
    	margin: 0 auto;
    	margin-bottom: 22px;
    }
    .right {
        position: absolute;
        right: 10px;
        top: 0;
    }
</style>
