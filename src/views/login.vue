<template>
  <div class="login-wrap">
    <div class="header">
      <div class="section-inline clearfix header-box">
        <div class="fl">
          <img src="../assets/images/logo3.png" style="display:inline-block;">
        </div>
        <div class="fl">
          <span>用户登录</span>
        </div>
      </div>
    </div>

    <div class="bgf7" style="padding: 70px 0; flex: 1;">
      <div class="register section-inline clearfix">
        <div class="form fl">
          <div class="form-submit">
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules2"
              ref="ruleForm"
              class="demo-ruleForm clearfix"
              @submit.native.prevent
            >
              <el-form-item prop="account" class="clearfix">
                <div class="from-item clearfix">
                  <div class="form-title">账号</div>
                  <el-input
                    class="login-input"
                    v-model="ruleForm.account"
                    autocomplete="off"
                    placeholder="请输入用户账号"
                  ></el-input>
                  <!-- <input type="text" name id="account" v-model="ruleForm.account" value placeholder="请输入手机号码"> -->
                </div>
              </el-form-item>
              <el-form-item prop="password" class="clearfix">
                <div class="from-item mB30 clearfix">
                  <div class="form-title">密码</div>
                  <el-input
                    class="login-input"
                    type="password"
                    v-model="ruleForm.password"
                    autocomplete="off"
                    placeholder="请输入用户密码"
                  ></el-input>
                  <!-- <input type="text" name id="account" v-model="ruleForm.account" value placeholder="请输入手机号码"> -->
                </div>
              </el-form-item>
              <!-- <input type="checkbox" class="checkbox">
              <span>记住密码</span>-->
              <div class="clearfix">
                <a class="fr fz14" style="color: #63a8eb;">忘记密码？</a>
              </div>
              <!-- <button class="login mT43" @click="submitForm('ruleForm')">登 录</button> -->
              <el-form-item style="margin-top:30px;">
                <el-button class="login mT43" type="primary" @click="submitForm" native-type="submit" :disabled="isSubmiting" v-loading="isSubmiting">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="ad fl texC">
          <img src="../assets/images/register.png" style="display:inline-block;">
        </div>
      </div>
    </div>
    <div class="bott">版权所有：浙江寻宝网络科技有限公司</div>
  </div>
</template>

