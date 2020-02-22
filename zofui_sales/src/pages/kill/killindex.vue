<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="top-bar-container sltk locationf" :style="{top:dev == 'app' ? '60px' : '0px'}">
                <div class="top-time" scrollX="true" >
                    <div class="scroll_bg" >
                        <div @click="tabChange" :data-id="item.id" :data-status="item.status" :data-start="item.status == 1 ? item.start : 0" :id="'topv'+item.id" class="top-time-item" :class="killarr.actid == item.id ? 'active' : ''" v-for="item in killarr.list" >
                            <div class="time-info">
                                <font class="txt-time txt-title" >{{item.title}}</font>
                                <font class="txt-status">{{item.sub_title}}</font>
                            </div>
                            <div class="time-bg"></div>
                        </div>
                    </div>
                </div>
            </div>

        <!-- <van-tabs v-model="actindex" class="killtop" sticky background="#000" title-inactive-color="#fff" title-active-color="#fff" :line-width="1">
            <van-tab v-for="(item,index) in killarr.list" @click="tabChange" :data-id="item.id" :data-status="item.status" :key="index">
            <div slot="title">
                <div>
                    {{item.title}}
                </div>
                <div>{{item.sub_title}}</div>
            </div> -->

            <div style="height: 52.5px;"></div>
            <div class="count-wrapper" v-if="topstatus == 1">
                <font >限时限量 底价抢购</font>
                <div class="time-countdown">
                    <font>距本场开始 </font>
                    <div class="countdown">
                        <font class="rect">{{downtime.hour}}</font>
                        :
                        <font class="rect">{{downtime.minite}}</font>
                        :
                        <font class="rect">{{downtime.second}}</font>
                    </div>
                </div>
            </div>

            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <div class="goods-list-bg " v-if="datalist.length > 0">
                
                <div @click="link" class="goods-item" :data-url="item.appurl" v-for="item in datalist" >
                    <div class="goods-item-image">
                        <img class="item-image" v-lazy="item.thumb">
                    </div>
                    <div class="goods-item-content">
                        <div class="title-mian line1">{{item.title}}</div>
                        <div class="xlg-price">
                            <div class="group-price" :class="item.status == 0 ?'coming-price':''">
                                <font class="cdj" v-if="!item.price_ori">秒杀价 </font>
                                <font :class="!item.price_ori?'rmb':'crmb'">¥</font>
                                <font class="price-deci" >{{item.show_price}}</font>
                                <font class="price-ori" v-if="item.oldprice*1 > 0">¥{{item.oldprice}}</font>
                            </div>
                            <div :class="item.status == 0 ? 'coming-line' : ''">
                                <div class="_progress" v-if="item.last <= 0">
                                    <div class="fire-icon"></div>
                                    <font class="closesale">已被抢{{item.stock}}</font>
                                    <div class="progress-inner" :style="{width:item.pro+'%'}"></div>
                                </div>
                                <div class="_progress" v-else>
                                    <font class="text" v-if="item.pro <= 85">{{item.pro}}%</font>
                                    <div v-else>
                                        <div class="fire-icon"></div>
                                        <font class="closesale">即将售罄</font>
                                    </div>
                                    <div class="progress-inner" :style="{width:item.pro+'%'}"></div>
                                </div>
                            </div>
                            <div  class="group-btns" >
                                <div class="tuan-group-btn">
                                    <font class="num none" v-if="item.last <= 0">已被抢完</font>
                                    <font class="num" :class="item.status == 0 ?'coming-color':''" v-else>{{item.btn_txt}}</font>
                                    <div class="group-btn" formType="submit">
                                        <font class="button btn-last" v-if="item.last <= 0">已抢光 </font>
                                        <font class="button btn-coming" v-else-if="item.status == 0">
                                            <font class="iconfont icon-remind"></font>{{item.mstime+'点'}}开抢 
                                        </font>
                                        <font class="button btn-selling" v-else>马上抢</font>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            </van-list>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                <div>— 暂时还没有数据 —</div>
            </div>

        <!-- </van-tab>
    </van-tabs>   -->  

            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Tab,Tabs } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Tab.name] : Tab,
            [Tabs.name] : Tabs,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			page : {
	  				pdata : {
	  					doo : 'kill',
	  					op : 'list',
	  					status : 0,
                        id : -1,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                killarr : [],
                topstatus : 0,
                timer : null,
                start : 0,
                downtime : {day:0,hour:0,minite:0,second:0},
                actindex : 0,
                dev : '',
	  		}
	  	},
        activated:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		//this.$emit('loadmessage',false);
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            tabChange(e){
                var self = this;

                var id = e.currentTarget.dataset.id;
                var status = e.currentTarget.dataset.status;
                var start = e.currentTarget.dataset.start;

                if( id == self.page.pdata.id ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.topstatus = status;
                this.killarr.actid = id;
                this.page.pdata.id = id;

                self.onLoad();

                if( start > 0 ) {
                    self.countTime(start);
                }

            },
            countTime(start){
                var self = this;
                clearInterval(self.timer);
                self.timer = null;

                self.start = start;
                self.timer = setInterval(function(){
                    var date = new Date();
                    var time = date.getTime();
                    
                    var endTime = self.start + '000';
                    var lag = (endTime*1 - time);
                    if(lag > 0){
                        var second = Math.floor(lag/1000%60);
                        var minite = Math.floor(lag/1000/60%60);
                        var hour = Math.floor(lag/1000/60/60%24);
                        var day = Math.floor(lag/1000/60/60/24);
                    }else{
                        var second = '0';
                        var minite = '0';
                        var hour = '0';
                        var day = '0';
                    }
                    self.downtime = {day:day,hour:hour,minite:minite,second:second};
                },1000);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                
                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.page.pdata.lat = loc.lat;
                if( loc.lng ) self.page.pdata.lng = loc.lng;
                self.page.isend = false;
                self.page.geting = false;
				self.page.pdata.page = 1;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.killarr = res.data.killarr;
                        self.actindex = res.data.killarr.actindex;
		                  
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        
                        
                        
	                	self.inited = 2;
                        if( !loc ){
                            self.$util.getLocation(function(){
                                self.initData();
                            },self.params.tenkey,wx)
                        }
	                }else{
	                	self.$toast(res.message);
	                }
	                self.isrefresh = false;
	            });
            },
	  		onLoad() {
	  			var self = this;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){        
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
                    
	            });
	  		},
	  		
	  	}
  	}
