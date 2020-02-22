<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
<subtip :params="params"></subtip>
<van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新">

<div v-if="redbag.isgeted == 0">
    <div class="hb_header" :style="{'background-image':'url('+redbag.topbg+')'}" style="background-size: 100% 100%;">
        <div @click="showRulesfn" class="rules">规则</div>
    </div>
    <div class="helpOpenbg">
        <div class="helpOpenWrap">
            <div class="hb_box">
                <div class="hb_box_text">
                    <font>{{redbag.fee}}</font>元
                </div>
                <div class="hb_box_r">
                    <div class="hb_name">{{redbag.name}}</div>
                    <div class="hb_date2">{{redbag.ruledesc}}</div>
                    <div class="hb_date2">
                        有效期：{{redbag.starttime}}-{{redbag.endtime}}
                    </div>
                </div>
            </div>
            <div class="helpOpen_circle">
                <div class="circle circle_l"></div>
                <div class="circle_line"></div>
                <div class="circle circle_r"></div>
            </div>
            <div class="helpOpen">
                <div class="over_text" v-if="redbag.status==1">来晚了，该红包已领完</div>
                <div class="over_text" v-if="redbag.status==3">来晚了，该活动已过期</div>
                <div class="over_text" v-if="redbag.status==2">来晚了，该活动未开始</div>
                <div  v-if="redbag.status != 0">
                    <div class="help_btn01" @click="link" data-url="/" >去逛逛</div>
                </div>
                <div class="helpOpen_tit2" style="margin-bottom:20rpx;" v-if="redbag.status == 0">
                    再邀请 <font>{{isgeted.need}}</font> 位好友一起领即可获得红包
                </div>
                <div class="helpOpen_btndiv" @click="shareit(true)">
                    <div class="help_btn01" v-if="redbag.status == 0">邀请好友一起领</div>
                </div>
                <div class="helpOpen_friends" v-if="redbag.status==0">
                    <font class="helptext">邀请好友</font>
                    <div class="helpfiendswrap" @click="shareit(true)">
                                
                        <div class="helpOpen_pics dbtn" v-for="item in helplist" v-if="helplist.length > 0">
                            <img mode="aspectFill" v-lazy="item.headimg">
                        </div>
                        <div class="helpOpen_pics dbtn" >
                            <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/hongbao/friend_autopic.png">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="header" v-else>
    <div class="hbopen_wrap"></div>
    <div class="hbopen_box">
        <div class="hbopwen_info">
            <div class="hb_tit">{{redbag.name}}</div>
            <div class="hb_price">
                <font>{{redbag.fee}}</font>元
            </div>
            <div class="hb_text">{{redbag.ruledesc}}</div>
            <div class="hb_date">
                有效期：
                <font>{{redbag.starttime}}-</font>{{redbag.endtime}}
            </div>
            <div class="hb_transfer" v-if="false">转赠</div>
        </div>
    </div>
    <div class="hb_box_ft">
        <div v-if="redbag.status == 0 && isgeted.status == 0">
            
            <div v-if="goodlist.length == 1" class="useBtn" :data-url="goodlist[0].url" >立即使用</div>
            <div catchtap="scrollTogoods" class="useBtn" v-else>立即使用</div>
            
        </div>
        
        <div class="useBtn btnover" v-if="isgeted.status == 1">已使用</div>
        <div class="useBtn btnover" v-if="redbag.status == 2">红包使用时间未到</div>
        <div class="useBtn btnover" v-if="redbag.status == 3">红包已过期</div>
        <font class="use_rule">
            {{redbag.dis}}每次只能使用1个红包，不找零，申请退款后红包不予退还
        </font>
    </div>
</div>
<div class="help_Mid" v-if="redbag.isgeted == 0"></div>
<div class="sub_title" :style="redbag.isgeted == 0?'margin-top:-40px':''">
    <font>以下{{params.goodbname}}可使用</font>
</div>

<div v-if="goodlist.length==1">
    <div class="sub_singlegood" @click="link" :data-url="goodlist[0].appurl" >
        <img style="background-size: cover;" :style="{background:'url('+goodlist[0].thumbh+') center'}">
        <div class="text">
            <div class="tit">
                <font class="leibie" v-if="goodlist[0].tag">{{goodlist[0].tag}}</font> {{goodlist[0].title}} 
            </div>
            <div class="foot flex">
                <div class="price">
                    <font class="yhtext" style="margin-bottom:3px;">优惠后</font>
                    <font class="big">{{goodlist[0].afterprice}}</font>
                    <font> 元</font>
                </div>
                <div class="buy">
                    <div class="active" v-if="goodlist[0].status==0">{{goodlist[0].btn}}</div>
                    <div v-if="goodlist[0].status==1">已售罄</div>
                    <div v-if="goodlist[0].status==3">未开始</div>
                    <div v-if="goodlist[0].status==2">已结束</div>
                </div>
            </div>
            <div class="flex foot1">
                <div>
                    <div class="shanchu">原价{{goodlist[0].oldprice}}元</div>
                </div>
                <div class="buy" >
                    <font>{{goodlist[0].saled}}人购买</font>
                </div>
            </div>
        </div>
    </div>
