<template>
  <div class="left">
    <el-row class="tac">
        <el-col>
            <el-menu
            :default-active="defaultIndex"
            class="el-menu-vertical-demo"
            :unique-opened="isOpen">
                <el-submenu v-for="(item, index) in items" :key="index" :index="item.id" :class="item.actives">
                    <template slot="title">
                        <img class="icons" :src="item.ico" alt="">
                        <span>{{item.name}}</span>
                    </template>
                    <el-menu-item-group v-for="(subitem, index) in item.child" :key="index">
                        <router-link :to="{name: subitem.url, params: {type: subitem.type}}">
                            <el-menu-item :index="subitem.index" @click="storage(subitem.index)">{{subitem.name}}</el-menu-item>
                        </router-link>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-col>

    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
        defaultIndex:"",
        isOpen:true,
        arr : [2],
        items:[],
        // items:[   
        //     {  
        //     name:'校园信息管理',  
        //     ico:'../static/imgs/school.png',
        //     id:'1',
        //     child:[  
        //         {  
        //             name:'教职工管理',
        //             url:'TeachingStaffManage',
        //             index:'1-1'    
        //         },  
        //         {  
        //             name:'年级管理',
        //             url:'GradeManage',
        //             index:'1-2'     
        //         },  
        //         {  
        //             name:'班级管理',
        //             url:'ClassManage',
        //             index:'1-3'     
        //         },
        //         {  
        //             name:'学生管理',
        //             url:'StudentManage',
        //             index:'1-4'     
        //         },
        //         {  
        //             name:'科室管理',
        //             url:'DepartmentManage',
        //             index:'1-5'     
        //         },
        //         {  
        //             name:'上课时间管理',
        //             url:'ClasstimeManage',
        //             index:'1-6'     
        //         },
        //     ]  
        //     }, 
        //     {  
        //     name:'后勤管理',  
        //     ico:'../static/imgs/back.png',
        //     id:'2',
        //     child:[  
        //         {  
        //             name:'宿舍管理',
        //             url:'LogisticsManageDormitory',
        //             index:'2-1'     
        //         },  
        //         {  
        //             name:'学生宿舍考勤配置',
        //             url:'LogisticsManageAttend',
        //             index:'2-2'     
        //         },  
        //         {  
        //             name:'教师考勤配置',
        //             url:'LogisticsManageAttendT',
        //             index:'2-3'     
        //         },  
        //         {  
        //             name:'学生考勤记录',
        //             url:'LogisticsManageRecordS',
        //             index:'2-4'     
        //         },
        //         {  
        //             name:'教师考勤记录',
        //             url:'LogisticsManageRecordT',
        //             index:'2-5'     
        //         }
        //     ]  
        //     },
        //     {  
        //     name:'监控管理',  
        //     ico:'../static/imgs/monitor.png',
        //     id:'3',
        //     child:[  
        //         {  
        //             name:'透明课堂',
        //             url:'MonitorData',
        //             index:'3-1'     
        //         }
        //     ]  
        //     },
        //     {  
        //     name:'财务管理',  
        //     ico:'../static/imgs/finance.png',
        //     id:'4',
        //     child:[  
        //         {  
        //             name:'消费记录',
        //             url:'MoneymanagerUselog',
        //             index:'4-1'     
        //         },
        //         {  
        //             name:'充值退款',
        //             url:'MoneymanagerMoney',
        //             index:'4-2'     
        //         },
        //         {  
        //             name:'财务报表',
        //             url:'MoneymanagerChart',
        //             index:'4-3'     
        //         } 
        //     ]  
        //     },
        //     {  
        //     name:'教务管理',  
        //     ico:'../static/imgs/work.png',
        //     id:'5',
        //     child:[  
        //         {  
        //             name:'教学科目管理',
        //             url:'TeachingManageItem',
        //             index:'5-1'     
        //         },
        //         {  
        //             name:'教学任务生成',
        //             url:'TeachingManageLists',
        //             index:'5-2'     
        //         },
        //         {  
        //             name:'教学任务分配',
        //             url:'TeachingManageTasking',
        //             index:'5-3'     
        //         },
        //         {  
        //             name:'教学进度管理',
        //             url:'TeachingManageProgress',
        //             index:'5-4'     
        //         },
        //         {  
        //             name:'课件管理',
        //             url:'TeachingManageCourseware',
        //             index:'5-5'     
        //         }   
        //     ]  
        //     },
        //     {  
        //     name:'排课管理',  
        //     ico:'../static/imgs/teaching.png',
        //     id:'6',
        //     child:[  
        //         {  
        //             name:'排课列表',
        //             url:'CourseManageRecord',
        //             index:'6-1'     
        //         },
        //         {  
        //             name:'课表时间管理',
        //             url:'CourseManageTimeRecord',
        //             index:'6-2'     
        //         }  
        //     ]  
        //     },
        //     {  
        //     name:'课表管理',  
        //     ico:'../static/imgs/schedule.png',
        //     id:'7',
        //     child:[  
        //         {  
        //             name:'课程表',
        //             url:'Schedule',
        //             index:'7-1'     
        //         } 
        //     ]  
        //     },
        //     {  
        //     name:'试题管理',  
        //     ico:'../static/imgs/question.png',
        //     id:'8',
        //     child:[  
        //         {  
        //             name:'系统题库',
        //             url:'QuestionsSystem',
        //             index:'8-1'     
        //         },  
        //         {  
        //             name:'学校题库',
        //             url:'QuestionsSchool',
        //             index:'8-2'     
        //         },  
        //         {  
        //             name:'年级题库',
        //             url:'QuestionsGrade',
        //             index:'8-3'     
        //         },
        //         {  
        //             name:'教师题库',
        //             url:'QuestionsTeacher',
        //             index:'8-4'     
        //         }   
        //     ]  
        //     },
        //     {  
        //     name:'试卷管理',  
        //     ico:'../static/imgs/paper.png',
        //     id:'9',
        //     child:[  
        //         {  
        //             name:'学校试卷库',
        //             url:'Papers',
        //             type:3,
        //             index:'9-1'     
        //         },  
        //         {  
        //             name:'年级试卷库',
        //             url:'Papers',
        //             type:2,
        //             index:'9-2'     
        //         },  
        //         {  
        //             name:'教师试卷库',
        //             url:'Papers',
        //             type:1,
        //             index:'9-3'     
        //         }  
        //     ]  
        //     },
        //     {  
        //     name:'考试管理',  
        //     ico:'../static/imgs/marking.png',
        //     id:'10',
        //     child:[  
        //         {  
        //             name:'考试列表',
        //             url:'ExamineExamineList',
        //             index:'10-1'     
        //         },  
        //         {  
        //             name:'阅卷任务',
        //             url:'ExamineRead',
        //             index:'10-2'     
        //         },  
        //         {  
        //             name:'教师工作量查询',
        //             url:'ExamineTeacherWorkloadQuery',
        //             index:'10-3'     
        //         }  
        //     ]  
        //     },
        //     {  
        //     name:'终端管理',  
        //     ico:'../static/imgs/terminal.png',
        //     id:'11',
        //     child:[  
        //         {  
        //             name:'考勤终端',
        //             url:'TerminalManageAttendance',
        //             index:'11-1'     
        //         },  
        //         {  
        //             name:'消费终端',
        //             url:'TerminalManageConsumption',
        //             index:'11-2'     
        //         } 
        //     ]  
        //     },
        //     {  
        //     name:'资产管理',  
        //     ico:'../static/imgs/asste.png',
        //     id:'12',
        //     child:[  
        //         {  
        //             name:'资产列表',
        //             url:'AssetManage',
        //             index:'12-1'     
        //         }  
        //     ]  
        //     }
        // ] 
        }
    },
    mounted:function() {
        this.req()
        
    },
    watch: {
        '$route' (to, from) {
            this.path = this.resetString((this.$route.path.split('/'))[1]) 
            for(let i=0;i<this.items.length;i++) {
                for(let j=0;j<this.items[i].child.length;j++) {
                    //console.log(this.items[i].child[j].url);
                    if(this.path == this.items[i].child[j].url) {
                        console.log(111,this.path)
                        this.defaultIndex = this.items[i].child[j].index
                        return;
                    }
                    if(this.path == '' || this.path == 'home') {
                        this.defaultIndex = ""
                    }
                }
            }
        }
    },
    methods: {
        //获取菜单数据
        req() {
            this.$http.post('/Common/menu',{
                token:localStorage.jxtoken
            })
            .then(res => {
                console.log(res);
                this.items = res.data
                this.$nextTick(()=>{
                    this.path = this.resetString((this.$route.path.split('/'))[1]) 
                    for(let i=0;i<this.items.length;i++) {
                        for(let j=0;j<this.items[i].child.length;j++) {
                            //console.log(this.items[i].child[j].url);
                            if(this.path == this.items[i].child[j].url) {
                                this.defaultIndex = this.items[i].child[j].index
                                console.log("index:"+this.defaultIndex)
                                return;
                            }
                            if(this.path == '' || this.path == 'home') {
                                this.defaultIndex = ""
                            }
                        }
                    }
                })
            })
        },
        // handleOpen(key, keyPath) {
        //     console.log(key, keyPath);
        //     for(let i=0;i<this.items.length;i++) {
        //         this.items[i].actives = "nomal"
        //     }
        //     this.items[key-1].actives = "active"
        // },
        // handleClose(key, keyPath) {
        //     console.log(key, keyPath);
        //     for(let i=0;i<this.items.length;i++) {
        //         this.items[i].actives = "nomal"
        //     }
        //     this.items[key-1].actives = "nomal"
        // },
        storage:function(index) {
            console.log(index)
            sessionStorage.defaultIndex = index
        },
        //格式化路由
        resetString(s) {
            var a = s.split("-");
            var o = a[0];
            for(var i=1;i<a.length;i++){
                o = o + a[i].slice(0,1).toUpperCase() + a[i].slice(1);
            }
            return o.substring(0,1).toUpperCase()+o.substring(1);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.left {
    // border-right: 1px solid #f3f3f4;
    width:210px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 40px;
    position: absolute;
    top:0;
    left:0;
    box-sizing: border-box;
    height: 100%;
    padding-top: 60px;
    overflow: auto;
    overflow-x: hidden;
    background: white;
    z-index: 50;
    min-height: 660px;
    .icons {
        vertical-align: sub;
        margin-right: 10px;
    }
}
.active {
    background-color: #f3f3f4;
}
.is-active {
    background-color: #f3f3f4;
}
.el-menu-item-group .is-active {
    background-color: white;
}


</style>
