<template>
    <div>
        <Base-right
        title="考勤设备管理"
        :isUpdate="true"
        :isBack="false"
        @update="init">
            <template slot-scope="props">
                <el-button size="smail" type="primary" @click="findfn" v-if="finding == false">发现设备</el-button>
                <el-button size="smail" type="primary" @click="unfindfn" v-if="finding == true">关闭搜索</el-button>
                <div class="content" :style="'overflow: auto;margin-top:10px; height:' + (props.maxHeight - 100) + 'px'">
                    <div v-if="datas.length==0" class="noDevice" >暂无设备可以操作</div>
                    <div class="item"  v-for="(item, index) in datas" :key="index">
                        <span class="left">
                            <img v-if="item.is_active == 1" :src="unactivebtn" alt="">
                            <img v-if="item.is_active == 2" :src="activebtn" alt="">
                            <span>设备名称：{{item.bio_sn}}</span>
                        </span>
                        <span class="borderLeft version">版本：{{item.app_version}}</span>
                        <span class="borderLeft time">创建时间：{{item.modify_time}}</span>
                        <span class="borderLeft action">
                            <el-button size="smail" type="primary" v-if="item.is_active == 1" @click="btnClickForActive(item)">激　活</el-button>
                            <el-button size="smail" type="primary" v-if="item.is_active == 2" disabled style="background-color:#949494;border-color:#949494">已激活</el-button>
                        </span>
                        <span class="borderLeft delete">
                            <img class="delete" v-if="item.is_active == 2" :src="deletebtn" alt="" @click="waitForDelID=item.id;deleteDialogVisible = true;">
                        </span>
                    </div>
                </div>
            </template>
        </Base-right>
        <!-- 删除 -->
        <I-table-editor v-model="deleteDialogVisible" 
        title="删除">
            <template slot="content">
                <span>您是否确定要删除当前设备？</span>
            </template>
            <template slot="foot">
                <el-button 
                @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="success"
                @click="btnClickForDelYes()">确 定</el-button>
            </template>
        </I-table-editor>
    </div>
    
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight';
import { ITableEditor,} from '@/components/Table/';

