<template>
    <div class="base-detail">
        <el-card class="box-card">
            <div slot="header">
                <span>试卷基本信息</span>
            </div>
            <el-table
            :data="model.data1"
            style="width: 100%">
                <el-table-column
                    prop=""
                    label="项目名称">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="试卷名称">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="科目名称">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="教师权限">
                </el-table-column>
            </el-table>
        </el-card>

        <el-card class="box-card">
            <div slot="header">
                <span>题块信息</span>
            </div>
            <el-table
            :data="model.data2"
            style="width: 100%">
                <el-table-column
                    prop=""
                    label="题号">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="分数">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="双评比例">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="小题数">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="最短批阅时间（秒）">
                </el-table-column>
            </el-table>
        </el-card>

        <el-card class="box-card">
            <div slot="header">
                <span>小题分数信息</span>
            </div>
            <el-table
            :data="model.data3"
            style="width: 100%">
                <el-table-column
                    prop=""
                    label="大题号">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="小题号">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="小题分值">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="小题误差阈值">
                </el-table-column>                
            </el-table>
        </el-card>
    </div>
</template>

<script>

export default {
    props: {
        model: Object,
    },
    data () {
        return {}
    },
}
</script>

<style lang="less">
.base-detail {
    // width: 1064px !important;
    .box-card {
        width: 100%;
    }
    .el-card__header {
        background-color: #41cac0;
        color: #fff;
    }
}
</style>

