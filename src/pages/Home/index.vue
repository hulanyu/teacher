<template>
    <Base-right
    :title="title"
    :isUpdate="false">
        <template slot-scope="props">
            <div class="content" :style="'overflow: auto; height:' + props.maxHeight + 'px'">
                <div class="item top">
                    <div class="title">校内师生统计</div>
                    <div class="charts">
                        <span id="sexChart" :style="{width: '300px', height: '200px',display:'inline-block'}"></span>
                        <span id="teacherChart" :style="{width: '300px', height: '200px',display:'inline-block'}"></span>
                        <span id="nationChart" :style="{width: '300px', height: '200px',display:'inline-block'}"></span>
                    </div>
                </div>
                <div class="item top">
                    <div class="title">校内师生统计分布</div>
                    <div class="charts">
                        <span id="studentsChart" :style="{width: '350px', height: '200px',display:'inline-block'}"></span>
                        <span id="teacherTimeChart" :style="{width: '350px', height: '200px',display:'inline-block'}"></span>
                    </div>
                </div>
                <div class="item top bottom">
                    <div class="title">关于我们</div>
                    <div class="lists">
                        <div class="list">系统开发：京县网络科技有限公司</div>
                        <div class="list">授权使用：丽江一中</div>
                        <div class="list">著作权所有：京县网络科技有限公司</div>
                        <div class="list">技术支持：京县网络科技有限公司</div>
                        <div class="list">联系方式：0888-8888281（周一至周五9:00-17:00）/0888-8888713（24小时）</div>
                    </div>
                    <div class="imgs">
                        <img :src="img1" alt="">
                        <img :src="img2" alt="">
                    </div>
                </div>
                
            </div>
        </template>
    </Base-right>
    
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight';
import echarts from 'echarts'

export default {  
    data() {  
        return { 
            img1:'../static/imgs/wechat.png',
            img2:'../static/imgs/qrcode.png',
            title:"首页", 
            // 初始化空对象  
            chart: null,  
            // 性别  
            opinionSex: ['女生', '男生'],  
            opinionDataSex: [{  
                value: 30,  
                name: '女生'  
            }, {  
                value: 70,  
                name: '男生'  
            }],
            //学历
            opinionTeacher: ['专科', '本科', '研究生', '博士'],  
            opinionDataTeacher: [{  
                value: 10,  
                name: '专科'  
            }, {  
                value: 10,  
                name: '本科'  
            },{  
                value: 20,  
                name: '研究生'  
            },{  
                value: 60,  
                name: '博士'  
            }],
            //名族 
            opinionNation: ['专科', '本科', '研究生', '博士'],  
            opinionDataNation: [{  
                value: 10,  
                name: '专科'  
            }, {  
                value: 10,  
                name: '本科'  
            },{  
                value: 20,  
                name: '研究生'  
            },{  
                value: 60,  
                name: '博士'  
            }],
            //学生人数
            opinionStudents:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            opinionStudentsData:[10, 52, 200, 334, 390, 330, 220],
            //工龄
            opinionTime:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            opinionTimeData:[10, 52, 200, 334, 390, 330, 220]
        }  
    },  
    components:{
        BaseRight
    },
    methods: {
        //获取数据
        req() {
            this.$http.post('/Index/info',{
                token:localStorage.jxtoken
            })
            .then(res => {
                console.log(res);
                //性别
                this.opinionSex = res.data.sex.type
                this.opinionDataSex = res.data.sex.data
                //学历
                this.opinionTeacher = res.data.education.type
                this.opinionDataTeacher = res.data.education.data
                //民族
                this.opinionNation = res.data.nation.type
                this.opinionDataNation = res.data.nation.data
                //年级分布
                this.opinionStudents = res.data.grade_number.type
                this.opinionStudentsData = res.data.grade_number.data
                //性别
                this.opinionTime = res.data.working_years.type
                this.opinionTimeData = res.data.working_years.data
                //渲染
                this.drawGraph('sexChart',this.opinionSex,this.opinionDataSex,'校内男女比例统计'); 
                this.drawGraph('teacherChart',this.opinionTeacher,this.opinionDataTeacher,'学校教师学历统计'); 
                this.drawGraph('nationChart',this.opinionNation,this.opinionDataNation,'校内学生民族统计'); 
                
                this.drawLine('studentsChart',this.opinionStudents,this.opinionStudentsData,'学生人数年级分布','年级','人数'); 
                this.drawLine('teacherTimeChart',this.opinionTime,this.opinionTimeData,'教师工龄人数分布','工龄','人数'); 
            })
        },  
        // 绘饼图  
        drawGraph(id,option,optionData,text) {  
            this.chart = echarts.init(document.getElementById(id))  
            //this.chart.showLoading()   
            this.chart.setOption({  
                title: {  
                    text: text,  
                    x: 'center',
                    y: 'bottom'  
                },  
                tooltip: {  
                    trigger: 'item',  
                    formatter: "{a} <br/>{b} : {c} ({d}%)"  
                },  
                legend: {  
                    orient: 'vertical',
                    x: 'right', 
                    y: 'middle',
                    data: option 
                },  
                toolbox: {  
                    show: true,  
                },  
                calculable: true,  
                series: [{  
                    type:'pie',
                    radius: ['30%', '65%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: optionData, 
                }]  
            })  
            this.chart.hideLoading()  
        },
        //绘柱状图
        drawLine(id,option,optionData,text,xName,yName) {
            this.chart = echarts.init(document.getElementById(id))  
            //this.chart.showLoading() 
            this.chart.setOption({
                title: {
                    text: text
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        name: xName,
                        data : option,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name: yName
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth: '60%',
                        data:optionData,
                        itemStyle: {
                        normal: {
                            // 随机显示
                            //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                        
                            // 定制显示（按顺序）
                            color: function(params) { 
                                var colorList = ['#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ]; 
                                return colorList[params.dataIndex] 
                                }
                            }
                        }
                    }
                ]

            }); 
        }
    },  
    // keypoint：执行方法  
    // “将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。”  
    mounted() {  
        this.req()
        this.$nextTick(function() {  
            // this.drawGraph('sexChart',this.opinionSex,this.opinionDataSex,'校内男女比例统计'); 
            // this.drawGraph('teacherChart',this.opinionTeacher,this.opinionDataTeacher,'学校教师学历统计'); 
            // this.drawGraph('nationChart',this.opinionNation,this.opinionDataNation,'校内学生民族统计'); 
            
            // this.drawLine('studentsChart',this.opinionStudents,this.opinionStudentsData,'学生人数年级分布','年级','人数'); 
            // this.drawLine('teacherTimeChart',this.opinionTime,this.opinionTimeData,'教师工龄人数分布','工龄','人数'); 
        })  
    }  
}
</script>

<style scoped lang="less">
    .item {
        border:1px solid #f3f3f4;
        border-radius: 5px;
        padding-bottom: 10px;
        margin-bottom: 5px;
        .title {
            width: 100%;
            padding:10px 0 30px 20px;
            background: #41cac0;
            color:white;
        }
        .charts {
            display: flex;
            justify-content:space-around;
        }
        .lists {
            line-height: 23px;
            padding-left: 10px;
        }
    }
    .bottom {
        position: relative;
        .imgs {
            position: absolute;
            top:60px;
            right: 30px;
            img {
                width:80px;
                margin-left: 50px;
            }
        }
    }
    
    
    
</style>