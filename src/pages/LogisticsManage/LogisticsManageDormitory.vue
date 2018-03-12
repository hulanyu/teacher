<template>
    <div>
        <I-table
        :isUpdate="true"
        @update="refresh"
        title="宿舍管理">
            <template slot="head">
                    <el-input v-model="search" :maxlength='20' size="smail" placeholder="宿舍编号" style="width:200px;"></el-input>
                    <el-button size="smail" type="primary" @click="req">查询</el-button>
                    <div class="right">
                        <el-button size="smail" type="primary" @click="addbtn">新增</el-button>
                    </div>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    :height="props.maxHeight"
                    style="width: 100%;"
                    row-class-name="table-row"
                    :data="tableData">
                        <el-table-column
                        prop="dormitory_no"
                        label="宿舍号"></el-table-column>
                        <el-table-column
                        prop="sexName"
                        label="居住性别"></el-table-column>
                        <el-table-column
                        prop="building_no"
                        label="楼栋"></el-table-column>
                        <el-table-column
                        prop="floor"
                        label="楼层"></el-table-column>
                        <el-table-column
                        prop="exp_people"
                        label="可住人数"></el-table-column>
                        <el-table-column
                        prop="real_people"
                        label="实住人数"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                            <el-button @click="editshow(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="deletefn(scope.row)" type="text" size="small">删除</el-button>
                            
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 新增 -->
                <I-table-editor v-model="dialogFormVisibleAdd" 
                :title="editTitle">
                    <template slot="content">
                        <el-form >
                            <el-form-item label="居住性别:" :label-width="formLabelWidth">
                                <el-radio v-model="form.sex" label="1">男</el-radio>
                                <el-radio v-model="form.sex" label="2">女</el-radio>
                            </el-form-item>
                            <!-- <el-form-item label="宿舍号：" :label-width="formLabelWidth">
                                <el-input v-model="form.building_no" :maxlength='20' auto-complete="off"></el-input>
                            </el-form-item> -->
                            <el-form-item label="楼栋：" :label-width="formLabelWidth">
                                <el-input v-model="form.building_no" :maxlength='20' auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="楼层：" :label-width="formLabelWidth">
                                <el-input v-model="form.floor" :maxlength='2' auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="宿舍号：" :label-width="formLabelWidth">
                                <el-input v-model="form.dormitory_no" :maxlength='20' auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="可住人数：" :label-width="formLabelWidth">
                                <el-input v-model="form.exp_people" :maxlength='2' auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                        <el-button v-if="isAdd == true" class="confirm" type="success"
                        @click="addConfirm">确 定</el-button>
                        <el-button v-if="isAdd == false" class="confirm" type="success"
                        @click="editfn">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 删除 -->
                <I-table-editor v-model="dialogFormVisibleDelete" 
                title="删除">
                    <template slot="content">
                        <div class="outportaddr-group">
                            <span>是否删除宿舍号{{delete_dormitory_no}}？</span>
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
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'