</script>
<style type="text/css" scoped>
@import "../../assets/css/iconfont.css";

#main {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
}
@-webkit-keyframes animation-shake {
    0% {
        transform: rotateZ(0);
    }

    25% {
        transform: rotateZ(10deg);
    }

    50% {
        transform: rotateZ(0);
    }

    75% {
        transform: rotateZ(-10deg);
    }

    100% {
        transform: rotateZ(0);
    }
}

@keyframes animation-shake {
    0% {
        transform: rotateZ(0);
    }

    25% {
        transform: rotateZ(10deg);
    }

    50% {
        transform: rotateZ(0);
    }

    75% {
        transform: rotateZ(-10deg);
    }

    100% {
        transform: rotateZ(0);
    }
}

.animation-shake {
    animation: animation-shake 0.5s linear infinite;
}

@-webkit-keyframes animation-ripple {
    0% {
        transform: scale3d(1,1,1);
    }

    33% {
        transform: scale3d(1.08,1.08,1);
    }

    57.8% {
        transform: scale3d(0.98,0.98,1);
    }

    73.3% {
        transform: scale3d(1.01,1.01,1);
    }

    91.1% {
        transform: scale3d(0.995,0.995,1);
    }

    100% {
        transform: scale3d(1,1,1);
    }
}

@keyframes animation-ripple {
    0% {
        transform: scale3d(1,1,1);
    }

    33% {
        transform: scale3d(1.08,1.08,1);
    }

    57.8% {
        transform: scale3d(0.98,0.98,1);
    }

    73.3% {
        transform: scale3d(1.01,1.01,1);
    }

    91.1% {
        transform: scale3d(0.995,0.995,1);
    }

    100% {
        transform: scale3d(1,1,1);
    }
}

.animation-ripple {
    animation: animation-ripple 1s infinite ease-in-out;
}

@-webkit-keyframes animation-bounce-in {
    from,20%,40%,60%,80%,to {
        animation-timing-function: cubic-bezier(0.215,0.61,0.355,1);
    }

    0% {
        opacity: 0;
        transform: scale3d(0.3,0.3,0.3);
    }

    20% {
        transform: scale3d(1.1,1.1,1.1);
    }

    40% {
        transform: scale3d(0.9,0.9,0.9);
    }

    60% {
        opacity: 1;
        transform: scale3d(1.03,1.03,1.03);
    }

    80% {
        transform: scale3d(0.97,0.97,0.97);
    }

    to {
        opacity: 1;
        transform: scale3d(1,1,1);
    }
}

