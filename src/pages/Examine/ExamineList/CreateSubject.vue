<template>
    <Base-subject
    title="新建考试项目"
    type="create"
    @submit="submit"></Base-subject>
</template>

<script>
import BaseSubject from '../BaseSubject'

export default {
    components: {
        BaseSubject,
    },
    methods: {
        submit (data) {
            this.$http.post('/ExamProject/add', {
                token: this.$tools.getToken(),
                name: data.subjectName,
                alias: data.subjectAlias,
                staff_id: data.subjectLeader,
                date: this.$tools.formatDate(data.dateTime.getTime() / 1000, 'yyyy-MM-dd'),
                student_uniqid: data.student_uniqid,
            })
            .then(res => {
                this.$message.success(res.info)
                this.$router.push({
                    name: 'ExamineExamineList'
                })
            })
        }
    }
}
</script>
