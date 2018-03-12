<template>
    <SGT
    :title="title"
    :componentsType="1"></SGT>
</template>

<script>
import SGT from './SGT.vue'

export default {
    data () {
        return {
            title: '学校题库'
        }
    },
    components: {
        SGT,
    },
}
</script>