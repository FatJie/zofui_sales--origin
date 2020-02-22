<template>
	
    <div id="main" :style="{background : params.shopbg ? params.shopbg : '#ffffff'}">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="shoplist">
                <div class="content" style="padding-top: 30rpx;" v-if="params.shopstl == 0">
                    <div class="shoplist-list" v-if="datalist.length > 0">

                        <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                        <div class="item" v-for="item in datalist" >
                            <div @click.prevent="link" :data-url="item.appurl">
                                <div class="img image-box __60">
                                    <img v-lazy="item.cover">
                                </div>
                                <div class="msg">
                                    <div class="info">
                                        <div class="name">
                                            <good :name="item.name" :tag="params.goodtag" :istag="item.isgood"></good>
                                        </div>
                                        <div class="local minbotom" bindtap="location" :data-lat="item.lat/1000000" :data-lng="item.lng/1000000" :data-addname="item.name" :data-address="item.street">
                                            <div class="lt">
                                                <div class="icon iconfont"></div>
                                                <div class="adress">{{item.street}}</div>
                                            </div>
                                            <div class="rt" >{{item.m}}</div>
                                        </div>
                                    </div>
                                    <div class="goods thin-border_t" v-if="item.goods">
                                        <div >
                                            <div v-for="inn in item.goods" class="goods_item" @click.stop="link" :data-url="'/goodinfo?id='+inn.id">
                                                <div class="icon iconfont"></div>
                                                <div class="intro">{{inn.title}}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="goods thin-border_t" v-if="item.cards.length > 0">
                                        <div >
                                            <div v-for="inn in item.cards" class="goods_item" @click.stop="link" :data-url="'/cardinfo?id='+inn.id">
                                                <div class="icon icon-18 iconfont"></div>
                                                <div class="intro">{{inn.name}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </van-list>
                        
                    </div>

                    <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                        <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                        <div>— 暂时还没有信息 —</div>
                    </div>
                </div>

                <div v-if="params.shopstl == 3 || params.shopstl == 5" class="shop_stla">

                    <div class="shoplist-list shoplist-lista" v-if="datalist.length > 0">

                        <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                        <div class="item" :class="{'itema':params.shopstl == 3,'item5':params.shopstl == 5}" v-for="item in datalist" >
                            <div @click="link" :data-url="item.appurl">

                                <div class="bottom-line nocount inner" v-if="params.shopstl == 3">
                                    <div class="top border-thin_b">
                                        <div class="pic">
                                            <img v-lazy="item.headimg">
                                        </div>
                                        <div class="txt">
                                            <div class="tit">
                                                <good :name="item.name" :tag="params.goodtag" :istag="item.isgood"></good>
                                            </div>
                                            <div class="see">人气：{{item.times}}</div>
                                        </div>
                                        <div class="info">
                                            <font class="location">{{item.m}}</font>
                                            <font class="iconfont icon-icon_arrow_right"></font>
                                        </div>
                                    </div>
                                    <div class="msg" v-if="item.goods.length > 0 || item.cards.length > 0">
                                        <div class="goods thin-border_t" v-if="item.goods">
                                            <div >
                                                <div v-for="inn in item.goods" class="goods_item" @click.stop="link" :data-url="'/goodinfo?id='+inn.id">
                                                    <div class="icon iconfont"></div>
                                                    <div class="intro">{{inn.title}}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="goods thin-border_t" v-if="item.cards.length > 0">
                                            <div >
                                                <div v-for="inn in item.cards" class="goods_item" @click.stop="link" :data-url="'/cardinfo?id='+inn.id">
                                                    <div class="icon icon-18 iconfont"></div>
                                                    <div class="intro">{{inn.name}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <template v-if="params.shopstl == 5">
                                    <div class="img image-box __60">
                                        <img :src="item.cover" />
                                        <div class="zanscan icon iconfont icon-dianzan1" > {{item.times}}</div>
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
                                        <div class="goods thin-border_t" v-if="item.cards.length > 0">
                                            <div >
                                                <div v-for="inn in item.cards" class="goods_item" bindtap="navigateto" data-url="/zofui_sales/card/info?id=inn.id">
                                                    <div class="icon icon-18 iconfont"></div>
                                                    <div class="intro">{{item.name}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        </van-list>
                    </div>

                    <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                        <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                        <div>— 暂时还没有信息 —</div>
                    </div>

                </div> 
                <div class="content" v-if="params.shopstl == 4">
                    
                    <van-search v-model="searchshop" class="searchshop" @search="searchshopfn" @clear="clears" :clearable="true" placeholder="请输入名称" shape="round" />

                    <div class="" v-if="datalist.length > 0">
                        <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                            <template v-for="(item,index) in datalist" >
                                <shoplista :item="item" :goodtag="params.goodtag" :isgood="item.isgood"></shoplista>
                            </template>
                        </van-list>
                    </div>

                    <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                        <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png" />
                        <div>— 暂时还没有数据 —</div>
                    </div>

                </div>

            </div>
            
           

        </div>
    </div>
</template>

<script type="text/javascript">
    import { Loading,List,Toast,Dialog,PullRefresh,Search } from 'vant';
    import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
    import shoplista from '../../components/shoplist';
    import good from '../../components/good';
	export default {
        name : 'shoplist',
        components: {
            [List.name] : List,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [Search.name] : Search,
            [PullRefresh.name] : PullRefresh,
            tabbar,shoplista,good
        },
	  	data : function(){
	  		return {
                isrefresh : false,
                sharedata :{},
                disrefresh : false,
                inited : false,
                datalist : [],
                params : {},
                page : {
                    pdata : {
                        doo : 'shop',
                        op : 'list',
                        type : 0,
                        sortid : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                inited : 0,
                showdown : false,
                searchshop : '',
                parents : 0,
	  		}
	  	},
        activated:function(e){

        },
        created:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
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
            tabchange(e){
                var self = this;
                if( e.currentTarget.dataset.status == self.page.pdata.status ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.status = e.currentTarget.dataset.status;
                self.onLoad();
            },
            change(e){
                var self = this;

                if( self.data.ising || ( e.target.dataset.type < 3 && e.target.dataset.type == self.data.page.pdata.type ) ) return false;
                self.data.ising = true;

                self.setData({
                    'page.pdata.type' : e.currentTarget.dataset.type,
                    'page.pdata.page' : 1,
                    'page.isend' : false,
                    'page.waitf' : 0,
                    'page.nodataf' : 0
                });

                app.com.getPage(self,self.data.page,20,function(res){
                    self.setData({
                        datalist : res.data.data.list,
                    });
                    wx.pageScrollTo({
                        scrollTop: 0
                    });
                });

                self.data.ising = false;
            },
            searchshopfn(e){
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.search = e;
                this.onLoad();
            },
            clears(e){
                this.searchshopfn('');
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                self.page.pdata.status = params.status ? params.status : 0;
                self.page.pdata.sortid = params.id ? params.id : 0;
                self.page.pdata.zfid = params.zfid ? params.zfid : 0;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) {
                    self.page.pdata.lat = loc.lat;
                }
                if( loc.lng ) {
                    self.page.pdata.lng = loc.lng;
                }
				self.page.isend = false;
                self.page.geting = false;
				self.page.pdata.page = 1;
				
                self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
                    if( res && res.data ){        
                        
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.datalist = res.data.list;
                        
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        window.document.title = res.data.title;
                        self.$emit('loadmessage',{title:res.data.title});

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

#content{
    min-height: 100vh;
}
.shoplist .content {
    padding: 0 15px;
}
.shoplist .coll {
    height: 68px;
    overflow: hidden;
}

.shoplist-top {
    height: 225px;
}
.shoplist-list{
    padding-top: 20px;
}
.shoplist-list .item {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 15px;
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

.shoplist-tab {
    height: 52px;
    line-height: 52px;
    font-size: 17.5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
}

.shoplist-tab .article {
    margin: 0 12px 0;
    position: relative;
    font-weight: 500;
}

.shoplist-tab .article::before {
    font-size: 12px;
    position: absolute;
    left: -17.5px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'iconfont';
    content: '\e60e';
    transition: all 0.5s;
}

.shoplist-tab .article::after {
    font-size: 12px;
    position: absolute;
    right: -17.5px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'iconfont';
    content: '\e60e';
    transition: all 0.5s;
}

.shoplist-tab .active {
    font-size: 14px;
    transition: all 0.5s;
}

.shoplist-tab .active::before,.shoplist-tab .active::after {
    font-size: 0;
}

.goodslist .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 15px;
}

.goodslist .item::last-child {
    border-bottom: unset;
}

.goodslist .item .pic {
    margin-right: 10.5px;
}

.goodslist .item .pic .img {
    position: relative;
    width: 103.5px;
    height: 82px;
}

.goodslist .item .pic .img img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

.goodslist .item .msg {
    -webkit-box-flex: 1;
    flex: 1;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.goodslist .item .msg .tp,.goodslist .item .msg .mid {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.goodslist .item .msg .mid {
    padding: 8px 0;
}

.goodslist .item .msg .name {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 15px;
    color: #222222;
    font-weight: 500;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.goodslist .item .msg .tips {
    position: relative;
    padding: 0 5px 0 20px;
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.goodslist .item .msg .tips .icon {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    color: #ff985b;
}

.goodslist .item .msg .rule {
    font-size: 12px;
    color: #999999;
    display: flex;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-box-align: start;
    align-items: flex-start;
    -webkit-box-pack: justify;
    justify-content: space-between;
    line-height: 17px;
    overflow: hidden;
    display: -webkit-box;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.goodslist .item .msg .distance {
    font-size: 12px;
    color: #999999;
}

.goodslist .item .msg .btn {
    width: 70px;
    height: 29px;
    font-size: 14px;
    line-height: 29px;
    text-align: center;
    border-radius: 3px;
}

.select {
    padding: 5px 15px 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    color: #222222;
    font-size: 14px;
    background-color: #fff;
}

.select .item {
    padding: 10px 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.select .item .name {
    margin-right: 6px;
}

.select .item .icon {
    color: #aaaaaa;
    font-size: 12px;
}

.opacity {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
}

.opacity .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
}

.opacity .choose {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    background-color: #fff;
}

.opacity .choose .item {
    -webkit-box-flex: 1;
    flex: 1;
}

.opacity .choose .item .name {
    font-size: 14px;
    margin-left: 27.5px;
}

.opacity .choose .item .icon {
    font-size: 12px;
}

.opacity .choose .list {
    max-height: 270px;
    font-size: 13px;
}

.opacity .choose .list .item {
    height: 36px;
    margin: 0 15px;
    line-height: 36px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.opacity .choose .rotate {
    transform: rotateZ(180deg);
}

.none {
    display: none;
}

.top {
    position: relative;
    height: 121px;
    color: #fff;
}

.top .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.top .bg image {
    display: block;
    width: 100%;
    height: 100%;
}

.top .msg {
    position: absolute;
    width: 100%;
    padding: 30px 15px;
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.top .msg .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.top .msg .info .avatar {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    position: relative;
    margin-right: 14px;
}

.top .msg .info .avatar img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 47px;
    height: 47px;
    background-color: #000;
    border-radius: 50%;
}

.top .msg .name .user {
    font-size: 20px;
    margin-bottom: 6.5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.top .msg .name .user .vip {
    padding: 2px 4px;
    text-align: center;
    font-size: 11px;
    border-radius: 4px;
    margin-left: 10px;
    border-color: #fc9127;
    color: #fc9127;
}

.top .msg .name .tip {
    font-size: 12px;
}

.top .msg .btn {
    width: 70px;
    height: 29px;
    font-size: 14px;
    line-height: 29px;
    text-align: center;
    border-radius: 3px;
}

#main {
    min-height: 100vh;
    background-color: #fff;
}

.datelist {
    display: inline-block;
    padding: 15px 15px 0;
    white-space: nowrap;
}

.datelist .item {
    display: inline-block;
    position: relative;
    margin-right: 26px;
}

.datelist .item:last-child {
    margin-right: unset;
}

.datelist .item .week {
    overflow: hidden;
    position: relative;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 13px;
    color: #969696;
    margin-bottom: 6px;
}

.datelist .item .week .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #f4f4f4;
}

.datelist .item .week font {
    position: relative;
}

.datelist .item .date {
    font-size: 12px;
    color: #969696;
    text-align: center;
    padding-bottom: 4px;
}

.datelist .item .remark {
    position: absolute;
    top: -5px;
    right: 0px;
    width: 20px;
    height: 13px;
    font-size: 11px;
    text-align: center;
    border-radius: 6.5px;
    color: #fff;
}

.datelist .item .active .bg {
    opacity: 0.1;
}

/*stylea*/
.shoplista .shoplist-top{
    margin-top: 45px;
}
.shop_stla .shoplist-tab{
    height: inherit;
    line-height: inherit;
    position: fixed;
    padding: 5px 0;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 7;
    border-bottom: 0.5px solid #f7f7f7;
}
.shop_stla .tabitem{
    height: 30px;
    line-height: 30px;
    width: 33.33%;
    text-align:center;
    border-right: 0.5px solid #eee;
    color: #666;
    font-size: 14px;
    font-weight: bold;
}
.shop_stla .tabitem:last-child{
    border-right: 0;
}
.select_box .mask{
    z-index: 6;
}
.select_in{
    position: fixed;
    background-color: #fff;
    width: 100%;
    left: 0;
    top: 40.5px;
    z-index: 7;
    padding: 15px;
}
.select_ina{
    padding: 5px 0 25px 0;
}
.select_ina font{
    font-size: 13px;
    padding: 5px 10px;
    border-radius: 25px;
    color: #666;
    border:0.5px solid #666;
    margin: 0 10px 10px 0;
    display: inline-block;
    min-width: 40px;
    text-align: center;
}

.shoplist-lista{
    margin-top: 10px;
}
.item5{
    margin: 0px 10px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
}
.itema{
    padding: 0px 10px;
    margin-bottom: 0!important;
    margin-top: 20px;
}
.itema .bottom-line{
    overflow: hidden;
    padding: 10px;
    -webkit-box-shadow: 1px 1px 6px rgba(0,0,0,0.1);
    box-shadow: 1px 1px 6px rgba(0,0,0,0.1);
}
.itema .top {
    border-color: #f3f3f3;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 75px;
}

.itema .pic {
    width: 75px;
    height: 75px;
    margin-right: 10px;
    border-radius: 2.5px;
    overflow: hidden;
}
.itema .pic>img {
    width: 100%;
    height: 100%;
}
.itema .txt {
    padding-right: 12px;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    flex-direction: column;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
}
.itema .tit {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    overflow: hidden;
    display: -webkit-box;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

}
.itema .see {
    font-size: 15px;
    color: #969696;
}
.itema .info {
    font-size: 14px;
    text-align: right;
    color: #aeaeae;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    flex-direction: column;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
}
.itema .location {
    vertical-align: middle;
    font-size: 14px;
    color: #aeaeae;
    display: block;
}
.itema .info .more {
    font-size: 12px;
    line-height: 1;
    display: block;
}
.itema .msg{
    padding:10px 0;
}
.itema .goods_item{
    padding-top: 10px!important;
    padding-right: 10px;
}
.searchshop{
    padding: 10px 0!important;
}
.sortbox.tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
}

.sortbox.tag .tag-item {
    background-color: #f0f0f0;
    border-radius: 14px;
    line-height: 27px;
    padding: 0 14px;
    margin-bottom: 13px;
    margin-right: 7px;
    color: #585858;
    font-size: 13px;
    text-align: center;
    display: inline-block;
}

.sortbox.tag .tag-item.active {
    color: #FF411E;
    background: rgba(255,65,30,0.08);
}
.downbox{
    padding: 10px;
    min-height: 100px;
}
</style>