<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <subtip :params="params"></subtip>

            <van-pull-refresh v-model="isrefresh" :disabled="disrefresh" v-scroll="scrolltop" @refresh="onRefresh" :head-height="80" success-text="已刷新">

            <div class="head" :style="{'background-image':'url('+ (params.commtop ? params.commtop : 'https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/praise_channel_headimg.png?t=2') +')'}"></div>
            
            <div class="top__nav" v-if="params.shopincom == 0">
                <div @click="showcomm" class="nav" :class="showtype==0?'color-pri':''" data-type="0" >
                    <div class="img-comment iconfont icon-haodian-youzhihaoping"></div>
                    <div class="name">优质好评</div>
                </div>
                <div @click="showcomm" class="nav" :class="showtype==1?'color-pri':''" data-type="1" >
                    <div class="img-shop iconfont icon-haodian-tuijian"></div>
                    <div class="name">推荐好店</div>
                </div>
            </div>

            <template v-if="showtype == 0">
                
                <div class="tag">
                    <div @click="commsort" class="tag-item" :class="page.pdata.sortid == 0?'color-pri':''"  data-id="0" >全部</div>
                    <div @click="commsort" class="tag-item" :class="page.pdata.sortid == item.id?'color-pri':''"  :data-id="item.id" v-for="item in goodsort" :key="item.id">{{item.name}}</div>
                </div>

                <div class="content" >
                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <div class="cont_kuai"  v-for="(item,index) in datalist" >
                        <div class="cont_kuai_top" >
                            <div class="kuai_top_avatar" :style="{'background-image':'url('+item.headimg+')'}"></div>
                            <div>
                                <div class="kuai_top_name">{{item.nickname}}</div>
                                <div class="kuai_top_zhong">
                                    <div class="kuai_top_haoping" >星级</div>
                                    <div class="kuai_top_xx" :style="{'background-image':'url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/' + (item.star >= inn ? 'p_star_1' : 'p_star_0') + '.png'}" v-for="inn in [1,2,3,4,5]" ></div>
                                </div>
                            </div>
                            <div @click="upcomm" class="kuai_top_tuijian" :data-cid="item.commid" data-status="0" v-if="item.isadmin==1 && item.isshow == 1">设为不推荐</div>
                            <div @click="upcomm" class="kuai_top_tuijian" :data-cid="item.commid" data-status="1" v-if="item.isadmin==1 && item.isshow == 0">设为推荐</div>
                        </div>
                        <div class="cont_kuai_mid" :id="'contid_'+item.id" @click="link" :data-url="item.appurl">
                            <font>{{item.content}}</font>
                        </div>
                        <div class="cont_kuai_down" v-if="item.img && item.img.length>0" @click="link" :data-url="item.appurl">
                            <div :class="'kuai_down_'+item.img.length" :style="{'background-image':'url('+pic+')'}" v-for="pic in item.img" ></div>
                        </div>
                        <div class="cont_kuai_shang" @click="link" :data-url="item.appgoodurl" >
                            <div class="kuai_shang_left" :style="{'background-image':'url('+item.thumb+')'}"></div>
                            <div class="kuai_shang_right">
                                <div class="kuai_shang_right_title">{{item.title}}</div>
                                <div class="kuai_shang_right_down">
                                    <div class="shang_right_down_left color-pri" >{{item.show_price}}元</div>
                                    <div class="shang_right_down_right color-pri border-pri" >{{item.btn}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="dianfen">
                            <div @click="favorclick" class="cont_kuai_zan" :data-cid="item.commid" :data-index="index" :data-iszan="item.is_zan">
                                <img class="cont_kuai_zan_icon" src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/haoping_dianzan2.png" >
                                <img class="cont_kuai_zan_icon" src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/haoping_dianzan.png" v-if="item.is_zan==1">
                                <div style="line-height:34rpx; padding-top:3rpx;" v-if="item.zan>0">{{item.zan}}</div>
                            </div>
                            <div class="cont_kuai_fenxiang" @click="shareit(true)" :data-id="item.commid" :data-index="index" style="margin:0;">
                                <img src="https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/cont_kuai_fenxiang.png?t=1">
                                <div style="line-height:34rpx; padding-top:3rpx;font-size:28rpx;color:#888888">分享</div>
                            </div>
                        </div>
                    </div>
                    </van-list>
                </div>
                <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— 暂时还没有信息 —</div>
                </div>

            </template>
            <template v-if="showtype == 1">
                
                <div class="tag">
                    <div @click="shopsorts" class="tag-item" :class="shoppage.pdata.sortid == 0?'color-pri':''" data-id="0" >全部</div>
                    <div @click="shopsorts" class="tag-item" :class="shoppage.pdata.sortid == item.id?'color-pri':''" :data-id="item.id" v-for="item in shopsort" :key="item.id">{{item.name}}</div>
                </div>

                
                <div class="shoplist" >
                    <van-list v-model="shoppage.doing" :immediate-check="shoppage.initget" :finished="shoppage.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <div class="shoplist-list" >
                        <div class="item" v-for="(item,index) in shoplist" :key="index">
                            <router-link :to="item.appurl">
                                <div class="img image-box __60">
                                    <img :src="item.cover" />
                                </div>
                                <div class="msg">
                                    <div class="info">
                                        <div class="name">{{item.name}}</div>
                                        <div class="local minbotom" bindtap="location" data-lat="item.lat/1000000" data-lng="item.lng/1000000" data-addname="item.name" data-address="item.street">
                                            <div class="lt">
                                                <div class="icon iconfont"></div>
                                                <div class="adress">{{item.street}}</div>
                                            </div>
                                            <div class="rt" >{{item.m}}</div>
                                        </div>
                                    </div>
                                    <div class="goods thin-border_t" v-if="item.goods">
                                        <div >
                                            <div v-for="inn in item.goods" class="goods_item" bindtap="navigateto" data-url="/zofui_sales/pages/good/good?id=inn.id">
                                                <div class="icon iconfont"></div>
                                                <div class="intro">{{inn.title}}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="goods thin-border_t" v-if="item.cards && item.cards.length > 0">
                                        <div >
                                            <div v-for="inn in item.cards" class="goods_item" bindtap="navigateto" data-url="/zofui_sales/card/info?id=inn.id">
                                                <div class="icon icon-18 iconfont"></div>
                                                <div class="intro">{{item.name}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                    </van-list>
                </div>

                <div class="list-none listnone" v-if="shoplist.length <= 0 && shoppage.isend">
                    <img class="info_img" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— 暂时还没有数据 —</div>
                </div>
                </van-list>
            </template>

            </van-pull-refresh>

            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

        </div>
    </div>

</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import sharetip from '../../components/sharetip';
    import subtip from '../../components/subtip';
    import wx from 'weixin-js-sdk';

	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	tabbar,sharetip,subtip
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : false,
                inited : false,
	  			params : {},
	  			cardinfo : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                shoplist : [],
	  			page : {
	  				pdata : {
	  					doo : 'comm',
	  					op : 'list',
	  					type : 0,
	  					page : 1,
                        sortid : 0,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                shoppage : {
                    pdata : {
                        doo : 'shop',
                        op : 'list',
                        type : 0,
                        page : 1,
                        sortid : 0,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                isshowshare : false,

                showtype : 0,
                goodsort : [],
                shopsort : [],
	  		}
	  	},
        activated:function(e){
            if( self.sharedata ){
                self.$util.share(wx,self.sharedata);
            }

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		this.$emit('loadmessage',false);           
	  	},       
	  	methods: {
            scrolltop(e){
                this.disrefresh = e <= 0 ? false : true;
            },
            onRefresh(){
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            shareit(bool){
                this.isshowshare = bool;
            },
            stype(e){
            	this.sstype = e.currentTarget.dataset.type;
            },
            commsort(e){
            	if( e.currentTarget.dataset.id == this.page.pdata.sortid ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.sortid = e.currentTarget.dataset.id;
                this.onLoad();
            },
            shopsorts(e){
                if( e.currentTarget.dataset.id == this.shoppage.pdata.sortid ) return false;
                this.shoplist = [];
                this.isbot = false;
                this.shoppage.pdata.page = 1;
                this.shoppage.isend = false;
                this.shoppage.doing = false;
                this.shoppage.pdata.sortid = e.currentTarget.dataset.id;
                this.onLoad();
            },
            showcomm(e){
                this.showtype = e.currentTarget.dataset.type;
                if( this.shoppage.pdata.page <= 1 ){
                    this.onLoad();
                }
            },
            favorclick(e){
                var self = this;
                var postdata = {
                    op : 'favorclick',
                    cid : e.currentTarget.dataset.cid,
                };
                self.$util.http('comm','GET',postdata,function(res){
                    if( res && !res.errno ){
                        for (var i = 0; i < self.datalist.length; i++) {
                            if( self.datalist[i].commid == postdata.cid ){
                                var now = self.datalist[i].zan*1 + 1;
                                self.datalist[i].zan = now;
                                return false;
                            }
                        }
                        self.$toast('成功点赞');
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            upcomm(e){
                var self = this;
                var postdata = {
                    op : 'upcomm',
                    cid : e.currentTarget.dataset.cid,
                    status : e.currentTarget.dataset.status,
                };
                self.$util.http('comm','GET',postdata,function(res){
                    self.$toast(res.message);
                    if( res && !res.errno ){
                        for (var i = 0; i < self.datalist.length; i++) {
                            if( self.datalist[i].commid == postdata.cid ){
                                self.datalist[i].isshow = postdata.status;
                                return false;
                            }
                        }
                        
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) {
                    self.page.pdata.lat = loc.lat;
                    self.shoppage.pdata.lat = loc.lat;
                }
                if( loc.lng ) {
                    self.page.pdata.lng = loc.lng;
                    self.shoppage.pdata.lng = loc.lng;
                }
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
				self.page.isend = false;
                self.page.geting = false;
				self.page.pdata.page = 1;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.goodsort = res.data.goodsort;
                        self.shopsort = res.data.shopsort;

                        window.document.title = self.params.title;
                        self.$util.share(wx,self.sharedata);
		                
                        self.inited = 2;
                        self.$route.meta.title = self.params.title;
                        self.$emit('loadmessage',{title:self.params.title});

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

                if( self.showtype == 0 ){
                    self.$util.pageList(this,this.page,function(res){
                        if( res && res.data && res.data.list.length > 0 ){        
                            if( self.datalist.length > 0 ){
                                self.datalist = self.datalist.concat(res.data.list)
                            }else{
                                self.datalist = res.data.list;
                            }
                        }
                    });
                }else{
                    self.$util.pageList(this,this.shoppage,function(res){
                        if( res && res.data && res.data.list.length > 0 ){        
                            if( self.shoplist.length > 0 ){
                                self.shoplist = self.shoplist.concat(res.data.list)
                            }else{
                                self.shoplist = res.data.list;
                            }
                        }
                    },'','','shoppage');
                }
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
.head {
    width: 375px;
    height: 79px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    margin-bottom: 19px;
}
.content {
    padding: 0 15px;
}

.cont_kuai {
    border-bottom: 0.5px solid #eeeeee;
    overflow: visible;
    margin-bottom: 24px;
}
.cont_kuai_top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 12.5px;
    position: relative;
}

.kuai_top_avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #dddddd;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 6.5px;
}

.kuai_top_name {
    width: 225px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #353535;
    line-height: 14px;
    font-size: 14px;
    text-align: left;
    margin-bottom: 6px;
}

.kuai_top_haoping {
    color: #aaa;
    font-size: 11px;
    padding-top: 2.5px;
    margin-right: 5px;
}

.kuai_top_xx {
    width: 11px;
    height: 11px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 5px;
}

.kuai_top_zhong {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 11px;
}

.kuai_top_tuijian {
    width: 75px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    border: 1px solid #353535;
    color: #353535;
    border-radius: 17.5px;
    position: absolute;
    text-align: center;
    right: 0;
}

.cont_kuai_mid {
    width: 345px;
    font-size: 14px;
    color: #353535;
    line-height: 1.75;
    letter-spacing: 1px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    margin-bottom: 17.5px;
    text-align: left;
}

.cont_kuai_mid2 {
    height: auto;
}

.cont_kuai_xsyc {
    font-size: 14px;
    color: #576b95;
    line-height: 1.75;
    text-align: left;
}

.cont_kuai_down {
    margin-bottom: 20px;
    overflow: hidden;
}

.kuai_down_1,.kuai_down_2,.kuai_down_3,.kuai_down_4,.kuai_down_5,.kuai_down_6,.kuai_down_7,.kuai_down_8,.kuai_down_9 {
    float: left;
    width: 345px;
    height: 345px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #eeeeee;
}

.kuai_down_2 {
    width: 168px;
    height: 168px;
}

.kuai_down_2:nth-child(1) {
    margin-right: 9px;
}

.kuai_down_3:nth-child(1) {
    width: 227.5px;
    height: 227.5px;
    margin-right: 7.5px;
}

.kuai_down_3:nth-child(2),.kuai_down_3:nth-child(3) {
    margin-right: 0;
    width: 110px;
    height: 110px;
}

.kuai_down_3:nth-child(3) {
    margin-top: 7.5px;
}

.kuai_down_4 {
    width: 168px;
    height: 168px;
}

.kuai_down_4:nth-child(1),.kuai_down_4:nth-child(2) {
    margin-bottom: 9px;
}

.kuai_down_4:nth-child(1),.kuai_down_4:nth-child(3) {
    margin-right: 9px;
}

.kuai_down_5 {
    width: 81.5px;
    height: 81.5px;
}

.kuai_down_5:nth-child(1) {
    width: 168px;
    height: 168px;
    margin-right: 9px;
}

.kuai_down_5:nth-child(2),.kuai_down_5:nth-child(3) {
    margin-bottom: 6px;
}

.kuai_down_5:nth-child(2),.kuai_down_5:nth-child(4) {
    margin-right: 5px;
}

.kuai_down_6 {
    margin-right: 0;
    width: 110px;
    height: 110px;
}

.kuai_down_6:nth-child(1) {
    width: 227.5px;
    height: 227.5px;
    margin-right: 7.5px;
}

.kuai_down_6:nth-child(2),.kuai_down_6:nth-child(3) {
    margin-bottom: 7.5px;
}

.kuai_down_6:nth-child(4),.kuai_down_6:nth-child(5) {
    margin-right: 7.5px;
}

.kuai_down_7 {
    width: 81.5px;
    height: 81.5px;
}

.kuai_down_7:nth-child(1),.kuai_down_7:nth-child(6),.kuai_down_7:nth-child(7) {
    width: 168px;
    height: 168px;
    margin-right: 7.5px;
}

.kuai_down_7:nth-child(1) {
    margin-bottom: 7.5px;
}

.kuai_down_7:nth-child(7) {
    margin-right: 0;
}

.kuai_down_7:nth-child(2),.kuai_down_7:nth-child(4) {
    margin-right: 5px;
}

.kuai_down_7:nth-child(2),.kuai_down_7:nth-child(3) {
    margin-bottom: 5px;
}

.kuai_down_7:nth-child(4),.kuai_down_7:nth-child(5) {
    margin-bottom: 7.5px;
}

.kuai_down_8 {
    width: 81.5px;
    height: 81.5px;
}

.kuai_down_8:nth-child(1) {
    width: 256px;
    height: 256px;
    margin-right: 8px;
}

.kuai_down_8:nth-child(1),.kuai_down_8:nth-child(4) {
    margin-bottom: 7.5px;
}

.kuai_down_8:nth-child(2),.kuai_down_8:nth-child(3) {
    margin-bottom: 6px;
}

.kuai_down_8:nth-child(5),.kuai_down_8:nth-child(6),.kuai_down_8:nth-child(7) {
    margin-right: 7px;
}

.kuai_down_9 {
    width: 110px;
    height: 110px;
    margin-right: 7.5px;
    margin-bottom: 7.5px;
}

.kuai_down_9:nth-child(3),.kuai_down_9:nth-child(6),.kuai_down_9:nth-child(9) {
    margin-right: 0px;
}

.kuai_down_9:nth-child(7),.kuai_down_9:nth-child(8),.kuai_down_9:nth-child(9) {
    margin-bottom: 0px;
}

.cont_kuai_shang {
    width: 315px;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 0px 10px rgba(144,144,144,0.3);
    display: flex;
    justify-content: space-between;
    box-sizing: content-box;
    text-align: left;
    margin-bottom: 26.5px;
}

.kuai_shang_left {
    width: 69px;
    height: 69px;
    border: 1px solid #eeeeee;
    border-radius: 3.5px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.kuai_shang_right {
    width: 230px;
}

.kuai_shang_right_title {
    font-size: 14px;
    line-height: 17.5px;
    height: 36px;
    width: 230px;
    letter-spacing: 1px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-bottom: 4px;
}

.kuai_shang_right_down {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.kuai_shang_right_down2 {
    justify-content: flex-end;
}

.shang_right_down_left {
    font-size: 14px;
    color: #ff5050;
    font-family: 'DIN';
    font-weight: 700;
}

.shang_right_down_right {
    height: 29px;
    padding: 0 21.5px;
    font-size: 14px;
    line-height: 29px;
    border: 1px solid #ff5050;
    color: #ff5050;
    border-radius: 15px;
}

.cont_kuai_zan {
    display: flex;
    justify-content: flex-start;
    width: 100px;
}

.cont_kuai_zan_icon {
    width: 17px;
    height: 17px;
    margin-right: 4.5px;
}

.dianfen {
    display: flex;
    justify-content: space-between;
    height: 18px;
    color: #888888;
    font-size: 14px;
    padding-bottom: 24px;
}

.cont_kuai_fenxiang {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100px;
}

.cont_kuai_fenxiang img {
    width: 15px;
    height: 17px;
    margin-right: 6.5px;
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    padding: 15px 0 30px;
    background-color: #fff;
    margin-top: 62.5px;
}

.footer .logo img {
    height: 40px;
    width: 40px;
}

.footer .text {
    margin: 0 15px;
    line-height: 20px;
}

.footer .btn div {
    font-size: 12px;
    background: #ffd93f;
    width: 57.5px;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
}

.footer .btn img {
    width: 10.5px;
    height: 11px;
    margin-right: 4px;
}

/**/
.top__img {
    display: block;
    width: 375px;
    height: 115px;
}

.top__nav {
    display: flex;
    justify-content: center;
    line-height: 61px;
    width: 375px;
    color: #585858;
    font-size: 15px;
    font-weight: 500;
}

.nav {
    display: flex;
    align-items: baseline;
}

.nav:nth-child(2) {
    margin-left: 50px;
}

.nav.active {
    color: #FF411E;
}

.tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
}

.tag>.tag-item {
    background-color: #f0f0f0;
    border-radius: 14px;
    line-height: 27px;
    padding: 0 14px;
    margin-bottom: 13px;
    margin-left: 12px;
    color: #585858;
    font-size: 13px;
    text-align: center;
}

.tag>.tag-item.active {
    color: #FF411E;
    background: rgba(255,65,30,0.08);
}


/*shoplist*/
.shoplist {
    padding: 0 15px;
}

.shoplist-list .item {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 15px;
    box-shadow: 0.5px 0.5px 5.5px 0.5px rgba(0, 0, 0, 0.2);
}

.shoplist-list .item .img {
    border-radius: 4px 4px 0 0;
}

.shoplist-list .msg {
    padding: 15px 15px 15px;
    color: #2a2a2a;
}

.shoplist-list .msg .info .name {
    font-size: 20px;
    font-weight: 500;
    margin-top: 9px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.shoplist-list .msg .info .local {
    font-size: 14px;
    padding-bottom: 15px;
    margin-top: 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.shoplist-list .msg .info .local .lt {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    align-items: center;
    margin-right: 20px;
}

.shoplist-list .msg .info .local .lt .icon {
    margin-right: 5px;
}

.shoplist-list .msg .info .local .lt .adress {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.shoplist-list .msg .info .minbotom {
    padding-bottom: 7.5px;
}

.shoplist-list .msg .goods {
    padding-bottom: 0px;
    font-size: 14px;
    font-weight: 500;
}

.shoplist-list .msg .goods_item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding-top: 20px;
}

.shoplist-list .msg .goods_item .icon {
    font-size: 16px;
    margin-right: 5px;
    color: #e42f16;
}

.shoplist-list .msg .goods_item .intro {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.shoplist-list .goods-more {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: baseline;
    align-items: baseline;
    -webkit-box-pack: justify;
    justify-content: space-between;
    font-weight: normal;
    background-color: #fff;
    font-size: 14px;
    padding: 0 15px 15px;
    border-radius: 0 0 4px 4px;
}

.shoplist-list .goods-more .see {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding-top: 7.5px;
}

.shoplist-list .goods-more .see .icon {
    margin-left: 5px;
    font-size: 10px;
}

</style>