export default {
    data() {
        return {
            deleteDialogVisible:false,
            dialogFormVisible:false,
            finding:false,
            radio:"1",
            input:"1",
            activebtn:"../static/imgs/activebtn.png",
            unactivebtn:"../static/imgs/unactivebtn.png",
            deletebtn:"../static/imgs/deletebtn.png",
            cmdTimer:null,
            cmdTimerInterval:10000,
            cmdTimerTimeout:60000,
            waitForDelID:0,
            datas: [],      //全部设备列表
            activeList:[],  //已激活列表
            unactiveList:[],    //未激活设备
            search: '',
            current: 1,
            total: 1000,
            showOutQuestionBox: false,
        };
    },
    components: {
        BaseRight,
        ITableEditor,
    },
    mounted () {
        this.init();
    },
    methods: {
        init() {
            //第一次请求-获得已激活列表
            this.datas = [];
            this.unactiveList = [];
            this.activeList = [];
            this.$http.post('/device/findActiveList', {type:2,token:this.$tools.getToken()},{showError: false,showLoading:false}).then((res) =>{
                    res.data.forEach(e => {
                        this.activeList.push({ id:e.id,is_active:e.is_active,bio_sn:e.bio_sn,app_version:e.app_version,modify_time:this.$tools.formatDate(e.modify_time)});
                    });
                    // //模拟数据 - 已激活
                    // for (let k = 1; k <= 2; k++) {
                    //     this.activeList.push({ id:k,is_active:2,bio_sn:"考勤机" + k,app_version:"1.0.0",modify_time:this.$tools.formatDate(new Date())});
                    // }
                    this.datas = this.datas.concat(this.activeList);
                }).catch((res)=>{
                    //暂无需处理
                }
            );
        },
        handleSortChange({ column, prop, order }) {
            console.log('handleSortChange', column, prop, order);
        },
        handlePageChange(current) {
            this.current = current
        },
        //返回
        back:function() {
            history.go(-1);
        },
        //发现设备
        findfn() {
            //打开搜索
            this.$http.post('/device/findOnOff', 
                {
                    on_off:1,
                    token:this.$tools.getToken()
                },
                {
                    showError: false,
                    showLoading:false
                }
            ).then((res) =>{
                console.log("打开搜索成功...");
                this.finding = true;
                this.$message.info('您已开启自动搜索，60秒后自动停止！');
                console.log("findfn");
                if(this.cmdTimer){clearInterval(this.cmdTimer);this.cmdTimer=null;}
                //发起请求-获得设备列表
                //60秒后，自动停止
                setTimeout(()=>{if(this.finding)this.unfindfn();},this.cmdTimerTimeout);
                this.cmdTimer = setInterval(()=>{
                    //获得已激活设备
                    this.$http.post('/device/findActiveList', {type:2,token:this.$tools.getToken()},{showError: false,showLoading:false}).then((res) =>{
                        this.activeList = [];
                        res.data.forEach(e => {
                            this.activeList.push({ id:e.id,is_active:e.is_active,bio_sn:e.bio_sn,app_version:e.app_version,modify_time:this.$tools.formatDate(e.modify_time)});
                        });
                    }).catch((res)=>{
                        this.activeList = [];
                    });
                    //获得未激活设备
                    this.$http.post('/device/findUnActiveList', {type:2,token:this.$tools.getToken()},{showError: false,showLoading:false}).then((res) =>{
                        res.data.forEach(e => {e.modify_time = this.$tools.formatDate(e.modify_time);});
                        this.unactiveList = res.data;
                        this.datas = [];
                        this.datas = this.datas.concat(this.unactiveList,this.activeList);
                    }).catch((res)=>{
                        this.unactiveList = [];
                        this.datas = [];
                        this.datas = this.datas.concat(this.unactiveList,this.activeList);
                        this.unfindfn();
                        this.$message.info(res.data);
                    });
                },this.cmdTimerInterval);

            }).catch((res)=>{
                this.$message.error('开启搜索失败！');
                return;
            });
        },
        //关闭搜索
        unfindfn() {
            console.log("unfindfn");
            if(this.cmdTimer){clearInterval(this.cmdTimer);this.cmdTimer=null;}
            this.finding = false;
            this.$message.info('自动搜索已停止,点击“发现设备”重新开启自动搜索！');
            this.$http.post('/device/findOnOff', {on_off:2,token:this.$tools.getToken()},{showError: false,showLoading:false}).then((res) =>{
                }).catch((res)=>{
            });
        },
        //激活设备
        btnClickForActive(item){
            this.$http.post('/device/active ', {device_id:item.id,token:this.$tools.getToken()},{showError: true,showLoading:true}).then((res) =>{
                    this.$message.success('激活设备成功！');
                    item.is_active = 2;
            }).catch((res)=>{
            });
        },
        //删除设备- 确定
        btnClickForDelYes(){
            console.log(this.waitForDelID);
            this.$http.post('/device/delete ', {device_id:this.waitForDelID,token:this.$tools.getToken()},{showError: true,showLoading:true}).then((res) =>{
                //遍历 - 删除
                for (let k = 0; k < this.datas.length; k++) {
                    const e = this.datas[k];
                    if(e.id != this.waitForDelID)continue;
                    this.datas.splice(k,1);
                    break;
                }
                this.$message.success(res.info);
                this.deleteDialogVisible = false;
            }).catch((res)=>{

            });
        }
    }
}
</script>

<style scoped lang="less">
    .item {
        margin:20px 0;
        background: #f7f7f7;
        border-radius: 10px;
        padding:20px;
        display: flex;
        justify-content: space-around;
        border:1px solid #e6e6e6;
        width:80%;
        span {
            display: inline-block;
            height: 40px;
            line-height: 40px;
            padding:0 20px;
            text-align: center;
        }
        .borderLeft {
            border-left:2px solid #e6e6e6;
        }
        img {
            vertical-align: middle;
        }
    }
    .top {
        padding-bottom: 30px;
        border-bottom: 2px solid #e6e6e6;
    }
    .bottom {
        padding-top: 20px;
    }
    .delete {
        cursor: pointer;
    }
    .noDevice{
        width: 100%;
        margin: 0 auto;
        margin-top: 15%;
        font-size:40px;
        text-align: center;
        color:gray;
        font-weight:bold;
    }
</style>