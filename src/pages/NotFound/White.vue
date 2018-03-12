<template>
    <div class="cover">

    </div>
    
</template>

<script>

export default {
    data() {
        return {
            imgsrc404:"../static/imgs/404.png",
            imgsrc4041:"../static/imgs/4041.png",
            imgsrc4042:"../static/imgs/4042.png"
        };
    },
    components: {
    },
    mounted () {
        // this.req()
        setTimeout(()=> {
          history.go(-1)
        },100)
    },
    methods: {
        backfn() {
            history.go(-1)
        }
    }
}
</script>

<style scoped lang="less">
    .cover {
        background: white;
        width: 100%;
        height: 100%;
        .notFound {
            position: absolute;
            top:25%;
            left:50%;
            transform: translateY(-50%);
            transform: translateX(-50%);
            .back {
                display: block;
                margin:10px auto;
            }
        }
    }
    
</style>