@keyframes animation-bounce-in {
    from,20%,40%,60%,80%,to {
        animation-timing-function: cubic-bezier(0.215,0.61,0.355,1);
    }

    0% {
        opacity: 0;
        transform: scale3d(0.3,0.3,0.3);
    }

    20% {
        transform: scale3d(1.1,1.1,1.1);
    }

    40% {
        transform: scale3d(0.9,0.9,0.9);
    }

    60% {
        opacity: 1;
        transform: scale3d(1.03,1.03,1.03);
    }

    80% {
        transform: scale3d(0.97,0.97,0.97);
    }

    to {
        opacity: 1;
        transform: scale3d(1,1,1);
    }
}

.animation-bounce-in {
    animation: animation-bounce-in 1s;
}

.popup-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 100;
}

.popup-window {
    position: relative;
    overflow: hidden;
    background-color: white;
    border-radius: 13px;
}

.popup-close {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 20px;
}


.slide-image {
    width: 100%;
    height: 150px;
}

.list-title {
    height: 56px;
    line-height: 56px;
    text-align: center;
    background-color: #FFF;
    font-size: 16px;
}

.tuan-list-title {
    height: 44.5px;
    background: url(//h0.hucdn.com/open/201736/7966db7e7e948737_750x89.png) no-repeat;
    background-size: 100% 100%;
}

.sub-channel {
    margin-bottom: 8px;
    padding-bottom: 12px;
    background: #FFF;
}

.sub-channel .item {
    display: inline-block;
    text-align: center;
    width: 187.2.5px;
}

.sub-channel .item .image {
    margin: 12px 0 8px;
    width: 50px;
    height: 50px;
}

.sub-channel .item .title {
    line-height: 1;
    text-align: center;
    color: #3D3D3D;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
}

.count-wrapper {
    background-color: #fff;
    margin-bottom: 5px;
    padding: 8px 12px 4px;
    font-size: 13px;
    color: #3D3D3D;
    line-height: 20px;
    position: relative;
    z-index: 1;
}

.count-wrapper .time-countdown {
    float: right;
    width: 155px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #EEEEEE;
    border-radius: 50px;
}

.count-wrapper .time-countdown .countdown {
    display: inline-block;
}

.block_margin {
    margin-top: 52.5px;
}

.top-bar-container {
    height: 52.5px;
}

.top-bar-container .top-time {
    position: relative;
    height: 52.5px;
    padding-bottom: -7.5px;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    background-image: linear-gradient(-1deg,#1D2228 0%,#1D2228 100%);
    background-repeat: repeat-x;
    background-size: 100% 45px;
}

.top-bar-container .top-time .scroll_bg {
    height: 45px;
    white-space: nowrap;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    width: 10rem;
}

.top-bar-container .top-time .scroll_bg .top-time-item {
    position: relative;
    z-index: 1;
    width: 94px;
    height: 45px;
    text-align: center;
    font-size: 30px;
    color: #fff;
    display: inline-block;
}

.top-bar-container .top-time .scroll_bg .top-time-item .time-info {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
}

.top-bar-container .top-time .scroll_bg .top-time-item .time-info .txt-time {
    display: block;
    margin-top: 6px;
    font-size: 15px;
    font-family: Helvetica-Bold;
    line-height: 18px;
    font-weight: 700;
}

.top-bar-container .top-time .scroll_bg .top-time-item .time-info .txt-title {
    display: block;
    margin-top: 6px;
    font-size: 13px;
    color: #FFFFFF;
    line-height: 18px;
}

.top-bar-container .top-time .scroll_bg .top-time-item .time-info .txt-status {
    display: block;
    font-size: 12px;
    line-height: 16.5px;
    letter-spacing: 0;
}

.top-bar-container .top-time .top-time-item.active {
    position: relative;
    background-color: #FF2436;
}

.van-tabs__line,.top-bar-container .top-time .top-time-item.active:after {
    display: inline-block;
    content: '';
    position: absolute;
    top: 45px;
    left: 39.5px;
    width: 0;
    height: 0;
    border-top: 6px solid #FF2436;
    border-left: 7.5px solid transparent;
    border-right: 7.5px solid transparent;
}
.van-tab{
    line-height: 1.1!important;
}

.top-bar-container .top-time .top-time-item.active .txt-time {
    font-size: 18px;
}

.top-bar-container .top-bar {
    position: absolute;
    top: 45px;
    height: 40px;
}

.top-bar-container .top-bar .top-bar-item.active {
    color: #FF2436!important;
}

.locationp {
    position: absolute;
    top: 0;
}

.locationf {
    position: fixed;
    top: 0;
    z-index: 3;
}


.list-container {
    margin-top: 91px;
    box-sizing: border-box;
}

.tuan-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 9px 12px;
    font-size: 11px;
    line-height: 11px;
    color: #8f8f8f;
}

.tuan-info .tuan-price-origin {
    text-decoration: line-through;
}

.goods-list-bg {
    position: relative;
    z-index: 1;
}

.goods-list-bg.all .goods-item:first-child {
    
}

.goods-list-bg.all .goods-item:first-child .tag {
    background-color: #fff;
}

.goods-list-bg .lm-container {
    background-color: #f2f4f6;
}

.icon-remind {
    display: inline-block;
    margin-right: 2px;
}

/**/
.goods {
    background-color: #fff;
    position: relative;
}

.goods-item {
    flex: 1;
    display: flex;
    background: #fff;
}

.goods-item-image {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 6px;
}

.goods-item-image image {
    width: 135px;
    height: 135px;
}

.goods-item-image .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 60px;
    height: 60px;
    z-index: 10000;
}

