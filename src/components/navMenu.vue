<template>
    <div>
        
        <el-menu-item v-if="menuD.leaf" :index="menuD.index">
            <i v-if="menuD.icon" :class="menuD.icon"></i>
            <span slot="title">{{menuD.title}}</span>
        </el-menu-item>

        <el-submenu v-if="!menuD.leaf" :index="menuD.index">
            <template slot="title">
                <i v-if="menuD.icon" :class="menuD.icon"></i>
                <span>{{menuD.title}}</span>
            </template>
            <nav-menu v-for="(item) in menuD.children"
                :key="item.index"
                :menuD="item"
            />
        </el-submenu>
    </div>
</template>

<script>
export default {
    name:'navMenu',
    props:{
        menuD:{
            type:Object,
            required:true
        }
    }
}
</script>

<style lang="less" scoped>

</style>
