<template>
  <I-table
  title="充值退款"
  @update="init">
      <template slot="head">
            <iframe id="fmc" src="/static/biokey.htm" width="100%" height="0" ></iframe>
            <iframe id="fmd" src="/static/nfc.htm" width="100%" height="0" ></iframe>
            <el-date-picker
            v-model="startDatetime"
            type="date"
            placeholder="开始日期"
            :picker-options="startDatetimePickerOptions"
            :editable="false"
            @change="startDatetimeChange">
            </el-date-picker>
            <el-date-picker
            v-model="endDatetime"
            type="date"
            placeholder="结束日期"
            :picker-options="endDateTimePickerOptions"
            :editable="false"
            @change="endDatetimeChange">
            </el-date-picker>
            <el-select v-model="qryType" placeholder="请选择">
					    <el-option
					      v-for="item in qryTypeOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
  
            <el-input v-model="search" size="smail" placeholder="请输入姓名" style="width:150px;"></el-input>
            <el-button size="primary"
            @click="searchChange">查询</el-button>
            <el-button size="smail" style="background-color: #41cac0;color: #fff;" @click="exportFn">导出记录</el-button>
            <el-button type="danger" style="float:right;"
            :disabled="!(biokeyFlag || nfcFlag)"
            @click="showSignBox = true">充值 / 退款</el-button>
      </template>
      <template slot="content" slot-scope="props">
            <el-table
            border
            row-class-name="table-row"
            :height="props.maxHeight"
            :data="tableData"
            @sort-change="sortChange">
                <el-table-column
                prop="name"
                label="学生名称"></el-table-column>
                <el-table-column
                sortable
                prop="class_name"
                label="班级"></el-table-column>
                <el-table-column
                prop="operation_type"
                label="操作类型"></el-table-column>
                <el-table-column
                prop="operation_money"
                label="金额"></el-table-column>
                <el-table-column
                prop="operation_time"
                label="时间"></el-table-column>
                <el-table-column
                prop="operation_name"
                label="操作者"></el-table-column>
                <el-table-column
                prop="ps"
                sortable
                label="备注"></el-table-column>
            </el-table>
            
            <el-dialog
            :visible.sync="showSignBox"
            width="300px"
            :before-close="handleSignBoxClose">
                <div class="waiting">
                    <img :src="waitImg" alt="">
                    <div>等待学生打卡...</div>
                </div>
            </el-dialog>

            <I-table-editor v-model="showMoneyBox" 
            title="充值信息"
            width="400px">
                <template slot="content">
                    <el-form class="money-form-box">
                        <el-form-item label="学生姓名">
                            {{moneyInfo.name}}
                        </el-form-item>
                        <el-form-item label="班级">
                            {{moneyInfo.class_name}}
                        </el-form-item>
                        <el-form-item label="余额">
                            {{moneyInfo.money}}
                        </el-form-item>
                        <el-form-item label="操作类型">
                            <el-select v-model="moneyInfo.selectType" placeholder="请选择" style="width: 100px;"
                            size="small">
                                <el-option label="充值" value="1"></el-option>
                                <el-option label="退款" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="充值/退款金额">
                            <el-input-number v-model="moneyInfo.operMoney" label="请输入"
                            size="mini"
                            :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input
                            size="small"
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="moneyInfo.ps">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showMoneyBox = false">取 消</el-button>
                    <el-button type="success" class="confirm"
                    @click="confirmRecharge">确 定</el-button>
                </template>
            </I-table-editor>
            <I-table-editor v-model="dialogFormVisibleRecharge" 
            :title="title" width="400px">
                <template slot="content">
                    <span>确认进行该操作？</span>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="dialogFormVisibleRecharge = false">取 消</el-button>
                    <el-button type="success" class="confirm"
                    @click="handleMoney">确 定</el-button>
                </template>
            </I-table-editor>

      </template>
      <template slot="foot">
          <I-table-page
          :total="total_page"
          @change="pageChange"></I-table-page>
      </template>
  </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
    data() {
        return {
            waitImg:"/static/imgs/wait.png",
            disabled:false,
            fmc:null,
            fmd:null,
            biokeyFlag:false,       //biokey是否加载完毕
            nfcFlag:false,          //nfc是否加载完毕
            startDatetimePickerOptions:{
                disabledDate(time) {return time.getTime() > Date.now();}
            },
            endDateTimePickerOptions:{
                disabledDate(time) {return time.getTime() > Date.now();}
            },
            dialogFormVisibleRecharge:false,//确认充值/退款操作弹框
            tableData: [],
            search: '',
            startDatetime: this.$tools.formatDate(new Date().getTime()/1000 - 6*60*60*24,'yyyy-MM-dd'),
            endDatetime: this.$tools.formatDate(new Date().getTime()/1000,'yyyy-MM-dd'),
            qryType:1,
            qryTypeOptions:[{label:"充值",value:1},{label:"退款",value:0}],
            showSignBox: false, // 打卡box
            showMoneyBox: false, // 充值box
            title:"",//确认充值/退款操作的标题
            moneyInfo: {
                id:"",
                name: '',
                class_name: '',
                money: 0,
                selectType: '1',    // 	1:充值。0:扣款
                operMoney: 0,
                ps: '',
            },
            page_size:10,
            sort:"",
            order:"",
            total_page:0
        };
    },
    watch: {
        showSignBox (isShow) {
            if (isShow) {
                //开始打卡
                console.log("开始打卡...");
                //add by xing.wei 在Chrome中调试
                // setTimeout(()=>{
                //         this.reveivedMsg({code:"fp_OnCapture",data:1});
                // },2000);
                // setTimeout(()=>{
                //         this.reveivedMsg({code:"nfc_OnReadCard",data:"709945A8"});
                // },2000);

                this.sendMsg({code:"fp_start",data:null});
                this.sendMsg({code:"nfc_start",data:null});
                
            }else{
                //结束打卡
                console.log("结束打卡...");
                this.sendMsg({code:"fp_stop",data:null});
                this.sendMsg({code:"nfc_stop",data:null});
            }
        },
        
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        this.init();
        this.fmc = document.getElementById('fmc');
        this.fmd = document.getElementById('fmd');
        window.addEventListener('message', this.receivedMsg);
    },
    beforeDestroy: function() {
    },
    destroyed(){
		window.removeEventListener('message',this.receivedMsg);
        this.fmc.setAttribute("src","");
        this.fmd.setAttribute("src","");
    },
    methods: {
        init() {
            this.startDatetime = this.$tools.formatDate(new Date().getTime()/1000 - 6*60*60*24,'yyyy-MM-dd');
            this.endDatetime = this.$tools.formatDate(new Date().getTime()/1000,'yyyy-MM-dd');
            this.search="";
            this.sort="";
            this.order="";
            this.page_current=1;
            this.page_size=10;
            this.total_page=0;
            //执行查询
            this.searchChange();
        },
        //接收到iframe消息
        receivedMsg(msg){
            msg = msg.data;
            switch (msg.code) {
                case "fp_ok":
                    console.log("指纹模块已完成");
                    this.getFingerData();
                    this.biokeyFlag = true;
                    break;
                case "fp_add":
                    //alert("获取总指纹数：" + msg.data.total +"个，实际加入" + msg.data.add + "个！");
                    this.$message.success("获取总指纹数：" + msg.data.total.toString() +"枚，实际加入" + msg.data.add.toString() + "枚");
                    break;
                case 'fp_error':
                    this.$message.error(msg.data);
                    this.sendMsg({code:"fp_stop",data:null});
                    break;
                case 'fp_OnEnroll':        //登记指纹回调        对应发送{code:"fp_reg",data:3}
                    //{ret:true,template:模板的BASE64字符串}
                    break;
                case 'fp_OnCapture':       //读取到指纹特征回调
                    //{ret:true,template:特征码}
                    if(!this.showSignBox)return;
                    if(msg.data<=0){
                        this.$message.error("未找到匹配的指纹信息，请重按手指！");
                        break;
                    }
                    //获取学生信息
                    this.$http.post('/MoneyLog/balance  ', {
                        entry_id:msg.data,
                        token:localStorage.jxtoken
                    }).then((res) => {
                        this.moneyInfo.id = res.data.id;
                        this.moneyInfo.name = res.data.name;
                        this.moneyInfo.money = res.data.money;
                        this.moneyInfo.class_name = res.data.class_name;
                        this.moneyInfo.operMoney = 0;
                        this.moneyInfo.ps="";
                        this.showSignBox = false;
                        this.showMoneyBox = true;
                    }).catch(res=>{
                        this.$message.error(res.info);
                    });
                    break; 
                case 'fp_OnFeatureInfo':   //登记指纹过程中回调  对应发送{code:"fp_reg",data:3}
                    //msg.data:
                    //0：好的指纹特征 
                    //1: 特征点不够 
                    //2: 其它原因导致不能取到指纹特征 
                    //-1:  可疑指纹
                    break;
                case "nfc_ok":
                    console.log("nfc模块已完成");
                    this.nfcFlag = true;
                    this.sendMsg({code:"nfc_start",data:null});
                    break;
                case "nfc_error":
                    this.$message.error(msg.data);
                    this.sendMsg({code:"nfc_stop",data:null});
                    break;
                case "nfc_OnReadCard":
                    //this.$message.info("NFC_CODE=" + msg.data);
                    if(!this.showSignBox)return;
                    //获取学生信息
                    this.$http.post('/MoneyLog/checkuser', {
                        nfc_code:msg.data,
                        token:localStorage.jxtoken
                    }).then((ret) => {
                        //通过ID获得学生余额信息
                        this.$http.post('/MoneyLog/balance  ', {
                            id:ret.data.id,
                            token:localStorage.jxtoken
                        }).then((res) => {
                            this.moneyInfo.id = res.data.id;
                            this.moneyInfo.name = res.data.name;
                            this.moneyInfo.money = res.data.money;
                            this.moneyInfo.class_name = res.data.class_name;
                            this.moneyInfo.operMoney = 0;
                            this.moneyInfo.ps="";
                            this.showSignBox = false;
                            this.showMoneyBox = true;
                        }).catch(res=>{
                            //this.$message.error(res.info);
                            this.$message.error("未找到匹配的NFC学生信息，请重新刷卡！");
                        });
                    }).catch(res=>{
                        //this.$message.error(res.info);
                        this.$message.error("未找到匹配的NFC信息，请重新刷卡！");
                    });
                    
                    break;
            }

        },
        //发送消息到iframe消息
        sendMsg(msg){
            console.log("发送iframe消息:" + msg);
            try {
	            	if(msg.code.indexOf("fp_")!=-1){
	                this.fmc.contentWindow.postMessage(msg,"*");
	            }else{
	                this.fmd.contentWindow.postMessage(msg,"*");
	            }
            }
            catch(e) {
            	console.error("error",e.message);
            }
            
        },
        //获取指纹
        getFingerData(){
            //调用接口获取全部指纹
            this.$message.info('加载载中...');
            this.$http.post('/MoneyLog/entry', {
                token:localStorage.jxtoken
            }).then((res) => {
                console.log("获取到指纹信息:" + JSON.stringify(res.data));
                this.sendMsg({code:"fp_add",data:res.data});
            }).catch(res=>{
                this.$message.error(res.info);
            });
        },
        //时间改变
        startDatetimeChange() {
            console.log(this.startDatetime);
            if(this.endDatetime=="" || this.endDatetime==null)return;
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('开始日期不能大于开始日期！');
                this.startDatetime = this.endDatetime;
            }
        },
        endDatetimeChange() {
            if(this.startDatetime=="" || this.startDatetime==null)return;
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('结束日期不能小于开始日期！');
                this.startDatetime = this.endDatetime;
            }
        },
        getSchoolUsername () {
            // 测试
            this.moneyInfo = {
                name: '小名',
                grade: '三年二班',
                endMoney: 25.09,
                selectType: '1',
                money: 0.01,
                text: 'hhh',
            }
        },
        sortChange({ column, prop, order }) {
            this.sort = column.property
            if(column.order == 'ascending') {
                this.order = 'asc'
            }else if(column.order == 'descending') {
                this.order = 'desc'
            }
            this.searchChange();
        },
        pageChange(current) {
            this.page_current = current
            this.searchChange()
        },
        searchChange() {
            this.$http.post('/MoneyLog/index', {
                sort: this.sort,
                order: this.order,
                page_number: this.page_current,
                page_size: this.page_size,
                token:localStorage.jxtoken,
                start_date:this.$tools.formatDate(this.startDatetime.toString(),"yyyy-MM-dd"),
                end_date:this.$tools.formatDate(this.endDatetime.toString(),"yyyy-MM-dd"),
                search:this.search,
                operation_type:this.qryType
            })
            .then((res) => {
                console.log(res)
                if(res.data.rows) {
                    res.data.rows.forEach(e => {
                    e.operation_time = this.$tools.formatDate(e.operation_time,"yyyy-MM-dd hh:mm:ss");
                    });
                    res.data.rows.forEach(e=>{
                    	if(e.operation_type==0){
                    		e.operation_type = "退款";
                    		e.operation_money = "-" + e.operation_money;
                    	}else if(e.operation_type==1){
                    		e.operation_type = "充值";
                    	}
                    });
                    this.tableData = res.data.rows;
                    this.total_page = parseInt(res.data.page.total);
                }else {
                    this.page_number = 1
                    this.total_page = 1
                    this.tableData = []
                }
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        handleSignBoxClose () {
            console.log('关闭打卡');
            this.showSignBox=false;
            this.sendMsg({code:"fp_stop",data:null});
        },
        //显示确认该操作弹框
        confirmRecharge () {
            if(this.moneyInfo.selectType == 1) {
                this.title = "充值";
            }else if(this.moneyInfo.selectType == 0) {
                this.title = "退款";
            }
            this.dialogFormVisibleRecharge = true;
        },
        // 确认充值信息
        handleMoney () {
            console.log('充值信息', this.moneyInfo);
            this.$http.post('/MoneyLog/editbalance', {
                token:localStorage.jxtoken,
                id:this.moneyInfo.id,
                operation_type:this.moneyInfo.selectType,
                operation_money:this.moneyInfo.operMoney,
                ps:this.moneyInfo.ps
            }).then((res) => {
                if(this.moneyInfo.selectType==1){
                    this.$message.success("恭喜您，充值成功！");
                    this.init();
                }else if(this.moneyInfo.selectType==0)
                {
                    this.$message.success("恭喜您，退款成功！");
                }
                this.showSignBox = false;
                this.showMoneyBox = false;
                this.dialogFormVisibleRecharge = false;
            }).catch(res=>{
                this.$message.error(res.info);
            });
        },
        // 打开充值界面
        handleShowMoneyBox () {
            // setTimeout(() => {
               
            //     setTimeout(() => {
            //         this.getSchoolUsername()
            //     }, 1000)
            // }, 2000)
        },
        //充值扣款导出
        exportFn() {
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyy-MM-dd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyy-MM-dd")
            this.$tools.exportFile('/MoneyLog/export', {
                start_date:start,
                end_date:end,
                search:this.search,
                operation_type:this.qryType,
                token:localStorage.jxtoken
            },{type: 'get'});
            // window.open(config.BASEURL+"/MoneyLog/export?token="+localStorage.jxtoken+"&start_date="+
            // this.startDatetime+"&end_date="+this.endDatetime+"&search="+this.search);
        }
    }
}
</script>

<style lang="less">
.money-form-box {
    .el-form-item {
        margin-bottom: 0px;
    }
}
.waiting {
    text-align: center;
}
</style>
