<template>
  <div class="login-wrap">
    <div class style="padding: 70px 0; flex: 1;">
      <div class="mian-box">
        <div class="mian-title">404</div>
        <div class="small-title">2018-05-01 至 2019-04-30</div>
        <div class="main-content">亲，你的应用已到期，请联系客服 0573-88022289，或添加微信 18005738266</div>
        <el-button type="primary" size="medium" @click="backHome">Back Home</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {
    backHome: function () {
      this.$router.push({ path: '/main' })
    }
  }
}
</script>

<style scoped lang="less">
.mian-box {
  width: 881px;
  height: 638px;
  margin: 0 auto;
  padding-top: 50px;
  box-shadow: 0px 0px 10px #ccc;
  background: #fff;
  text-align: center;
  .mian-title {
    font-size: 150px;
    color: #101010;
  }
  .small-title {
    color: #101010;
    font-size: 14px;
  }
  .main-content {
    color: #008eea;
    font-size: 14px;
    margin-top: 61px;
    margin-bottom: 51px;
  }
}
</style>
