<template>
    <div class="image-container">
        <el-image
            :src="domain + src + last"
            :style="style"
            @click="onViewClick"
        >
            <div slot="placeholder" class="image-slot">
                <i class="el-icon-loading"></i>加载中...
            </div>
            <div slot="error" class="image-slot">
                <img :src="require('@/assets/images/load_err.png')" :style="style">
            </div>
        </el-image>
        <div class="mask">
            <i class="el-icon-view" v-if="viewBtn" @click="onViewClick"></i>
            <i class="el-icon-delete" v-if="delBtn" @click="onDeleteClick"></i>
            <i class="el-icon-refresh" v-if="refreshBtn" @click="onRefreshClick"></i>
        </div>
    </div>
</template>
<script>
import { type } from 'os';
export default {
    name:'image_component',
    props:{
        src:{
            type:String,
            required:true,
        },
        width:{
            type:Number,
            default:120,
        },
        height:{
            type:Number,
            default:120,
        },
        /**
         * image 图片资源
         * video 视频资源
         */
        type:{   
            type:String,
            default:'image'
        },
        // 预览按钮
        viewBtn:{
            type:Boolean,
            default:false
        },
        // 关闭按钮
        delBtn:{
            type:Boolean,
            default:false
        },
        // 重置按钮
        refreshBtn:{
            type:Boolean,
            default:false
        },
    },
    computed:{
        style(){
            return `width:${this.width}px;height:${this.height}px;`
        },
        domain(){
            return this.$domainUrl();
        },
        last(){
            switch (this.type) {
                case 'image' :
                    return `?x-oss-process=image/resize,m_fill,h_${this.width},w_${this.height}`;
                case 'video' : 
                    return this.$lastVideoUrl();
            }
        }
    },
    data(){
        return {

        }
    },
    methods:{
        onViewClick(){

            this.$emit('view');
        },
        onDeleteClick(){
            
            this.$emit('delete');
        },
        onRefreshClick(){

            this.$emit('refresh');
        },
    }
}
</script>
<style lang="less" scoped>
    .image-container {
        position: relative;
        .image-slot {
            text-align: center;
        }
        .mask {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(0, 0, 0, .5);
            color: #ffffff;
            font-size: 19px;
        }
    }
    .image-container:hover .mask {
        display: block;
    }
</style>