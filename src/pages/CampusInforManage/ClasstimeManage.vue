<template>
    <div>
        <I-table
        title="上课时间管理"
		:isUpdate="false"
        >
            <template slot="head">
                <div>
                    <el-button size="medium" type="success" class="confirm addbtn" @click="addbtn">新 增 规 则</el-button>
                    <el-button size="medium" type="primary" @click="refresh">刷 新</el-button>
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
                        label="规则名称"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="300"
                        >
	                        <template slot-scope="scope">
	                        	<el-button  type="text" size="small" @click="editshow(scope.row)">编辑</el-button>
	                        	<el-button  type="text" size="small" @click="lookbtn(scope.row)">查看</el-button>
	                            <el-button  type="text" size="small" @click="deletebtn(scope.row)">删除</el-button>
	                        </template>
                        </el-table-column>
                    </el-table>
                	<!--新增规则-->
                	<I-table-editor v-model="dialogFormVisibleAdd" 
                	:title="title">
	                   <template slot="content">
	                   		<el-form >
	                            <el-form-item label="规则名称:" :label-width="formLabelWidth">
	                                <el-input v-model="form.name" auto-complete="off"></el-input>
	                            </el-form-item>
		                        <el-form-item label="生效时间:" :label-width="formLabelWidth" >
								    <el-col :span="11">
								      <el-date-picker 
									  type="date" 
									  v-model="form.start_time"
									  :editable="false"
									  style="width: 100%;" 
									  @change="checkStartTime" 
									 ></el-date-picker>
								    </el-col>
								    <el-col class="line" :span="2" style="text-align: center;">至</el-col>
								    <el-col :span="11">
								      <el-date-picker 
									   type="date" 
									   v-model="form.end_time" 
									   :editable="false"
									   style="width: 100%;" 
									   @change="checkEndTime" 
									 ></el-date-picker>
								    </el-col>
								</el-form-item>
								<el-form-item label="星   期:" :label-width="formLabelWidth">
								    <el-checkbox-group v-model="form.week">
								      <el-checkbox value="1" label="1" name="week">星期一</el-checkbox>
								      <el-checkbox value="2" label="2" name="week">星期二</el-checkbox>
								      <el-checkbox value="3" label="3" name="week">星期三</el-checkbox>
								      <el-checkbox value="4" label="4" name="week">星期四</el-checkbox>
								      <el-checkbox value="5" label="5" name="week">星期五</el-checkbox>
								      <el-checkbox value="6" label="6" name="week">星期六</el-checkbox>
								      <el-checkbox value="0" label="0" name="week">星期日</el-checkbox>
								    </el-checkbox-group>
								</el-form-item>
								<el-form-item label="课时设置:" :label-width="formLabelWidth">
									<div v-for="(item,index) in site" :key="index" class="siteBox" :data-index="index">
										<el-col :span="6">
											<el-time-select
											  v-model="item.start_time"
											  :editable="false"
											  :picker-options="{
											    start: '05:00',
											    step: '00:05',
											    end: '23:00'
											  }"
											  @change="siteStartTimeCheck"
											>
											</el-time-select>
									    </el-col>
									    <el-col class="line" :span="1" style='text-align: center;'>至</el-col>
									    <el-col :span="6">
									    	<el-time-select
											  v-model="item.end_time"
											  :editable="false"
											  :picker-options="{
											    start: '05:00',
											    step: '00:05',
											    end: '23:00'
											  }"
											  @change="siteEndTimeCheck"
											>
											</el-time-select>
									    </el-col>
									    <el-col :span="8" class="margin_left">
									      <el-input type="text" placeholder="填入课时名称" v-model="item.name" style="width: 100%;"></el-input>
									    </el-col>
									    <el-col :span="1">
									    	<img v-if="item.is_first" @click="addSite" class="plusbtn" src="/static/imgs/addBtn.png"/>
									    </el-col>
									    <el-col :span="1">
									    	<img v-if="!item.is_first" @click="deleteSite" class="plusbtn" src="/static/imgs/close.png"/>
									    </el-col>
									</div>
								</el-form-item>
	                        </el-form>
	                    </template>
	                    <template slot="foot">
	                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
	                        <el-button v-if="isAdd == true" class="confirm" type="success"
	                        @click="addconfirm">保 存</el-button>
	                        <el-button v-if="isAdd == false" class="confirm" type="success"
	                        @click="addconfirm">保 存</el-button>
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
            		<!--查看-->
            		<I-table-editor v-model="dialogFormVisibleDetail" 
	                title="查看">
	                    <template slot="content">
							  <el-table :data="tableDatas" border style="width: 100%;border:1px solid #ebeef5;border-bottom: none;">
							    <el-table-column prop="class_hour" label="课时" align="center"></el-table-column>
							    <el-table-column prop="w1" label="星期一"  align="center"></el-table-column>
							    <el-table-column prop="w2" label="星期二"  align="center"></el-table-column>
							    <el-table-column prop="w3" label="星期三"  align="center"></el-table-column>
							    <el-table-column prop="w4" label="星期四" align="center"></el-table-column>
							    <el-table-column prop="w5"  label="星期五" align="center"></el-table-column>
							  </el-table>
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
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            dialogFormVisibleDetail:false,
			multipleSelection:[], //选中的数据
			site_start:"",//课时开始时间
			site_end:"",//课时结束时间
            formLabelWidth: '100px',
            isAdd:true,
            deleteId:"",//删除
            //搜索参数
            type:"",
            number:"",
            page_number:1,
            page_size:10,
            total_page:0,
            sort:"",
			order:"",
			title:"",//新增和编辑标题
          	//编辑添加参数
            form: {
                id:"",
                name:"",
                start_time:"",
                end_time:"",
                week:[],
                site:[]
                
            },
            //获取的数据
            tableData: [
               
            ],
            //查看的数据
            tableDatas:[
            	
            ],
            //课时设置数据
            site: [
            	{
            		name:"",
            		start_time:"",
            		end_time:"",
            		is_first:true
            	}
            ]
        };
    },
    mounted() {
		this.req();
    },
    methods: {
    	refresh() {
    		this.req();
    	},
    	req() {
    		this.$http.post("/SchoolTime/lists",{
    			token: localStorage.jxtoken,
    			page_size: this.page_size,
    			page_number: this.page_number,
    			sort: this.sort,
    			order: this.order
    		})
    		.then(res => {
    			console.log("列表数据",res);
    			this.tableData = res.data.row;
    			this.total_page = parseInt(res.data.page.total);
    		})
    		.catch(res => {
    			this.$message.error(res.info);
    		})
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
		//有效时间改变
		checkStartTime() {
			if(this.form.end_time == "" || this.form.end_time == null)return;
			var start = this.$tools.formatDate(this.form.start_time.toString(),"yyyyMMdd");
			var end = this.$tools.formatDate(this.form.end_time.toString(),"yyyyMMdd")
			if(start>end){
                this.$message.error('开始日期不能大于结束日期！');
                this.startDatetime = this.endDatetime;
            }
		},
		checkEndTime() {
			if(this.form.start_time == "" || this.form.start_time == null)return;
			var start = this.$tools.formatDate(this.form.start_time.toString(),"yyyyMMdd");
			var end = this.$tools.formatDate(this.form.end_time.toString(),"yyyyMMdd")
			if(start>end){
                this.$message.error('结束日期不能小于开始日期！');
                this.startDatetime = this.endDatetime;
            }
		},
		//课时时间改变
		siteStartTimeCheck(val) {
			this.site_start = val;
			if(this.site_end == "" || this.site_end == null)return;
			if(this.site_start >= this.site_end) {
				this.$message.error("课时开始时间不能大于课结束时间！");
			}
		},
		siteEndTimeCheck(val) {
			this.site_end = val;
			if(this.site_start == "" || this.site_start == null)return;
				if(this.site_start >= this.site_end) {
					this.$message.error("课时结束时间不能小于开始时间！");
				}
		},
        //新增
        addbtn() {
            this.form = {
            	name:"",
                start_time:"",
                end_time:"",
                week:[],
                site:[]
            }
            //清空
            this.site = [
            	{
            		name:"",
            		start_time:"",
            		end_time:"",
            		is_first:true
            	}
            ]
			this.title = "新增规则";
            this.form.site = this.site;
            //console.log("表单",this.form);
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
        },
        //确认新增 编辑
        addconfirm() {
			console.log("site",this.form.site)
			let site = this.form.site;
        	if(this.form.name.trim() == "") {
        		this.$message.error("请输入规则名称");
        		return;
        	}
        	if(this.form.start_time == "") {
        		this.$message.error("请选择生效起始时间");
        		return;
        	}
        	if(this.form.end_time == "") {
        		this.$message.error("请选择生效结束时间");
        		return;
        	}
        	if(this.form.week == "") {
        		this.$message.error("请选择星期");
        		return;
			}
			for(let i = 0; i < site.length; i ++) {
				if(site[i].start_time == '') {
					this.$message.error("请选择课时开始时间");
					return;
				} else if(site[i].end_time == '') {
					this.$message.error("请选择课时结束时间");
					return;
				} else if(site[i].name == '') {
					this.$message.error("请选择课时名称");
					return;
				}
			}
        	let t = {
        			...this.form
        		}
        		t.site = JSON.stringify(t.site);
        		t.week = t.week.join(",");
        		t.token = localStorage.jxtoken;
        	if(this.isAdd) {
        		this.$http.post("/SchoolTime/add",t)
	        	.then(res => {
	        		this.$message.success(res.info);
	        		this.dialogFormVisibleAdd = false;
	        		this.req();
	        	})
	        	.catch(res => {
	        		this.$message.error(res.info);
	        	})
        	} else {
        		this.$http.post("/SchoolTime/edit",t)
        		.then(res => {
        			//console.log("新增后的数据",this.form);
        			this.$message.success(res.info);
        			this.dialogFormVisibleAdd = false;
        			this.req();
        		})
        		.catch(res => {
        			this.$message.error(res.info);
        		})
        	}
        },
        //编辑
        editshow(val) {
			this.title = "编辑规则";
        	this.$http.post("/SchoolTime/info",{
        		token: localStorage.jxtoken,
    			id: val.id
        	})
        	.then(res => {
        		console.log(res);
        		this.form.id = res.data.id;
        		this.form.name = res.data.name;
        		this.form.week = res.data.week.split(",");
        		this.form.site = JSON.parse(res.data.site);
				this.form.start_time = this.$tools.formatDate(parseInt(res.data.start_time));
        		this.form.end_time = this.$tools.formatDate(parseInt(res.data.end_time));
        		this.site = this.form.site;
        		console.log("编辑时的数据",this.form);
			})
            this.isAdd = false;
            this.dialogFormVisibleAdd = true;
        },
    	//删除
    	deletebtn(val) {
    		this.deleteId = val.id;
    		this.dialogFormVisibleDelete = true;
    	},
    	//确认删除
    	deleteconfirm() {
    		this.$http.post("/SchoolTime/delete",{
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
    	//查看
    	lookbtn(val) {
    		console.log("查看数据",val);
    		this.dialogFormVisibleDetail=true;
    		this.$http.post("/SchoolTime/info",{
    			token: localStorage.jxtoken,
    			id: val.id
    		})
    		.then(res => {
    			console.log("点击查看返回的数据",res);
    			this.tableDatas = this.siteData(res.data);
    		})
    	},
    	//新增课时
    	addSite() {
    		var data = {
    			name:"",
        		start_time:"",
        		end_time:"",
        		is_first:false
    		}
    		
    		if(this.site.length < 15) {
    			this.site.push(data);
    		} else {
    			this.$message.error("超过最多课时限制");
    		}
    		
    	},
    	//删除课时
    	deleteSite(e) {
    		var el = e.target.parentElement.parentElement;
    		//console.log("自定义属性",el.getAttribute('data-index'));
    		var index = el.dataset.index;
    		this.site.splice(index,1);
    	},
    	//查看的数据
    	siteData(result) {
    		var data = [];
			var datas = JSON.parse(result.site);
			var weeks = result.week;
			for(var s in datas) {
				var d = datas[s];
				var row = {
					class_hour: d.name 
				}
				for(var w = 0; w < 7; w++) {
					if(weeks.indexOf(w.toString()) != -1) {
						row['w' + w] = d.start_time + '-' + d.end_time;
					} else {
						row['w' + w] = '';
					}
				}
				data.push(row);
			}
			return data;
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
    .margin_left {
    	margin-left: 20px;
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
    
    .el-checkbox {
    	margin-right: 24px;
    }
    .el-checkbox+.el-checkbox {
    	margin-left: 0;
    }
    .plusbtn {
    	margin-left: 10px;
    	vertical-align: middle;
    }
    .el-icon-plus {
    	font-weight: 900;
    }
    .siteBox {
    	height: 50px;
    }
    .el-date-editor.el-input {
    	width:150px;
    }
    .my-table .el-table {
    	border: 1px solid #ebeef5;
    }
</style>
