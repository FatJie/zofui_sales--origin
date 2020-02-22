<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
        
        <subtip :params="params"></subtip>
        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新">    

        <div class="main bg-pri">
            <div class="coupon">
                <div class="coupon_header">
                    <div class="cirle bg-pri" v-for="item in [1,2,3,4,5,6,7,8,9,10,0,0,0,0,0,0]"></div>
                </div>
                <div class="coupon_wrap">
                    <div @click="sharefn" style="position:static;z-index: 2">
                        <img class="share_btn" src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/share1_btn_coupon.png" >
                    </div>
                    <div>
                        <div class="coupon_cut">
                            <div class="coupon_cutc coupon_cutcl bg-pri"></div>
                            <div class="coupon_cutc coupon_cutcr bg-pri"></div>
                            <div class="coupon_cutl"></div>
                        </div>
                        <img class="shop_logo" v-lazy="shop.headimg">
                        <div class="shop_name">{{shop.name}}</div>
                        <div class="coupon_name color-pri">{{card.name}}</div>
                        <div class="get_part" v-if="card.istaked == 0">
                            <form>
                                <div @click="takecard" class="get_btn can_click" v-if="card.status == 0">立即领取</div>
                                <div class="get_btn not_click" v-else-if="card.status===1">已领完</div>
                                <div class="get_btn not_click" v-else-if="card.status===2">未开始</div>
                                <div class="get_btn not_click" v-else-if="card.status===3">已过期</div>
                            </form>
                        </div>
                        <div class="get_part" v-if="card.istaked == 1">
                            <div v-if="card.isused == 1" class="get_btn not_click" >已使用</div>
                            <div v-else>
                                <div v-if="(card.status == 0 || card.status == 1) && card.type == 1">
                                    <div @click="link" class="get_btn can_click" :data-url="'/cardmyinfo?id='+card.takedid">立即使用</div>
                                </div>
                                <div class="get_btn not_click" v-else-if="card.status===3">已过期</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="deadline color-pri" >
                        <div>
                            <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/icon_clock.png">使用期限：{{card.startstr}}-{{card.endstr}}
                        </div>
                    </div>
                    <div class="deadline color-pri" >
                        <div>
                            <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/icon_clock.png">使用条件：满{{card.use}}减免{{card.fee}}
                        </div>
                    </div>
                </div>
                <div class="coupon_info">
                    <div class="info_item" v-if='card.content'>
                        <div class="info_title">使用须知</div>
                        <div class="info_content">
                            <div v-for="item in card.content">{{item}}</div>
                        </div>
                    </div>

                    <div class="info_item shopInfo_item" v-if="card.shop && card.shop.length > 0 && card.type == 1">
                        <div class="info_title">使用地址</div>
                        <div class="shopInfo shopInfo_index1 shopInfo_add"  v-for="item in card.shop">
                            <div bindtap="callphone" class="sinfo_item has_btn" :data-tel="shop.tel" >
                                <div class="info_text">
                                    <font>{{item.name}}，{{item.add}}</font>
                                </div>
                            </div>
                            <div bindtap="callphone" class="sinfo_item has_btn" :data-tel="shop.tel" >
                                <div class="info_text">
                                    <font>电话：{{shop.tel}}</font>
                                </div>
                                <div class="bg-pri ttag">拨打</div>
                            </div>
                        </div>
                    </div>

                    <div class="info_item shopInfo_item" >
                        <div class="info_title" v-if="card.shopid > 0">商家信息</div>
                        <div class="shopInfo shopInfo_index1"  v-if="card.shopid > 0">
                            <div @click="link" class="sinfo_item" :data-url="'/shopinfo?id='+shop.id" >
                                <div class="info_text">
                                    <font class="info_name">{{shop.name}}</font>
                                </div>
                            </div>
                            <div @click="bindtap($event,'tel')" class="sinfo_item has_btn" :data-tel="shop.tel" >
                                <div class="info_text">
                                    <font>商家电话：{{shop.tel}}</font>
                                </div>
                                <img class="info_img" src="http://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/as_dianhua.png">
                            </div>
                            <div bindtap="location" class="sinfo_item has_btn" :data-lat="shop.lat/1000000" :data-lng="shop.lng/1000000" :data-addname="shop.name" :data-address="shop.province+shop.city+shop.country+shop.street" >
                                <div class="info_text dizhi">
                                    <font>{{shop.province}}{{shop.city}}{{shop.country}}{{shop.street}}</font>
                                </div>
                                <img class="info_img" src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/as_dizhi.png">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>


        <div v-if="card.type == 0">
            <div class="help_Mid bg-pri">
                <div class="help_Midin"></div>
            </div>
            <div class="sub_title">
                <font>以下{{params.goodbname}}可使用</font>
            </div>
            <div   v-if="datalist.length > 0">
                <div class="sub_goods">
                    <div class="goods_item" :data-url="item.appurl" @click="link" v-for="item in datalist">
                        <img  v-lazy="item.thumb">
                        <font class="goods_tit">{{item.title}}</font>
                        <div class="goods_ft">
                            <font class="yhtext">优惠后</font>
                            <font class="price_cur">{{item.afterprice}}</font>
                            <font class="price_org" v-if="item.oldprice*1 > 0">{{item.oldprice}}</font>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list-none" v-if="datalist.length <= 0">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                <div>— 暂时还没有{{params.goodbname}} —</div>
            </div>
        </div>
        </van-pull-refresh>


        <div v-if="isshowredbag">
            <div class="mask"></div>
            <div class="redbag_box  " >
                <img class="redbag_top" src="http://img11.360buyimg.com/ddimg/jfs/t1/100432/28/2910/168140/5dd7d160E8efb9f21/4060e92a9798ae3d.png" />
                <div class="redbag_body" >
                    <div class="redbag_fee" >
                        <span>{{card.showredbag}}</span>
                    </div>
                    <div class="redbag_info" >
                        <div>活动说明：</div>
                        <div>1.发送给好友领取，并好友使用优惠券后你可获得{{card.showredbag}}元红包。</div>
                        <div>2.红包直接发送至你的微信零钱。</div>
                        <div>3.活动资金池发完即停止活动。</div>
                    </div>
                    <div @click="sharefn" class="redbag_btn" >发给好友</div>
                    <img @click="hideredbag" class="redbag_close" src="http://img11.360buyimg.com/ddimg/jfs/t1/80646/8/16135/5196/5dd7d6ecE4ca5d489/0e3dc66e5651a8e9.png" />
                </div>

            </div>
        </div>

        <div @click="link" class="header_shouye" data-url="/" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/headline_shouye.png?t=1);bottom:120rpx;" ></div>

        
        <img v-if="posterurl && showposter" :src="posterurl" class="poster_view">
        <van-popup class="showposter_popup" v-model="showposter" position="bottom" >
            <div class="showposter item_cell_box" >
                <div  class="showposter_item" @click="wxshare(1)" >
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                    <div>转发给好友</div>
                </div>
                <div v-if="dev == 'app'" class="showposter_item" @click="wxshare(2)" >
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                    <div>转发到朋友圈</div>
                </div>
                <div class="showposter_item" @click="cposter" >
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/79397/19/948/5580/5cf23bdbE11da7e29/b145f3c1ba828eba.png">
                    <div>生成海报</div>
                </div>
            </div>
        </van-popup>

        </div>
        <sharetip :isshowshare="isshowshare" @shareit="shareit" />
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup } from 'vant';
	import tabbar from '../../components/tabbar';
    import sharetip from '../../components/sharetip';
    import subtip from '../../components/subtip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'cardinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
	    	tabbar,sharetip,subtip
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
	  					doo : 'cut',
	  					op : 'list',
	  					status : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                shop : {},
                card : {},
                isshowshare : false,
                showposter : false,
                dev : '',
                isshowredbag : false,
                zfid : 0,
                posterurl : false,
	  		}
	  	},
        activated:function(e){

        },
	  	created:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
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
            sharefn(bool){
                this.showposter = true;
            },
            shareit(bool){
                this.isshowshare = bool;
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            hideredbag(){
                this.isshowredbag = !this.isshowredbag;
            },
            wxshare(type){
                var self = this;
                if( self.dev != 'app' ){
                    self.isshowshare = !self.isshowshare;
                    return false;
                }
                var scene = 'session';
                if(type == 2){
                    scene = 'timeline';
                }
                var wx = api.require('wx');
                wx.shareWebpage({
                    apiKey: '',
                    scene: scene,
                    title: self.sharedata.title,
                    description: self.sharedata.desc,
                    thumb: 'widget://image/logomini.png',
                    contentUrl: self.sharedata.link
                }, function(ret, err) {
                    if (ret.status) {
                        self.$toast('已分享');
                    } else {
                        self.$toast(err.code);
                    }
                });
            },
            takecard(e){
                var self = this;
                var postdata = {
                    op : 'takecard',
                    id : self.card.id,
                    fxuid : self.zfid,
                };
                self.$util.http('card','GET',postdata,function(res){
                    
                    if (!res.errno && res.data) {
                        self.$toast(res.message);
                        self.card.istaked = 1;
                        return false;
                    }else if( res.errno == 2 ){
                        Dialog.confirm({
                          message: res.message,
                          confirmButtonText : '购买会员',
                        }).then(() => {
                            self.$router.push('/buycard');
                        });
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            cposter(){
                var self = this;
                var postdata = {
                    op:'card',
                    id:self.card.id,
                    path : self.sharedata.link,
                };

                self.$util.http('poster','GET',postdata,function(res){     
                    if (!res.errno && res.data ) {
                        self.posterurl = res.data.url;
                        self.showposterurl = true;

                        if( self.dev == 'app' ){

                        }else if(self.dev == 'wx'){
                            Dialog.alert({message:'可长按图片转发给好友'});
                        }else if(self.dev == 'wap'){
                            Dialog.alert({message:'可截屏保存到手机'});
                        }

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                self.zfid = params.zfid ? params.zfid : 0;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : self.zfid,
                }
	            self.$util.http('card','GET',postdata,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
                        //self.params.subbgcolor = '#ffdd22';
                        self.userinfo = res.data.userinfo;
                        self.card = res.data.card;
                        self.shop = res.data.shop;
                        self.sharedata = res.data.sharedata;
                        self.datalist = res.data.allgoods ? res.data.allgoods : '';
		                
                        self.isshowredbag = self.card.issharemoney == 1 ? true : false;

                        window.document.title = self.card.name;
                        self.$emit('loadmessage',{title:self.card.name});
                        
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        
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

#main #content{
    padding-bottom: 0;
    position: relative;
    z-index: 1;
    min-height: 100vh;
    background-color: #fff;
}
.main {
    box-sizing: border-box;
    padding: 20px 15px 0px 15px;
}

.coupon {
    box-sizing: border-box;
    width: 100%;
    background-color: white;
    border-radius: 5px;
    padding: 20px 14.5px 5px 14.5px;
    position: relative;
}

.coupon_header {
    width: 100%;
    height: 5px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
}
.coupon_header .cirle{
    width: 10px;
    height: 10px;
    display: block;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: 3vw;
}
.shop_logo {
    width: 59px;
    height: 59px;
    border: 1px solid #d2d2d2;
    border-radius: 50%;
    margin-bottom: 10px;
}

.coupon_wrap {
    position: relative;
    text-align: center;
    padding-bottom: 26px;
}

.shop_name {
    font-size: 20px;
    text-align: center;
    font-weight: bold;
}

.coupon_name {
    font-size: 30px;
    color: #ff4040;
    text-align: center;
    margin-top: 15px;
}

.coupon_cut {
    width: calc(100% + 29px);
    height: 21px;
    position: absolute;
    bottom: 0;
    left: -14px;
}

.qr_code {
    margin: 20px 0 0px 0;
    text-align: center;
}

.code_wrap {
    height: 120px;
    width: 120px;
    margin: 0 auto 0px auto;
    position: relative;
}

.code {
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
}

.send_btn {
    font-size: 16px;
    color: white;
    margin: 0 auto;
    margin-top: 15.5px;
    text-shadow: 0.5px 1px #d23997;
    background: linear-gradient(to bottom,#ff6469,#ff2c72);
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 222px;
    border-radius: 50px;
}

.send_hint {
    margin-top: 18px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #353535;
}

.send_hint font {
    color: #919191;
}

.send_hint img {
    height: 28.5px;
    width: 28.5px;
    border-radius: 50%;
    margin-right: 6.5px;
}

.deadline {
    font-size: 12px;
    color: #ff3d3d;
    margin-top: 12.5px;
    line-height: 25px;
    text-align: left;
}

.deadline div:first-of-type {
    display: flex;
    align-items: center;
}

.deadline img {
    width: 18px;
    height: 18.5px;
    margin-right: 5px;
}

.hx_hint {
    margin-top: 10px;
    line-height: 25px;
    font-size: 14px;
    text-align: left;
}

.expired {
    width: 100%;
    height: 100%;
    line-height: 120px;
    position: absolute;
    font-weight: bold;
    left: 0;
    top: 0;
    color: #8b8b8b;
    font-size: 14px;
    background-color: rgba(241,241,241,0.9);
}

.coupon_info {
    padding-top: 20.5px;
}

.info_item {
    margin-bottom: 31.5px;
}

.info_title {
    color: #353535;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10.5px;
}

.info_title::before {
    content: "\00A0\00A0";
    height: 16px;
    background-color: #ff6f6f;
    margin-right: 7.5px;
}

.info_content {
    font-size: 14px;
    line-height: 30px;
    color: #333;
}

.record_item:first-child {
    margin-top: 0;
}

.record_item {
    font-size: 14px;
    color: #353535;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 17px;
}

.record_admin {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.admin_avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #e6e6e6;
}

.admin_name font {
    margin: 0 5.5px;
}

.get_btn {
    width: 222.5px;
    height: 40px;
    border-radius: 50px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: white;
    text-shadow: 0.5px 1px #d23997;
    margin: 20px auto 0px auto;
}

.can_click {
    background: linear-gradient(to bottom,#ff616a,#ff2b72);
}

.not_click {
    background-color: #d2d2d2;
    text-shadow: 0 0 white;
}

.share_btn {
    width: 39px;
    height: 12px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
}

/**/
.shopInfo {
    border-top: 0.5px solid #eee;
    padding-top: 10px;
    margin-bottom: 10px;
    line-height: 2;
}

.shopInfo_index1 {
    border-top: 0;
    padding-top: 0;
}

.sinfo_item {
    font-size: 15px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.has_btn {
    justify-content: space-between;
}

.info_icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    position: relative;
    top: 2.5px;
}

.info_text {
    flex: 1;
    flex-wrap: wrap;
    display: flex;
    font-size: 12px;
    color: #888;
}

.info_text font {
    flex: 1;
}

.info_btn {
    width: 54.5px;
    height: 25px;
    text-align: center;
    font-size: 12px;
    line-height: 25px;
    background-color: #ffd926;
    margin-left: 10px;
    border-radius: 5px;
}

.info_img {
    width: 24px;
    height: 24px;
}

.green {
    background-color: #09bb07;
    color: white;
}

.load_more_da {
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.load_more {
    margin-top: 10px;
    padding: 10px 20px;
    border-radius: 15px;
    background-color: #ffd93f;
    color: #353535;
    line-height: 12px;
    font-size: 12px;
    text-align: center;
    display: inline-block;
}

.down_arrow {
    width: 15px;
    height: 15px;
    margin-left: 5px;
    transform: rotate(0);
}

.up {
    transform: rotate(180deg);
}

.info_name {
    font-size: 16px;
    color: #353535;
    font-weight: bold;
}

.dizhi font {
    width: 245px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

/**/
.help_Mid {
    background-size: 100% 80px;
    width: 100%;
    overflow: hidden;
    height: 80px;
    position: relative;
    z-index: -1;
    margin-top: -1px;
}
.help_Midin{
    position: absolute;
    width: 100%;
    height: 40px;
    background: #fff;
    bottom: 0;
    border-radius: 100% 100% 0 0;
}
.sub_title {
    color: #353535;
    font-size: 16px;
    text-align: center;
    display: block;
    font-weight: bold;
    margin-top: -20px;
    background: #fff;
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
    margin: 25px 10px 0;
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
    width: 100%;
    height: 92.5px;
    display: block;
    background-color: #eee;
}

.goods_item .goods_tit {
    color: #353535;
    font-size: 14px;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 10px 0;
    box-orient: vertical;
    -webkit-box-orient: vertical;
    height: 36px;
}

.price_cur {
    color: #ff4040;
    font-size: 16px;
    margin-right: 7.5px;
    font-family: 'DIN';
}

.price_org {
    color: #cccccc;
    font-size: 12px;
    text-decoration: line-through;
    font-family: 'DIN';
}
.sub_singlegood {
    padding: 0 15px;
    text-align: left;
}

.sub_singlegood font {
    margin-top: 10px;
}

.sub_singlegood>img {
    width: 345px;
    height: 194px;
    margin: 10px 0 5px;
}

.sub_singlegood .tit {
    font-size: 16px;
}

.sub_singlegood .tit .leibie {
    display: inline-block;
    color: #353535;
    padding: 4px 7.5px;
    font-size: 11px;
    background: #ffd926;
    position: relative;
    top: -2.5px;
}

.sub_singlegood .foot {
    padding: 0;
    margin-top: 12px;
}

.sub_singlegood .foot1 {
    padding: 0;
    margin-top: 5px;
    margin-bottom: 20px;
}

.sub_singlegood .price {
    color: #ff4040;
    font-size: 12px;
    display: flex;
    align-items: flex-end;
}

.sub_singlegood .price .big {
    font-size: 24px;
    font-family: 'DIN'!important;
    line-height: 1;
}

.sub_singlegood .price .fensi.active {
    display: inline;
}

.sub_singlegood .price .fensi {
    display: none;
    color: #353535;
}

.sub_singlegood .price .fensi img {
    width: 14px;
    height: 14px;
    margin: 0 2.5px -1.5px 7.5px;
}

.sub_singlegood .shanchu {
    text-decoration: line-through;
    color: #888;
    font-size: 12px;
}

.sub_singlegood .buy {
    text-align: right;
}

.sub_singlegood .buy>div {
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    border-radius: 5px;
    background: #d2d2d2;
    color: #888;
}

.sub_singlegood .buy>div.active {
    background: #ff5050;
    color: #fff;
}

.sub_singlegood .buy>font {
    font-size: 12px;
    color: #888;
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
    z-index: 999;
    text-align: center;
}

.kanjiatk .infotext {
    background-color: #fff;
    width: 230px;
    font-size: 14px;
    color: #353535;
    padding: 22.5px;
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
.shopInfo_add{
  border-bottom: 1px solid #eee;
}



.redbag_box{
    width:300px;
    position: fixed;
    left: 0;
    top:60px;
    z-index: 6;
    left:50%;
    margin-left: -150px;
    border-radius: 0 0 15px 15px;
    background-position:0 0;
}
.redbag_top{
    width:300px;
    height:165px;
    position:relative;
    z-index:3;
    display:block;
}
.redbag_body{
    background-color: #de3121;
    position: absolute;
    z-index:2;
    left: 0;
    width: 100%;
    height:250px;
    border-radius:0 0 15px 15px;
    box-shadow:1px 1px 11px rgba(225,225,225,0.2);
    padding:15px;
    box-sizing: border-box;
}
.redbag_fee{
    color:#fee63c;
    text-align: center;
}
.redbag_fee font{
    font-size:40px;
    font-weight:bold;
}
.redbag_info{
    color:#fff;
    font-size:12px;
    line-height:1.6;
}
.redbag_btn{
    margin:0 auto;
    margin-top:25px;
    padding:10px 0;
    border-radius:25px;
    background:#fff;
    width:125px;
    text-align: center;
    color:#de3121;
    box-shadow: 1px 1px 11px 1px rgba(225,225,225,0.2);
    font-weight:bold;
    font-size: 14px;
}
.redbag_close{
    position:absolute;
    bottom:-50px;
    left:50%;
    width:40px;
    height:40px;
    margin-left:-20px;
}
.showposter{
    justify-content: center;
}
.showposter_item{
    flex: 1;
}


.coupon_cutc {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    left: -12.5px;
    position: absolute;
}
.coupon_cutcr{
    left: initial;
    right: -12.5px;
}
.coupon_cutl{
    border-bottom: 2px dashed #eee;
    position: absolute;
    left: 12.5px;
    top: 50%;
    width:calc(100% - 25px);
    height: 1px;
}

</style>