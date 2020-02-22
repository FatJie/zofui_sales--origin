<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">


            <div class="header" >
                <div class="sign_btna"></div>
                <div class="sign_btnb"></div>
                <div class="sign_btn color-pri" v-if="signinfo.status == 0" @click="signinfn">
                    {{signinfo.signdis <= 0 ? '已完成' : '点我签到'}}
                </div>
                <div class="sign_btn sign_btnend" v-else>
                    {{signinfo.status == 1 ? '已抢完' : ''}}
                    {{signinfo.status == 2 ? '未开始' : ''}}
                    {{signinfo.status == 3 ? '已结束' : ''}}
                </div>   
            </div>
                
            <div class="sign_pro">
                <div class="sign_proinfo item_cell_box">
                    <div class="item_cell_flex" v-if="signinfo.signdis > 0">
                        你已签到<font class="color-pri">{{signinfo.signed}}</font>次，还差<font class="color-pri">{{signinfo.signdis}}</font>次获得礼包
                        <font  @click="link" class="color-pri" data-url="/cardmylist">查看我的奖品</font>
                    </div>
                    <div class="item_cell_flex" v-else>
                        恭喜你已经完成了，<font class="color-pri" @click="link" data-url="/cardmylist">查看我的奖品</font>
                    </div>
                    <div class="sign_rule" @click="hideRules" >
                        规则<font class="zan-icon zan-icon-question"></font>
                    </div>
                </div>
                <div class="sign_probody">

                    <div class="sign_day" v-for="(item,index) in signstep" :key="index">
                        <div class="sign_ic">
                            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/78156/8/3158/4095/5d162192E23ac1dcd/fc35b30c57c80855.png" v-if="item.status == 1">
                            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/72782/4/3195/7172/5d162198E0dc6b225/9b67ec5441747a1d.png" v-if="item.status == 0">
                        </div>
                        <div class="sign_time" >{{item.time ? item.time : '待签到'}}</div>
                    </div>
                </div>
            </div>

            <div class="prize_box">

                <van-swipe class="topswiper" :autoplay="4000" indicator-color="white">
                  <van-swipe-item v-for="(item,index) in signinfo.prize" :key="index">
                        <div class="box " :data-index='index' @click="link" data-url="/cardmylist" >
                            <div class="prize_itemper">礼包{{index+1}}/{{signinfo.prize.length}}</div>
                            <img v-lazy='item.pimg' style="width:100%;height: 300rpx;"></image>
                            <div class='pname'>
                                {{item.pname}}
                            </div>
                        </div>
                  </van-swipe-item>
                </van-swipe>

            </div>

            <div class="sub_title mt0" >
                <font>签到门店</font>
            </div>
            <div class="shop-top">
                <div class="top-wrap mt20" v-for="(item,index) in signinfo.signshop" :key="index">
                    <div class="tit">{{item.name}}</div>
                    <div class="info_list thin-border_t">
                        <div class="item" v-if="item.tel">
                            <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/101969/39/1451/874/5dbef58aEdb6f1d8a/2edd1ecd006d6583.png">
                            <div class="txt">{{item.tel}}</div>
                            <div @click="bindtap($event,'tel')" class="btn bg-pri" :data-tel="item.tel">拨打</div>
                        </div>
                        <div class="item" v-if="item.address">
                            <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/54624/21/15033/774/5dbef5a2E91b5f893/b5c7df46f8c99df0.png">
                            <div class="txt">{{item.address}}</div>
                            <div @click="bindtap($event,'loc')" class="btn bg-pri" :data-lat="item.lat" :data-lng="item.lng" :data-addname="item.name" :data-add="item.address" v-if="item.lat">导航</div>
                        </div>
                    </div>
                </div>   
            </div>


            <div class="sub_title" >
                <font>店主推荐</font>
            </div>
            <div class="sub_goods">
                <div class="goods_item" @click="link" :data-url="item.appurl" v-for="item in datalist" :key="item.id">
                    <img lazyLoad="true" mode="aspectFill" v-lazy="item.thumbh">
                    <font class="goods_tit">{{item.title}}</font>
                    <div class="goods_ft">
                        <div class="price_cur item_cell_flex">{{item.show_price}} <font>元</font></div>
                        <div class="price_orgbox tr" v-if="item.oldprice > 0">
                            <font class="price_orga">原价</font>
                            <font class="price_org" >{{item.oldprice}}</font>
                        </div>
                    </div>
                </div>
            </div>

            <div @click="hideRules" class="kanjiatk" v-if="showRules">
                <div class="infotext">
                    <div class="info_tit">活动规则<div class="tit_line"></div>
                    </div>
                    <div class="rulesinfo" v-for="(item,index) in signinfo.content" :key="index">{{item}}</div>
                </div>
                <div class="btn_">
                    <img @click.stop="hideRules" class="btn_close" src="https://wuhoucdn.oss-cn-hangzhou.aliyuncs.com/tangdaren/btn_close.png">
                </div>
            </div>

            <div  class="kanjiatk" v-if="signin">
                <div class="infotext qrcode_in">
                    <img :src="qrcode" >
                    <div class="tips">请向店员出示此二维码</div>
                </div>
                <div class="btn_">
                    <img @click="hidesignin" class="btn_close" src="https://wuhoucdn.oss-cn-hangzhou.aliyuncs.com/tangdaren/btn_close.png">
                </div>
            </div>

            <div  class="kanjiatk" v-if="showtake" >
                <div class="infotext" style="background-image: url('https://img11.360buyimg.com/ddimg/jfs/t1/32833/8/13037/29169/5cb981c2E6d80a73a/c63b580245bfad04.png');background-size: 660rpx 660rpx;background-repeat: no-repeat;background-position: center center;">
                    <div class="take_tit color-pri">签到完成</div>
                    
                    <div class="botswiper">
                        <img class="bg-pri" src="https://img11.360buyimg.com/ddimg/jfs/t1/38798/33/461/1217/5cb98095E5ceed519/bc0ae015ef79b85c.png" >
                        <div class="tips">你签到已完成，领取礼包后，礼包会发放到你的优惠券中心，注意查收使用</div>
                    </div>

                    <div class="take_btn lbg-pri" @click="takeprize">领取礼包</div>
                </div>
            </div>

            <div @click="link" class="header_shouye" data-url="/" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/headline_shouye.png?t=1);" ></div>


        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Swipe,SwipeItem } from 'vant';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'signinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Swipe.name] : Swipe,
            [SwipeItem.name] : SwipeItem,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                signinfo : {},
                signstep : [],
                showRules : false,
                signin : false,
                showtake : false,
                datalist : [],
                page : {
                    pdata : {
                        doo : 'shopinfo',
                        op : 'goodlist',
                        shopid : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : true,
                    geting : false,
                    initget : false,
                },
	  		}
	  	},
	  	created:function(e){
            this.$emit('loadmessage',false);
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  		
	  	},
        beforeRouteLeave(to,from,next){
            this.signin = false;
            next();
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            joinact(){
                this.showjoin = true;
            },
            hidesignin(){
                this.signin = false;
            },
            hideRules(){
                this.showRules = !this.showRules
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            signinfn(){
                var self = this;
                var postdata = {
                    op : 'signtoday',
                    signid : self.signinfo.id
                }
                self.$util.http('signin','GET',postdata,function(res){     
                    if (!res.errno && res.data) {
                        self.signin = true;
                        self.logid = res.data.sid;
                        self.qrcode = res.data.qrcode;

                        self.checkSigned();
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            checkSigned(){
                var self = this;
                setTimeout(function(){
                    if( !self.signin ) return false;
                    
                    var postdata = {
                        op : 'checksign',
                        logid : self.logid
                    }
                    self.$util.http('signin','GET',postdata,function(res){    
                        if (!res.errno && res.data) {
                            self.signin = false;
                            if( res.data.issuc == 1 && res.data.isselftake == 1 ){

                                self.showtake = true;
                            }else{
                                Dialog.alert({
                                  message: res.message
                                }).then(() => {
                                    self.initData();
                                });
                            }
                        }else{
                            self.checkSigned();
                        }
                    },true);
                },3000)
            },
            takeprize(){
                var self = this;
                var postdata = {
                    op : 'takeprize',
                    signid : self.signinfo.id
                }

                self.$util.http('signin','GET',postdata,function(res){     
                    if (!res.errno && res.data ) {
                        Dialog.alert({
                          message: res.message
                        }).then(() => {
                            self.showtake = false;
                            self.initData();
                        });
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            showjoinfn(){
                this.showjoin = !this.showjoin;
            },
            hidegeted : function(){
                this.showgeted = false;
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }

	            self.$util.http('signin','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
                        self.signinfo = res.data.signinfo;
                        self.signstep = res.data.signstep ? res.data.signstep : [];
                        self.shop = res.data.shop ? res.data.shop : {};
                        self.page.pdata.shopid = res.data.signinfo.shopid;
                        self.showtake = res.data.signinfo.isneedtaked == 1 ? 1 : 0;
                        self.sharedata = res.data.sharedata;
                        
                        window.document.title = self.signinfo.name;
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }

		                self.onLoad();

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
#main {
    min-height: 100vh;
    background-color: #fff;
}
.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
}
.header {
    background: url("http://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/hongbao/info_bg.png") no-repeat;
    width: 375px;
    height: 325px;
    background-size: 100% 100%;
    position: relative;
}
.help_btn01 {
    height: 40px;
    width: 100%;
    background-color: #ffd909;
    text-align: center;
    line-height: 40px;
    overflow: hidden;
    color: #9c3000;
    font-size: 18px;
    border-radius: 25px;
    box-shadow: 2.5px 5px #ffa509;
    font-weight: bold;
}

.sub_title {
    color: #353535;
    font-size: 16px;
    text-align: center;
    display: block;
    margin-top: 35px;
    font-weight: bold;
}

.sub_title::after {
    background-color: #ffd93f;
    width: 20px;
    height: 4px;
    display: block;
    content: " ";
    margin: 14px auto 0;
}

.sub_goods {
    margin: 15px 10px 0;
    display: flex;
    flex-wrap: wrap;
}

.goods_item {
    background-color: #fff;
    width: 165px;
    padding: 5px;
    height: 175px;
    overflow: hidden;
    box-sizing: content-box;
    margin-bottom: 10px;
    text-align: left;
}

.goods_item:nth-child(2n-1) {
    margin-right: 5px;
}

.goods_item img {
    width: 165px;
    height: 92.5px;
    display: block;
    background-color: #eee;
}

.goods_item .goods_tit {
    color: #353535;
    font-size: 14px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 10px 0;
}

.price_cur {
    color: #ff4040;
    font-size: 16px;
    margin-right: 7.5px;
}
.price_orgbox{
    display: inline-flex;
}
.price_org {
    color: #cccccc;
    font-size: 12px;
    text-decoration: line-through;
}
.price_orga{
    color: #cccccc;
    font-size: 12px;
}


.goods_ft {
    display: flex;
    align-items: center;
}

.yhtext {
    font-size: 10px;
    color: #ff4040;
    border: 1px solid #ff4040;
    padding: 0 1px;
    margin-right: 5px;
    height: 14px;
}

.kanjiatk {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    top: 0;
    left: 0;
    z-index: 999;
    text-align: center;
}

.kanjiatk .infotext {
    background-color: #fff;
    width: 230px;
    font-size: 14px;
    color: #353535;
    padding: 10px;
    border-radius: 10px;
    height: 309px;
    margin: 122.5px auto 0;
    text-align: left;
    line-height: 1.6;
}

.kanjiatk .info_tit {
    font-size: 16px;
    text-align: center;
    font-weight: bold;
}

.kanjiatk .info_tit .tit_line {
    background: #ffd93f;
    width: 20px;
    height: 3px;
    margin: 10px auto 20px;
}

.kan_icon_alarm {
    width: 50px;
    height: 49.5px;
}

.text_kan {
    color: #888888;
}

.text_kan2 {
    font-size: 12px;
    color: #353535;
}

.red {
    color: #ff5050;
}

.rulesinfo {
}

.btn_ {
    width: 100%;
    text-align: center;
    padding-top: 26px;
}

.btn_close {
    width: 38.5px;
    height: 38px;
}

.header_shouye {
    border-radius: 50%;
    background-color: rgba(0,0,0,0.5);
    width: 45px;
    height: 45px;
    position: fixed;
    left: 15px;
    bottom: 15px;
    z-index: 500;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
div.dbtn{
    background-color: initial!important;
    padding-left: initial!important;
    padding-right: initial!important;
    line-height: initial!important;
}
.tr{
    text-align: right;
}
.price_cur{
    font-size: 16px;
}
.price_cur text{
    font-size: 11px;
}

/**/
.sign_btna{
    width: 140px;
    height: 140px;
    background: rgba(255,255,255,0.4);
    position: absolute;
    top: 50px;
    left: 50%;
    margin-left: -70px;
    border-radius: 50%;
    box-shadow: 0.5px 0.5px 11px rgba(255,255,255,0.8);
    animation: warn 2s ease-out;
    animation-direction:alternate;
    animation-iteration-count: infinite;
}
.sign_btnb{
    background: rgba(255,255,255,0.6);
    border-radius: 50%;
    box-shadow: 0.5px 0.5px 11px rgba(255,255,255,0.2);
    width: 120px;
    height: 120px;
    position: absolute;
    left: 50%;
    margin-left: -60px;
    top: 60px;
    animation: warn 2s ease-out;
    animation-direction:alternate;
    animation-iteration-count: infinite;
}
.sign_btn{
    background: #fff;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    text-align: center;
    line-height: 100px;
    font-weight: bold;
    position: absolute;
    left: 50%;
    margin-left: -50px;
    top: 70px;
    box-shadow: 0.5px 0.5px 5.5px rgba(0,0,0,0.2);
    font-size: 20px;
}
.sign_btnend{
    background-color: #ddd;
}

@keyframes warn {
0% {
    transform: scale(1);
}
50% {
    transform: scale(1.1);
}
100% {
    transform: scale(1);
}
}
.sign_pro{
    box-shadow: 0.5px 0.5px 11px rgba(0,0,0,0.2);
    margin: 10px;
    border-radius: 5px;
    margin-top: -110px;
    background: #fff;
    position: relative;
    z-index: 1;
}
.sign_proinfo{
    color: #999;
    font-size: 12.5px;
    padding: 10px;

}
.sign_rule .zan-icon{
    padding-left: 3px;
}
.sign_probody{
    white-space: nowrap;
    text-align: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
.sign_day{
    text-align: center;
    display: inline-block;
    padding: 5px 0;

}
.sign_day .sign_time{
    color: #999;
    font-size: 12px;
    width: 75px;
}
.sign_ic{
    width: 100%;
    text-align: center;
    border-radius: 50%;
    box-shadow: 0.5px 0.5px 5.5px rgba(0,0,0,0.1);
    width: 50px;
    height: 50px;
    display: inline-block;
    margin: 5px 0;
}
.sign_day img{
    width: 35px;
    height: 35px;
    display: inline-block;
    padding: 7.5px;
}

/**/
.shop-top{
    margin:10px;
}
.shop-top .top-wrap {
    padding: 0 15px;
    box-shadow: 0 0 11px 0 rgba(0,0,0,0.2);
    border-radius: 5px;
    background-color: #fff;
}

.shop-top .tit {
    padding: 5px 0;
    font-size: 19px;
    font-weight: 500;
    text-align: center;
    line-height: 24px;
    color: #222;
}

.shop-top .info_list {
    padding: 10px 0;
}

.shop-top .info_list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    min-height: 23px;
    padding: 5px 0;
    font-size: 14px;
    line-height: 17px;
    color: #222;
}

.shop-top .info_list .item .btn {
    flex-shrink: 0;
    margin: unset;
    padding: 0 10px;
    font-size: 12px;
    line-height: 23px;
    border-radius: 3px;
}

.shop-top .info_list .item .txt {
    -webkit-box-flex: 1;
    flex: 1;
    padding: 0 5px;
}

.shop-top .info_list .item .icon {
    align-self: flex-start;
    width: 17px;
    height: 17px;
    margin-top: 3px;
}

.shop-top .discounts .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-top: 15px;
    font-size: 14px;
    line-height: 17px;
    color: #666;
}

.shop-top .discounts .item .icon {
    -webkit-box-flex: 17px;
    flex: 17px 0 0;
    width: 17px;
    height: 17px;
    margin-right: 5px;
}

/**/
.prize_box{
    margin:10px;
    height: 285px;
}
swiper.topswiper{
    height: 100%;
    align-items: center;
    display: flex;
}
.pname{
    font-size: 12.5px;
    color: #333;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
}
.van-swipe-item{
    text-align: center;
}
.van-swipe-item img{
    width: 100%;
}
.box{
    display: inline-block;
    box-sizing: border-box;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
    margin-top: 10px;
    width: 225px;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
}
.biger{
    animation : biger 1s forwards;
}
@keyframes biger{
    from {transform:scale(1)}
    to {transform:scale(1.2)}
}
.prize_itemper{
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    background-color: #000;
    color: #fff;
    font-size: 12.5px;
    padding: 0 10px;
}
.prize_itemper::after{
    content: "";
    width:0;
    height:0;
    border-left:10px solid transparent;
    border-right:10px solid transparent;
    border-top:17px solid #000;
    position: absolute;
    z-index: 1;
    top: 0;
    right: -10px;
}
.qrcode_in{
    text-align: center!important;
}
.qrcode_in img{
    width:210px;
    height:210px;
}
.qrcode_in .tips{
    margin-top:20px;
}
.take_tit{
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    text-align: center;
}
.take_btn{
    line-height: 45px;
    text-align: center;
    border-radius: 45px;
    font-size: 15px;
    margin : 0 20px;
}
.boxbot{
    background: #fff;
}
.botswiper{
    height: 200px;
    margin-bottom: 20px;
    text-align: center;
}
.botswiper img{
    margin-top: 50px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    opacity: 0.8;
}
</style>