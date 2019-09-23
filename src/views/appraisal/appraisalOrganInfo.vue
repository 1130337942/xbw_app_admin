<template>
  <div class="home">
    <div class="backImg" @click="onBackClick"></div>
    <div class="formTitle">专家资料</div>
    <el-form
      class="formBox"
      ref="rulesForm"
      :model="rulesForm"
      :inline="false"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item prop="icon" label="机构logo:">
        <div class="imageCon" @click="onCheckImgClick('icon')" v-if="rulesForm.icon">
          <img
            v-lazy="domain+rulesForm.icon+'?x-oss-process=image/resize,m_fill,h_120,w_120'"
            alt
            class="avatar-uploader-icon"
          />
        </div>
        <div class="imageCon" @click="onCheckImgClick('icon')" v-else>
          <div class="avatar-uploader-icon">
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="images" label="机构图片:">
        <div class="imageArrCon">
            <div class="imageCon" @click="onCheckImgClick('images')" v-if="rulesForm.images.length<9">
                <div class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                </div>
            </div>
            <div 
                class="imageCon" 
                v-for="(item,index) in rulesForm.images"
                :key="index"
            >
                <img v-lazy="domain+item+'?x-oss-process=image/resize,m_fill,h_120,w_120'" alt class="avatar-uploader-icon"/>
                <div class="imageCon-icon-delete">
                    <i class="el-icon-delete" @click="onDelImgClick(index)" ></i>
                </div>
            </div>
        </div>
      </el-form-item>
      <el-form-item prop="name" label="机构名称:">
        <el-input v-model="rulesForm.name" :maxlength="10">
          <span slot="suffix">{{rulesForm.name.length||0}}/10</span>
        </el-input>
      </el-form-item>
      <el-form-item prop="province_id" label="机构地点:">
          <el-select v-model="rulesForm.province_id" @change="onProvinceChange">
              <el-option
                  v-for="item in provinceArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item prop="city_id" label-width="120px" label="">
          <el-select v-model="rulesForm.city_id">
              <el-option
                  v-for="(item,index) in cityArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item prop="introduction" label="机构简介:">
        <el-input type="textarea" v-model="rulesForm.introduction" :maxlength="255">
          <span slot="suffix">{{rulesForm.introduction.length||0}}/255</span>
        </el-input>
      </el-form-item>
      <el-form-item prop="recommend_star" label="推荐评级:">
        <el-rate v-model="rulesForm.recommend_star" show-text :texts="[1,2,3,4,5]"></el-rate>
      </el-form-item>
      <el-form-item prop="advisory_num" label="已咨询次数:">
        <el-input-number v-model="rulesForm.advisory_num" style="width:200px;"></el-input-number>
      </el-form-item>
    </el-form>

    <div class="formTitle" v-if="org_id!='-1'">服务项目</div>
    <div class="formBox" v-if="org_id!='-1'">
      <el-button icon="el-icon-circle-plus-outline" type="success" plain @click="onAddClick">添加服务</el-button>
      <el-table :data="tableData" border style="width: 100%;margin-top:10px;" size="medium">
        <el-table-column label="服务名称" min-width="100px">
          <template slot-scope="scope">{{scope.row.serves_info.genre_name}}</template>
        </el-table-column>
        <el-table-column label="服务价格(元)" min-width="100px">
          <template slot-scope="scope">{{scope.row.serves_price}}</template>
        </el-table-column>
        <el-table-column label="是否显示" min-width="100px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.release" :active-value="1" :inactive-value="0" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button @click="onEditClick(scope.row)" plain type="primary" icon="el-icon-edit">修改</el-button>
            <el-button
              @click="onDeleteClick(scope.row)"
              plain
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="formBox">
      <div class="textCenter" style="margin-top:20px;margin-bottom;">
        <el-button @click="onBackClick" type="danger">取消</el-button>
        <el-button @click="onSaveClick" type="primary">保存</el-button>
      </div>
    </div>

    <el-dialog title="图片资源" :visible.sync="dialogVisible" @close="onClose">
      <resources ref="resources" :checkLength="checkLength" />
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button @click="onCheckChange" type="primary">确定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog :title="tableDialogTitle" :visible.sync="tableDialogVisit" @close="onDialogClose">
        <el-form :model="tableDialogForm" :rules="dialogRules" ref="tableDialogForm" class="tableDialogForm" label-position="right" :inline="true">
            <el-form-item label="服务名称:" prop="serves_name">
                <!-- <el-input v-model="tableDialogForm.serves_name" maxlength="30">
                    <span slot="suffix">{{tableDialogForm.serves_name.length||0}}/30</span>
                </el-input> -->
                
            <el-autocomplete
              v-model="tableDialogForm.serves_name"
              :fetch-suggestions="querySearchAsync"
              :debounce="300"
              valueKey="name"
              placeholder="请输入服务名称"
            >
              <span slot="prefix"><i class="el-icon-search"></i></span>
            </el-autocomplete>
            </el-form-item>
            <el-form-item label="服务金额:" prop="serves_price">
                <el-input-number v-model="tableDialogForm.serves_price" style="width:200px;"></el-input-number>
            </el-form-item>
            <el-form-item label="服务描述:" prop="introduction">
                <el-input type="textarea" v-model="tableDialogForm.introduction" maxlength="225">
                    <span slot="suffix">{{tableDialogForm.serves_name.length||0}}/225</span>
                </el-input>
            </el-form-item>
            <el-form-item label="是否显示:" prop="release">
                <el-switch v-model="tableDialogForm.release" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="推荐关键词:" prop="keyword">
                <el-input v-model="tableDialogForm.keyword" maxlength="6">
                    <span slot="suffix">{{tableDialogForm.serves_name.length||0}}/6</span>
                </el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button @click="tableDialogVisit=false">取消</el-button>
            <el-button @click="onSaveDialogFormClick" type="primary">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getExpertOrgInfo,
  saveExperOrgData,
  getExpertOrgService,
  getAppraisalType,
  saveExperOrgService,
  delExpertOrgService,
  getServiceList
} from "@/api/appraisal";
import resources from "@/components/resources";
export default {
  components: {
    resources
  },
  data() {
    let positiveInteger = this.$positiveInteger;
    return {
      rulesForm: {
        icon : '',
        images : [],
        name : '',
        introduction : '',
        recommend_star : 4,
        advisory_num : 0,
        province_id:'',
        city_id:''
      },
      rules: {
        icon: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        images: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        name: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        recommend_star: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        advisory_num: [
          { required: true, message: "该项为必填项", trigger: "blur" },
          { validator: positiveInteger }
        ],
      },
      provinceArr:[],
      cityArr :[],
      tableData: [],
      dialogVisible: false,
      checkTarget:'icon',

      org_id: "-1",
      tableDialogForm: {
        org_id: "",
        serves_name: '',
        serves_price: 0,
        introduction: "",
        release: 0,
        keyword: ''
      },
      tableDialogTitle: "",
      tableDialogVisit: false,
      dialogRules: {
        serves_name: [{ required: true, message: "该项为必填项", trigger: "change" }],
        serves_price: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        introduction: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        release: [{ required: true, message: "该项为必填项", trigger: "blur" }],
      },

      folderOldVal:false,
      folderArr:[]
    };
  },
  computed: {
    domain() {
      return this.$domainUrl();
    },
    checkLength(){
        if(this.checkTarget==='images'){
            return 9 - this.rulesForm.images.length
        }else{
            return 1
        }
    }
  },
  created() {
    this.org_id = this.$route.params.id;
    if (this.org_id != "-1") {
      this.getData(this.org_id);
      this.getTableData(this.org_id);
    }
    this.getArea({level:1}).then(res=>{
      this.provinceArr = res;
    })
  },
  methods: {
    getTableData(id) {
      getExpertOrgService({ org_id: id }).then(res => {
        this.tableData = res;
      });
    },
    onAddClick() {
      this.tableDialogTitle = "添加服务类型";
      this.tableDialogVisit = true;
    },
    onEditClick(record) {
      this.tableDialogTitle = "编辑服务类型";
      this.tableDialogForm = {
        org_serves_id: record.id,
        serves_name: record.serves_info.name,
        serves_price: record.serves_price,
        introduction: record.introduction,
        release: record.serves_info.release,
        keyword: record.keyword
      };
      this.tableDialogVisit = true;
    },
    onDeleteClick(record) {
      delExpertOrgService({ org_serves_id: record.id }).then(res => {
        this.$message.success("删除成功");
        this.getTableData(this.org_id);
      });
    },
    onSaveDialogFormClick() {
      let params = { ...this.tableDialogForm };
      params.org_id = this.org_id * 1;
      this.$refs["tableDialogForm"].validate()
      .then(() =>
        saveExperOrgService(
          params,
          params.org_serves_id || params.org_serves_id === 0
        )
      )
      .then(res => {
        this.getTableData(this.org_id);
        this.$message.success("专家类型保存成功!");
        this.tableDialogVisit = false;
      })
      .catch(err => {
        console.log(err);
      });
    },
    onDialogClose() {
      this.tableDialogForm = {
        serves_name: '',
        serves_price: '',
        introduction: "",
        release: '',
        keyword: ''
      };
      this.$refs["tableDialogForm"].clearValidate();
    },

    onProvinceChange(id){
        this.cityArr = [];
        this.rulesForm.city_id = ''
        this.getArea({level:2,parent_id:id})
        .then(res=>{
            this.cityArr = res;
        })
    },

    getArea(params){
        return this.axios({
            url:'area/',
            params
        })
    },
    onSaveClick() {
      let params = { ...this.rulesForm };
      this.org_id != "-1" ? (params.org_id = this.org_id * 1) : null;
      this.$refs["rulesForm"]
        .validate()
        .then(() => saveExperOrgData(params, this.org_id != "-1"))
        .then(res => {
          this.$message.success("保存成功!");
          this.$router.back();
        })
        .catch(err => console.log(err));
    },
    onBackClick() {
      this.$router.back();
    },

    querySearchAsync(text,callback){
      let folderArr  = this.folderArr;
      if(this.folderOldVal === text){
          callback(this.folderArr);
      }else{
          getServiceList({page:1,limit:50}).then(res=>{
              callback(res.items);
              this.folderArr = res.items
          })
      }
      this.folderOldVal = text;
    },
    getData(id) {
      getExpertOrgInfo({ org_id: this.org_id }).then(res => {
        console.log(res);
        this.rulesForm = {
          icon: res.icon,
          images: res.images,
          name: res.name,
          introduction: res.introduction,
          recommend_star: res.recommend_star,
          advisory_num: res.advisory_num,
          province_id:res.province_id,
          city_id:res.city_id,
        };
        if(this.org_id!='-1'){
          this.getArea({level:2,parent_id:res.province_id}).then(res=>{
            this.cityArr = res;
          })
        }
      });
    },

    onCheckImgClick(type) {
    this.checkTarget = type;
    this.dialogVisible = true;
    },
    onDelImgClick(index){
        this.rulesForm.images.splice(index,1);
    },
    onCheckChange() {
        let data = this.$refs["resources"].api_getcheckItem();
        if(this.checkTarget ==='images'){
            this.rulesForm.images = this.rulesForm.images.concat(data.map(item=>this.$replaceUrl(item.url)))
        }else{
            this.rulesForm.icon = this.$replaceUrl(data[0].url);
        }
        this.dialogVisible = false;
    },
    onClose() {
      this.$refs["resources"].api_clearCheck();
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/formInfo.less");
.tableDialogForm {
  width: 80%;
  min-width: 450px;
  margin: 0 auto;
}
.imageArrCon {
    display: flex;
    justify-content: flex-start;
    flex-wrap:wrap;
    .imageCon {
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;
        overflow: hidden;
        .imageCon-icon-delete {
            width: 120px;
            height: 120px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, .3);
            text-align: center;
            line-height:120px;
            font-size: 20px;
            display: none;
            color: #ffffff;
        }
    }
    .imageCon:hover {
        .imageCon-icon-delete {
            display: block;
        }
    }
}
</style>
