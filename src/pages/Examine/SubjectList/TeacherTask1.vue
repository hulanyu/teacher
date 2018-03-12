<template>
    <Base-right
    title="添加阅卷老师"
    isBack
    @update="req">
        <template slot-scope="scope">
            <div 
            :style="'overflow: auto; height: ' + scope.maxHeight + 'px;'">
                <el-row style="padding: 20px 0 30px 0;">
                    <el-checkbox v-model="scopeChecked"
                    @change="handleScopeChecked">全选 / 全不选</el-checkbox>
                </el-row>
                <el-row>
                    <el-checkbox v-model="item.checked" 
                    :class="'check-box ' + (item.checked ? 'check-box-checked' : '')"
                    :key="index"
                    v-for="(item, index) in list">{{item.label}}</el-checkbox>
                </el-row>
                <el-row style="padding: 50px 0 20px 0;">
                    <el-button type="primary" class="confirm"
                    @click="next">下一步</el-button>
                </el-row>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'

export default {
    data () {
        return {
            scopeChecked: false,
            list: [],
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
        this.req()
    },
    methods: {
        // 获取所有教职工
        req () {
            this.$http.post('/Common/staff', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                power: 1,
            })
            .then(res => {
                this.list = res.data.map(item => {
                    return {
                        label: item.name,
                        checked: false,
                        staff_id: parseInt(item.id),
                    }
                })
            })
        },
        submit (callback=()=>{}) {
            let staff_id_arr = []
            for (let item of this.list) {
                if (item.checked) {
                    staff_id_arr.push(item.staff_id)
                }
            }
            if (staff_id_arr.length === 0) {
                this.$message.error('请选择阅卷老师')
                return
            }
            this.$http.post('/ExamTask/addStaff', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                staff_id: staff_id_arr.length <= 1 ? staff_id_arr.join('') : staff_id_arr.join(','),
            })
            .then(res => {
                this.$message.success(res.info)
                callback()
            })
        },
        next () {
            this.submit(() => {
                this.$emit('change', true)
            })
        },
        handleScopeChecked (val) {
            this.list.forEach(item => {
                item.checked = val
            })
        }
    }
}
</script>

<style scoped lang='less'>
.check-box {
    // color: #818181;
    padding: 5px;
    border-radius: 3px;
    &-checked {
        background-color: #f0f0f0;
    }
}
</style>