<script>
import * as AuthAction from '../api/auth'
export default {
  data () {
    return {
      ruleForm: {
        account: 'test123',
        password: 'test123456'
      },
      rules2: {
        account: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
        ],
      },
      isSubmiting:false,
    }
  },
  methods: {
    submitForm(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.isSubmiting = true;
          this.axios.post(`admin/sign_in/`,{account:this.ruleForm.account,password:this.ruleForm.password}).then(res=>{
            console.log(res)
            this.isSubmiting = false
            if(res.data){
              if(res.data.error_code!=0){
                this.$message.error(res.data.message.field.account[0]);
              }
            }else{
              this.$message.success('登录成功');
              // let time = new Date().getTime();
              AuthAction.setToken(res.token,2);
              // AuthAction.setExpires(time);
              this.$router.push({ path: '/main' })
            }     
          }).catch(err=>{console.log(err);this.isSubmiting = false;})
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.fz14{
  font-size: 14px;
}
.c999{
  color: #999999;
}
.mT43 {
  margin-top: 43px;
}
.mT23 {
  margin-top: 23px;
}
.mB30 {
  // margin-bottom: 30px;
}
.texC {
  text-align: center;
}
.disB {
  display: block;
}
input,
img {
  vertical-align: middle;
}
clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
  zoom: 1;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bott{
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #101010;
}
input,
button,
select,
textarea {
  outline: none;
}
a,
abbr,
acronym,
address,
applet,
article,
aside,
audio,
b,
blockquote,
big,
body,
center,
canvas,
caption,
cite,
code,
command,
datalist,
dd,
del,
details,
dfn,
dl,
div,
dt,
em,
embed,
fieldset,
figcaption,
figure,
font,
footer,
form,
h1,
h2,
h3,
h4,
h5,
h6,
header,
hgroup,
html,
i,
iframe,
img,
ins,
kbd,
keygen,
label,
legend,
li,
meter,
nav,
menu,
object,
ol,
output,
p,
pre,
progress,
q,
s,
samp,
section,
small,
span,
source,
strike,
strong,
sub,
sup,
table,
tbody,
tfoot,
thead,
th,
tr,
tdvideo,
tt,
u,
ul,
var {
  margin: 0;
  padding: 0;
}
img,
input,
button,
select,
textarea {
  vertical-align: middle;
}
img {
  border: 0;
}
input,
button,
textarea,
select {
  border: 0;
  margin: 0;
  padding: 0;
  font-size: 1em;
  line-height: 1em;
  outline: none;

  background-color: rgba(0, 0, 0, 0);
}
select::-ms-expand {
  display: none;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
  display: none;
}
.section-inline {
  // width: 1200px;
  margin: 0 auto;
}
body {
  font-family: "microsoft yahei", Microsoft Yahei;
  font-size: 14px;
  margin: 0 auto;
  min-width: 1200px;
  position: relative;
  background: #fff;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.header {
  height: 72px;
  line-height: 72px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
.header-box {
  height: 100%;
}
.header span {
  margin-left: 30px;
  height: 25px;
  display: block;
  line-height: 25px;
  border-left: 1px solid #eee;
  padding-left: 32px;
  margin-top: 25px;
  font-size: 16px;
  color: #666;
}
.form-title {
  width: 90px;
  display: inline-block;
}
.checkbox {
  border: 1px solid #999;
  -webkit-appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 3px;
  vertical-align: -2px;
}
// .checkbox.checked {
//   // background: url(../assets/images/fir.jpg) no-repeat center #fff;
// }
.register {
  width: 977px;
  height: 583px;
  box-shadow: 0px 0px 10px #ccc;
}
.register .form {
  width: 610px;
  background-color: #fff;
  height: 583px;
}
.register .ad {
  background-color: #eefaff;
  height: 100%;
  width: 367px;
}
.register .ad img {
  margin-top: 199px;
}
.register .form-submit {
  width: 420px;
  margin-left: 89px;
  margin-top: 69px;
}
.form-submit .from-item{
  border-bottom: 1px solid #eee;
  line-height: 76px;
}
.register .form-submit p input {
  float: right;
  width: 330px;
  height: 40px;
  margin-top: 18px;
  color: #666;
}
.el-input {
  width: 330px;
  height: 40px;
  margin-top: 18px;
  color: #666;
}
.register .form-submit button {
  display: block;
  width: 100%;
  background-color: #008EEA;
  height: 57px;
  line-height: 57px;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  font-size: 20px;
}
.register .form-submit span i {
  color: #63a8eb;
}
.register .form-submit span {
  color: #999;
}
#getcode {
  display: block;
  right: 0;
  bottom: 10px;
  border: 1px solid #63a8eb;
  color: #63a8eb;
  width: 117px;
  height: 39px;
  line-height: 39px;
  text-align: center;
  font-size: 16px;
  border-radius: 3px;
}
input::-webkit-input-placeholder {
  color: #999999;
  font-size: 16px;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999999;
  font-size: 16px;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999999;
  font-size: 16px;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #999999;
  font-size: 16px;
}

// .login-wrap {
//   width: 100%;
//   height: 100vh;
//   background: #c8d0dd no-repeat center 110px;
//   background-size: 100%;
//   display: flex;
//   flex-direction: column;
//   .login-main {
//     width: 280px;
//     margin: 70px auto 0;
//     flex: 1 1;
//     .login-title {
//       font-size: 20px;
//       font-weight: bold;
//       height: 50px;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     }
//     .el-button {
//       width: 100%;
//     }
//     @media screen and (max-width: 576px) {
//       width: 95%;
//     }
//   }
//   @media (min-width: 768px) {
//     background: #f0f2f5 url("../assets/login.svg") no-repeat center 110px;
//     background-size: 100%;
//   }
//   footer {
//     text-align: center;
//     color: rgba(0, 0, 0, 0.45);
//     font-size: 14px;
//     margin-bottom: 24px;
//     .footer-content {
//       margin-bottom: 8px;
//       > a {
//         color: rgba(0, 0, 0, 0.45);
//         margin-right: 40px;
//         &:last-child {
//           margin-right: 0;
//         }
//       }
//     }
//   }
// }
</style>