export default {
    data() {
        return {
            dialogFormVisibleImport: false,
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            dialogFormVisibleDetail:false,
            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:true,
            deleteId:"",
            delete_dormitory_no:"",
            //类型
            typeOptions:[{
                value: '1',
                label: '办公'
            }],
            //搜索参数
            search:"",
            number:"",
            page_size:10,
            page_number:1,
            total_page:0,
            sort:"",
            order:"",
            //编辑添加参数
            form: {
                token:localStorage.jxtoken,
                sex: '1',
                building_no: '',
                floor: '',
                exp_people: '',
                dormitory_no:''
            },
            //获取的数据
            tableData: [],
            //新增
            value1: '',
            editTitle:''
        };
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        this.req()
        let time = this.$tools.formatDate(1372751992)
        console.log(time);
        //this.$message.success('操作成功!');
    },
    methods: {
        //刷新
        refresh() {
            this.search = ""
            this.req()
        },
        //搜索
        req() {
            this.tableData = []
            this.$http.post('/SchoolDormitory/lists', {
                page_number: this.page_number,
                page_size: this.page_size,
                token:localStorage.jxtoken,
                order:this.order,
                sort:this.sort,
                search:this.search
               
            })
            .then((res) => {
                console.log(res)
                if(this.page_number > 1) {
                    if(!res.data.row) {
                        this.page_number = this.page_number - 1
                        this.req()
                    }
                }
                this.tableData = res.data.row;
                for(let i=0;i<this.tableData.length;i++) {
                    if(this.tableData[i].sex == 1) {
                        this.tableData[i].sexName = "男"
                    }
                    if(this.tableData[i].sex == 2) {
                        this.tableData[i].sexName = "女"
                    }
                }
                this.total_page = parseInt(res.data.page.total);
            });
        },
        //分页
        pageChange(current) {
            this.page_number = current
            this.req()
        },
        //查看详情
        handleClick:function(val) {
            this.$http.post('/fund/detail', {
                id:val.id,
                token:localStorage.jxtoken
            })
            .then((res) => {
                console.log(res);
                this.form = res.info
                this.dialogFormVisibleDetail  = true
            }); 
        },
        //新增
        addbtn() {
            this.form = {
                token:localStorage.jxtoken,
                sex: '1',
                building_no: '',
                floor: '',
                exp_people: '',
                dormitory_no:''
                }
            this.isAdd = true;
            this.editTitle = "新增"
            this.dialogFormVisibleAdd = true;
        },
        //新增
        addConfirm(){
            if(this.form.sex == "") {
                this.$message.error('请输入选择性别!');
                return;
            }
            if(this.form.building_no.trim() == "" || this.form.building_no.toString().trim() == "") {
                this.$message.error('请输入楼栋编号!');
                return;
            }
            if(this.form.floor.trim() == "" || this.form.floor.toString().trim() == "") {
                this.$message.error('请输入楼层数字!');
                return;
            }
            if(this.form.exp_people.trim() == "" || this.form.exp_people.toString().trim() == "") {
                this.$message.error('请输入可住人数!');
                return;
            }
            //console.log(this.form);
            this.form.token = localStorage.jxtoken
            //提交
            this.$http.post('/SchoolDormitory/add',this.form)
            .then(res => {
                this.$message.success('操作成功!');
                this.dialogFormVisibleAdd = false;
                this.req()
            })
            .catch(res=>{
                this.$message.error(res.info);
            })

        },
        //编辑
        editshow(val) {
            console.log(val)
            this.form.sex = val.sex
            this.form.building_no = val.building_no
            this.form.floor = val.floor
            this.form.exp_people = val.exp_people
            this.form.id = val.id
            this.form.dormitory_no = val.dormitory_no
            this.isAdd = false;
            this.editTitle = "编辑"
            this.dialogFormVisibleAdd = true;
        },
        //确认编辑
        editfn(){
            if(this.form.sex == "") {
                this.$message.error('请输入选择性别!');
                return;
            }
            if(this.form.building_no.trim() == "" || this.form.building_no.toString().trim() == "") {
                this.$message.error('请输入楼栋编号!');
                return;
            }
            if(this.form.floor.trim() == "" || this.form.floor.toString().trim() == "") {
                this.$message.error('请输入楼层数字!');
                return;
            }
            if(this.form.exp_people.trim() == "" || this.form.exp_people.toString().trim() == "") {
                this.$message.error('请输入可住人数!');
                return;
            }
            //console.log(this.form);
            this.form.token = localStorage.jxtoken
            //提交
            this.$http.post('/SchoolDormitory/edit',this.form)
            .then(res => {
                this.$message.success('操作成功!');
                this.dialogFormVisibleAdd = false;
                this.req()
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        //删除
        deletefn(val) {
            this.deleteId = val.id
            this.delete_dormitory_no = val.dormitory_no
            this.dialogFormVisibleDelete = true;
        },
        //确认删除
        deleteconfirm() {
            //console.log(this.ids);
            //提交删除
            this.$http.post('/SchoolDormitory/delete',{
                id:this.deleteId,
                token:localStorage.jxtoken
            })
            .then(res => {
                this.$message.success('操作成功！');
                this.dialogFormVisibleDelete = false;
                this.req()
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
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
    .head {
        position: relative;
    }
    .right {
        position: absolute;
        right: 10px;
        top: 0;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }
    .details {
        line-height: 40px;
        font-size: 17px;
    }
    .details label {
        width:100px;
        display: inline-block;
        text-align: right;
    }
</style>
