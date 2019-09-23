<template>
  <div class="panelBox">
    <div class="searchBox">
      <commodity-genre :bindValue="data" ></commodity-genre>
    </div>
  </div>
</template>
<script>
import commodityGenre from '@/components/commodityGenre'
export default {
    components:{commodityGenre},
    data() {
        return {
        
        options:[],
        data: [],
        // props:{
        //     value:'name',

        // },
        }
    },
    watch:{
      'this.$data.data':function(val,oldVal){
        console.log(val,oldVal);
      }
    },
    mounted(){
        setTimeout(() => {
            this.options = this.options1;
        }, 3000);
    },
    methods:{
        onChange(val){
            console.log('on panel', val)
        }
    }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/searchAndTabel.less");
</style>