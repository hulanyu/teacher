<template>
    <Teacher-task1
    v-if="active === ACTIVE1"
    @change="change"></Teacher-task1>
    <Teacher-task2
    v-else-if="active === ACTIVE2"
    @change="change"></Teacher-task2>
    <Teacher-task3
    v-else-if="active === ACTIVE3"
    @change="change"></Teacher-task3>
    <Teacher-task4
    v-else-if="active === ACTIVE4"
    @change="change"></Teacher-task4>
</template>

<script>
import TeacherTask1 from './TeacherTask1'
import TeacherTask2 from './TeacherTask2'
import TeacherTask3 from './TeacherTask3'
import TeacherTask4 from './TeacherTask4'

export default {
    data () {
        return {
            active: 0,
            ACTIVE1: 0,
            ACTIVE2: 1,
            ACTIVE3: 2,
            ACTIVE4: 3,
        }
    },
    components: {
        TeacherTask1,
        TeacherTask2,
        TeacherTask3,
        TeacherTask4,
    },
    methods: {
        stepsBack () {
            if (!this.active) {
                return
            }
            --this.active
        },
        stepsNext () {
            if (this.active > this.ACTIVE4) {
                return
            }
            ++this.active
        },
        change (isNext) {
            if (isNext === void 0 || isNext === null) {
                throw new Error('错误')
            }
            if (isNext) {
                this.stepsNext()
            } else {
                this.stepsBack()
            }
        },
    }
}
</script>
