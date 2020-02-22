<template>
  	<div id="app">

        <div class="app-header " style="height:60px;" :style="{'background-color':setbg?setbg:'#ffffff','color':setbg?'#ffffff':'#000000'}" v-if="isshowbar && dev == 'app'">
            <div class="item_cell_box app-header-in" style="padding-top: 25px;">
                <div class="app-header-c" @click="back" v-if="isshowback">
                    <van-icon name="arrow-left" />
                </div>
                <div class="item_cell_flex header-title">{{apptitle}}</div>
            </div>
        </div>
        <transition :name="transitionName" >
        <keep-alive  exclude="login,orderinfo,cardmyinfo,helpinfo,groupinfo,commentinfo,shopinfo,redbaginfo,jiziinfo,buycard,orderlist,commentorder,adminbindadmin,zhuanpan,agentjoin,adminpub,adminlogin,cart,adminbaddcard,adminset,adminpay,adminindex,adminhexiaocard,adminhexiao,cardinfo,agentindex,fenxiaouser,fenxiaojoinPartner,sortindex,orderaddaddress,kefuindex,kefulist,userset,page,shoplist,fenxiaogoods,fenxiaoindex,vedioindex,art,questinfo,adminorderinfo,cardredbag,goodsshare,questindex,adminorder">
            
      	    <router-view :style="{'padding-top' : isshowbar && dev == 'app' ? '60px':''}" @loadmessage="loadmessage"></router-view>
            
        </keep-alive>
        </transition>
        <tabbar @routechange="routechange"></tabbar>
  	</div>
</template>

<script>
    import { Icon } from 'vant';
    import tabbar from './components/tabbar';
    export default {
      	name: 'App',
        components : {
            [Icon.name] : Icon,
            tabbar
        },
      	data : function(){
      		return {
      			loaded : false,
                scrolltop : 0,
                slide : '',
                dev : '',
                apptitle : '',
                isshowbar : true,
                transitionName : '',
                isshowback : false,
                setbg : false,
      		}
      	},
        created(){
            var self = this;
            var locurl = location.href.split('#');
            var url = this.$util.getQuery(locurl[0]);
            if( url.zfdo ){
                this.$router.push({ name:url.zfdo, query:url });
            }
            
            window.apiready = function(){
                var dev = self.$util.dev();
                if( dev == 'app' ){  
                    self.dev = 'app';
                }
                
                api.sendEvent({
                    name: 'opened'
                });
            }

            self.$util.http('user','GET',{op:'queue'},function(res){});

        },
        updated() {
            window.scroll(0, 0);
        },
      	methods: {
      		loadmessage(e){
                this.apptitle = e.title;
      		},
            routechange(e){

                if( e.isback ){
                    this.transitionName = 'slide-right';
                }else{
                    this.transitionName = 'slide-left';
                }
                if( this.dev == 'app' ){
                    if( e.title ){
                        this.apptitle = e.title;
                    }
                    
                    if( e.ishide ){
                        this.isshowbar = false;
                    }else{
                        this.isshowbar = true;
                    }
                    if( e.isshowback ){
                        this.isshowback = true;
                    }else{
                        this.isshowback = false;
                    }
                    if( e.setbg ){
                        this.setbg = e.setbg;
                    }else{
                        this.setbg = false;
                    }
                }
            },
            back(){
                this.$router.go(-1);
            }
      	}
    }
</script>
<style type="text/css">
.app-header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 101;
    align-items: center;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
}
.app-header-in{
    padding: 0 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.app-header-c{
    font-size:16px; 
    width:40px;
    padding-top: 5px;
    position: absolute;
    z-index: 2;
}
.header-title{
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    margin-left: -20px;
    padding: 0 40px;
    padding-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: box;
    -webkit-box-orient: vertical;
    position: relative;
    z-index: 1;
}


.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    will-change: transform;
    transition: all .3s;
    position: absolute;
    width: 100%;
    height:100%;
}
.slide-right-enter {
    transform: translate3d(-100%, 0, 0);
    opacity: 1;
}
.slide-right-leave-active {
    opacity: 0;
}
.slide-left-enter {
    transform: translate3d(100%, 0, 0);
    opacity: 1;
}
.slide-left-leave-active {
    opacity: 0;
}
</style>