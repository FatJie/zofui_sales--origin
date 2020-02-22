<template>
	
    <div :class="params.style" id="main" >
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        
         
        <div id="content" v-if="inited == 2 && params.shopsty == 1">
            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新"> 
            <div class="shop-t">
                <div class="shop-pic">
                    <div class="info-swiper act-swiper" >
                        <img v-lazy="shop.cover" width="100%">
                    </div>
                </div>
                <div class="shop-divs">人气：{{shop.times}}</div>
            </div>
            <div>
                <div class="info-section">
                    <div class="shop-top">
                        <div class="top-wrap">
                            <div class="tit">{{shop.name}}
                                <good :name="shop.name" :istag="shop.isgood" :tag="params.goodtag"></good>
                            </div>
                            <div class="info_list thin-border_t">
                                <div class="item" v-if="shop.severtime">
                                    <img class="icon" v-lazy="'http://img11.360buyimg.com/ddimg/jfs/t1/101002/28/1456/656/5dbef4ccE5fd2117b/164846edba5aea30.png'">
                                    <div class="txt">营业时间：{{shop.severtime}}</div>
                                </div>
                                <div class="item" v-if="shop.tel">
                                    <img class="icon" v-lazy="'http://img11.360buyimg.com/ddimg/jfs/t1/102369/27/1443/874/5dbef4d7Ef20a4120/cd8150892d3ef674.png'">
                                    <div class="txt">{{shop.tel}}</div>
                                    <div @click="bindtap($event,'tel')" class="btn bg-pri" :data-tel="shop.tel">拨打</div>
                                </div>
                                <div class="item" v-if="shop.address">
                                    <img class="icon" v-lazy="'http://img11.360buyimg.com/ddimg/jfs/t1/75681/8/14526/774/5dbef4ddE2f8f221e/aaf16d8f7f5b1d03.png'">
                                    <div class="txt">{{shop.address}}</div>
                                    <div @click="bindtap($event,'loc')" class="btn bg-pri" :data-lat="shop.lat/1000000" :data-lng="shop.lng/1000000" :data-addname="shop.name" :data-add="shop.address" v-if="shop.lat">导航</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="spaybtn lbg-pri" @click="link" :data-url="'/adminpay?shopid='+shop.id" v-if="shop.isshowpay == 0 && params.shoppay == 0">
                        {{shop.spcut > 0 && shop.spcut < 10 ? shop.spcut*100/100  +'折' : '优惠'}}买单
                    </div>

                </div>
                <div class="info-section" v-if='userinfo.level != 1 && params.iscard == 1'>
                    <div class="shop-isVip">
                        <div class="text color-pri">开通{{params.cardname}}可享优惠</div>
                        <div class="btn bg-pri" @click="link" data-url="/ucard">开通</div>
                    </div>
                </div>

                <div class="info-section" v-if="allcard.length > 0">
                    <div class="card_box" >
                        
                        <div @click="link" class="coupon" :data-url="'/cardinfo?id='+item.id" v-for="item in allcard" :data-id="item.id" :style="{width: (allcard.length == 1 ? '100%' : '7rem')}">
                            <div class="coupon_text">
                                <div class="coupon_title coupon_name" v-if="item.hidefee == 1">
                                    {{item.name}}
                                </div>
                                <div class="coupon_title" v-else><font>¥</font> {{item.fee}}</div>
                                <div class="coupon_rule">
                                    <font class="coupon_tagname" >{{item.hidefee == 1 ? '' : item.name}}</font>
                                </div>
                                <div class="coupon_rule">
                                    <font class="coupon_tagname" >{{item.statusstr}}</font>
                                </div>
                            </div>
                            <div catchtap="item.istaked == 0 && item.status == 0 ? 'takecard' : ''" @click="takecard($event,item.istaked,item.status)" :data-id="item.id" class="btn_div" :class="item.status===0?'get_btn':''" v-if="item.istaked == 0">
                                {{item.status===0?'立即领取':''}} {{item.status===1?'已领完':''}} {{item.status===2?'未开始':''}} {{item.status===3?'已过期':''}}
                            </div>
                            <div class="btn_div has_get " v-if="item.istaked == 1">
                                立即使用
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-section" v-if="datalist.length || params.shopsear == 1">
                    <div class="info-title">{{params.fontsty == 33?'驾校推荐班型':params.shopbname+'推荐' }}</div>

                    <form @submit.prevent="comfirm">
                    <div class="search-wrap" v-if="params.shopsear == 1">
                        <div class="search-area" style="position: relative;padding: 0;border:0;box-shadow:initial;">
                            
                            <div class="input thin-border">
                                <font class="iconfont icon-search"></font>
                                <input bindconfirm="comfirm" bindinput="searchinput" confirmType="search" name="search" :placeholder="'请输入要搜索的'+ params.goodbname" v-model="page.pdata.search" type="text" />
                                <img @click="close" v-if="page.pdata.search" class="icon-close" v-lazy="'http://img11.360buyimg.com/ddimg/jfs/t1/62911/33/14620/898/5dbef51eE5dd9038a/4ead8adae087b789.png'" >
                            </div>
                        </div>
                    </div>
                    </form>

                    <div class="tag sortbox" v-if="sort.length > 0">
                        <div @click="changesort" class="tag-item" :class="page.pdata.sorttwo == 0?'color-pri':''"  data-id="0" >全部</div>
                        <div @click="changesort" class="tag-item" :class="page.pdata.sorttwo == item.id?'color-pri':''"  :data-id="item.id" v-for="item in sort" :key="item.id">{{item.name}}</div>
                    </div>

                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <div class="info-rlist">
                        <div class="item thin-border_b" v-for="item in datalist" >
                            <div class="inner" @click="link" :data-url="item.appurl">
                                <div class="lt">
                                    <div class="lt_pic image-box __100">
                                        <img v-lazy="item.thumb">
                                    </div>
                                    <div class="list-status" :class="{'__saled':item.status == 1,'__end':item.status == 3}" v-if="item.status" ></div>
                                </div>
                                <div class="rt">
                                    <div class="rt_tit">
                                        <font v-if="item.tag" class="tag ttag bg-pri">{{item.tag}}</font>{{item.title}}
                                    </div>
                                    <div class="rt-btm">
                                        <div class="rt_price fmt-price">
                                            <div class="now color-pri">
                                                <font class="dollar" v-if="item.show_price > 0">¥</font>
                                                <font class="price">{{item.show_price > 0 ? item.show_price : '免费'}}</font>
                                            </div>
                                            <div class="btm_fx bg-pri" v-if="item.userpricejb > 0">{{item.userpricejb*100/100}} {{params.umname}}</div>
                                            <div class="old" v-if="item.oldprice*1 > 0">¥{{item.oldprice}}</div>

                                        </div>
                                        <div class="rt_sale" >{{item.ncon}}：{{item.saled}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </van-list>

                </div>
                <div class="info-section" v-if="shop.content">
                    <div class="info-title">{{params.shopbname}}详情</div>
                    <div class="rich_text">
                        <div class="shop-detail">

                            <div v-if="shop.content" class="detail-content auto " v-html="shop.content"></div>
                            <div class="detail-nomore" v-else>— 暂时没有详情介绍 —</div>

                        </div>
                    </div>
                </div>
            </div>
            </van-pull-refresh>
        </div>
        

        <div v-if="inited == 2 && (params.shopsty == 0 || params.shopsty == 2)">
            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新"> 
            <div class="shop-index-wrapper" >
                <div class="bg-img-wrap">
                    <div class="shadow"></div>
                    <img class="img coverimg" mode="widthFix" :src="shop.cover"></image>
                    <div class="member-wrapper" >
                        <div class="slide" >

                            <div class="content dis-flex vertical" :class="animate ? 'animate' : ''">
                                <template v-if="slidedata.length">
                                    <div class="bubble dis-flex flex-middle default animate" v-for="(item,index) in slidedata" :key="index">
                                        <div class="dis-flex flex-middle info">
                                            <img class="img" v-lazy="item.headimg">
                                            <div class="text">{{item.txt}}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="wrapper">
                    <div class="panel shop top">
                        <div class="content">
                            <div class="shop-info dis-flex flex-middle">
                                <div class="shop-avatar-wrap">
                                    <img class="shop-avatar" :src="shop.headimg">
                                </div>
                                <div class="flex">
                                    <div class="shop-title clamp-1">
                                        <good :name="shop.name" :istag="shop.isgood" :tag="params.goodtag"></good>
                                    </div>
                                    <div class="shop-des clamp-1">{{shop.desc}}</div>
                                </div>
                                <div class="tag-wrap vertical flex-middle flex-center">
                                    <img class="icon follow" mode="widthFix" src="https://img11.360buyimg.com/ddimg/jfs/t1/58858/32/6500/1878/5d41a8bbE9914d00f/ad0355d56ee0bb99.png">
                                    <div class="num num-style">{{shop.times}}</div>
                                    <div class="label">人气</div>
                                </div>
                            </div>
                        </div>

                        <div class="dis-flex tool-wrap" v-if="params.shopdz == 0">
                            <div @click="bindtap($event,'tel')" :data-tel="shop.tel" class="item flex vertical flex-middle flex-center">
                                <img class="icon icon-call" src="https://file.open.banchengyun.com/2019/04/16/155539333543846.png" />
                                <div class="text">电话</div>
                            </div>
                            <div @click="bindtap($event,'loc')" class="item flex vertical flex-middle flex-center" :data-lat="shop.lat/1000000" :data-lng="shop.lng/1000000" :data-addname="shop.name" :data-address="shop.address">
                                <img class="icon icon-location" src="https://file.open.banchengyun.com/2019/04/16/155539333513560.png" />
                                <div class="text">约 {{shop.distance}}</div>
                            </div>
                            <div @click="openShareArea" class="item flex vertical flex-middle flex-center" >
                                <img class="icon icon-share" src="https://file.open.banchengyun.com/2019/04/16/155539333551355.png" />
                                <div class="text">{{shop.share}}分享</div>
                            </div>
                            <div @click="zanit" class="item flex vertical flex-middle flex-center" >
                                
                                <img class="icon icon-collect" src="https://file.open.banchengyun.com/2019/04/15/155530800875250.png" />
                                <div class="text">{{(shop.zan > 0 ? shop.zan : '' ) +' '}}赞</div>
                            </div>
                        </div>

                        <div class="spaybtn lbg-pri" @click="link" :data-url="'/adminpay?shopid='+shop.id" v-if="shop.isshowpay == 0 && params.shoppay == 0">
                            {{shop.spcut > 0 && shop.spcut < 10 ? shop.spcut*100/100  +'折' : '优惠'}}买单
                        </div>

                    </div>

                    <div class="panel">
                        <div class="info-title pt0">{{params.shopbname+'信息' }}</div>
                        <div class="content">
                            <div class="shop-content">
                                <div class="shop-position-wrap" v-for="item in fendian" :key="item.id">
                                    <div class="dis-flex flex-between flex-middle">
                                        <div class="position">
                                            <font class="name">{{item.name}}</font>
                                            <font class="info">{{item.address}}</font>
                                        </div>
                                        <div class="icon-wrap dis-flex flex-between flex-middle">
                                            <img @click="bindtap($event,'tel')" class="icon" :data-tel="item.tel" src="https://img11.360buyimg.com/ddimg/jfs/t1/50223/3/6546/8412/5d41a8a5Ee9a68692/988b8ea256022915.png">
                                            <div class="line"></div>
                                            <img @click="bindtap($event,'loc')" :data-lat="item.lat/1000000" :data-lng="item.lng/1000000" :data-addname="item.name" :data-add="item.address" class="icon"  src="https://img11.360buyimg.com/ddimg/jfs/t1/42073/18/10771/6633/5d41a88bE91580944/e49783d7096fa147.png">
                                        </div>
                                    </div>
                                    <div class="open-time dis-flex flex-middle" v-if="item.id == 0 && shop.severtime">
                                        <div class="dis-flex vertical">
                                            <img class="img" mode="widthFix" src="https://img11.360buyimg.com/ddimg/jfs/t1/39923/12/12906/5303/5d41a876Eea384b26/ba379bdc0e460f6a.png">
                                            <div class="flex"></div>
                                        </div>
                                        <div class="text flex">{{shop.severtime}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="coupon-list-wrap" v-if="allcard.length > 0">
                        <div class="_item" v-for="(item,index) in allcard" :key="item.id">
                            <div @click="link" :data-url="'/cardinfo?id='+item.id" class="coupon redpackets primary  dis-flex flex-middle" v-if="index < 2 || (index >= 2 && morecard)">
                                <div class="discount-title dis-flex vertical flex-middle flex-center">
                                    <div class="flex-middle coupon_name" v-if="item.hidefee == 1">{{item.name}}</div>
                                    <div class="big dis-flex flex-center flex-middle" v-else>{{item.fee}}</div>
                                    <div class="small">{{item.statusstr}}</div>
                                </div>
                                <div class="discount-info flex">
                                    <div class="big clamp-1" v-if="item.hidefee != 1">{{item.name}}</div>
                                    <div class="small clamp-1">{{item.desc}}</div>
                                </div>
                                <div @click="takecard($event,item.istaked,item.status)" :data-id="item.id" class="btn_div" :class="item.status===0?'get_btn':''" v-if="item.istaked == 0" >
                                    {{item.status===0?'立即领取':''}} {{item.status===1?'已领完':''}} {{item.status===2?'未开始':''}} {{item.status===3?'已过期':''}}
                                </div>
                                <div class="btn_div " v-if="item.istaked == 1" >
                                    立即使用
                                </div>
                            </div>
                        </div>

                        <div class="spread-wrap dis-flex flex-middle flex-center" v-if="allcard.length > 2">
                            <img @click="couponShow" class="spread" :class="morecard ? 'rotate' : ''"  mode="widthFix" src="https://img11.360buyimg.com/ddimg/jfs/t1/53291/25/6600/874/5d41a855E50418aa3/01fe9346ed30f522.png">
                        </div>
                    </div>

                    <div class="panel goods pt0" v-if="datalist.length > 0">

                        <van-tabs v-model="tabtype">
                          <van-tab :title="params.fontsty == 33?'驾校推荐班型': params.shopbname+'推荐'"></van-tab>
                          <van-tab title="详情介绍"></van-tab>
                        </van-tabs>

                        <div class="container dis-flex vertical pt20" v-if="tabtype == 0">

                            <div class="tag sortbox" v-if="sort.length > 0">
                                <div @click="changesort" class="tag-item" :class="page.pdata.sorttwo == 0?'color-pri':''"  data-id="0" >全部</div>
                                <div @click="changesort" class="tag-item" :class="page.pdata.sorttwo == item.id?'color-pri':''"  :data-id="item.id" v-for="item in sort" :key="item.id">{{item.name}}</div>
                            </div>

                            <div class="goods-item" v-for="(item,index) in datalist" :key="index">

                                <div @click="link" :data-url="item.appurl" class="defalut-goods-wrapper dis-flex" >
                                    <div class="img-wrapper">
                                        <img class="img" :src="item.thumbh">
                                    </div>
                                    <div class="item-right dis-flex flex vertical flex-between">
                                        <div class="goods-title clamp-2">{{item.title}}</div>
                                        <div class="flex"></div>
                                        <div class="price-info dis-flex flex-middle flex-between">
                                            <div class="price flex" >
                                                <div>
                                                    <font class="now-price">￥{{item.show_price}}</font>
                                                    <font class="before-price " v-if="item.oldprice*1 > 0">￥{{item.oldprice}}</font>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="pt20" v-if="tabtype == 1">
                            <template v-if="shop.content">
                                <div class="detail-content auto " v-html="shop.content">
                                </div>
                            </template>
                            <div class="detail-nomore" v-else>— 暂时没有详情介绍 —</div>
                        </div>
                    </div>
                    
                    <div class="is-ipx"></div>
                </div>

            </div>
            </van-pull-refresh>
        </div>
          
        <div class="fix-box" style="">
            <div class="info-menu">
                <div class="menu-items">
                    <div @click="link" class="item" data-url="/">
                        <img class="icon" :src="footimg.index">
                        <div>首页</div>
                    </div>
                    <div class="item" @click="openShareArea">
                            <img class="icon" :src="footimg.share">
                            <div>分享</div>
                    </div>
                    <div @click="link" class="item" data-url="/user">
                        <img class="icon" :src="footimg.my">
                        <div>我的</div>
                    </div>
                </div>
                <div class="menu-btns" v-if="params.isjoin == 0 && params.shoppj == 0">
                    <div @click="joinit()" class="shop-join btn lbg-pri" data-url="/shopjoin" :data-tel="params.jointel" :data-copy="params.joinwx"  >立即入驻</div>
                </div>
            </div>
        </div>

        <shopjoin v-if="params.shopji == 0" :isshow="params.shoppj == 0" :params="params"></shopjoin>

        <sharetip :isshowshare="isshowshare" @shareit="shareit" />

        <van-popup class="showposter_popup showposter" v-model="showposter" position="bottom" >

            <div class="posterbox" v-if="posterurl">
                <img @click="posterurlfn"  :src="posterurl" >
            </div>

            <div class="showposter item_cell_box" style="justify-content:center;">
                <div class="showposter_item" v-if="dev == 'app'" @click="wxshare(1)" style="width:50%;">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                    <div>分享好友</div>
                </div>
                <div class="showposter_item" v-if="dev == 'app'" @click="wxshare(2)" style="width:50%;">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                    <div>分享朋友圈</div>
                </div>
                <div class="showposter_item" @click.stop="shareit(true)" v-if="dev == 'wx'">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/57519/33/1457/6627/5cf23c90E4be43f37/2ba5d88a5b1b6ec1.png">
                    <div>分享给好友</div>
                </div>
                <div @click="shareposter" class="showposter_item" v-if="posterurl && dev == 'app'">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/57519/33/1457/6627/5cf23c90E4be43f37/2ba5d88a5b1b6ec1.png">
                    <div>分享海报</div>
                </div>
                <div @click="saveposter" class="showposter_item" v-if="posterurl && dev == 'app'">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/70599/27/1062/4948/5cf5d8a7E1d3b8a1d/7f74b9b5814e0c6e.png">
                    <div>保存到相册</div>
                </div>
                <div @click="getPoster" class="showposter_item" v-if="!posterurl">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/79397/19/948/5580/5cf23bdbE11da7e29/b145f3c1ba828eba.png">
                    <div>生成海报</div>
                </div>
            </div>
        </van-popup>

        </div>
    
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Tab,Tabs,Popup,ImagePreview } from 'vant';
    import sharetip from '../../components/sharetip';
    import shopjoin from '../../components/shopjoin';
    import good from '../../components/good';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'shopinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Tab.name] : Tab,
            [Tabs.name] : Tabs,
            [Popup.name] : Popup,
            sharetip,shopjoin,good
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
	  					doo : 'shopinfo',
	  					op : 'goodlist',
	  					shopid : 0,
	  					page : 2,
                        search : '',
                        sorttwo : 0,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                shop : {},
                allcard : {},
                isshowshare : false,
                Joinanimation : false,
                animate : false,
                timer : false,
                slidedata : [],
                fendian : [],
	  		    tabtype : 0,
                morecard : false,
                state : {
                    slidedata: [],
                    currentIndex: 0,
                    currentData: {},
                    status: "hide",
                    anmiate: 0
                },
                sort : [],
                showposter : false,
                dev : '',
                footimg : {},
                posterurl : false,
            }
	  	},
	  	created:function(e){
	  		//this.$emit('loadmessage',false);

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;

	  	},
        beforeRouteLeave(to, from, next){
            clearInterval(this.timer);
            next();
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            openShareArea : function(e){
                this.showposter = !this.showposter;
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
            getPoster(){
                var self = this;
                var postdata = {
                    op:'shop',
                    sid:self.shop.id,
                    path:self.sharedata.link,
                    dev : self.dev,
                };
                self.$util.http('poster','GET',postdata,function(res){    
                    if (!res.errno && res.data ) {
                        self.posterurl = res.data.url;
                        Dialog.alert({
                            message: '可将图片保存到本地相册和发给好友！'
                        }).then(() => {
                            if( self.dev == 'app' ){

                            }else{
                                ImagePreview({
                                    images : [res.data.url],
                                    closeOnPopstate : true,
                                    showIndicators : true,
                                })
                            }
                        });

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            posterurlfn(){
                ImagePreview({
                    images : [this.posterurl]
                })
            },
            joinit(){
                if( this.params.jointype == 0 ){
                    this.$router.push('/shopjoin');
                }else{
                    this.Joinanimation = !this.Joinanimation
                }
            },
            tabChange(e){
                var self = this;

                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                self.onLoad(true);
            },
            changesort(e){
                var self = this;

                this.isbot = false;
                this.datalist = [];
                this.page.pdata.sorttwo = e.currentTarget.dataset.id;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                self.onLoad(true);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            close(){
                this.page.pdata.search = '';
                this.tabChange();
            },
            couponShow(){
                this.morecard = !this.morecard;
            },
            comfirm(){
                var self = this;
                
                if( !self.page.pdata.search ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;

                self.onLoad(true);
            },
            zanit(){
                var self = this;
                var postdata = {
                    op:'zan',
                    id:self.shop.id,
                };
                self.$util.http('shopinfo','GET',postdata,function(res){    
                    if (!res.errno && res.data ) {
                        self.$toast(res.message);
                        self.shop.zan = self.shop.zan*1 + 1;
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            slideAnimate(){
                var self = this;
                setTimeout(function() {
                    t();
                }, 1000);
                var t = function() {
                    var slidedata = self.state.slidedata;
                    var e = JSON.parse(JSON.stringify(slidedata[0]));
                    slidedata.push(e);

                    self.slidedata = slidedata;
                    self.animate = true;

                    self.timer = setTimeout(function() {
                        clearTimeout(self.timer);
                        self.state.slidedata.splice(0, 1);

                        self.animate = false;
                        self.slidedata = self.state.slidedata;
                        self.slideAnimate();
                    }, 600);
                    
                };
            },
            takecard(e,a,b){
                if( a == 0 && b == 0 ){

                    var self = this;
                    var postdata = {
                        op : 'takecard',
                        id : e.currentTarget.dataset.id,
                    };
                    self.$util.http('card','GET',postdata,function(res){     
                        if (!res.errno && res.data) {
                            for (var i = 0; i < self.allcard.length; i++) {
                                if( self.allcard[i].id == postdata.id ){
                                    self.$set(self.allcard[i],'istaked',1);
                                }
                            }
                            self.$toast(res.message);
                        }else if( res.errno == 2 ){

                            Dialog.confirm({
                              message: res.message
                            }).then(() => {
                                self.$router.push('/buycard');
                            });

                        }else{
                            self.$toast(res.message);
                        }

                    },true);
                }
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                    shareid : params.shareid ? params.shareid : 0,
                }
                self.page.pdata.shopid = postdata.id;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) postdata.lat = loc.lat;
                if( loc.lng ) postdata.lng = loc.lng;

                self.$util.http('shopinfo','GET',postdata,function(res){ 
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.shop = res.data.shop;
                        self.datalist = res.data.list;
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.userinfo = res.data.userinfo;
                        self.allcard = res.data.allcard;
                        self.fendian = res.data.fendian;
                        self.sort = res.data.sort;
                        self.slidedata = res.data.slide ? res.data.slide : [];
                        self.footimg = res.data.footimg;
		                
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        window.document.title = self.shop.name;
                        self.$emit('loadmessage',{title:self.shop.name});

                        if( self.slidedata.length > 0 && self.params.shopsty == 0 ){
                            clearTimeout(self.timer);
                            self.state.slidedata = self.slidedata;
                            self.slideAnimate();
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
	  		onLoad(loading) {
	  			var self = this;
	            self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){        
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            },loading);
	  		},
	  		
	  	}
  	}
</script>
<style type="text/css" scoped>
@import "../../assets/css/iconfont.css";
#main{
    min-height: 100vh;
    background-color: #fff;
}
.shop-top {
    position: relative;
    z-index: 2;
    padding-bottom: 20px;
    margin-top: -25px;
}

.shop-top .top-wrap {
    padding: 0 15px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.3);
    border-radius: 5px;
    background-color: #fff;
}

.shop-top .tit {
    padding: 15px 0;
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

.shop-t {
    position: relative;
}

.shop-t .shop-divs {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    background-color: rgba(0,0,0,0.5);
    border-radius: 10px;
    padding: 0 8px;
}

.shop-pic {
    position: relative;
    z-index: 1;
}

.shop-pic .goods-swiper {
    height: 220px;
}

.rich_text {
    padding: 5px 0 15px;
}

.shop-nearshops .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    margin-bottom: 10px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 0.5px 1.5px 0 rgba(0,0,0,0.1);
}

.shop-nearshops .item .lt {
    margin-right: 10px;
}

.shop-nearshops .item .lt .img {
    position: relative;
    width: 103.5px;
    height: 82px;
}

.shop-nearshops .item .lt .img image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

.shop-nearshops .item .rt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.shop-nearshops .item .rt .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.shop-nearshops .item .rt .top .name {
    font-size: 15px;
    color: #333;
    font-weight: 500;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.shop-nearshops .item .rt .top .icon {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: #aeaeae;
    font-size: 12px;
}

.shop-nearshops .item .rt .top .icon .iconfont {
    margin-right: 5px;
}

.shop-nearshops .item .rt .btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.shop-nearshops .item .rt .btm .discount {
    font-size: 12px;
    color: #aeaeae;
}

.shop-nearshops .item .rt .btm .give {
    color: #aeaeae;
    font-size: 12px;
}

.shop-isVip {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 13px 0;
    font-size: 14px;
}

.shop-isVip .btn {
    padding: 0 10px;
    font-size: 12px;
    line-height: 23px;
    border-radius: 3px;
}

.card_box{
    white-space: nowrap;
    padding: 10px 0;
    overflow-x: auto;
}

/**/
.coupon {
    width: 265px;
    height: 80px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/ticket.png);
    background-size: 100% 100%;
    margin-right: 15px;
    box-sizing: border-box;
    padding: 10px;
}

.coupon {
    display: inline-flex;
    justify-content: space-between;
}

.coupon_text {
    flex: 1;
}

.coupon_title {
    font-size: 18px;
    color: #ff8585;
    max-width: 165px;
}
.coupon_title text{
    font-size: 10px;
}
.coupon_name{
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 165px;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    display: box;
    -webkit-box-orient: vertical;
}
.coupon_rule {
    font-size: 10px;
    margin-top: 2.5px;
    line-height: 15px;
    z-index: 1;
    width: 100%;
}

.coupon_tagname {
    font-size: 10px;
    margin-right: 5px;
    color: #ff8585;
}

.get_hint {
    margin-top: 5px;
    color: #FF6A6A;
    font-size: 10px;
    text-align: center;
}

.btn_div {
    z-index: 1;
    position: relative;
    font-size: 12px;
    height: 25px;
    text-align: center;
    line-height: 25px!important;
    border-radius: 50px;
    width: 70px;
    color: white;
    margin-top: 17.5px;
}

.get_btn {
    background-color: #ff5050;
}

.cant_get {
    background-color: #d2d2d2;
}

.has_get {
    border: 1px solid #ff5050;
    background-color: transparent;
    color: #ff5050!important;
}

.share_icon {
    width: 54.5px;
    height: 53px;
    position: fixed;
    right: 0;
    top: 325px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/share_icon_fansCard.png?v=1.0);
    background-size: 100% 100%;
    z-index: 55;
}

/**/
.search-wrap {
    height: 50px;
    margin-bottom: 15px;
}

.search-area {
    position: fixed;
    top: 0;
    left: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    box-shadow: 0 0 2.5px 0 rgba(0,0,0,0.2);
    background: #ffffff;
    z-index: 1;
}

.search-area .input {
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 30px;
    padding: 0 10px;
    border-color: #ddd;
    line-height: 30px;
    border-radius: 30px;
}

.search-area .input input {
    position: relative;
    z-index: 1;
    -webkit-box-flex: 1;
    flex: 1;
    height: 44px;
    padding: 0 10px;
    font-size: 14px;
    line-height: inherit;
    background-color: rgba(0,0,0,0);
    border: 0;
}

.search-area .input .icon-search {
    font-size: 16px;
}

.search-area .input .icon-close {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    opacity: 0.2;
}

.search-area .btn {
    height: 30px;
    padding: 0 15px;
    margin-right: -15px;
    font-size: 14px;
    line-height: 30px;
    background-color: transparent;
}
.info-section {
    padding: 0 15px;
    border-top: 8px solid #F5F5F5;
}

.info-section:first-of-type {
    border-top: 0;
}

.list-status {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto 60%;
}

.list-status.__end {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/60677/17/14518/10992/5dbef53dEa2ad66ea/167306a30872b4c2.png);
}

.list-status.__saled {
    background-image: url(http://img11.360buyimg.com/ddimg/jfs/t1/67901/21/14334/11117/5dbef542Efca67c10/a072e74e765e268f.png);
}
.info-rlist .rt_tit {
    font-size: 14px;
    line-height: 19px;
}

.info-rlist .item {
    padding-bottom: 14px;
    margin-bottom: 14px;
}

.info-rlist .item:last-child:after {
    visibility: hidden;
}

.info-rlist .inner {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.info-rlist .inner .lt {
    position: relative;
    width: 94px;
    margin-right: 12px;
}

.info-rlist .inner .rt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.info-rlist .inner .rt-btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.info-rlist .rt_tit {
    max-height: 38px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.info-rlist .rt_sale {
    font-size: 12px;
    color: #999;
}
.fix-box{
    position: fixed;
    z-index: 1;
    bottom: 0;
    left: 0;
    width: 100%;
}

.info-title {
    padding:20px 0 15px;
    font-size:17px;
    font-weight:500;
    line-height:22px;
    color:#222;
}
.detail-content{
    font-size: 14px;
}


/*样式二*/
.dis-flex,.vertical {
    display: flex;
    flex-direction: row;
}

.vertical {
    flex-direction: column;
}

.flex {
    flex: 1;
}

.flex-top {
    align-items: flex-start;
}

.flex-middle {
    align-items: center;
}

.flex-bottom {
    align-items: flex-end;
}

.flex-center {
    justify-content: center;
}

.flex-left {
    justify-content: flex-start;
}

.flex-right {
    justify-content: flex-end;
}

.flex-around {
    justify-content: space-around;
}

.flex-between {
    justify-content: space-between;
}

.flex-wrap {
    flex-wrap: wrap;
}

.clamp-1,.clamp-2,.clamp-3 {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 1.5;
}

.clamp-2,.clamp-3 {
    -webkit-line-clamp: 2;
}

.clamp-3 {
    -webkit-line-clamp: 3;
}

.bor-bom,.bor-left,.bor-right,.bor-top,.hover {
    position: relative;
}

.bor-bom::after,.bor-top::before {
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    height: 1PX;
    color: #eee;
    transform: scaleY(.5);
}

.bor-top::before {
    top: 0;
    border-top: 1PX solid #eee;
    transform-origin: 0 0;
}

.bor-bom::after {
    bottom: 0;
    border-bottom: 1PX solid #eee;
    transform-origin: 0 100%;
}

.bor-left::before,.bor-right::after {
    content: " ";
    position: absolute;
    right: 0;
    width: 1PX;
    height: 100%;
    color: #eee;
    transform: scaleX(.5);
}

.bor-left::before {
    left: 0;
    top: 0;
    border-left: 1PX solid #eee;
    transform-origin: 0 0;
}

.bor-right::after {
    bottom: 0;
    border-right: 1PX solid #eee;
    transform-origin: 0 100%;
}


.hover {
    overflow: hidden;
}

.hover::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,.1);
}

.icon-arrow {
    width: 10px;
    height: 10px;
    border-top: 0.5px solid #9496ab;
    border-right: 0.5px solid #9496ab;
    transform: rotate(45deg);
}

.icon-arrow-right {
    width: 6px;
    height: 6px;
    border-top: 1.2.5px solid #a6a6a6;
    border-right: 1.2.5px solid #a6a6a6;
    transform: rotate(45deg) translateY(-0.5px);
}

.icon-arrow-bottom {
    width: 6px;
    height: 6px;
    border-top: 1.2.5px solid #c7a15c;
    border-right: 1.2.5px solid #c7a15c;
    transform: rotate(135deg);
}

.icon-arrow-right-golden {
    width: 6px;
    height: 6px;
    border-top: 1.2.5px solid #d1b483;
    border-right: 1.2.5px solid #d1b483;
    transform: rotate(45deg) translateY(-0.5px);
}

.Bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 8;
    background-color: rgba(0,0,0,.7);
}

.swiper-page {
    transform: translateY(3.5px);
}

.swiper-page .now-page {
    font-size: 21px;
    font-weight: 700;
}

.swiper-page .all-page {
    transform: translateY(3.5px);
    margin-left: 1.5px;
}

.weui-loading {
    width: 17.5px;
    height: 17.5px;
    display: inline-block;
    vertical-align: middle;
    animation: e 1s steps(12) infinite;
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
    margin-right: .1rem;
}

.position-info {
    width: 100%;
    margin-top: 12px;
    margin-bottom: -8px;
}

.position-info .left .circle {
    width: 4px;
    height: 4px;
    background-color: #fd0;
    border-radius: 50%;
}

.position-info .left .span {
    font-size: 12px;
    color: #999;
    margin-left: 7.5px;
}

.position-info .distance,.swiper-page .all-page {
    font-size: 12px;
    color: #999;
}

.sale-tag {
    padding: 1.5px 5px;
    background-color: #f64031;
    font-size: 11px;
    color: #fff;
    border-radius: 2.5px;
    font-family: 'not specified';
}

font,view {
    line-height: inherit;
}

.shop-index-wrapper,page {
    background-color: #f2f2f2;
}

.shop-index-wrapper {
    min-height: 100vh;
}

.shop-index-wrapper .spread-wrap {
    padding: 5px 0 15px;
}

.shop-index-wrapper .spread-wrap .spread {
    width: 18px;
    padding: 7.5px;
    margin: -7.5px 0;
    height: 18px;
}

.shop-index-wrapper .spread-wrap .spread.rotate {
    transform: rotate(180deg);
}

.shop-index-wrapper .member-wrapper {
    position: absolute;
    left: 15px;
    bottom: 10px;
    height: 105px;
    overflow: hidden;
}

.shop-index-wrapper .bg-img-wrap {
    width: 100%;
    position: relative;
    z-index: 0;
}
.shop-index-wrapper .bg-img-wrap .coverimg{
  width: 100%;
}


.shop-index-wrapper .bg-img-wrap .shadow {
    position: absolute;
    background-image: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#f2f2f2 50%);
    padding-top: 120px;
    bottom: -59px;
    left: 0;
    width: 100%;
    z-index: 1;
}

.shop-index-wrapper .bg-img-wrap .btn {
    position: absolute;
    width: 30px;
    height: 30px;
    right: 15px;
    top: 15px;
    background: #333;
    border-radius: 50%;
    text-align: center;
}

.shop-index-wrapper .bg-img-wrap .btn .img {
    width: 13px;
    height: 0;
    transform: translateY(-0.5px);
}

.shop-index-wrapper .wrapper {
    position: relative;
    z-index: 1;
    margin-top: 0;
}

.shop-index-wrapper .wrapper .empty {
    padding-bottom: 48px;
}

.shop-index-wrapper .wrapper .panel {
    background-color: #fff;
    border-radius: 4px;
    padding: 15px;
    margin: 10px 0;
    box-sizing: border-box;
}

.shop-index-wrapper .wrapper .panel .font-small {
    font-size: 10px;
    color: #999;
    margin-left: 5px;
}

.shop-index-wrapper .wrapper .panel .font-small .num {
    margin-right: 3.5px;
}

.shop-index-wrapper .wrapper .panel ._title {
    color: #000;
    font-size: 18px;
    margin-bottom: 15px;
}

.shop-index-wrapper .wrapper .panel.goods .container {
    margin-bottom: -25px;
}

.shop-index-wrapper .wrapper .panel.goods .container .goods-item {
    margin-bottom: 25px;
}

.shop-index-wrapper .wrapper .panel.goods .container .goods-item .img {
    width: 140px;
    height: 94px;
    border-radius: 5PX;
    background-color: #eee;
    margin-right: 10px;
}

.shop-index-wrapper .wrapper .panel.goods .container .more .img {
    width: 14px;
    margin: 0 auto 10px;
}

.shop-index-wrapper .wrapper .panel.artcle {
    padding: 15px 0;
}

.shop-index-wrapper .wrapper .panel.artcle ._title {
    padding: 0 15px;
}

.shop-index-wrapper .wrapper .panel.artcle .artcle-swiper {
    width: 100%;
    height: 165px;
}

.shop-index-wrapper .wrapper .panel.artcle .artcle-swiper .artcle-item {
    position: relative;
    width: 98%;
    overflow: hidden;
    border-radius: 5px;
}

.shop-index-wrapper .wrapper .panel.artcle .artcle-swiper .artcle-item .img {
    background-color: #eee;
    height: 165px;
}

.shop-index-wrapper .wrapper .panel.artcle .artcle-swiper .artcle-item .text {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 14px;
    margin-top: 9px;
    color: #fff;
    box-sizing: border-box;
    padding: 0 15px 9.5px;
    background: linear-gradient(to bottom,transparent,rgba(58,42,42,.6));
}

.shop-index-wrapper .wrapper .panel .server-item .img {
    width: 10.5px;
    height: 12.5px;
    background-color: #eee;
}

.shop-index-wrapper .wrapper .panel .server-item .text {
    color: #999;
    font-size: 10px;
    margin-left: 5px;
}

.shop-index-wrapper .wrapper .panel .shop-aptitude .img {
    width: 14px;
    height: 0;
}

.shop-index-wrapper .wrapper .panel .shop-aptitude .text {
    color: #333;
    font-size: 13px;
    margin-left: 4.5px;
}

.shop-index-wrapper .wrapper .shop {
    padding-left: 0;
    padding-right: 0;
}

.shop-index-wrapper .wrapper .shop .avatar {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: #eee;
}

.shop-index-wrapper .wrapper .shop .shop-name {
    font-size: 16px;
    color: #000;
    font-weight: 500;
    margin-right: 10px;
    line-height: 20px;
}

.shop-index-wrapper .wrapper .shop .text {
    font-size: 11px;
    color: #666;
}

.shop-index-wrapper .wrapper .shop .dot {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    margin: 0 4px;
    background-color: #999;
}

.shop-index-wrapper .wrapper .shop .avatar-group {
    border: 19px;
    height: 19px;
    border-radius: 50%;
    margin-right: 5px;
}

.shop-index-wrapper .wrapper .shop .avatar-group .avatar-img {
    width: 19px;
    height: 19px;
    border-radius: 50%;
    border: 2Px solid #fff;
}

.shop-index-wrapper .wrapper .shop .avatar-group .avatar-img:nth-child(1) {
    position: relative;
    left: 16px;
    z-index: 1;
}

.shop-index-wrapper .wrapper .shop .avatar-group .avatar-img:nth-child(2) {
    position: relative;
    left: 8px;
    z-index: 2;
}

.shop-index-wrapper .wrapper .shop .avatar-group .avatar-img:nth-child(3) {
    z-index: 3;
}

.shop-index-wrapper .wrapper .shop .introduce {
    padding: 12px 20px;
    background: rgba(255,252,234,.8);
    border-radius: 5px;
    margin: 15px 15px 0;
    position: relative;
}

.shop-index-wrapper .wrapper .shop .introduce .iconfont {
    font-size: 15px;
    color: #fd0;
    margin-right: 10px;
    transform: translateY(-0.5px);
}

.shop-index-wrapper .wrapper .shop .introduce .triangle {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent #fffcea;
    top: -10.5px;
    left: 18px;
}

.shop-index-wrapper .wrapper .shop .introduce .text {
    font-size: 12px;
}

.shop-index-wrapper .wrapper .shop .tool-wrap {
    padding-top: 20px;
    padding-bottom: 5px;
}

.shop-index-wrapper .wrapper .shop .tool-wrap .item {
    width: 25%;
}

.shop-index-wrapper .wrapper .shop .tool-wrap .item .icon {
    margin-bottom: 8px;
}

.shop-index-wrapper .wrapper .shop .tool-wrap .item .icon-call {
    width: 19px;
    height: 19px;
}

.shop-index-wrapper .wrapper .shop .tool-wrap .item .icon-location {
    width: 17px;
    height: 19px;
}

.shop-index-wrapper .wrapper .shop .tool-wrap .item .icon-share {
    width: 19.5px;
    height: 17.5px;
}

.shop-index-wrapper .wrapper .shop .tool-wrap .item .icon-collect {
    width: 19px;
    height: 18px;
}

.shop-index-wrapper .wrapper .shop .shop-info {
    padding: 0 15px;
}

.shop-index-wrapper .wrapper .shop .shop-info .num-style {
    font-family: "DINN";
    letter-spacing: -1Px;
}

.shop-index-wrapper .wrapper .shop .shop-info .shop-avatar-wrap {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: #eee;
}

.shop-index-wrapper .wrapper .shop .shop-info .shop-avatar-wrap .shop-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.shop-index-wrapper .wrapper .shop .shop-info .shop-title {
    font-size: 16px;
    font-weight: 600;
    color: #000;
}

.shop-index-wrapper .wrapper .shop .shop-info .shop-des {
    font-size: 12px;
    color: #999;
}

.shop-index-wrapper .wrapper .shop .shop-info .tag-wrap {
    width: 40px;
    height: 50px;
    background: #fff;
    margin-left: 10px;
    box-shadow: 0 1.5px 6px 0 rgba(51,51,51,.12);
}

.shop-index-wrapper .wrapper .shop .shop-info .tag-wrap .icon {
    width: 13px;
    height: 14px;
}

.shop-index-wrapper .wrapper .shop .shop-info .tag-wrap .icon.follow {
    transform: scale(1.2);
    position: relative;
    top: -1px;
}

.shop-index-wrapper .wrapper .shop .shop-info .tag-wrap .icon.location {
    position: relative;
    top: 1px;
}

.shop-index-wrapper .wrapper .shop .shop-info .tag-wrap .num {
    font-size: 12px;
    margin: 3px 0 -4px;
}

.shop-index-wrapper .wrapper .shop .shop-info .tag-wrap .label {
    font-size: 8px;
    color: #999;
}

.shop-index-wrapper .wrapper .rank-scrollview {
    height: 80px;
}

.shop-index-wrapper .wrapper .rank-scrollview .item-wrap {
    width: 345px;
    height: 80px;
    display: inline-block;
    border-radius: 10px;
    overflow: hidden;
    background-color: #eee;
    position: relative;
}

.shop-index-wrapper .wrapper .rank-scrollview .item-wrap .btn-share {
    width: 110px;
    height: 28px;
    background: linear-gradient(0deg,#ffb500,#fd0);
    border-radius: 14px;
    color: #333;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
}

.shop-index-wrapper .wrapper .rank-scrollview .item-wrap .btn-share .icon-share {
    width: 14px;
    height: 14px;
    background-size: 14px;
    background-repeat: no-repeat;
    background-image: url(https://file.open.banchengyun.com/2019/04/15/155530849243369.png);
}

.shop-index-wrapper .wrapper .rank-scrollview .item-wrap .btn-share .btn-label {
    font-size: 13px;
    margin: 0 5px;
}

.shop-index-wrapper .wrapper .rank-scrollview .item-wrap .btn-share .btn-sub-label {
    font-size: 9px;
    font-weight: 500;
}

.shop-index-wrapper .wrapper .rank-scrollview .item-wrap .item {
    width: 345px;
}

.shop-index-wrapper .wrapper .goods .title {
    font-size: 18px;
    margin-bottom: 15px;
}

.shop-index-wrapper .wrapper .goods .goods-img {
    width: 140px;
    height: 94px;
    border-radius: 5px;
    margin-right: 10px;
}

.shop-index-wrapper .wrapper .goods .content {
    margin-bottom: 8px;
    font-size: 14px;
}

.shop-index-wrapper .wrapper .goods .item {
    background: #fbfbfb;
    border: 0.5px solid #ccc;
    border-radius: 2.5px;
    padding: 0 5px;
    height: 17.5px;
    line-height: 17.5px;
    margin-right: 5px;
}

.shop-index-wrapper .wrapper .goods .new-price {
    font-size: 16px;
    margin-right: 5px;
}

.shop-index-wrapper .wrapper .goods .old-price,.shop-index-wrapper .wrapper .goods .text {
    height: 16px;
    line-height: 29px;
    font-size: 11px;
}

.shop-index-wrapper .wrapper .goods .text {
    font-family: "DINN";
}

.shop-index-wrapper .wrapper .goods .btn-add-goods {
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: linear-gradient(0deg,#ff9d07 0%,#ffc43c 100%);
    border-radius: 20px;
    font-size: 12px;
    margin: 20px auto 0;
}

.shop-index-wrapper .shop-footer {
    z-index: 7;
    position: fixed;
    width: 100%;
    height: 48px;
    background-color: #fff;
    bottom: 0;
    left: 0;
}

.shop-index-wrapper .shop-footer .img {
    width: 26.5px;
    height: 0;
}

.shop-index-wrapper .shop-footer .text {
    color: #000;
    font-size: 9px;
}

.shop-index-wrapper .coupon-list-wrap {
    margin: 0 0px 10px;
}

.shop-index-wrapper .coupon-list-wrap ._item {
    margin-bottom: 10px;
}

.shop-index-wrapper .coupon-list-wrap ._item:nth-last-child(1) {
    margin-bottom: 0;
}

/*card*/
.redpackets {
    position: relative;
    z-index: 1;
    border-radius: 4px;
    background-size: 109.5px 48.5px;
    background-position: 162px bottom;
    background-repeat: no-repeat;
    padding: 0 15px 0 25px;
    height: 2rem;
    width: 100%;
}

.redpackets.primary {
    background-color: #fe716d;
    background-image: url(https://file.open.banchengyun.com/2019/06/12/156033511240371.png);
}

.redpackets.disable {
    background-color: #ccc;
    background-image: url(https://file.open.banchengyun.com/2019/06/12/156033560691572.png);
}

.redpackets .discount-title {
    color: #fff;
    margin-right: 25px;
}

.redpackets .discount-title .big {
    font-family: "DINN";
    font-size: 25px;
    letter-spacing: -1px;
}

.redpackets .discount-title .small {
    font-size: 8px;
    transform: translateX(2.5px);
    font-weight: 500;
    width:100%;
    padding-top: 10px;
}

.redpackets .discount-info {
    color: #fff;
    margin-right: 5px;
}

.redpackets .discount-info .big {
    font-size: 12px;
    margin-bottom: 0.5px;
    font-weight: 500;
}

.redpackets .discount-info .small {
    font-size: 10px;
}
.coupon-list-wrap .btn_div{
    border:1px solid #ffffff;
    color: #fff;
    margin-top: 0;
}

/*goods*/
.defalut-goods-wrapper {
    width: 100%;
}

.defalut-goods-wrapper .member-tab {
    margin-bottom: -8px;
}

.defalut-goods-wrapper .img {
    width: 140px;
    height: 94px;
    border-radius: 5px;
    background-color: #ddd;
    overflow: hidden;
    display: block;
    margin-right: 12px;
}

.defalut-goods-wrapper .goods-title {
    white-space: normal;
    font-size: 14px;
    color: #333;
    height: 37.5px;
    font-weight: 500;
    line-height: 20px;
    margin-top: -1px;
}

.defalut-goods-wrapper .price-info {
    width: 100%;
    transform: translateY(6px);
}

.defalut-goods-wrapper .price-info .price {
    position: relative;
    transform: translateX(-1px);
}

.defalut-goods-wrapper .price-info .price .now-price {
    font-size: 18px;
    color: #f64031;
    letter-spacing: -0.5px;
    font-family: "DINN";
}

.defalut-goods-wrapper .price-info .price .before-price {
    font-size: 11px;
    color: #c2c2c2;
    margin-left: 5px;
    letter-spacing: -0.5px;
    position: relative;
    font-family: "DINN";
}

.defalut-goods-wrapper .price-info .price .before-price:before {
    content: "";
    position: absolute;
    left: 2%;
    bottom: 50%;
    width: 100%;
    height: 1PX;
    background-color: #c2c2c2;
}

.defalut-goods-wrapper .price-info .price .tooltip {
    top: -20px;
    left: 2.5px;
    padding: 0 5px;
    position: absolute;
    color: #fff;
    font-size: 10px;
    border-radius: 5px;
    height: 20px;
    background: linear-gradient(90deg,#ff3060,#ff0204);
}

.defalut-goods-wrapper .price-info .price .tooltip::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-width: 9.3px;
    border-style: solid;
    border-color: #ff0204 transparent transparent;
    bottom: -16.32px;
    left: 17.5px;
}

.defalut-goods-wrapper .price-info .sales {
    font-size: 10px;
    color: #999;
    transform: translateY(2px);
}

.defalut-goods-wrapper .sell-detail {
    transform: translateY(5px);
}

.defalut-goods-wrapper .sell-detail .text {
    font-size: 9px;
    line-height: 9px;
    color: #333;
    margin-bottom: 5px;
}

.defalut-goods-wrapper .sell-detail .progress {
    width: 85px;
    height: 3.5px;
    border-radius: 2PX;
    background-color: #eee;
    overflow: hidden;
}

.defalut-goods-wrapper .sell-detail .progress .bar {
    width: 10%;
    height: 100%;
    background-color: #fd0;
}

/**/
.shop-content .shop-position-wrap {
    margin-bottom: 15px;
}

.shop-content .shop-position-wrap:nth-last-child(1) {
    margin-bottom: 0;
}

.shop-content .shop-position-wrap .position {
    width: 250px;
}

.shop-content .shop-position-wrap .position .name {
    display: block;
    font-size: 13px;
    color: #666;
}

.shop-content .shop-position-wrap .position .info {
    display: block;
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shop-content .shop-position-wrap .icon-wrap {
    width: 61px;
}

.shop-content .shop-position-wrap .icon-wrap .icon {
    width: 19px;
    height: 19px;
}

.shop-content .shop-position-wrap .icon-wrap .line {
    width: 1PX;
    height: 12px;
    background-color: #efeeee;
}

.shop-content .shop-position-wrap .open-time {
    margin-top: 6.5px;
}

.shop-content .shop-position-wrap .open-time .img {
    width: 20px;
    height: 20px;
    margin-right: 6px;
}

.shop-content .shop-position-wrap .open-time .text {
    display: block;
    float: left;
    font-size: 12px;
    color: #999;
}

.more-wrapper {
    box-sizing: border-box;
}

.more-wrapper .more-img {
    width: 14px;
    padding: 7.5px;
    margin: 7.5px auto -7.5px;
}

.more-wrapper .more-img.show-more {
    transform: rotate(180deg);
}

.more.hide {
    display: none;
}
/**/
@-webkit-keyframes slide1 {
    0% {
        margin-top: 0;
        opacity: .2;
    }

    to {
        margin-top: -30px;
        opacity: 0;
        display: none;
    }
}

@keyframes slide1 {
    0% {
        margin-top: 0;
        opacity: .2;
    }

    to {
        margin-top: -30px;
        opacity: 0;
        display: none;
    }
}

@-webkit-keyframes slide2 {
    0% {
        opacity: .7;
    }

    to {
        opacity: .2;
    }
}

@keyframes slide2 {
    0% {
        opacity: .7;
    }

    to {
        opacity: .2;
    }
}

@-webkit-keyframes slide3 {
    0% {
        opacity: 1;
    }

    to {
        opacity: .7;
    }
}

@keyframes slide3 {
    0% {
        opacity: 1;
    }

    to {
        opacity: .7;
    }
}
.slide {
    padding-top: 20px;
    overflow: hidden;
}

.slide .content .bubble:nth-child(1) {
    opacity: .2;
}

.slide .content .bubble:nth-child(2) {
    opacity: .7;
}

.slide .content.animate {
    width: 100%;
}

.slide .content.animate .bubble:nth-of-type(1) {
    animation: slide1 .6s linear;
    animation-fill-mode: forwards;
}

.slide .content.animate .bubble:nth-of-type(2) {
    animation: slide2 .6s linear;
    animation-fill-mode: forwards;
}

.slide .content.animate .bubble:nth-of-type(3) {
    animation: slide3 .6s linear;
    animation-fill-mode: forwards;
}

.bubble {
    position: fixed;
    z-index: 3;
    top: 15px;
    left: 15px;
    transition: 1000ms all ease;
    opacity: 0;
}

.bubble.default {
    position: static;
    margin-bottom: 3px;
    opacity: 1;
    width: 100%;
    box-sizing: border-box;
    transition: 1.5s all linear;
    padding: 0;
    background-color: transparent;
    border-radius: inherit;
}

.bubble,.bubble.default .info {
    padding: 2.5px;
    background-color: rgba(0,0,0,.5);
    border-radius: 14PX;
}

.bubble.default .info .text {
    margin-right: 5px;
}

.bubble.show {
    opacity: 1;
}

.bubble .img {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    background-color: #eee;
}

.bubble .text {
    margin-left: 6.5px;
    color: #fff;
    font-size: 11px;
    margin-right: 12.5px;
}

/**/
.sortbox.tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
}

.sortbox.tag>.tag-item {
    background-color: #f0f0f0;
    border-radius: 14px;
    line-height: 27px;
    padding: 0 14px;
    margin-bottom: 13px;
    margin-right: 7px;
    color: #585858;
    font-size: 13px;
    text-align: center;
}

.sortbox.tag>.tag-item.active {
    color: #FF411E;
    background: rgba(255,65,30,0.08);
}
.posterbox{
    position: relative;
    z-index: 1;
}
.posterbox img{
    position: fixed;
    bottom: 125px;
    width: 250px;
    left: 62.5px;
}
.spaybtn{
    text-align: center;
    line-height: 44px;
    border-radius: 50px;
    margin: 10px;
    margin-top: 20px;
    font-size: 14px;
}

</style>