</div>
<div  v-else>
    <div class="sub_goods">
        <div class="goods_item" @click="link" :data-url="item.appurl" v-for="item in goodlist">
            <img v-lazy="item.thumbh">
            <font class="goods_tit">{{item.title}}</font>
            <div class="goods_ft">
                <div class="yhtext">优惠后</div>
                <div class="price_cur">{{item.afterprice}} <font>元</font></div>
                <div class="price_org item_cell_flex tr">{{item.show_price}}</div>
            </div>
        </div>
    </div>
</div>

</van-pull-refresh>


<div @click="showRulesfn" class="kanjiatk" v-if="showRules">
    <div class="infotext">
        <div class="info_tit">红包规则<div class="tit_line"></div>
        </div>
        <div class="rulesinfo" v-for="item in redbag.rule">{{item}}</div>
    </div>
    <div class="btn_">
        <img @click.stop="showRulesfn" class="btn_close" src="https://wuhoucdn.oss-cn-hangzhou.aliyuncs.com/tangdaren/btn_close.png">
    </div>
</div>

<div @click="link" data-url="/" class="header_shouye" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/headline_shouye.png?t=1);" ></div>


<van-popup class="showposter_popup showposter" v-model="showposter" position="bottom" >
    <div class="showposter item_cell_box" >
        <div class="showposter_item" @click="wxshare(1)" style="width:50%;">
            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
            <div>转发给好友</div>
        </div>
        <div class="showposter_item" @click="wxshare(2)" style="width:50%;">
            <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
            <div>转发到朋友圈</div>
        </div>
    </div>
</van-popup>

