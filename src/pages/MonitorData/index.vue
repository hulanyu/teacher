<template>
    <div>
        <I-table
        title="监控数据管理"
        :isUpdate="true"
        @update="refresh">
            <template slot="head">
                    <el-input v-model="search" size="smail" placeholder="请输入监控名称" style="width:200px;"></el-input>
                    <el-button size="smail" type="primary" @click="searchfn">查询</el-button>
                    <el-button size="smail" type="primary" class="confirm" @click="addShow">新增</el-button>
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
                        prop="id"
                        label="ID"></el-table-column>
                        <el-table-column
                        sortable
                        prop="name"
                        label="监控名称"></el-table-column>
                        <el-table-column
                        sortable
                        prop="class_name"
                        label="班级"></el-table-column>
                        <el-table-column
                        sortable
                        prop="position"
                        label="位置"></el-table-column>
                        <el-table-column
                        sortable
                        prop="create_time"
                        label="添加时间"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small" @click="deletefn(scope.row)">删除</el-button>
                            <el-button type="text" size="small" @click="showVideo(scope.row)">查看</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                <!-- 新增 -->
                <I-table-editor v-model="dialogFormVisible" 
                :title="editTitle">
                    <template slot="content">
                        <el-form >
                            <el-form-item label="监控名称:" :label-width="formLabelWidth">
                            <el-input :maxlength="30" v-model="form.name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="班级名称:" :label-width="formLabelWidth">
                                <el-select v-model="form.class_id" placeholder="请选择">
                                    <el-option
                                    v-for="(item,index) in classType"
                                    :key="index"
                                    :label="item.grade + item.class"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="URL地址:" :label-width="formLabelWidth">
                            <el-input v-model="form.pc_url" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="APP地址" :label-width="formLabelWidth">
                            <el-input v-model="form.app_url" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="监控位置" :label-width="formLabelWidth">
                            <el-select v-model="form.position" placeholder="请选择监控位置">
                                <el-option label="前" value="1"></el-option>
                                <el-option label="后" value="2"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button v-if="isAdd == true" class="confirm" type="success"
                        @click="addfn('add')">确 定</el-button>
                        <el-button v-if="isAdd == false" class="confirm" type="success"
                        @click="addfn('edit')">确 定</el-button>
                    </template>
                </I-table-editor>
                    <!-- 删除 -->
                <I-table-editor v-model="deleteDialogVisible" 
                title="删除">
                    <template slot="content">
                        <span>是否确定删除？</span>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="deleteDialogVisible = false">取 消</el-button>
                        <el-button type="success"
                        @click="deleteconfirm">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 详情 -->
                 <I-table-editor v-model="dialogFormVisibleDetail" 
                title="查看详情">
                    <template slot="content">
                        <div class="details">
                            <div class="item">
                                <label>监控名称：</label>
                                <span>{{form.name}}</span>
                            </div>
                            <div class="item">
                                <label>班级名称：</label>
                                <span>{{form.class_name}}</span>
                            </div>
                            <div class="item">
                                <label>URL地址：</label>
                                <span>{{form.pc_url}}</span>
                            </div>
                            <div class="item">
                                <label>app地址：</label>
                                <span>{{form.app_url}}</span>
                            </div>
                            <div class="item">
                                <label>监控位置：</label>
                                <span>{{form.position}}</span>
                            </div>
                        </div>
                        
                    </template>
                    <template slot="foot">
                        <el-button @click="dialogFormVisibleDetail = false">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="dialogFormVisibleDetail = false">确 定</el-button>
                    </template>
                </I-table-editor>
                <I-table-editor :title="dialogFormVideoTitle" v-model="dialogFormVideoVisible" >
                    <template slot="content">
                        <div class="loadingVideo" v-if="videoIsReady==true">正在加载...</div>
                        <p style="text-align:center;">
                            <!-- <video id="video"  ></video> -->
                            <iframe id="fmc" width="100%;" height="320px;" :src="fmcUrl"></iframe>
                        </p>
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
            page_number:1,
            page_size:10,
            sort:"",
            order:"",
            search: '', //搜索
            total:0,
            fmc:null,
            fmcUrl:"",
            //删除
            deleteId:'',

            dialogFormVisible: false,
            deleteDialogVisible:false,
            dialogFormVisibleDetail:false,
            dialogFormVideoVisible:false,
            dialogFormVideoUrl:"",
            dialogFormVideoTitle:"高清监控视频",
            videoIsReady:false,
            videoObj:null,
            hlsObj:null,
            formLabelWidth: '100px',
            //新增数据
            isAdd:true,
            form: {
                name: '',
                class_id: '',
                position: '',
                pc_url: '',
                app_url: '0'
            },
            classType:[
                {
                    value: '1',
                    label: '一年级'
                },
            ],
            tableData: [
                {
                    id: 111,
                    name: '黄若曦',
                    grade: '三年级二班',
                    money: 1000
                }
            ],
            current: 1,
            videoOptions:{
                source: {
                    type: "application/x-mpegURL",
                    src: 'http://hls.open.ys7.com/openlive/1431fa4bc361431caec063218f933f9b.m3u8',
                    withCredentials: false
                },
                language: 'zh-CN',
                live: true,
                autoplay: true,
                height:320,
                width:480
            },
            editTitle:"新增"
        };
    },
    watch: {
        dialogFormVideoVisible (isShow) {
            console.log("dialogFormVideoVisible=" + isShow);
            if (!isShow) {
                // try{
                //     this.videoObj.pause();
                //     this.hlsObj.destroy();
                //     this.hlsObj = null;
                // }catch (e){}
                this.fmcUrl="";
            }
        }
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        this.fmc = document.getElementById('fmc');
        this.req()
        this.getSchoolGrade()
    },
    methods: {
        //刷新
        refresh() {
            this.search = ""
            this.req()
        },
        req() {
            this.$http.post('/Monitor/index', {
                token: localStorage.jxtoken,
                page_number: this.page_number,
                page_size: this.page_size,
                sort: this.sort,
                order: this.order,
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
                this.tableData = res.data.rows;
                for(let i=0;i<this.tableData.length;i++) {
                    this.tableData[i].create_time = this.$tools.formatDate(this.tableData[i].create_time);
                }
                this.total = parseInt(res.data.page.total)
                
            });
        },
        //获取年级
        getSchoolGrade() {
            this.$http.post('SchoolClass/lists', {
                token: localStorage.jxtoken,
                page_number: this.page_number,
                page_size: 50,
                sort: this.sort,
                order: this.order,
            })
            .then((res) => {
                console.log(res);
                this.classType = res.data.row
            });
        },
        sortChange({ column, prop, order }) {
            this.sort = column.property
            if(column.order == 'ascending') {
                this.order = 'asc'
            }else if(column.order == 'descending') {
                this.order = 'desc'
            }
            this.req();
        },
        pageChange(current) {
            this.page_number = current
            this.req()
        },
        //查询
        searchfn() {
            this.req()
        },
        //删除
        deletefn(val) {
            console.log(val);
            this.deleteId = val.id
            this.deleteDialogVisible = true;
        },
        //确认删除
        deleteconfirm() {
            //提交删除
            this.$http.post('/Monitor/delete',{
                id:this.deleteId,
                token:localStorage.jxtoken
            })
            .then(res => {
                this.$message.success('操作成功！');
                this.deleteDialogVisible = false;
                this.req()
            })
        },
        //编辑
        handleClick(val) {
            this.form = val
            this.isAdd = false
            this.dialogFormVisible = true
            this.editTitle = "编辑"
        },
        //查看
        showDetail(val) {
            this.form = val
            if(this.form.position == 1) {
                this.form.position = "前"
            }else if(this.form.position == 2) {
                this.form.position = "后"
            }
            this.dialogFormVisibleDetail = true;
        },
        //查看监控
        showVideo(val){
            this.dialogFormVisibleDetail = false;
            this.dialogFormVideoVisible = true;
            this.dialogFormVideoTitle = "透明课堂[ " + val.name + " ]";
            this.fmcUrl = "/static/video.htm?path=" + val.pc_url;
            return;

        //     if(!Hls.isSupported()){
        //         this.$message.info('您的浏览器不支持透明学堂的在线观看！');   
        //         return;
        //     }
        //    this.dialogFormVisibleDetail = false;
        //    this.dialogFormVideoVisible = true;
        //    this.dialogFormVideoTitle = "透明课堂[ " + val.name + " ]";
        //    this.videoIsReady = true;
        //    return;
        //    this.$nextTick(() => {
        //        if(this.videoObj==null)this.videoObj = document.getElementById("video");
        //        if(this.hlsObj==null)this.hlsObj = new Hls();
        //        this.hlsObj.loadSource(val.pc_url);
        //        this.hlsObj.attachMedia(this.videoObj);
        //        this.hlsObj.on(Hls.Events.MANIFEST_PARSED, ()=> {
        //             this.videoObj.play();
        //             setTimeout(()=>{this.videoIsReady = false;},200);
        //        });
        //    });
        },
        //全屏
        showFullScreen(){
            
        },
        //显示添加弹窗
        addShow() {
            this.dialogFormVisible = true
            this.isAdd = true
            this.form = {
                name: '',
                class_id: '',
                position: '',
                pc_url: '',
                app_url: '',
            }
            this.editTitle = "新增"
        },
        //新增
        addfn(){
            if(this.form.name.trim() == "" || this.form.name.toString().trim() == "") {
                this.$message.error('请输入监控名称!');
                return;
            }
            if(this.form.name.length < 2) {
                this.$message.error('监控名称长度为2到10个字符!');
                return;
            }
            if(this.form.class_id == "") {
                this.$message.error('请选择班级!');
                return;
            }
            if(this.form.pc_url.trim() == "" || this.form.pc_url.toString().trim() == "") {
                this.$message.error('请输入URL地址!');
                return;
            }
            if(this.form.app_url.trim() == "" || this.form.app_url.toString().trim() == "") {
                this.$message.error('请输入APP地址!');
                return;
            }
            if(this.form.position == "") {
                this.$message.error('请选择监控位置!');
                return;
            }
            //console.log(this.form);
            this.form.token = localStorage.jxtoken
            //提交
            if(this.isAdd) {
                this.$http.post('/Monitor/add',this.form)
                .then(res => {
                    this.$message.success(res.info);
                    this.dialogFormVisible = false;
                    this.req()
                })
            }else {
                this.$http.post('/Monitor/edit',this.form)
                .then(res => {
                    this.$message.success(res.info);
                    this.dialogFormVisible = false;
                    this.req()
                })
            }
        },
    }
}
</script>
<style scoped lang="less">
    .el-button--text {
        padding:5px;
        background: #409EFF;
        color:#fff;
    }
    .el-button--text:focus, .el-button--text:hover {
    	background: #409EFF;
    	color:#fff;
    }
    .details {
        line-height: 30px;
        padding-left: 30px;
        label {
            width:80px;
            display: inline-block;
            text-align: right;
        }
    }
    .loadingVideo{
        width:100%;
        margin: 0 auto;
        margin-top: 20%;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        color:#949494;
    }
    .video{
        display: block;
        clear: both;
        margin: 0 auto;
    }
</style>
