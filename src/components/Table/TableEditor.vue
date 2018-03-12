<template>
    <el-dialog class="table-editor"
    :title="title" 
    :visible.sync="visible"
    :width="typeof width === 'number' ? width + '%' : width">
        <slot name="content"></slot>
        <template slot="footer">
            <slot name="foot"></slot>
        </template>
    </el-dialog>
</template>

<script>
/*
通用编辑(新建或修改)弹框组件
*/
export default {
    name: 'ITableEditor',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        width: {
            type: [Number, String],
            default: 40
        }
    },
    data() {
        return {
            visible: this.value,
        }
    },
    watch: {
        value(newValue) {
            this.visible = newValue
        },
        visible(newValue) {
            this.$emit('input', newValue)
        }
    }
}
</script>

<style lang="less">
.table-editor {
    .el-table {
        border-top-width: 1px !important;
        border-right-width: 1px !important;
        border-left-width: 1px !important;
        border-bottom-width: 1px !important;
    }
    .el-dialog__header {
        background: #41cac0;
    }
    .el-dialog__title {
        color:white;
    }
    .el-dialog__footer {
        text-align: center;
        // .el-button--success {
        //     background-color: #41cac0;
        //     border: #41cac0;
        // }
    }
    .el-table--border {
        border-right: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
    }
}
.confirm {
    background: #41cac0;
    border:1px solid #41cac0;
}
</style>