<sharetip :isshowshare="isshowshare" @shareit="shareit" />

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup } from 'vant';
    import wx from 'weixin-js-sdk';
    import sharetip from '../../components/sharetip';
    import subtip from '../../components/subtip';
	export default {
		name : 'redbaginfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            sharetip,subtip
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			redbag : {},
	  			isgeted : {},
	  			shop : {},
	  			helplist : [],
	  			goodlist : [],
                showRules : false,
                isshowshare : false,
                showposter : false,
                dev : '',
	  		}
	  	},
	  	created:function(e){
	  		this.$emit('loadmessage',false);

            if( this.inited && this.$route.meta.keepAlive ) return false;
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
            showRulesfn(){
                this.showRules = !this.showRules;
            },
            shareit(bool){
                if( this.dev == 'app' ){
                    this.showposter = true;
                }else{
                    this.isshowshare = bool;
                }
            },
            wxshare(type){
                var self = this;
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
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    rid : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
	            self.$util.http('redbag','GET',postdata,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.params.subbgcolor = '#ff5f45';
                        self.redbag = res.data.redbag;
                        self.isgeted = res.data.isgeted;
                        self.goodlist = res.data.goodlist;
                        self.helplist = res.data.helplist;

                        self.$util.share(wx,self.sharedata);

                        window.document.title = self.redbag.name;
		                
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

.hbopen_wrap {
    background-color: #e95858;
    border-radius: 5px;
    width: 345px;
    height: 240px;
    position: absolute;
    bottom: 0;
    left: 15px;
}

.hbopen_box {
    background-color: #fff9e7;
    border-radius: 5px;
    width: 315px;
    left: 30px;
    top: 25px;
    height: 192.5px;
    position: absolute;
    z-index: 10;
    overflow: hidden;
}

.hbopwen_info {
    border: 1px dashed #ff8c5a;
    border-radius: 5px;
    margin: 6px;
    height: 180.5px;
}

.hb_transfer {
    background: url("http://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/hongbao/btn_transfer.png") no-repeat left center;
    background-size: 12.5px 12px;
    position: absolute;
    right: 22.5px;
    top: 17.5px;
    color: #ff7877;
    font-size: 12px;
    padding-left: 17.5px;
}

.hbopwen_info div {
    text-align: center;
}

.hb_tit {
    margin-top: 37.5px;
    font-size: 14px;
    color: #353535;
}

.hb_price {
    margin-top: 10px;
    font-size: 12px;
    color: #ff5050;
}

.hb_price font {
    font-size: 24px;
}

.hb_text {
    font-size: 10px;
    color: #353535;
}

.hb_date {
    margin-top: 10px;
    font-size: 10px;
    color: #888888;
}

.hb_date2 {
    font-size: 10px;
    color: #888888;
    line-height: 1.5;
}

.hb_box_ft {
    background: url("https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/hongbao/hb_fbg.png") no-repeat center bottom;
    background-size: 100% 101%;
    height: 120px;
    width: 315.5px;
    padding: 60px 15px 0;
    position: absolute;
    bottom: 0;
    left: 15px;
    z-index: 10;
    overflow: hidden;
    border-radius: 5px;
}

.useBtn {
    height: 40px;
    background-color: #ffd909;
    text-align: center;
    line-height: 40px;
    overflow: hidden;
    color: #9c3000;
    font-size: 14px;
    border-radius: 25px;
    box-shadow: 2.5px 5px #ffa509;
    margin: 0 12.5px;
    margin-bottom: 20px;
}

.useBtn.btnover {
    background-color: #dddddd;
    color: #888888;
    box-shadow: none;
}

.use_rule {
    color: #fff;
    font-size: 14px;
    line-height: 1.5;
    display: block;
}

.hb_header {
    height: 150px;
    overflow: hidden;
    position: relative;
}

.hb_header .rules {
    background-color: #fff9e7;
    color: #dd5050;
    font-size: 12px;
    width: 60px;
    height: 27.5px;
    line-height: 27.5px;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 20px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    text-align: center;
}

.hb_box {
    height: 82.5px;
    display: flex;
    justify-content: space-between;
}

.hb_box_text {
    display: block;
    margin: 29px 25px 0 24px;
    color: #ff5050;
    font-size: 12px;
}

.hb_box_text text {
    font-size: 24px;
}

.hb_box_r {
    flex: 1;
    line-height: 1;
    margin-top: 25px;
}

.hb_box_r text {
    display: block;
    color: #ff5050;
}

.hb_box_r .hb_name {
    font-size: 16px;
    font-weight: bold;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    margin-bottom: 7.5px;
}

.hb_box_r .hb_date {
    font-size: 10px;
}

.helpOpen_circle {
    height: 20px;
    position: relative;
}

.circle {
    width: 20px;
    height: 20px;
    background-color: #ff5f45;
    border-radius: 100%;
    position: absolute;
}

.circle_l {
    left: -10px;
}

.circle_r {
    right: -10px;
}

.circle_line {
    height: 0.5px;
    overflow: hidden;
    background-color: #ff5f45;
    width: 315px;
    position: absolute;
    top: 10px;
    left: 15px;
}

.helpOpenbg {
    background: #ff5f45;
    padding-bottom: 2.5px;
}

.help_Mid {
    background: url("https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/hongbao/middlebg.png") no-repeat left top;
    background-size: 100% 80px;
    overflow: hidden;
    height: 150px;
}

.helpOpenWrap {
    margin: 0 15px;
    background-color: #fff9e7;
    border-radius: 5px;
    overflow: hidden;
}

.helpOpen {
    margin: 5px;
    border-radius: 5px;
    padding: 0 7.5px 30px;
    overflow: hidden;
}

.helpOpen_tit {
    color: #353535;
    font-size: 16px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: bold;
}

.helpOpen_tit img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 12.5px;
}

.over_text {
    margin-top: 62.5px;
    text-align: center;
    margin-bottom: 52.5px;
    font-size: 16px;
}

.helpOpen_tit2 {
    color: #353535;
    font-size: 14px;
    text-align: center;
    height: 14px;
    line-height: 14px;
    overflow: hidden;
    font-weight: bold;
    margin: 25px 0;

}

.helpOpen_tit font,.helpOpen_tit2 font {
    color: #ff5f45;
}

.helpOpen_tit .help_num {
    font-size: 24px;
}

.helpOpen_isopen {
    text-align: center;
    color: #353535;
    font-size: 14px;
    margin-top: 20px;
}

.helpOpen_text {
    color: #888;
    font-size: 12px;
    text-align: center;
    margin-bottom: 15px;
}

.helpOpen_text2 {
    color: #ff5f45;
    font-size: 12px;
    text-align: center;
}

.helpOpen_isopen font {
    color: #ff5f45;
    font-size: 40px;
    padding: 0 10px;
}

.helpOpen_friends {
    background-color: #fff0c8;
    display: flex;
    padding: 10px 0 20px;
    margin-top: 20px;
}

.helpOpen_friends .helptext {
    color: #ff5f45;
    font-size: 14px;
    border-right: 0.5px solid #ff5f45;
    width: 30px;
    display: block;
    padding-right: 5px;
    margin-left: 12.5px;
    line-height: 1.2;
    margin-right: 11px;
    height: 35px;
    overflow: hidden;
    margin-top: 10px;
}

.helpfiendswrap {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
}

.helpOpen_pics {
    width: 33.5px;
    height: 33.5px;
    margin-right: 11px;
    margin-top: 10px;
    display: inline-block;
}

.helpOpen_pics img {
    width: 33.5px;
    height: 33.5px;
    border-radius: 100%;
    background: #fff;
}

.helpOpen_btndiv {
    display: flex;
    margin-bottom: 10px;
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
    -webkit-box-orient: vertical;
    box-orient: vertical;
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


button.dbtn{
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
</style>