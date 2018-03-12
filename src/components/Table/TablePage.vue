<template>
    <el-pagination style="float: right;"
    background
    layout="prev, pager, next"
    :total="total"
    :page-size="pageSize"
    :current-page.sync="currentPage"
    @current-change="currentChange">
    </el-pagination>
</template>

<script>
/*
通用分页组件
*/
export default {
    name: 'ITablePage',
    props: {
        value: {
            type: Number,
            default: 1,
        },
        total: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            pageSize: 10,
            currentPage: this.value,
        }
    },
    watch: {
        value (newVal) {
            this.currentPage = newVal
        },
        currentPage (newVal) {
            console.log(1122)
            this.$emit('input', newVal)
        }
    },
    methods: {
        currentChange(current) {
            this.$emit('change', current);
        }
    }
}
</script>

