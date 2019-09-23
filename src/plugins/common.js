
/**
 * 全局方法 ($+方法名)
 */
export default {
    install (Vue, options) {


        Vue.prototype.$replaceUrl = function (url){
            return url.replace(/^http(s)?:\/\/(.*?)\//g,'/');
        };
        
        Vue.prototype.$domainUrl = function (){
            return 'https://app-img.xunbaowang.net';
        };
        
        /**
         * 是视频首帧图片后缀
         */
        Vue.prototype.$lastVideoUrl = function (){
            return '?x-oss-process=video/snapshot,t_10000,m_fast';
        };
        
        /**
         * @method 参数过滤
         * @param {Object} 过滤参数 
         * @param {Object,undefind} 补充参数 
         */
        Vue.prototype.$filterParams = function (params,other={}){
            let ret = {
                ...other
            }            ;
            for(let i in params){
                if(params[i]||params[i]===0){
                    ret[i] = params[i];
                }
            }
            return ret
        };

        /**
         * @method 显示/隐藏操作面板的loading
         */
        Vue.prototype.$showLoading = function (){
           this.$store.commit('showLoading');
        }
        Vue.prototype.$hideLoading = function (){
           this.$store.commit('hideLoading');
        }

        /**
         * @param {String,Number} 电话号码校验
         */
        Vue.prototype.$positiveInteger = function (rules,num,callback) {  //正整数
            if((num+'').trim()===''){
                callback();
            }else if(!/^(0|\+?[1-9][0-9]*)$/.test(num)){
                callback(new Error('请输入正整数'))
            }else{
                callback();
            }
        }
        Vue.prototype.$phoneRule = function (phone) {
            return phone?/^1[3456789]\d{9}$/.test(phone):false;
        },
        Vue.prototype.$special = function (rules,text,callback) {
            if((text+'').trim()===''){
                callback(new Error('该项为必填项'))
            }else if(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im.test(text)){
                callback(new Error('该项不能输入特殊字符'))
            }else{
                callback();
            }
        },
        // Vue.prototype.$money = function (money) {
        //     return money?/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(money):false;
        // }
        Vue.prototype.$money = function (rules,value,callback){
            if((value+'').trim()===''){
                callback(new Error('该项为必填项'))
            }else if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value))){
                callback(new Error('请填写正确的金额数'))
            }else{
                callback();
            }
        }   
    }
}