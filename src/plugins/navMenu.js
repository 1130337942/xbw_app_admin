import navMenu from '@/components/navMenu';

let $vm

export default {
    install(Vue,options){
        // if(!$vm){

        // }
        Vue.component('navMenu', Vue.extend(navMenu))
    }   
}