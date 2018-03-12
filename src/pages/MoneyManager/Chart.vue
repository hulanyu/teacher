<template>
    <Base-right 
    title="财务报表"
    @update="init">
        <el-row type="flex" justify="space-between">
            <div>
                <el-button size="small" @click="showRed('isActiveDay')" :class="{ activeBtn: isActiveDay }">日</el-button>
                <el-button size="small" @click="showRed('isActiveWeek')" :class="{ activeBtn: isActiveWeek }">周</el-button>
                <el-button size="small" @click="showRed('isActiveMonth')" :class="{ activeBtn: isActiveMonth }">月</el-button>
            </div>
            <div>
                <el-button class="out"
                @click="exportFile">导出</el-button>
            </div>
        </el-row>
        <div class="chart" id="chart"></div>    
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import echarts from 'echarts'

export default {
    data() {
        return {
            isActiveDay:true,
            isActiveWeek:false,
            isActiveMonth:false,
            typeStr:"day",
            drawName:"小时",
            chart: null,    // 初始化空对象  
            optionDataDay:[],   //日
            optionDataWeek:[],  //周
            optionDataMonth:[], //月
            chartX:[],
            chartY:[]
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
       
       this.init();
    },
    methods: {
        init() {
            this.chart = echarts.init(document.getElementById('chart'));
            this.showRed("isActiveDay");
        },
        //显示数据
        showRed(val) {
            this.typeStr = "day"
            if(val == 'isActiveDay') {
                this.isActiveDay = true;
                this.isActiveWeek = false;
                this.isActiveMonth = false;
                this.typeStr = "day";
                this.drawName = "日";
            }else if(val == 'isActiveWeek') {
                this.isActiveDay = false;
                this.isActiveWeek = true;
                this.isActiveMonth = false;
                this.typeStr = "week";
                this.drawName = "周";
            }else if(val == 'isActiveMonth') {
                this.isActiveDay = false;
                this.isActiveWeek = false;
                this.isActiveMonth = true;
                this.typeStr = "month";
                this.drawName = "月";
            }
            //发起请求
            this.$http.post('/ShopReport/index', {
                type:this.typeStr,
                token:localStorage.jxtoken
            }).then((res) => {
                console.log(res);
                
                //res.data：{x,amount}
                this.chartX=[];
                this.chartY=[];
                res.data.forEach(e => {
                    this.chartX.push(e.x.toString());
                    this.chartY.push(e.amount);
                });
                switch (this.typeStr) {
                    case "day": //以天计算 - 显示时
                        
                    break;
                    case "week":

                    break;
                    case "month":break;
                }   
                //进行渲染
                this.drawGraph(); 
            }).catch(res=>{
                this.$message.error(res.info);
            });
        },
        //渲染
        drawGraph(){
            this.chart.resize({width:'auto'});
            this.chart.setOption({
                color: ['#3398DB'],
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
                        name: this.drawName,
                        data : this.chartX,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name: '金额'
                    }
                ],
                series : [
                    {
                        name:'金额',
                        type:'bar',
                        barWidth: '60%',
                        data:this.chartY
                    }
                ]

            });
        },
        exportFile () {
            this.$tools.exportFile('/ShopReport/export', {
                token: this.$tools.getToken(),
                type: this.typeStr,
            },{type: 'get'})
        },
    }
}
</script>

<style scoped>
.activeBtn,.el-button:focus {
    background: #ff0000;
    color:#ffffff;
}
.activeBtn:hover {
	background: #ff0000;
    color:#ffffff;
}
.out,.out:focus,.out:hover {
    background-color: #41cac0;
    color: #fff;
}
.chart{
    width: 100%;
}
</style>