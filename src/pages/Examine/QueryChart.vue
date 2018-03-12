<template>
    <Base-right 
    title="教师工作量"
    @update="req"
    isBack>
        <template slot-scope="props">
            <el-row>
                <el-col style="text-align: center;">教师工作量分布图</el-col>
            </el-row>
            <div class="chart"
            :id="chartId"></div>
            <!-- <I-table-page
            :total="total"
            @change="handlepageChange"></I-table-page> -->
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
// import {ITablePage,} from '@/components/Table/'
import echarts from 'echarts'

export default {
    data () {
        return {
            chartId: 'chart' + (new Date()).getTime(),
            // total: 1000,
            // current: 1,
            data: [],
            xAxisData: [],
            seriesData: []
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
        this.req()
    },
    methods: {
        req() {
            this.$http.post('/Marking/teacherWorkload', {
                // page: this.current
                exam_id: this.$route.params.subject_id,
                token: this.$tools.getToken(),
            })
            .then(res => {
                this.data = res.data
                this.setChart()
            })
        },
        init () {
            this.myChart = echarts.init(document.getElementById(this.chartId));
            // 绘制图表
            this.myChart.setOption({
                // title: {
                //     text: 'ECharts 入门示例'
                // },
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
                xAxis: [{
                    type : 'category',
                    name: '姓名',
                    data : this.xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis : [
                    {
                        type : 'value',
                        name: '数量'
                    }
                ],
                series : [
                    {
                        name:'金额',
                        type:'bar',
                        barWidth: '60%',
                        data: this.seriesData
                    }
                ],
            });

        },
        handlepageChange(current) {
            this.current = current
        },
        setChart () {
            this.xAxisData = []
            this.seriesData = []
            this.data.forEach(item => {
                this.setXAxisData(item.teacher_name)
                this.setseriesData(item.count)
            })
            this.init()
        },
        setXAxisData (name) {
            this.xAxisData.push(name)
        },
        setseriesData (count) {
            this.seriesData.push(count)
        }
    }
}
</script>

<style scoped>
.out {
    background-color: #41cac0;
    color: #fff;
}
</style>