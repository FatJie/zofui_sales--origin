<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
                  
        <div class="bg_audio"  @click="replaybg" v-if="pparams.music">
            <img :class="audioplaying ? 'music-btn-ani' : ''" :style="{ 'top' : dev == 'app' ? '100px':'40px'}" src="https://img11.360buyimg.com/ddimg/jfs/t1/74637/31/7451/1357/5d57e82eE1c06ed22/5965b60a624b89e2.png" />  
            <audio id="bgMusic" :src="pparams.music" loop="loop"></audio>
        </div>

        <div class="pg">
            <div @click="link" class="num" data-url="/zhuanpanlog">
                <img class="coin" src="https://img11.360buyimg.com/ddimg/jfs/t1/66987/40/2844/2130/5d11c13fE991d4de8/3325b3ca702a4704.png">
                <div>中奖记录</div>
            </div>
            <div @click="showRule" class="rule">
                <div>活动</div>
                <div>规则</div>
            </div>
            <div class="l-bg">
                <div class="l-prize" :style="{transform:'translate3d(0,0,0) rotate('+rotate+'deg)',transition : anim+'s'}">
                    <div class="item" :class="'item'+(index+1)" v-for="(item,index) in prizes" :key="item.id">
                        <div>{{item.name}}</div>
                    </div>
                </div>
                <div class="l-btn"></div>
                <div class="lottery"></div>
            </div>
            <div class="rule-wrap" v-if="isshowrule">
                <div class="mask"></div>
                <div class="rule-content">
                    <div class="rule-box">
                        <div class="rule-title">活动规则</div>
                        <div class="p-wrap">
                            <div class="rule-p" v-for="(item,index) in info.rule" :key="index">{{item}}</div>
                        </div>
                    </div>
                    <div @click="showRule" class="imgwrap">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/70820/25/2867/1314/5d11c236E54bba13c/40b67736eaa65a7b.png">
                    </div>
                </div>
            </div>
            <div class="bottom-wrap">
                <div class="bot-swiper" v-if="logarr && logarr.length > 0">
                    <van-swipe :show-indicators="false" :loop="true" :vertical="true"  :autoplay="2000" style="height: 30px;">
                        <van-swipe-item v-for="(item,index) in logarr" :key="index" initial-swipe="0" style="height: 30px;">
                            <div>{{item}}</div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
                <div  @click="getLottery" class="bot-btn"  :class="{'blink':!isAnimate,'opacity':isAnimate}" >
                    <font  v-if="pparams.last > 0">{{params.jifen*1 > 0 ? '立即':'免费'}}抽奖</font>
                    <font  v-if="pparams.last <= 0">邀请好友</font>
                </div>
                <div class="bot-txt">今天剩余{{pparams.last}}次机会</div>
            </div>
            <div class="rule-wrap" v-if="showprize">
                <div class="mask " :class="showani?'':'fade'"></div>
                <div class="icon-wrap " :class="showani?'fade_in1':'fade_out'">
                    <img v-if="myprize.type == 1" src="https://img11.360buyimg.com/ddimg/jfs/t1/40613/31/7689/72466/5d120709E1eacc578/e31b9eadf5c4df2b.png">
                    <img v-else src="https://img11.360buyimg.com/ddimg/jfs/t1/51204/12/3336/46693/5d11c211E4696b1ce/6ef891e2becc1d45.png">
                    <div class="pname">{{showprizetxt}}</div>

                    <div class="btnpp" @click="hidep">确定</div>
                </div>
            </div>

            <div @click="link" class="header_shouye" data-url="/" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/headline_shouye.png?t=1);bottom:40px;" ></div>

            <sharetip :isshowshare="isshowshare" @shareit="shareit" />
            <div class="apple-tips" v-if="dev == 'app' && devl == 'apple'">本活动与苹果公司无关</div>

            <div v-if="isshowsub">
                <div @click="hidepopsub" class="login-fullbtn __show " >
                </div>
                <div class="login-content tipstop-box " :class="isshowsub ? 'bounceInUp' : ''">   
                    <img :src="params.subqr.guanzhuqr" style="width:100%;" />
                    <div class="content">
                        <div>长按二维码关注公众号，便于查询订单和获取订单进度</div>
                    </div>
                    <div @click="hidepopsub" class="btn bg-pri">关闭</div>
                </div>
            </div>

        </div>
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Swipe,SwipeItem } from 'vant';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'zhuanpan',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Swipe.name] : Swipe,
            [SwipeItem.name] : SwipeItem,
            sharetip,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
                pparams : {},
                vesion : '',
	  			userinfo : {},
	  			sharedata :{},
                rotate : 0,
                anim : 5,
                myprize : {},
                prizes : [],
                logarr : [],
                isAnimate : false,
                showprize : false,
                txtArr: {
                    btn_name: "免费抽奖",
                    btn_pay: "",
                    btn_num: "剩余2次免费机会",
                    btn_able: true,
                    btn_val: ""
                },
                isshowrule : false,
                showani : false,
                isshowshare : false,
                dev : '',
                devl : '',
                isshowsub : false,
                music : false,
                audioplaying : false,
	  		}
	  	},
	  	created:function(e){

            this.initData();
            this.$route.meta.keepAlive = true;

	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            shareit(bool){
                this.isshowshare = bool;
            },
            hidepopsub(){
                this.isshowsub = false;
            },
            bindtap(e,type){
                var self = this;
                if( type == 'copy' ){
                    this.$copyText(e.currentTarget.dataset.copy).then(function (e) {
                         self.$toast('已复制');
                    }, function (e) {
                        self.$toast('复制失败');
                    })
                }else if(type == 'callphone'){
                    window.location.href = 'tel://' + e.currentTarget.dataset.tel;
                }else if(type == 'toweburl'){
                    window.location.href = e.currentTarget.dataset.weburl;
                }else if(type == 'navigateto'){
                    window.location.href = e.currentTarget.dataset.url;
                }
            },
            showRule(){
                this.isshowrule = !this.isshowrule;
            },
            getLottery(){
                var self = this;
                if( self.pparams.last <= 0 ){
                    self.shareit(true);
                    return false;
                }
                if( self.ising ) return false;
                self.ising = true;
                self.$util.http('zhuanpan','GET',{op:'getprize'},function(res){ 
                    if (res.data && !res.errno && res.data.prize) {

                        var id = 1;
                        for (var i = 0; i < self.prizes.length; i++) {
                            if( self.prizes[i].id == res.data.prize.id ){
                                self.myprize = res.data.prize;
                                self.anim = 5;
                                self.isAnimate = true;
                                id = i+1;
                            }
                        }

                        self.lottery(id, res.data.prize.name, 1, 'aaa');
                    }else if( res.errno == 2 ){
                        self.isshowsub = true;
                    }else{
                        self.$toast(res.message);
                        
                    }
                    self.ising = false;
                },true);
            },
            lottery: function(index, prizename, isprize, n) {
                var self = this;

                var s = this.rotate;
                0 == s && (s = 22.5);
                s += 3600 - 45 * index;
                this.rotate = s;
                this.rotate -= -45 * index;
                setTimeout(function() {
                    if( isprize == 1 ){
                        
                        self.showprize = true;
                        self.showani = true;
                        self.showprizetxt = prizename;
                        self.isAnimate = false;
                        self.ising = false;
                        self.rotate = 0;
                        self.anim = 0;
                        self.pparams.last = self.pparams.last - 1;

                    }else if(isprize == 0){
                        self.isAnimate = false;
                        self.ising = false;
                        self.rotate = 0;
                        self.anim = 0;
                        self.pparams.last = self.pparams.last - 1;
                    }
                }, 5000);
            },
            hidep(){
                var self = this;
                this.showani = false;
                setTimeout(function() {
                    self.showprize = false;
                }, 500);
            },
            replaybg(){
                if(this.music.paused) {
                    this.music.play();
                    this.audioplaying = true;
                } else {
                    this.music.pause();
                    this.audioplaying = false;
                }
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();

                var u = navigator.userAgent;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                self.devl = isiOS ? 'apple' : 'andr';

                var query = self.$route.query;
                var postdata = {
                    op : 'info',
                    zfid : query.zfid ? query.zfid : 0,
                }
	            self.$util.http('zhuanpan','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.info = res.data.info;
		                self.prizes = res.data.prize;
                        self.pparams = res.data.pparams;
                        self.params = res.data.params;
                        self.logarr = res.data.logarr;
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }

                        setTimeout(function(){
                        if( self.pparams.music ){
                            self.music = document.getElementById('bgMusic');
                            self.audioplaying = true;
                            self.music.play();
                            if( self.dev == 'wx' ){
                                document.addEventListener("WeixinJSBridgeReady", function (){
                                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                                        self.music.play();
                                    }, false);
                                });
                            }
                        }
                        },1000)

						self.inited = 2;
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
@import "../../assets/css/login.css";
button,input,li,p,page,section,td,th,ul,view {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#main #content{
    padding-bottom: 0;
}

