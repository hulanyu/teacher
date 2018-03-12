<template>
    <Base-right class="my-table"
    :title="title"
    :isUpdate="isUpdate"
    :isBack="isBack"
    @update="update">
        <el-row class="head">
            <slot name="head"></slot>
        </el-row>
        <div style="border: 1px solid #dcdfe6;">
            <slot name="content" 
            :maxHeight="tableMaxHeight"></slot>
            <el-row class="foot">
                <slot name="foot"></slot>
            </el-row>
        </div>
    </Base-right>
</template>

<script>
/*
通用表单组件
*/
import BaseRight from '../BaseRight/BaseRight';

export default {
    name: 'ITable',
    props: {
        title: {
            type: String,
            default: ''
        },
        isUpdate: {
            type: Boolean,
            default: true,
        },
        isBack: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            tableMaxHeight: 0,
        }
    },
    components: {
        BaseRight
    },
    mounted () { 
        this.computedTableHeight()
        this.$tools.htmlResize((result) => {
            if (result.h) {
                this.computedTableHeight()
            }
        })
    },
    methods: {
        computedTableHeight () {
            const baseNode = document.querySelector('.my-table')
            const titleNode = document.querySelector('.my-table .el-card__header')
            const headNode = document.querySelector('.my-table .head')
            const bodyNode = document.querySelector('.my-table .el-card__body')
            const footNode = document.querySelector('.my-table .foot')

            const baseHeight = parseInt(getComputedStyle(baseNode).height)
            const titleHeight = parseInt(getComputedStyle(titleNode).height)
            const titlePadding = parseInt(getComputedStyle(titleNode).paddingTop) * 2 
            const headHeight = parseInt(getComputedStyle(headNode).height)
            const headPadding = parseInt(getComputedStyle(headNode).paddingBottom)
            const bodyPadding = parseInt(getComputedStyle(bodyNode).paddingTop) * 2
            const footHeight = parseInt(getComputedStyle(footNode).height)
            const footPadding = parseInt(getComputedStyle(footNode).paddingTop)
            this.tableMaxHeight = baseHeight - titleHeight - headHeight - footHeight - bodyPadding - 10
            // ie兼容
            let browser = this.$tools.getBrowserInfo()
            if (browser.name === 'ie') {
                this.tableMaxHeight = this.tableMaxHeight - titlePadding - headPadding - footPadding
            }

            // console.log('tableMaxHeight:' + this.tableMaxHeight)
            // console.log('baseHeight:' + baseHeight)
            // console.log('titleHeight:' + titleHeight)
            // console.log('titlePadding:' + titlePadding)
            // console.log('headHeight:' + headHeight)
            // console.log('footHeight:' + footHeight)
            // console.log('headPadding:' + headPadding)
            // console.log('footPadding:' + footPadding)
        },
        update () {
            this.$emit('update')
        }
    }
}
</script>

<style scoped lang="less">
.head {
    padding-bottom: 28px;
}
.foot {
    padding: 10px 10px 10px 0;
}
</style>

<style lang="less">
.my-table {
    .el-table {
        border-top-width: 0;
        border-right-width: 0;
        border-left-width: 0;
        border-bottom-width: 0;
        // position: relative;
        // top: -1px;
        // left: -1px;
    }
    .el-table::before, .el-table::after {
        height: 0;
        width: 0;
    }
}
</style>
