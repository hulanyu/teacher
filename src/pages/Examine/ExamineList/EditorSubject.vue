<template>
    <Base-subject
    title="修改考试项目"
    type="editor"
    :model="data"
    @submit="submit"></Base-subject>
</template>

<script>
import BaseSubject from '../BaseSubject'

export default {
    data () {
        return {
            data: {
                id: '',
                subjectName: '',
                subjectAlias: '',
                subjectLeader: '',
                dateTime: '',
                count: null,
            }
        }
    },
    components: {
        BaseSubject,
    },
    mounted () {
        this.getDetail()
    },
    methods: {
        getDetail () {
            this.$http.post('/ExamProject/info', {
                token: this.$tools.getToken(),
                id: this.$route.params.id
            })
            .then(res => {
                this.data = {
                    id: res.data.id,
                    subjectName: res.data.name,
                    subjectAlias: res.data.alias,
                    subjectLeader: res.data.staff_id,
                    dateTime: res.data.date,
                    count: res.data.number,
                }
            })
        },
        submit (data) {
            let date
            try {
                date = this.$tools.formatDate(data.dateTime.getTime() / 1000, 'yyyy-MM-dd')
            } catch (error) {
                date = data.dateTime
            }
            let obj = {
                token: this.$tools.getToken(),
                name: data.subjectName,
                alias: data.subjectAlias,
                staff_id: data.subjectLeader,
                date,
                id: data.id,
            }
            if (data.student_uniqid && data.student_uniqid !== '') {
                obj[student_uniqid] = data.student_uniqid
            }
            this.$http.post('/ExamProject/edit', obj)
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
