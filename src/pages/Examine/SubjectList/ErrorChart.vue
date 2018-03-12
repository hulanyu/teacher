<template>
    <Base-right 
    :title="`${$route.params.title} 错题分布图`"
    isBack
    @update="req">
        <div class="chart"
        :id="chartId"></div>    
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
// import Chart from '@/components/Chart/'
import echarts from 'echarts'

export default {
    data() {
        return {
            chartId: 'chart' + (new Date()).getTime(),
            data: [],
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
        // this.myChart = echarts.init(document.getElementById(this.chartId));
        // // 绘制图表
        // this.myChart.setOption({
        //     // title: {
        //     //     text: 'ECharts 入门示例'
        //     // },
        //     color: ['#3398DB'],
        //     tooltip : {
        //         trigger: 'axis',
        //         axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        //             type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        //         }
        //     },
        //     grid: {
        //         left: '3%',
        //         right: '4%',
        //         bottom: '3%',
        //         containLabel: true
        //     },
        //     xAxis : [
        //         {
        //             type : 'category',
        //             name: '题号',
        //             data : [1, 2, 3, 4],
        //             axisTick: {
        //                 alignWithLabel: true
        //             }
        //         }
        //     ],
        //     yAxis : [
        //         {
        //             type : 'value',
        //             name: '错题人数'
        //         }
        //     ],
        //     series : [
        //         {
        //             name:'错题人数',
        //             type:'bar',
        //             barWidth: '60%',
        //             data:[100]
        //         }
        //     ]

        // });
        this.req()
    },
    watch: {
        data (val) {
            this.drawLine(
                this.chartId,
                val.map(item => {
                    return item.small_number
                }),
                val.map(item => {
                    return item.error_count
                }),
                '题号','错题人数'
            )
        }
    },
    methods: {
        req () {
            this.$http.post('/ExamScore/errorQuestion', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
            })
            .then(res => {
                let arr = []
                for (let bigNumber of Object.keys(res.data)) {
                    let bigValue = res.data[bigNumber]
                    for (let smallNumber of Object.keys(bigValue)) {
                        let smallValue = bigValue[smallNumber]
                        arr.push({
                            big_number: parseInt(bigNumber),
                            small_number: parseInt(smallNumber),
                            count: parseInt(smallValue.count),
                            error_count: parseInt(smallValue.error_count),
                        })
                    }
                }
                this.data = arr
            })
        },
        //绘柱状图
        drawLine(id,option,optionData,xName,yName) {
            this.chart = echarts.init(document.getElementById(id))  
            //this.chart.showLoading() 
            this.chart.setOption({
                // title: {
                //     text: text
                // },
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
                        name:'错题人数',
                        type:'bar',
                        barWidth: '60%',
                        data:optionData,
                    }
                ]

            }); 
        },
    }
}
</script>

<style scoped>
.out {
    background-color: #41cac0;
    color: #fff;
}
</style>