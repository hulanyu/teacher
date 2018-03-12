<template>
    <td 
    :width="`${width}px`">
        <slot>
            {{prop}}
        </slot>
    </td>
</template>

<script>
export default {
    props: {
        prop: String,
        width: [Number, String],
    }
}
</script>