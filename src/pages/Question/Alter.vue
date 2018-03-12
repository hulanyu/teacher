<template>
    <Edit
    title="编辑试题"
    mode="w"
    :data="data"></Edit>
</template>

<script>
import Edit from './Edit'

export default {
    data () {
        return {
            data: {},
            id: this.$route.params.id,
            type: this.$route.params.type,
        }
    },
    mounted () {
        this.req()
    },
    methods: {
        req () {
            this.$http.post('/Question/getDetailById', {
                token: this.$tools.getToken(),
                uid: this.$tools.getUID(),
                school_id: this.$tools.getSchoolID(),
                id: this.id,
                question_type: this.type,
            })
            .then(res => {
                this.data = res.data
            })
        }
    },
    components: {
        Edit,
    },
}
</script>