// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueResource from 'vue-resource'
Vue.use(VueResource)

import { Lazyload } from 'vant';
Vue.use(Lazyload);

Vue.config.productionTip = false

import Common from './assets/js/Common.js'
Vue.use(Common)

import './assets/css/Common.css'

// 复制插件
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard)


import loading from './components/loading';
Vue.component('loading',loading);


// 阻止多次下拉刷新 这个方式重复加载
Vue.directive('scroll',{
    inserted: function (el,binding,vnode,oldVnode) {
        let cb_name = binding.expression,
        cb = vnode.context[cb_name];
        let sctop = 0;
        window.addEventListener('scroll',function(){
            sctop = document.documentElement.scrollTop;
            if( sctop <= 0 ) sctop = document.body.scrollTop;
            if( sctop <= 0 ) sctop = window.pageYOffset;
            try{
                cb && cb(sctop);
            }catch(error){
                console.log(error)
            }
        })
    }
})


function setRem () {
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let htmlDom = document.getElementsByTagName('html')[0];
    //htmlDom.style.fontSize = htmlWidth/22.86 + 'px';
    htmlWidth = htmlWidth > 640 ? 640 : htmlWidth;
    let htmlFontSize = htmlWidth * 37.5 / 375;
    htmlDom.style.fontSize = htmlFontSize + 'px';
}
setRem();
window.onresize = function () {
    setRem()
}


router.beforeEach((to,from,next)=>{
    window.document.title = to.meta.title
    next()
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
