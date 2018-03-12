<template>
    <Base-right class="read-subject"
    title="查看考试项目"
    isBack>
        <div class="read-subject-group">
            <div class="read-subject-body">
                <el-row class="read-subject-item">
                    项目名称：{{data.subjectName}}
                </el-row>
                <el-row class="read-subject-item">
                    项目别名：{{data.subjectAlias}}
                </el-row>
                <el-row class="read-subject-item">
                    项目组长：{{data.subjectLeader}}
                </el-row>
                <el-row class="read-subject-item">
                    考试日期：{{data.dataTime}}
                </el-row>
                <el-row class="read-subject-item">
                    参考学生：{{data.count}}
                </el-row>
            </div>
            <el-button class="confirm"
            @click="$router.go(-1)">返回</el-button>
        </div>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'

export default {
    data () {
        return {
            data: {
                subjectName: '',
                subjectAlias: '',
                subjectLeader: '',
                dataTime: '',
                count: 0,
            }
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
        this.req()
    },
    methods: {
        req () {
            this.$http.post('/ExamProject/info', {
                token: this.$tools.getToken(),
                id: this.$route.params.id
            })
            .then(res => {
                this.data.subjectName = res.data.name
                this.data.subjectAlias = res.data.alias
                this.data.subjectLeader = res.data.staff_name
                this.data.dataTime = res.data.date
                this.data.count = res.data.number
            })
        }
    }
}
</script>

<style lang="less">
.read-subject {
    &-body {
        border: 1px solid #ccc;
        border-radius: 4px;
        color: #8c8c8c;
        font-size: 16px;
        margin: 60px 0 40px 0;
    }
    &-item {
        padding: 20px;
    }
    &-item + &-item {
        border-top: 1px solid #ccc;
    }
}
.read-subject-group {
    width: 440px;
    margin: 0 auto;
    border: 1px solid #fff;
}
</style>
