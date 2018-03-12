<template>
    <td 
    :width="`${width}px`">
        <slot>
            {{label}}
        </slot>
    </td>
</template>

<script>
export default {
    props: {
        label: String,
        width: [Number, String],
    }
}
</script>