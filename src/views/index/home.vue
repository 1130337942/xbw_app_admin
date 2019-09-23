
<template>
    <div>
        <div class="message-box">
            <div class="box">
                <div class="box-main">
                    <div class="img-box">
                        <img class="img-box-img"  src="../../assets/images/logo-header.png" alt="" />
                    </div>
                    <div class="text-box">
                        <p class="text-first">浏览</p>
                        <p class="text-first">0/0</p>
                    </div>
                </div>

            </div>
            <div class="box">
                <div class="box-main">
                    <div class="img-box">
                        <img class="img-box-img" src="../../assets/images/logo-header.png" alt="" />
                    </div>
                    <div class="text-box">
                        <p class="text-first">浏览</p>
                        <p class="text-first">0/0</p>
                    </div>
                </div>
            </div>
            <div class="box">
                <div class="box-main">
                    <div class="img-box">
                        <img class="img-box-img" src="../../assets/images/logo-header.png" alt="" />
                    </div>
                    <div class="text-box">
                        <p class="text-first">浏览</p>
                        <p class="text-first">0/0</p>
                    </div>
                </div>
            </div>
            <div class="box">
                <div class="box-main">
                    <div class="img-box">
                        <img class="img-box-img" src="../../assets/images/logo-header.png" alt="" />
                    </div>
                    <div class="text-box">
                        <p class="text-first">浏览</p>
                        <p class="text-first">0/0</p>
                    </div>
                </div>
            </div>
            <div class="box">
                <div class="box-main">
                    <div class="img-box">
                        <img class="img-box-img" src="../../assets/images/logo-header.png" alt="" />
                    </div>
                    <div class="text-box">
                        <p class="text-first">浏览</p>
                        <p class="text-first">0/0</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="charts">
            <ve-line height="300px" :data="chartData"></ve-line>
        </div>
        <div class="bott">
            <div class="left">
                <div class="top">
                    <div class="top-txt">异常日志</div>
                    <div class="top-txt">更多</div>
                </div>
                <el-table
                    :data="tableData1"
                    style="width: 100%"
                    row-key="id"
                    border
                    >
                    <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="地址">
                    </el-table-column>
                </el-table>
            </div>
            <div class="left">
                <div class="top">
                    <div class="top-txt">最新对话信息</div>
                    <div class="top-txt">更多</div>
                </div>
                <el-table
                    :data="tableData1"
                    style="width: 100%"
                    row-key="id"
                    border
                    >
                    <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="地址">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isBind:true,
                tableData1: [{
                    id: 1,
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    id: 2,
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    id: 3,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                }, {
                    id: 4,
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                chartData: {}
            }
        },
        created(){

        },
        mounted(){
            this.chartData = {
                columns: ['日期', '访问用户', '下单用户', '下单率'],
                rows: [
                    { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
                    { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
                    { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
                    { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
                    { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
                    { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
                ]
            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
.line{
    height: 10px;
    width: 100%;
    background-color: rgb(233, 236, 243);
}
.message-box{
    background-color:#fff;
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
}
.box{
    height: 70px;
    width: 20%;
    display: flex;
    align-items: center;
    border-right:solid 1px #eee;
    .box-main{
        width: 60%;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        .img-box{
            width: 50%;
            height:50px;
            text-align: center;
            .img-box-img{
                width:50px;
                // border-radius: 50%;
                height: 100%;
                margin: 0 auto;
                object-fit: scale-down;
            }
        }
        .text-box{
            width: 50%;
            height:50px;
            .text-first{
                line-height: 25px;
            }
        }
    }
}
.charts{
    margin-top: 10px;
    background-color: #fff;
    // height: 200px;
    width:100%;
    padding: 25px;
    box-sizing: border-box;
}
.bott{
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .left{
        background-color: #fff;
        width:49.8%;
        .top{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .top-txt{
                font-size: 14px;
                line-height: 40px;
                padding-left: 20px;
                &:nth-of-type(2){
                    padding-right: 20px;
                }
            }
        }
    }
}
</style>
