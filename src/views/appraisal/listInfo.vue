<template>
  <div class="home">
    <div class="backImg" @click="onBackClick"></div>
    <el-form :model="formData" label-width="90px" size="medium">
      <div class="formTitle">藏品信息</div>
      <div class="formBox">
        <el-form-item label="藏品描述:">{{formData.description}}</el-form-item>
        <el-form-item label="订单编号:">{{orderId}}</el-form-item>
        <el-form-item label="藏品图片:">
          <div class="flex_container">
            <div class="imageCon flex_item" v-for="(item,index) in formData.images" :key="index">
              <img v-lazy="domain+item+'?x-oss-process=image/resize,m_fill,h_120,w_120'" />
            </div>
          </div>
        </el-form-item>
      </div>
      <div class="formTitle">鉴宝人信息</div>
      <el-row class="formBox">
        <el-col :span="12">
          <el-form-item label="鉴宝人:">{{formData.contacts_info.name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式:">{{formData.contacts_info.mobile}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址:" v-if="formData.genre!==1">{{formData.contacts_info.address}}</el-form-item>
        </el-col>
      </el-row>
      <div class="formTitle">藏品鉴定者</div>
      <el-row class="formBox">
        <el-col :span="12">
          <el-form-item label="鉴宝方式:">{{formData.appraisal_info.appraisal_way}}</el-form-item>
        </el-col>

        <!-- 机构鉴定 -->
        <el-col :span="12" v-if="formData.genre===3">
          <el-form-item label="鉴定机构:">{{formData.appraisal_info.org_name}}</el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.genre===3">
          <el-form-item label="服务类型:">{{formData.appraisal_info.serves_genre}}</el-form-item>
        </el-col>

        <!-- 极速鉴定 -->
        <el-col :span="12" v-if="formData.genre===1">
          <el-form-item label="鉴定类别:">{{formData.appraisal_info.genre}}</el-form-item>
        </el-col>

        <!-- 专家鉴定 -->
        <el-col :span="12" v-if="formData.genre===2">
          <el-form-item label="鉴定专家:">{{formData.appraisal_info.expert}}</el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.genre===2">
          <el-form-item label="专家类型:">{{formData.appraisal_info.genre}}</el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.genre===2">
          <el-form-item label="专家等级:">{{formData.appraisal_info.level}}</el-form-item>
        </el-col>
      </el-row>
      <div class="formTitle" v-if="formData.appraisal_status===1">鉴定结果</div>
      <el-row class="formBox" v-if="formData.appraisal_status===1">
        <el-col :span="12" v-if="formData.genre===2">
          <el-form-item label="藏品真伪:">{{formData.authenticity===1?'真品':'仿品'}}</el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.genre===2">
          <el-form-item label="藏品年代:">{{formData.age_describe}}</el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.genre===2">
          <el-form-item label="价值评估:">￥{{formData.value_assessment}}</el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.genre===2">
          <el-form-item label="收藏价值:">{{formData.collection_value}}</el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.genre===2">
          <el-form-item label="参考意见:">{{formData.references}}</el-form-item>
        </el-col>
      </el-row>
      
      <div class="formTitle" v-if="formData.appraisal_status=='-1'">拒绝原因</div>
      <el-row class="formBox" v-if="formData.appraisal_status=='-1'">
        <el-col :span="24">
          <el-form-item label="原因:">{{rejectReasonArr.filter(item=>item.id===formData.reject_reason)[0].name}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述:">{{formData.reject_remark}}</el-form-item>
        </el-col>
      </el-row>
      
      <div class="formBox">
        <div class="textCenter" style="margin-top:30px;">
          <el-button
            type="primary"
            @click="onAppraisalClick"
            icon="el-icon-circle-check-outline"
            :disabled="formData.appraisal_status=='-3'"
            v-if="formData.appraisal_status=='-2'"
          >鉴定</el-button>
          <el-button
            type="danger"
            @click="onRefuseClick"
            icon="el-icon-circle-close-outline"
            v-if="[-3,-2].indexOf(formData.appraisal_status)!==-1"
          >拒绝鉴定</el-button>
          <el-button @click="onCancheClick">取消</el-button>
        </div>
      </div>
    </el-form>

    <el-dialog title="提交鉴定结果" :visible.sync="submitVisit" @close="onClose('submitForm')">
      <el-form ref="submitForm" :model="submitForm" label-position="left" :rules="rules">
        <el-form-item label="请确定藏品真伪" prop="authenticity">
          <el-radio-group v-model="submitForm.authenticity">
            <el-radio :label="1">真品</el-radio>
            <el-radio :label="2">仿品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请描述藏品年代" prop="age_describe">
          <el-input type="textarea" :maxlength="60" v-model="submitForm.age_describe">
            <!-- <span>{{submitForm.age_describe.length||0}}/60</span> -->
          </el-input>
        </el-form-item>
        <el-form-item label="价格评估" prop="value_assessment">
          <el-input-number v-model="submitForm.value_assessment"></el-input-number>
        </el-form-item>
        <el-form-item label="收藏价值" prop="collection_value">
          <el-input type="textarea" :maxlength="200" v-model="submitForm.collection_value">
            <!-- <span>{{submitForm.collection_value.length||0}}/200</span> -->
          </el-input>
        </el-form-item>
        <el-form-item label="参考意见" prop="references">
          <el-input type="textarea" :maxlength="400" v-model="submitForm.references">
            <!-- <span>{{submitForm.references.length||0}}/400</span> -->
          </el-input>
        </el-form-item>
      </el-form>
      <div class="footer" slot="footer">
        <el-button icon="el-icon-circle-close-outline" type="danger" @click="submitVisit=false">取消</el-button>
        <el-button icon="el-icon-circle-check-outline" type="primary" @click="onSaveClick">确认提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝鉴定原因" :visible.sync="cancelVisit" @close="onClose('cancelForm')">
      <el-form ref="cancelForm" :model="cancelForm" label-position="left" :rules="cancleRules">
        <el-form-item label="拒绝原因" prop="reject_reason">
          <el-select v-model="cancelForm.reject_reason">
            <el-option v-for="item in rejectReasonArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="reject_remark">
          <el-input type="textarea" v-model="cancelForm.reject_remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer" slot="footer">
        <el-button icon="el-icon-circle-close-outline" type="danger" @click="cancelVisit=false">取消</el-button>
        <el-button icon="el-icon-circle-check-outline" type="primary" @click="onCancleClick">确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAppraisalInfo,
  submitAppraisal,
  cancelAppraisal
} from "@/api/appraisal";
import { format } from "url";
export default {
  data() {
    return {
      formData: {
        images: [],
        contacts_info: {},
        appraisal_snapshot: {},
        appraisal_info: {}
      },
      rules: {
        authenticity: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        age_describe: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        value_assessment: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        collection_value: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        references: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ]
      },
      submitForm: {
        authenticity: "",
        age_describe: "",
        value_assessment: "",
        collection_value: "",
        references: ""
      },
      cancelForm: {
        reject_reason: "",
        reject_remark: ""
      },
      cancleRules: {
        reject_reason: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        reject_remark: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ]
      },
      rejectReasonArr:[
        {id:1,name:'藏品图片存在问题'},
        {id:2,name:'鉴定藏品与分类不符'},
        {id:3,name:'其他原因'},
      ],
      submitVisit: false,
      cancelVisit: false
    };
  },
  computed: {
    domain() {
      return this.$domainUrl();
    },
    orderId(){
      return this.$route.query.order_id
    }
  },
  created() {
    this.appraisal_id = this.$route.params.id;
    this.getData(this.appraisal_id);
  },
  methods: {
    onAppraisalClick() {
      this.submitVisit = true;
    },
    onRefuseClick() {
      this.cancelVisit = true;
    },
    onCancheClick() {
      this.$router.back();
    },
    onSaveClick() {
      let params = {
        appraisal_id: this.appraisal_id,
        ...this.submitForm
      };
      this.$refs["submitForm"]
        .validate()
        .then(() =>
          submitAppraisal(params).then(res => {
            this.$message.success("提交成功!");
            this.$router.back();
          })
        )
        .catch(err => console.log);
    },
    onCancleClick() {
      let params = {
        appraisal_id: this.appraisal_id,
        ...this.cancelForm
      };
      this.$refs["cancelForm"]
        .validate()
        .then(() =>
          cancelAppraisal(params).then(res => {
            this.$message.success("提交成功!");
            this.$router.back();
          })
        )
        .catch(err => console.log);
    },
    onClose(target) {
      this.$refs[target].resetFields();
    },
    onBackClick() {
      this.$router.back();
    },
    getData(id) {
      getAppraisalInfo({ appraisal_id: id })
        .then(res => {
          console.log(res)
          this.formData = res;
        })
        .catch(err => console.log(err));
    },
    getGenre(type) {
      let ret = "";
      switch (type) {
        case 1:
          ret = "极速鉴定";
          break;
        case 2:
          ret = "专家鉴定";
        case 3:
          ret = "机构鉴定";
      }
      return ret;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/css/formInfo.less");
</style>
