<template>
    <SGT
    :title="title"
    :componentsType="2"></SGT>
</template>

<script>
import SGT from './SGT.vue'

export default {
    data () {
        return {
            title: '年级题库'
        }
    },
    components: {
        SGT,
    },
}
</script>