.l-bg {
    width: 340px;
    height: 340px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: url(https://img11.360buyimg.com/ddimg/jfs/t1/42318/10/7540/170923/5d11c0e4E4dcaed13/214297ee3b4e3176.png) no-repeat no-repeat;
    background-size: 100% 100%;
}

.l-prize {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: url(https://img11.360buyimg.com/ddimg/jfs/t1/43821/28/7594/12465/5d11c121E774ab02c/f3d44c5418114ab4.png) no-repeat no-repeat;
    background-size: 100% 100%;
    font-size: 15px;
    color: #fff;
}

.l-btn {
    width: 340px;
    height: 340px;
    position: absolute;
    left: 0;
    top: 0;
    background: url(https://img11.360buyimg.com/ddimg/jfs/t1/37500/3/13186/10033/5d11c19cE24cbc6f4/b47e2771b8abd7d0.png) no-repeat no-repeat;
    background-size: 100% 100%;
}

.lottery {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.item {
    position: absolute;
    left: 135px;
    top: 70.5px;
    width: 70px;
    height: 200px;
    padding-top: -10px;
    text-align: center;
    font-size: 11px;
}

.item view:first-child {
    font-size: 15px;
    font-weight: 700;
}

.item1 {
    transform: rotate(22.5deg);
}

.item2 {
    transform: rotate(67.5deg);
}

.item3 {
    transform: rotate(112.5deg);
}

.item4 {
    transform: rotate(157.5deg);
}

.item5 {
    transform: rotate(202.5deg);
}

.item6 {
    transform: rotate(247.5deg);
}

.item7 {
    transform: rotate(292.5deg);
}

.item8 {
    transform: rotate(337.5deg);
}

.pg {
    position: relative;
    width: 100%;
    height: 100vh;
    background: url(https://img11.360buyimg.com/ddimg/jfs/t1/62866/15/2726/124559/5d11bff5E950b9bc9/38987d2bbb51ca67.jpg) no-repeat no-repeat;
    background-size: 100% 100%;
}

.num {
    position: absolute;
    left: 10px;
    top: 10px;
    display: flex;
    font-size: 12px;
    color: #fff;
    align-items: center;
}

.coin {
    display: block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.rule {
    position: absolute;
    right: 10px;
    top: 0;
    color: #fff;
    font-size: 12px;
    width: 40px;
    height: 40px;
    background: #c62743;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
}

.rule view:first-child {
    margin-top: 2px;
}

.rule-wrap {
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 100;
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(0,0,0,.6);
}

.bottom-wrap {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 35px;
}

.bot-btn {
    width: 258px;
    height: 69px;
    margin: 0 auto;
    background: url(https://img11.360buyimg.com/ddimg/jfs/t1/60438/25/2859/10808/5d11c16cEa8d577b2/372aedec98542428.png) no-repeat no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 41.5px;
    font-style: italic;
}

.hover {
    background: url(https://img11.360buyimg.com/ddimg/jfs/t1/54738/27/3302/2147/5d11c1d2Ec4ba92c2/cee199b0fa5d56fe.png) no-repeat no-repeat;
    background-size: 100% 100%;
    line-height: 52.5px;
}

.bot-btn font {
    color: #b3113f;
}

.bot-btn font:nth-child(1) {
    margin-right: 5px;
    font-weight: 700;
    font-size: 24px;
}

.bot-btn font:nth-child(2) {
    font-size: 15px;
}

.bot-txt {
    font-size: 14px;
    color: #fdd94e;
    text-align: center;
}

.bot-swiper {
    width: 150px;
    height: 18px;
    margin: 0 auto;
    margin-bottom: 12px;
    border-radius: 18px;
    background: rgba(255,255,255,.2);
    overflow: hidden;
}

.bot-swiper swiper {
    width: 100%;
    height: 100%;
}

.bot-swiper .van-swipe-item {
    text-align: center;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.icon-wrap {
    width: 272px;
    height: 272px;
    position: absolute;
    left: 50%;
    top: 40%;
    margin-left: -136px;
    margin-top: -136px;
    z-index: 2;
}

.icon-wrap img {
    width: 272px;
    height: 272px;
    display: block;
}

.icon-wrap .pname {
    font-size: 24px;
    color: #fbe265;
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
}

.fade_in {
    animation: fade_in 1s ease-in;
}

.fade_out {
    animation: fade_out .5s ease-in forwards;
}

.fade {
    animation: fade .5s linear forwards;
}

.blink {
    animation: blink 1s linear infinite;
}

@-webkit-keyframes fade_in {
    0% {
        transform: scale(.5);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes fade_in {
    0% {
        transform: scale(.5);
    }

    100% {
        transform: scale(1);
    }
}

@-webkit-keyframes fade_out {
    0% {
        left: 50%;
        top: 50%;
        transform: scale(1);
    }

    100% {
        left: 0;
        top: 0;
        transform: scale(0);
    }
}

@keyframes fade_out {
    0% {
        left: 50%;
        top: 50%;
        transform: scale(1);
    }

    100% {
        left: 0;
        top: 0;
        transform: scale(0);
    }
}

@-webkit-keyframes fade {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes fade {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@-webkit-keyframes blink {
    0% {
        transform: scale(.9);
    }

    50% {
        transform: scale(1);
    }

    100% {
        transform: scale(.9);
    }
}

@keyframes blink {
    0% {
        transform: scale(.9);
    }

    50% {
        transform: scale(1);
    }

    100% {
        transform: scale(.9);
    }
}

.loading {
    width: 100%;
    height: 100vh;
    background: #fff;
    position: relative;
}

.loading img {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.rule-content {
    position: absolute;
    z-index: 3;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.rule-box {
    width: 250px;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
}

.p-wrap {
    width: 100%;
    max-height: 250px;
    overflow: scroll;
}

.rule-title {
    margin-bottom: 15px;
    font-weight: 700;
    font-size: 18px;
    color: #333;
}

.rule-p {
    color: #666;
    font-size: 12px;
    text-align: left;
}

.imgwrap {
    width: 100%;
    margin-top: 30px;
    text-align: center;
}

.imgwrap img {
    width: 30px;
    height: 30px;
}

.opacity {
    opacity: .6;
}

.adwrap {
    margin-top: -24px;
    padding-bottom: 25px;
}
.btnpp{
    width: 125px!important;
    height: 33px;
    line-height: 33px;
    border-radius: 33px;
    margin:0 auto;
    margin-top: 25px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.1);
    border:1px solid #fff;
}

.apple-tips{
    position: fixed;
    left: 0;
    bottom: 2px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #fff;
}

/**/
.bg_audio img{
    width: 40px;
    height: 40px;
    border-radius:50%;
    position: fixed;
    z-index:2;
    top: 10px;
    right: 10px;
}
.music-btn-ani {
    -webkit-animation: music 1.5s infinite linear;
    animation: music 1.5s infinite linear;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

@keyframes music {
    0% {
        -webkit-transform: rotate(0deg) scale(1);
        transform: rotate(0deg) scale(1)
    }

    50% {
        -webkit-transform: rotate(180deg) scale(1.1);
        transform: rotate(180deg) scale(1.1)
    }

    to {
        -webkit-transform: rotate(1turn) scale(1);
        transform: rotate(1turn) scale(1)
    }
}



</style>