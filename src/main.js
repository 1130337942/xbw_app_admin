import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/css/public.css'

import VueLazyload from 'vue-lazyload'
import navMenu from '@/plugins/navMenu';
import resources from '@/components/resources';
import xbImage from '@/components/image';
import common from '@/plugins/common';
// import uploadTaskBar from '@/plugins/uploadTaskBar';  //上传 任务栏
import axios from './api/axios'


import OSS from 'ali-oss'

Vue.prototype.OSS = OSS;

Vue.prototype.axios = axios;

import VCharts from 'v-charts';
Vue.use(VCharts);
Vue.use(VueLazyload, {
  preLoad: 1,
  error: require('./assets/images/load_err.png'),
  loading: require('./assets/images/load.png'),
  attempt: 2,
})
// Vue.use(VueLazyload);

Vue.use(ElementUI).use(vueQuillEditor)
Vue.use(navMenu);
Vue.use(navMenu);
// Vue.use(uploadTaskBar);  上传任务栏
Vue.use(common);

Vue.component('resources',resources)
Vue.component('xbImage',xbImage)

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$ELEMENT = {
  size: 'small',
  zIndex: 3000
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#jscx')
