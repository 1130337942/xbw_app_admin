

<template>
    <el-button 
        :icon="icon" 
        :disabled="btnDisabled" 
        :circle="circle" 
        :plain="plain"
        :size="size"
        :type="type"
        @click="onbtnClick" 
    ></el-button>
</template>
<script>
export default {
    model:{
        prop:'btnDisabled',
        event:'change'
    },
    props:{
        circle:{
            type:Boolean,
            default:false,
        },
        plain:{
            type:Boolean,
            default:true,
        },
        size:{
            type:String,
            default:'small',
        },
        type:{
            type:String,
            default:'',
        }
    },
    // watch:{'btnDisabled':function(v,o){console.log(v,o)}},
    data(){
        return {
            btnDisabled:false,
        }
    },
    computed:{
        icon(){
            return !this.btnDisabled?'el-icon-refresh':'el-icon-loading';
        }
    },
    methods:{
        onbtnClick(){
            this.$emit('onClick')
        }
    }
}
</script>
<style lang="less" scoped>

</style>