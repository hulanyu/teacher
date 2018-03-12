<template>
    <SGT
    :title="title"
    :componentsType="3"></SGT>
</template>

<script>
import SGT from './SGT.vue'

export default {
    data () {
        return {
            title: '教师题库'
        }
    },
    components: {
        SGT,
    },
}
</script>