.goods-item-image .qiangguangla {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.goods-item-image .item-image {
    width: 120px;
    height: 120px;
}

.goods-item-image .item-tag {
    position: absolute;
    left: 0;
    right: 0;
    width: 80px;
    height: 80px;
    z-index: 9;
}

.goods-item-image .promotion-img {
    position: absolute;
    left: 0;
    right: 0;
}

.goods-item-content {
    flex: 1;
    border-bottom: 0.5px solid rgba(0,0,0,0.08);
    position: relative;
}

.goods-item-content .title {
    font-size: 14px;
    margin-top: 10px;
    margin-left: 9px;
    margin-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-family: PingFang-SC-Regular;
    color: #3d3d3d;
}

.goods-item-content .title-mian {
    font-size: 14px;
    margin-top: 5px;
    margin-left: 9px;
    margin-right: 12px;
}

.goods-item-content .line1 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.goods-item-content .line2 {
    display: -webkit-box;
    overflow: hidden;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.goods-item-content .tip {
    color: #FF2436;
    font-size: 14px;
    margin-left: 3px;
}

.goods-item-content .tag {
    display: inline-block;
    padding: 0 6px;
    height: 18px;
    background: rgba(252,232,97,0.7);
    border-radius: 50px;
    margin-top: 8px;
    text-align: center;
    line-height: 18px;
    margin-left: 9px;
}

.goods-item-content .tag font {
    font-size: 12px;
    color: #701411;
}

.goods-item-content .coming-price.group-price {
    color: #32bc6f;
}

.goods-item-content .group-price {
    display: block;
    font-size: 13px;
    line-height: 13px;
    color: #FF2436;
}

.goods-item-content .group-price .group-num {
    color: #999;
    padding-right: 4.5px;
    display: inline-block;
}

.goods-item-content .group-price .cdj {
    font-size: 12px;
    margin-left: 10.5px;
}

.goods-item-content .group-price .rmb {
    padding-right: 4px;
    font-weight: 700;
}

.goods-item-content .group-price .crmb {
    margin-left: 10.5px;
    font-weight: 700;
}

.goods-item-content .group-price .price-inte {
    font-size: 18px;
    line-height: 1;
    font-weight: 700;
}

.goods-item-content .group-price .price-deci {
    font-weight: 700;
    margin-right: 0;
}

.goods-item-content .group-price .price-ori {
    color: #999;
    padding-left: 6px;
    text-decoration: line-through;
}

._progress {
    position: relative;
    width: 94px;
    height: 14px;
    background: rgba(255,119,111,0.3);
    border: 1px solid rgba(255,119,111,0.5);
    border-radius: 50px;
    margin-left: 9px;
    margin-top: 10.5px;
    overflow: hidden;
}

._progress .text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 10px;
    color: #fff;
    z-index: 1000;
}

._progress .progress-inner {
    position: absolute;
    left: 0;
    right: 0;
    height: 14px;
    background-image: linear-gradient(50deg,#FE597C 0%,#FF776F 100%);
    border-radius: 50px;
}

._progress .closesale {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 10px;
    color: #FCFF99;
    z-index: 100;
    padding-left: 24px;
    width: 70px;
}

._progress .fire-icon {
    background-image: url('http://h0.hucdn.com/open/201737/ab262b9975c79f73_42x42.png');
    background-size: 100%;
    width: 14px;
    height: 14px;
    position: absolute;
    z-index: 7000;
    left: 7px;
    top: -1px;
}


.xlg-price {
    position: absolute;
    width: 240px;
    left: 0;
    bottom: 0;
    margin-bottom: 7.5px;
}

.tuan-group-btn {
    position: absolute;
    right: 12px;
    bottom: 0;
    right: 0;
    text-align: -webkit-right;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: end;
    justify-content: flex-end;
}

.tuan-group-btn .group-btn {
    background-color: transparent;
    line-height: 0;
}

.tuan-group-btn font.num {
    font-size: 12px;
    line-height: 12px;
    color: #FF2436;
    margin-top: 10px;
    padding: 0 14px;
}

.tuan-group-btn .button {
    display: inline-block;
    width: 44px;
    height: 24px;
    padding: 0 8px;
    margin-top: 8px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    border-radius: 50px;
    line-height: 24px;
    white-space: nowrap;
}

.tuan-group-btn .btn-selling {
    background-image: linear-gradient(50deg,#FE597C 0%,#FF776F 100%);
    vertical-align: middle;
}

.tuan-group-btn .btn-selling .iconfont {
    font-size: 10px;
}

.tuan-group-btn .ic_tuan_left-arrow {
    display: inline-block;
    width: 5.5px;
    height: 10px;
    margin-left: 2.5px;
    background: url("http://h0.hucdn.com/open/201738/45a77ea8e08f7c57_17x30.png") no-repeat center;
    background-size: 100% 100%;
    vertical-align: middle;
}

.tuan-group-btn .btn-coming {
    padding: 0;
    width: 60px!important;
    opacity: .9;
    background: #32bc6f;
}
.coming-line .progress-inner{
    background: #32bc6f;
}
.coming-line ._progress{
    background: #32bc6f;
    border:0.5px solid #32bc6f;
}
.coming-color{
  color: #32bc6f!important;
}

.tuan-group-btn .btn-coming .icon-bell {
    font-size: 10px;
}

.tuan-group-btn .btn-coming-1 {
    padding: 0;
    width: 60px!important;
    opacity: .9;
    background: #32bc6f;
}

.tuan-group-btn .btn-coming-1 .icon-bell {
    font-size: 10px;
}

.tuan-group-btn .btn-last {
    opacity: 0.7;
    background: #CECECE;
    color: #fff;
    width: 60px!important;
}

.tuan-group-btn .btn-last-1 {
    opacity: 0.7;
    background: #CECECE;
    color: #fff;
    width: 44px!important;
}

.promotion_desc {
    margin-top: 6px;
    margin-left: 9px;
    font-size: 14px;
    color: #FF4F4D;
    letter-spacing: 0;
    line-height: 14px;
}

.blue-tag {
    display: inline-block;
    padding: 0 6px;
    height: 18px;
    background: #D2F2FE;
    border-radius: 50px;
    margin-top: 8px;
    text-align: center;
    line-height: 18px;
    margin-left: 10.5px;
    overflow: hidden;
}

.blue-tag font {
    font-size: 12px;
    color: #303E6D;
    float: left;
    margin-left: 6px;
    margin-right: 6px;
}

.blue-tip {
    width: 48px;
    height: 18px;
    background: #91B8F2;
    font-size: 12px;
    color: #fff;
    margin-left: -6px;
    float: left;
}

.yellow-tag {
    display: inline-block;
    padding: 0 6px;
    height: 15px;
    border-radius: 50px;
    margin-top: 8px;
    text-align: center;
    line-height: 15px;
    margin-left: 10.5px;
    overflow: hidden;
    border: 1px solid #FF8E4D;
}

.yellow-tag font {
    font-size: 11px;
    color: #FF8E4D;
    float: left;
    margin-left: 5px;
    margin-right: 2.5px;
}

.yellow-tip {
    width: 31px;
    height: 15px;
    background: #FF8E4D;
    font-size: 11px;
    color: #fff;
    margin-left: -6px;
    float: left;
}

.green-tag {
    display: inline-block;
    padding: 0 6px;
    height: 15px;
    border-radius: 50px;
    margin-top: 8px;
    text-align: center;
    line-height: 15px;
    margin-left: 10.5px;
    overflow: hidden;
    border: 1px solid #2ccc8c;
}

.green-tag font {
    font-size: 11px;
    color: #2ccc8c;
    float: left;
    margin-left: 5px;
    margin-right: 2.5px;
}

.green-tip {
    width: 31px;
    height: 15px;
    background: #2ccc8c;
    font-size: 12px;
    color: #fff;
    margin-left: -6px;
    float: left;
}

.qcfont {
    display: block;
    font-size: 13px;
    color: #999;
    padding-left: 10.5px;
    text-decoration: line-through;
    margin-top: 6px;
}



</style>