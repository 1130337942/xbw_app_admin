<template>
  <div class="ad-box">
      <el-scrollbar style="width:100%;height:100%">
        <div class="top-box">
            <el-form :rules="rules" size="medium" :model="ruleForm"  :inline="true" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="basic">基本信息</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="网站名称:" prop="website_name">
                            <el-input  v-model="ruleForm.website_name" placeholder="网站名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="首页标题:">
                            <el-input  v-model="ruleForm.index_title" clearable placeholder="pc网站seo 优化标题信息"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="首页关键词:">
                            <el-input v-model="ruleForm.index_keyword" clearable placeholder="pc网站seo 优化关键词"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="首页描述:">
                            <el-input :autosize="{ minRows: 4,}" type="textarea" v-model="ruleForm.index_description" clearable placeholder="pc网站seo 优化描述"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="basic">联系我们</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客服电话:">
                            <div class="box" v-for="(item,index) in serviceList" :key="index">
                                <el-input  style="margin:10px 10px 10px 0;" v-model="item.title" clearable></el-input>
                                <el-button  type="primary" @click="delService(index)">删除</el-button>
                            </div>
                            <el-input style="margin:10px 10px 10px 0;" v-model="serviceName" clearable></el-input>
                            <el-button  type="primary" @click="addService">添加</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱:">
                            <el-input v-model="ruleForm.email" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- <el-col :span="12">
                        <el-form-item label="公司地址:">
                            <el-input style="margin:10px 10px 10px 0;" v-model="ruleForm.province" clearable placeholder="请输入省"></el-input>
                            <br>
                            <el-input style="margin:10px 10px 10px 0;" v-model="ruleForm.city" clearable placeholder="请输入市"></el-input>
                            <br>
                            <el-input style="margin:10px 10px 10px 0;" v-model="ruleForm.area" clearable placeholder="请输入区"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="工作时间:">
                            <el-time-select
                                placeholder="起始时间"
                                v-model="startTime"
                                :picker-options="{
                                start: '07:30',
                                step: '00:15',
                                end: '20:30'
                                }">
                            </el-time-select>
                            <el-time-select
                                placeholder="结束时间"
                                v-model="endTime"
                                :picker-options="{
                                start: '07:30',
                                step: '00:15',
                                end: '20:30',
                                minTime: startTime
                                }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="详细地址:" class="address">
                            <el-input :autosize="{ minRows: 4,}" type="textarea" v-model="ruleForm.address" placeholder="街道等具体信息"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="地址坐标:">
                            <el-input v-model="ruleForm.longitude" placeholder="输入经度坐标"></el-input>
                            <el-input  v-model="ruleForm.latitude" placeholder="输入纬度坐标"></el-input>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item class="basic">
                            <el-button type="primary" @click="addOrEdit(1)">保存</el-button>
                            <!-- <el-button  @click="addOrEdit(2)">取消</el-button> -->
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
      </el-scrollbar>
    
  </div>
</template>

<script>
export default {
  data () {
    return {        
        serviceList:[],
        startTime:'',
        endTime:'',
        ruleForm:{
            website_name:'',
            index_title:'',
            index_keyword:'',
            index_description:'',
            city:'',
            province:'',
            area:'',
            email:'',
            address:'',
            latitude:'',
            longitude:''
        },
        serviceName:'',
        rules:{
            website_name: [
                { required: true, message: '请输入网站名称', trigger: 'blur' },
            ],
        },
        dt:''
    }
  },
  watch: {

  },
  created () {
    this.getData();
  },
  methods: {   
    getData(){
        this.axios.get(`system/basic_parameters/info/`).then(res=>{
            this.ruleForm.website_name = res.website_name;
            this.ruleForm.index_title = res.index_title;
            this.ruleForm.index_keyword = res.index_keyword;
            this.ruleForm.index_description = res.index_description;
            if(res.consumer_hotline.length>0){
                for(const item of res.consumer_hotline){
                    this.serviceList.push({
                        title:item
                    })
                }
            }
            if(res.end_work_time.split(':').length==3){
                this.endTime = res.end_work_time.split(':')[0]+":"+res.end_work_time.split(':')[1];
            }else{
                this.endTime = res.end_work_time;
            }
            if(res.start_work_time.split(':').length==3){
                this.startTime = res.start_work_time.split(':')[0]+":"+res.start_work_time.split(':')[1];
            }else{
                this.startTime = res.start_work_time;
            }
            this.ruleForm.email = res.email;            
            this.ruleForm.address = res.address;
            this.ruleForm.province = res.province;
            this.ruleForm.city = res.city;
            this.ruleForm.area = res.area;
            this.ruleForm.latitude = res.latitude;
            this.ruleForm.longitude = res.longitude;
        })
    },
    addOrEdit(i){
        // console.log(this.startTime);
        // return;
        if(i==1){
            var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
            if(this.ruleForm.email){
                if(!re.test(this.ruleForm.email)){
                    this.$message.error('邮箱格式不正确');
                    return;
                }
            }
            
            let dataParams = {};
            dataParams.website_name = this.ruleForm.website_name;
            this.ruleForm.index_title?dataParams.index_title = this.ruleForm.index_title:'';
            this.ruleForm.index_description?dataParams.index_description = this.ruleForm.index_description:'';
            this.ruleForm.index_keyword?dataParams.index_keyword = this.ruleForm.index_keyword:'';
            dataParams.consumer_hotline = [];
            if(this.serviceList.length>0){              
                for(const item of this.serviceList){
                    dataParams.consumer_hotline.push(item.title);
                }
            }
            this.serviceName?dataParams.consumer_hotline.push(this.serviceName):'';
            // this.ruleForm.province?dataParams.province = this.ruleForm.province:'';
            // this.ruleForm.city?dataParams.city = this.ruleForm.city:'';
            // this.ruleForm.area?dataParams.area = this.ruleForm.area:'';
            this.ruleForm.address?dataParams.address = this.ruleForm.address:'';
            this.ruleForm.email?dataParams.email = this.ruleForm.email:'';
            // this.ruleForm.latitude?dataParams.latitude = this.ruleForm.latitude:'';
            // this.ruleForm.longitude?dataParams.longitude = this.ruleForm.longitude:'';
            dataParams.start_work_time = this.startTime;
            dataParams.end_work_time = this.endTime;
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.axios.post(`system/basic_parameters/edit/`,dataParams).then(res=>{
                        this.$message.success('提交成功');
                    })
                } 
            });
        }
    },
    addService(){
        if(this.serviceName){
            this.serviceList.push({
                title:this.serviceName,        
            })
            this.serviceName = '';
        }else{
            this.serviceList.push({
                title:'',        
            })
        }     
    },
    delService(i){
        this.serviceList.splice(i,1);
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-box{
    height: 100%;
    background-color: #fff;
    .top-box{
        padding: 40px;
        width: 100%;
        height: 100%;
    }
}
/deep/ .basic{
    padding-left: 40px;
    color: #1989FA;
}
/deep/ .el-range-separator{
    width: 8% !important;
}
.el-input {
  width: 250px;
}
.el-textarea {
  width: 250px;
}
.address{
    width: 100%;
    /deep/ .el-form-item__content{
        width: 500px !important;
        /deep/ .el-input--medium{
            width: 100% !important;
        }   
    }
}
</style>

