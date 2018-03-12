<template>
    <div>
        <I-table
        :isUpdate="true"
        @update="refresh"
        title="资产列表">
            <template slot="head">
                <el-select v-model="type" placeholder="请选择" >
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="number" :maxlength="maxlength20" size="smail" placeholder="编号" style="width:200px;"></el-input>
                <el-button size="smail" type="primary" @click="req">查询</el-button>
                <div class="right">
                    <el-button size="smail" type="primary" @click="addbtn">新增</el-button>
                    <el-button size="smail" type="danger" @click="deletefn">删除</el-button>
                    <el-button size="smail" type="primary" class="confirm" @click="exprotfn">导出</el-button>
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
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="number"
                        label="资产编号"></el-table-column>
                        <el-table-column
                        prop="name"
                        label="资产名称"></el-table-column>
                        <el-table-column
                        prop="num"
                        label="数量"></el-table-column>
                        <el-table-column
                        prop="type"
                        label="类型"></el-table-column>
                        <el-table-column
                        prop="input_time"
                        label="入库日期"></el-table-column>
                        <el-table-column
                        prop="manager"
                        label="负责人"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                            <el-button @click="editshow(scope.row)" type="text" size="small">编辑</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 新增 -->
                <I-table-editor v-model="dialogFormVisibleAdd" 
                :title="editTitle">
                    <template slot="content">
                        <el-form >
                            <el-form-item label="资产名称:"  :label-width="formLabelWidth">
                                <el-input v-model="form.name" :maxlength="maxlength20" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="资产编号:"  :label-width="formLabelWidth">
                                <el-input v-model="form.number" :maxlength="maxlength20" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="资产类型:" :label-width="formLabelWidth">
                                <el-select v-model="form.type" placeholder="请选择" >
                                    <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="资产单价" :label-width="formLabelWidth">
                                <el-input v-model="form.price" :maxlength="maxlength8" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="资产数量" :label-width="formLabelWidth">
                                <el-input v-model="form.num" :maxlength="maxlength5" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="负责人" :label-width="formLabelWidth">
                                <el-input v-model="form.manager" :maxlength="maxlength20" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="入库日期" :label-width="formLabelWidth">
                                <el-date-picker
                                v-model="form.input_time"
                                type="date"
                                placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="存放地点"  :label-width="formLabelWidth">
                                <el-input v-model="form.place" :maxlength="maxlength50" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                        <el-button v-if="isAdd == true" class="confirm" type="success"
                        @click="addfn">确 定</el-button>
                        <el-button v-if="isAdd == false" class="confirm" type="success"
                        @click="editfn">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 删除 -->
                <I-table-editor v-model="dialogFormVisibleDelete" 
                title="删除">
                    <template slot="content">
                        <span>是否确定删除？</span>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisibleDelete = false">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="deleteconfirm">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 详情 -->
                 <I-table-editor v-model="dialogFormVisibleDetail" 
                title="资产详情">
                    <template slot="content">
                        <div class="details">
                            <div class="item">
                                <label>资产名称：</label>
                                <span>{{form.name}}</span>
                            </div>
                            <div class="item">
                                <label>资产编号：</label>
                                <span>{{form.number}}</span>
                            </div>
                            <div class="item">
                                <label>资产类型：</label>
                                <span>{{form.type}}</span>
                            </div>
                            <div class="item">
                                <label>资产单价：</label>
                                <span>{{form.price}}</span>
                            </div>
                            <div class="item">
                                <label>资产数量：</label>
                                <span>{{form.num}}</span>
                            </div>
                            <div class="item">
                                <label>负责人：</label>
                                <span>{{form.manager}}</span>
                            </div>
                            <div class="item">
                                <label>入库日期：</label>
                                <span>{{form.input_time}}</span>
                            </div>
                            <div class="item">
                                <label>存放地点：</label>
                                <span>{{form.place}}</span>
                            </div>
                        </div>
                        
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisibleDetail = false">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="dialogFormVisibleDetail = false">确 定</el-button>
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
            maxlength20:20,
            maxlength50:50,
            maxlength8:8,
            maxlength5:5,
            dialogFormVisibleImport: false,
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            dialogFormVisibleDetail:false,
            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:true,
            ids:[],//删除
            //类型
            typeOptions:[{
                value: '1',
                label: '办公'
            }],
            //搜索参数
            type:"",
            number:"",
            page_current:1,
            page_size:10,
            total_page:100,
            //编辑添加参数
            form: {
                id:"",
                name: '',
                number: '',
                type: '',
                price: '',
                num: '',
                manager: '',
                place: '',
                input_time: ''
            },
            //获取的数据
            tableData: [],
            search: '',
            current: 1,
            //新增
            value1: '',
            editTitle:"新增"
        };
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        this.getCategory();
        this.req();
        // console.log("mounted....");
        // let time = this.$tools.formatDate("Thu Jan 18 2018 00:00:00 GMT+0800 (中国标准时间)","timescamp");
        // console.log(time);
        //this.$message.success('操作成功!');
    },
    methods: {
        //获取类别
        getCategory() {
            this.$http.post('/fund/category', {
                token:localStorage.jxtoken
            })
            .then((res) => {
                this.typeOptions = [{value:"",label:"请选择"}]
                for(let i=0;i<res.data.length;i++) {
                    let obj = {value:res.data[i],label:res.data[i]}
                    this.typeOptions.push(obj)
                }
                console.log(this.typeOptions)
            })
        },
        //刷新
        refresh() {
            this.type = ""
            this.number = ""
            this.req()
        },
        //搜索
        req() {
            this.tableData = []
            this.$http.post('/fund/search', {
                type: this.type,
                number: this.number,
                page_current: this.page_current,
                page_size: this.page_size,
                token:localStorage.jxtoken
            })
            .then((res) => {
                console.log(res)
                res.data.rows.forEach(e => {
                    e.input_time = this.$tools.formatDate(e.input_time,"yyyy-MM-dd");
                });
                this.tableData = res.data.rows;
                this.total_page = parseInt(res.data.count);
            })
            .catch(res=>{
                this.$message.error(res.data);
            })
        },
        //排序
        sortChange({ column, prop, order }) {
            console.log('sortChange', column, prop, order);
        },
        //分页
        pageChange(current) {
            this.page_current = current
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
                this.form = res.data
                this.dialogFormVisibleDetail  = true
            }); 
        },
        //新增资产
        addbtn() {
            this.form = {
                name: '',
                number: '',
                type: '',
                price: '',
                num: '',
                manager: '',
                place: '',
                input_time: ''}
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
            this.editTitle = "新增"
        },
        //新增
        addfn(){
            if(this.form.name.trim() == "" || this.form.name.toString().trim() == "") {
                this.$message.error('请输入资产名称!');
                return;
            }
            if(this.form.number.trim() == "" || this.form.number.toString().trim() == "") {
                this.$message.error('请输入资产编号!');
                return;
            }
            if(this.form.type.trim() == "" || this.form.type.toString().trim() == "") {
                this.$message.error('请输入资产类型!');
                return;
            }
            if(this.form.price.trim() == "" || this.form.price.toString().trim() == "") {
                this.$message.error('请输入资产单价!');
                return;
            }
            if(this.form.price < 0 || this.form.price > 99999999) {
                this.$message.error('资产单价范围为0-99999999');
                return;
            }
            if(this.form.num.trim() == "" || this.form.num.toString().trim() == "") {
                this.$message.error('请输入资产数量!');
                return;
            }
            if(this.form.num < 0 || this.form.num > 99999) {
                this.$message.error('资产单价范围为0-99999');
                return;
            }
            if(!/^[0-9]*[1-9][0-9]*$/.test(this.form.num)) {
                this.$message.error("试题总分应为整数");
                return;
            }
            if(this.form.manager.trim() == "" || this.form.manager.toString().trim() == "") {
                this.$message.error('请输入负责人!');
                return;
            }
            if(this.form.input_time == "") {
                this.$message.error('请选择入库日期!');
                return;
            }
            if(this.form.place.trim() == "" || this.form.place.toString().trim() == "") {
                this.$message.error('请输入存放地点!');
                return;
            }
            //console.log(this.form);
            this.form.token = localStorage.jxtoken
            // this.form.input_time = this.$tools.formatDate(this.form.input_time.toString(),"timescamp")
            this.form.input_time = this.$tools.stringToDate(this.form.input_time.toString())
            //提交
            this.$http.post('/fund/create',this.form)
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
            this.form.name = val.name
            this.form.number = val.number
            this.form.type = val.type
            this.form.price = val.price
            this.form.num = val.num
            this.form.manager = val.manager
            this.form.place = val.place
            this.form.input_time = val.input_time
            this.form.id = val.id

            delete this.form.create_time;
            delete this.form.modify_time;
            delete this.form.is_delete;
            this.isAdd = false;
            this.dialogFormVisibleAdd = true;
            this.editTitle = "编辑";
        },
        //确认编辑
        editfn(){
            if(this.form.name.trim() == "" || this.form.name.toString().trim() == "") {
                this.$message.error('请输入资产名称!');
                return;
            }
            if(this.form.number.trim() == "" || this.form.number.toString().trim() == "") {
                this.$message.error('请输入资产编号!');
                return;
            }
            if(this.form.type.trim() == "" || this.form.type.toString().trim() == "") {
                this.$message.error('请输入资产类型!');
                return;
            }
            if(this.form.price.trim() == "" || this.form.price.toString().trim() == "") {
                this.$message.error('请输入资产单价!');
                return;
            }
            if(this.form.num.trim() == "" || this.form.num.toString().trim() == "") {
                this.$message.error('请输入资产数量!');
                return;
            }
            if(this.form.manager.trim() == "" || this.form.manager.toString().trim() == "") {
                this.$message.error('请输入负责人!');
                return;
            }
            if(this.form.input_time == "") {
                this.$message.error('请选择入库日期!');
                return;
            }
            if(this.form.place.trim() == "" || this.form.place.toString().trim() == "") {
                this.$message.error('请输入存放地点!');
                return;
            }
            //console.log(this.form);
            this.form.token = localStorage.jxtoken;
            console.log("this.form.input_time=" + this.form.input_time);
            // this.form.input_time = this.$tools.formatDate(this.form.input_time.toString(),"timescamp")
            this.form.input_time = this.$tools.stringToDate(this.form.input_time.toString())
            console.log("this.form.input_time=" + this.form.input_time);
            //提交
            this.$http.post('/fund/edit',this.form)
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
        deletefn() {
            if(this.multipleSelection.length == 0) {
                this.$message.error('您还未选择任何资产!');
                return false;
            }
            this.dialogFormVisibleDelete = true;
        },
        //确认删除
        deleteconfirm() {
            this.ids = [];
            for(let i = 0;i < this.multipleSelection.length;i++) {
                this.ids.push(this.multipleSelection[i].id)
            }
            //console.log(this.ids);
            //提交删除
            this.$http.post('/fund/delete',{
                ids:this.ids.join(','),
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
        //复选框状态改变
        changeFun(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        //导出
        exprotfn() {
            console.log(this.type,this.number,this.page_current,this.page_size)
            this.$tools.exportFile('/fund/export', {
                type:this.type,
                number:this.number,
                page_current:this.page_current,
                page_size:this.page_size,
                token:localStorage.jxtoken
            })
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
