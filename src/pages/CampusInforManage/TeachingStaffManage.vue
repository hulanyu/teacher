<template>
    <div>
        <I-table
        title="教职工管理"
        :isUpdate="false"
        >
             <template slot="head">
                <iframe id="fmc" src="/static/biokey.htm" width="100%" height="0" ></iframe>
                <iframe id="fmd" src="/static/nfc.htm" width="100%" height="0" ></iframe>
                    <el-input v-model="search" size="medium" placeholder="姓名/手机" style="width:200px;"></el-input>
                    <el-button size="medium" type="primary" @click="searchbtn">查询</el-button>
                    <div class="right">
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
                    @sort-change="sortChange"
                    @selection-change="changeFun">
                        <el-table-column
                        prop="name"
                        label="姓名"></el-table-column>
                        <el-table-column
                        prop="sex"
                        label="性别"></el-table-column>
                        <el-table-column
                        prop="education"
                        label="学历"></el-table-column>
                        <el-table-column
                        prop="phone"
                        label="手机号码"></el-table-column>
                        <el-table-column
                        prop="work_year"
                        label="工龄"></el-table-column>
                        <el-table-column
                        prop="work_position"
                        label="职务"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="300"
                        >
                        <template slot-scope="scope">
                        	<el-button  type="text" size="small" @click="editshow(scope.row)">编辑</el-button>
                            <el-button  type="text" size="small" @click="addFinger(scope.row)">录入指纹</el-button>
                            <el-button  type="text" size="small"  @click="showNFC(scope.row)">NFC设置</el-button>
                            <el-button  type="text" size="small" @click="deletebtn(scope.row)">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <!-- NFC设置 -->
                    <I-table-editor v-model="dialogFormVisibleNFC" 
                	title="NFC设置" width="500px">
	                    <template slot="content">
	                        <div class="NFCbox">
	                            <el-button class="addNFCbtn" :disabled="!nfcFlag" v-if="!hasNFC" type="success" @click="btnClickForAddNFC">绑定NFC</el-button><br/>
	                            <el-button class="lossNFCbtn" v-if="hasNFC"  @click="btnClickForDelNFC">注销NFC</el-button>
	                        </div>
	                    </template>
                	</I-table-editor>
                	<!--添加NFC成功-->
                	<I-table-editor v-model="dialogFormVisibleAddNFC"
                	title="添加成功">
                	</I-table-editor>
                	<!--挂失NFC成功-->
                	<I-table-editor v-model="dialogFormVisibleLossNFC" 
                	title="挂失成功">
                	</I-table-editor>
                	<!--新增教职工-->
                	<I-table-editor v-model="dialogFormVisibleAdd" 
                	:title="title">
	                   <template slot="content">
	                        <el-form >
	                            <el-form-item label="姓名:" :label-width="formLabelWidth">
	                                <el-input v-model="form.name" auto-complete="off"></el-input>
	                            </el-form-item>
	                            <el-form-item label="性别:" :label-width="formLabelWidth">
								    <el-radio-group v-model="form.sex">
								      <el-radio label="1">男</el-radio>
								      <el-radio label="2">女</el-radio>
								    </el-radio-group>
							  	</el-form-item>
							  	<el-form-item label="学历:" :label-width="formLabelWidth">
								    <el-select v-model="form.education" placeholder="请选择学历">
								      <el-option label="博士后" value="博士后"></el-option>
								      <el-option label="博士" value="博士"></el-option>
								      <el-option label="硕士" value="硕士"></el-option>
								      <el-option label="本科" value="本科"></el-option>
								      <el-option label="专科" value="专科"></el-option>
								    </el-select>
								</el-form-item>
	                            <el-form-item label="手机号码:" :label-width="formLabelWidth">
	                                <el-input v-model="form.phone" auto-complete="off"></el-input>
	                            </el-form-item>
	                            <el-form-item label="工龄:" :label-width="formLabelWidth">
	                                <el-input v-model="form.work_year" auto-complete="off"></el-input><span class="workyearsN">年</span>
	                            </el-form-item>
	                            <el-form-item label="职务:" :label-width="formLabelWidth">
	                                <el-input v-model="form.work_position" auto-complete="off"></el-input>
	                            </el-form-item>
	                        </el-form>
	                    </template>
	                    <template slot="foot">
	                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
	                        <el-button v-if="isAdd == true" class="confirm" type="success"
	                        @click="addconfirm">确 定</el-button>
	                        <el-button v-if="isAdd == false" class="confirm" type="success"
	                        @click="addconfirm">确 定</el-button>
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
                    <!--指纹管理-->
                    <I-table-editor class="teacherBox"  v-model="dialogFormVisibleFinger" title="录入指纹" width="660px" >
                         <template slot="content">
                             <table  style="width:100%; vertical-align: middle;" >
                                <tr style="vertical-align: middle;">
                                    <td v-for="(item, index)  in fingerData" :key="index" style="vertical-align: middle;">
                                        <div class="fingerBox">
                                            <span v-if="item.value==''" @click="btnClickForAddFinger(item)">+</span>
                                            <img  class="hasFingerImg" v-if="item.value!=''" src="/static/imgs/hasfinger.png">
                                            <div  class="hasFingerDel" v-if="item.value!=''" @click="btnClickForDelFinger(item)">×</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5" style="text-align:center;"><img src="/static/imgs/lefthand.png" ></td>
                                    <td colspan="5" style="text-align:center;"><img src="/static/imgs/righthand.png" ></td>
                                </tr>
                             </table>
                             <div class="noticeForAddFinger" v-if="noticeForAddFingerVisible" >
                                 <img :src="noticeForAddFingerSrc">
                                 <el-button type="success" id="cancel" @click="btnClickForAddFingerCancel">取 消</el-button>
                             </div>
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
        	page_size:10,
        	search:"",
            total:"",
        	deleteId:"",//删除ID
            title:'',//新增和编辑的标题
            dialogFormVisibleNFC: false,
            dialogFormVisibleAddNFC:false,
            dialogFormVisibleLossNFC:false,
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            dialogFormVisibleDetail:false,
            dialogFormVisibleFinger:false,      //指纹管理界面
            watiForOperID:0,                    //教职工ID
            entryId:{},                         //指纹ID
            watiForOperNFCCode:"",              //教职工NFC编码
            fingerType:"",//手指类型
            noticeForAddFingerVisible:false,           //显示录入指纹步骤
            noticeForAddFingerSrc:"/static/imgs/finger_01.png",
            noticeForAddFingerSrc1:"/static/imgs/finger_01.png",
            noticeForAddFingerSrc2:"/static/imgs/finger_02.png",
            noticeForAddFingerSrc3:"/static/imgs/finger_03.png",
            noticeForAddFingerSrc4:"/static/imgs/finger_04.png",
            fmc:null,
            fmd:null,
            biokeyFlag:false,       //biokey是否加载完毕
            nfcFlag:false,          //nfc是否加载完毕
            regFingerCount:3,
            regFingerStep:1,
            waitForOperItem:{}, //等待操作的教职工信息   
            hasNFC:false,
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
                name: '',
                sex: '',
                education: '',
                phone: '',
                work_year: '',
                work_position: ''
            },
            //获取的数据
            tableData: [
               
            ],
            //指纹序号及对应数据
            fingerData:[
                {label:"l-5",value:""},
                {label:"l-4",value:""},
                {label:"l-3",value:""},
                {label:"l-2",value:""},
                {label:"l-1",value:""},
                {label:"r-1",value:""},
                {label:"r-2",value:""},
                {label:"r-3",value:""},
                {label:"r-4",value:""},
                {label:"r-5",value:""},
            ],
        };
    },
    mounted () {
    	this.req();
        this.fmc = document.getElementById('fmc');
        this.fmd = document.getElementById('fmd');
        window.addEventListener('message',this.receivedMsg);
    },
    destroyed(){
        window.removeEventListener('message',this.receivedMsg);
        this.fmc.setAttribute("src","");
        this.fmd.setAttribute("src","");
    },
    methods: {
    	//刷新
    	refresh() {
    		this.search = "";
            this.req();
        },
    	req() {
    		this.$http.post("/Staff/index",{
    			token: localStorage.jxtoken,
    			page_number: this.page_number,
        		sort: this.sort,
        		order: this.order,
        		page_size: this.page_size,
        		search: this.search
    		})
    		.then(res => {
    			console.log("教职工信息",res);
    			if(this.page_number > 1) {
                    if(!res.data) {
                        this.page_number = this.page_number - 1
                        this.req()
                    }
              }
        		this.tableData = res.data.rows;
        		//console.log("this.tableData",this.tableData);
                this.total_page = parseInt(res.data.page.total)
    		})
    	},
        //查询
        searchbtn() {
            this.page_number = 1;
            this.req();
        },
        //确认新增
        addconfirm() {
            let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
            let num = /^(0|([1-9]\d{0,1}))$/;
            let cnName = /^[\u4E00-\u9FA5]{2,15}$/;
			let enName = /^[A-Za-z]+$/;
        	if(this.form.name.trim() == "") {
        		this.$message.error("请输入姓名！");
        		return;
            }
            if(!cnName.test(this.form.name) && !enName.test(this.form.name)) {
				this.$message.error('输入的姓名不规范!'); 
        		return;
			}
        	if(this.form.sex == "") {
        		this.$message.error("请选择性别！");
        		return;
        	}
        	if(this.form.education.trim() == "") {
        		this.$message.error("请选择学历！");
        		return;
        	}
        	if(this.form.phone == "" || !mobile.test(this.form.phone) ) {
        		this.$message.error("请输入正确的手机号码！");
        		return;
        	}
        	if(this.form.work_year == "" || !num.test(this.form.work_year)) {
        		this.$message.error("请输入两位以内的数字且为正整数！");
        		return;
            }
        	if(this.form.work_position.trim() == "") {
        		this.$message.error("请输入职务！");
        		return;
        	}
            this.form.token = localStorage.jxtoken;
            console.log("表单内容",this.form);
        	if(this.isAdd) {
        		this.$http.post("/Staff/add",this.form)
	        	.then(res => {
	        		this.$message.success(res.info);
	        		this.dialogFormVisibleAdd = false;
	        		this.req();
	        	})
	        	.catch(res => {
	        		this.$message.error(res.info);
	        	})
        	} else {
        		this.$http.post("/Staff/edit",this.form)
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
        	this.$http.post("/Staff/delete",{
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
        //接收到iframe消息
        receivedMsg(msg){
            msg = msg.data;
            switch (msg.code) {
                case "nfc_ok":
                    this.nfcFlag = true;
                    this.sendMsg({code:"nfc_start",data:null});
                    break;
                case "nfc_error":
                    this.$message.error(msg.data);
                    this.sendMsg({code:"nfc_stop",data:null});
                    break;
                case "nfc_OnReadCard":
                    this.$message.info("NFC_CODE=" + msg.data);
                    //提交接口，绑定nfc_code
					this.$http.post("/Staff/add_nfc",{
						token: localStorage.jxtoken,
						id: this.watiForOperID,
						nfc_code: msg.data
					})
					.then(res => {
						this.$message.success(res.info);
						this.dialogFormVisibleNFC = false;
						this.req();
                    })
                    .catch(res => {
                        this.$message.error(res.info);
                    })
                    break;
                case "fp_ok":
                    // this.$message.error("指纹阅读器加载完毕！");
                    this.biokeyFlag = true;
                    this.sendMsg({code:"fp_start",data:null});
                    break;
                case 'fp_error':
                    this.$message.error(msg.data);
                    this.sendMsg({code:"fp_stop",data:null});
                    break;
                case 'fp_OnEnroll':        //登记指纹回调        对应发送{code:"fp_reg",data:3}
                    //{ret:true,template:模板的BASE64字符串}
                    //console.log("教师指纹管理==>" + "ret=" + msg.data.ret + ",data=" +  msg.data.template);
                    //return;
                    if(!msg.data.ret){
                        this.regFingerStep = 1;
                        this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
                        this.$message.error("获取指纹模板失败，请重新录入！");
                        //继续，重新开启指纹录入
                        this.btnClickForAddFinger(this.waitForOperItem);
                        break;
                    }
                    this.noticeForAddFingerSrc = this.noticeForAddFingerSrc4;
                    //发起请求，入库指纹。
                    this.$http.post("/Staff/add_entry",{
                    	token: localStorage.jxtoken,
                    	id: this.watiForOperID,
                    	type: this.fingerType,
                    	entry_list: msg.data.template
                    })
                    .then(res => {
                        //console.log(res);
                        this.$message.success("添加成功");
                        this.entryId[this.fingerType] = res.data.entry_id;
                        //console.log("指纹ID",this.entryId);
                        this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
                        this.noticeForAddFingerVisible = false;
                        this.waitForOperItem.value = ".....";
                    })
                    .catch(res=>{
                        //console.log("错误信息：",res);
                        this.$message.error(res.info);
                        //继续，重新开启指纹录入
                        this.regFingerStep = 1;
                        this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
                        this.btnClickForAddFinger(this.waitForOperItem);
                    })
                    break;
                case 'fp_OnFeatureInfo':   //登记指纹过程中回调  对应发送{code:"fp_reg",data:3}
                    //msg.data:
                    //0：好的指纹特征 
                    //1: 特征点不够 
                    //2: 其它原因导致不能取到指纹特征 
                    //-1:  可疑指纹
                    if(!this.dialogFormVisibleFinger)break;
                    if(msg.data!=0)break;
                    if(msg.data==0){
                        this.regFingerStep++;
                        switch (this.regFingerStep) {
                            case 1:this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1; break;
                            case 2:this.noticeForAddFingerSrc = this.noticeForAddFingerSrc2;break;
                            case 3:this.noticeForAddFingerSrc = this.noticeForAddFingerSrc3;break;
                        }
                    }
                    break;
            }
        },
        //发送消息到iframe消息
        sendMsg(msg){
            console.log("发送iframe消息:" + msg);
            if(msg.code.indexOf("fp_")!=-1){
                try{this.fmc.contentWindow.postMessage(msg,"*");}catch(e){}
            }else{
                try{this.fmd.contentWindow.postMessage(msg,"*");}catch(e){}
            }
        },
    	sortChange({ column, prop, order }) {
            console.log('sortChange', column, prop, order);
        },
        pageChange(current) {
            this.page_number = current
            this.req()
        },
        changeFun(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        //显示新增窗口
        addbtn() {
            this.form = {
	                name: '',
	                sex: '',
	                education: '',
	                phone: '',
	                work_year: '',
	                work_position: ''
                }
            this.title = "新增教职工";
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
        },
        //编辑
        editshow(val) {
           for (var key in val) {
               if(val[key] == "男") {
                    this.form[key] = "1";
               } else if(val[key] == "女") {
                    this.form[key] = "2";
               } else {
                   this.form[key] = val[key];
               }
                
            }
            this.title = "编辑教职工";
            this.form.work_year = parseInt(this.form.work_year);
            console.log("编辑",typeof this.form.work_year)
            this.isAdd = false;
            this.dialogFormVisibleAdd = true;
        },
        //显示删除窗口
        deletebtn(val) {
        	this.deleteId = val.id;
        	this.dialogFormVisibleDelete = true;
        },
        //录入指纹
        addFinger(item){
        	for(var k = 0; k < 10; k++) {
            	this.fingerData[k].value = "";
            }
            //alert("录入指纹:" + item.id);
             this.$http.post("/Staff/list_entry",{
             	token: localStorage.jxtoken,
            	id:item.id
            })
            .then(res => {
            	//console.log(res.data);
            	var data = res.data;
            	for(let i = 0; i < 10; i ++) {
            		for(let j = 0; j < data.length; j ++) {
            			if(this.fingerData[i].label == data[j].type) {
            				this.fingerData[i].value = data[j].id;
            				//this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
            			}
            		}
            	}
            })
            .catch(res => {
            	this.$message.error(res.info);
            })
            this.watiForOperID =item.id;
            this.dialogFormVisibleFinger = true;
            this.noticeForAddFingerVisible = false;
        },
        //删除指定的指纹ID
        btnClickForDelFinger(item){
            //alert("删除指纹:" + item.label);
            this.$http.post("/Staff/del_entry",{
            	token: localStorage.jxtoken,
            	id: this.entryId[item.label] ? this.entryId[item.label] : item.value
            })
            .then(res => {
            	this.$message.success(res.info);
            	item.value = "";
            })
            
        },
        //添加指定的学生ID的指纹
        btnClickForAddFinger(item){
            // if(!this.biokeyFlag){this.$message.error("指纹阅读器未正确加载，无法执行当前操作！");return;}
            //alert(item.label);
            this.fingerType = item.label;
            this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
            this.noticeForAddFingerVisible = true;
            this.regFingerStep=1;
            this.waitForOperItem = item;
            this.sendMsg({code:"fp_reg",data:this.regFingerCount});
            console.log({code:"fp_reg",data:this.regFingerCount});
            return;
            setTimeout(()=>{
                //this.noticeForAddFingerSrc = this.noticeForAddFingerSrc2;
                this.receivedMsg({code:"fp_OnFeatureInfo",data:0});
                setTimeout(()=>{
                    //this.noticeForAddFingerSrc = this.noticeForAddFingerSrc3;
                    this.receivedMsg({code:"fp_OnFeatureInfo",data:0});
                    setTimeout(()=>{
                        //this.noticeForAddFingerSrc = this.noticeForAddFingerSrc4;
                        this.receivedMsg({code:"fp_OnFeatureInfo",data:0});
                        setTimeout(()=>{
                            // this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
                            // this.noticeForAddFingerVisible = false;
                            // item.value = "有啦...";
                            // this.$message.success('录入指纹成功！');
                            this.receivedMsg({code:"fp_OnEnroll",data:{ret:true,template:"template"}});
                        },2000);
                    },2000);
                },2000);
            },2000);
        },
        //NFC设置界面开启
        showNFC(item){
        	console.log("当前教职工的信息",item);
        	if(!item.nfc_code) { 
        		this.hasNFC = false;
        	} else {
        		this.hasNFC = true;
        	}
        	this.watiForOperID =item.id;
            this.watiForOperNFCCode = item.nfc_code;
            this.dialogFormVisibleNFC = true
        },
        //绑定NFC
        btnClickForAddNFC(){
            this.sendMsg({code:"nfc_start",data:null});
            this.$message.info("NFC已开启，请刷卡！");
            //alert(this.watiForOperNFCCode);
        },
        //注销NFC
        btnClickForDelNFC(item){
            //alert("删除：" + this.watiForOperNFCCode);
            this.$http.post("/Staff/delete_nfc",{
            	token: localStorage.jxtoken,
            	id: this.watiForOperID
            })
            .then(res => {
            	this.$message.success(res.info);
            	this.dialogFormVisibleNFC = false;
            	this.req();
            })
            .catch(res => {
            	this.$message.error(res.info);
            })
        },
        //取消录入指纹
        btnClickForAddFingerCancel(){
            console.log("cancel");
            this.sendMsg({code:"fp_reg_cancel",data:null});
            this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
            this.noticeForAddFingerVisible = false;
            this.fingerType = "";
            this.regFingerStep=1;
            this.waitForOperItem = {};
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
    .addNFCbtn {
        margin-bottom: 40px;
        width: 120px;
    }
    .lossNFCbtn {
    	width:120px;
    }
    .el-dialog {
        border-radius: 8px !important;
    }
    .el-dialog__header {
        border-radius: 8px 8px 0 0;
    }
    .el-dialog__body {
        .NFCbox {
            text-align: center;
        }
    }
    .el-select {
    	width: 100%;
    }
    .el-form-item {
    	width: 50%;
    	margin: 0 auto;
    	margin-bottom: 22px;
    }
    .workyearsN {
    	position:absolute;
    	right: 10px;
    	top: 2px;
    }
    .el-button--text {
        padding:5px;
        background: #409EFF;
        color:#fff;
        margin-bottom: 0;
    }
    .el-button--text:focus, .el-button--text:hover {
    	color:#fff;
    	background: #409EFF;
    	border-color: transparent;
    }
    .right {
        position: absolute;
        right: 10px;
        top: 22px;
    }
    .fingerBox{
        width:50px;
        height: 45px;
        box-shadow:1px 1px 1px #cccccc;
        border: 1px solid #cccccc;
        border-radius: 8px;
        text-align: center;
        vertical-align:middle;
        font-size:45px;
        line-height: 45px;
        color:#cccccc;
        cursor: pointer;
        position: relative;
    }
    .fingerBox:hover{
        color:#1CB394;
        box-shadow:2px 2px 2px #cccccc;
        border-color: #1CB394;
    }
    .fingerBox .hasFingerImg{
        width: 71%;
        height: 90%;
    }
    .fingerBox .hasFingerDel{
        position: absolute;
        width: 14px;
        height: 14px;
        font-size: 13px;
        line-height: 14px;
        border-radius: 8px;
        border:1px solid  red;
        top:0px;
        right: 0px;
        background-color: red;
        color: #fff;
    }
    .fingerBox .hasFingerDel:hover{
       border:1px solid  #1CB394;
    }
    .noticeForAddFinger{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        position: absolute;
        left: 0;
        top:0;
    }
    .noticeForAddFinger img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 10px;
    }
    #cancel {
        position: absolute;
        bottom: 90px;
        left: 40%;
        width: 20%;
    }
</style>
