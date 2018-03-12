<template>
    <I-table
    :title="`${$route.params.title} 查看错题一览表`"
    isBack
    @update="req">
        <template slot="head">
            <el-button type="primary" style="float: right;"
            @click="handleShowChart">查看统计图</el-button>
        </template>
        <template slot="content" slot-scope="scope">
            <el-table
            border
            row-class-name="table-row"
            :height="scope.maxHeight"
            :data="tableData">
                <el-table-column
                prop="big_number"
                label="大题号"></el-table-column>
                <el-table-column
                prop="small_number"
                label="小题号"></el-table-column>
                <el-table-column
                prop="count"
                label="错误人数"></el-table-column>
                <el-table-column
                prop="error_count"
                label="错误比例">
                    <template slot-scope="scope">
                        {{scope.row.error_count}}%
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!-- <template slot="foot">
            <I-table-page
            :total="total"
            @change="handlePageChange"></I-table-page>
        </template> -->
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'

export default {
    data () {
        return {
            tableData: [],
        //     total: 1000,
        //     current: 1,
        }
    },
    components: {
        ITable,
    },
    mounted () {
        this.req()
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
                this.tableData = arr
            })
        },
        handleShowChart () {
            this.$router.push({
                name: 'ExamineErrorChart',
                params: {
                    subject_id: this.$route.params.subject_id,
                    title: this.$route.params.title,
                }
            })
        },
        handlePageChange(current) {
            this.current = current
        },
    }
}
</script>
