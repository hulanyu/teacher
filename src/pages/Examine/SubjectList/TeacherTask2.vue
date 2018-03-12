<template>
    <I-table
    title="教师权限分配"
    isBack>
        <template slot="content" slot-scope="scope">
            <div
            :style="`overflow: auto; height: ${scope.maxHeight}px`">
                <el-table
                border
                row-class-name="table-row"
                :data="tableData">
                    <el-table-column
                    prop="name"
                    label="教师姓名"></el-table-column>
                    <el-table-column
                    prop="power"
                    label="教师权限">
                        <template slot-scope="scope">
                            {{POWER_MAP[String(scope.row.power)]}}
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleEditor(scope.row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row style="padding-top: 45px;">
                    <el-button class="confirm"
                    @click="$emit('change', false)">上一步</el-button>
                    <el-button class="confirm"
                    @click="$emit('change', true)">下一步</el-button>
                </el-row>
            </div>

            <I-table-editor v-model="showPowerBox"
            width="420px"
            title="权限修改">
                <template slot="content">
                    <el-row>选择教师权限：</el-row>
                    <el-row type="flex" class="row-bg" justify="center" style="padding-top: 30px;">
                        <el-radio-group v-model="powerSelected">
                            <el-radio 
                            :key="index"
                            :label="item.value"
                            v-for="(item, index) in powerList">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showPowerBox = false">取 消</el-button>
                    <el-button type="success"
                    @click="submit">确 定</el-button>
                </template>
            </I-table-editor>
        </template>
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import config from '../../../config.js'

export default {
    data () {
        return {
            tableData: [],
            showPowerBox: false,
            powerList: [],
            powerSelected: 0,
            row: {},
            POWER_MAP: config.POWER_MAP,
        }
    },
    components: {
        ITable,
        ITableEditor,
    },
    mounted () {
        this.setPowerList()
        this.req()
    },
    methods: {
        // 获取当前科目教师列表
        req () {
            this.$http.post('/ExamTask/staffLists', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                this.tableData = res.data.row.map(item => {
                    return {
                        name: item.name,
                        power: parseInt(item.power),
                        id: parseInt(item.id),
                    }
                })
            })
        },
        setPowerList () {
            for (let key of Object.keys(this.POWER_MAP)) {
                this.powerList.push({
                    label: this.POWER_MAP[String(key)],
                    value: parseInt(key),
                })
            }
        },
        handleEditor (row) {
            this.row = row
            this.powerSelected = row.power
            this.showPowerBox = true
        },
        submit () {
            if (!this.showPowerBox) {
                return console.log('违规操作')
            }
            this.$http.post('/ExamTask/setPower', {
                token: this.$tools.getToken(),
                task_staff_id: this.row.id,
                exam_id: this.$route.params.subject_id,
                power: this.powerSelected,
            })
            .then(res => {
                this.$message.success(res.info)
                this.req()
            })
            this.showPowerBox = false
        },
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
