<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2" :style="{'background-color' : params.shopstl == 0 && params.shopbg ? params.shopbg : '#ffffff'}">

            <subtip :params="params"></subtip>
            
        	<div class="shop_stla" v-if="params.shopstl == 3 || params.shopstl == 5">
	            <div class="shoplist-tab" >
	                <div @click="link" data-url="/sortsearch?from=shop" class="tabitem">搜索{{params.shopbname}}</div>
	                <div @click="stype" data-type="2" class="tabitem" :class="sstype == 2 ? 'color-pri' : ''">{{params.shopbname}}分类</div>
	                
                    <div @click="stype" data-type="1" class="tabitem" :class="sstype == 1 ? 'color-pri' : ''">{{params.shopbname}}排序</div>
	            </div>
        	</div>

            <van-pull-refresh v-model="isrefresh" :head-height="80" @refresh="onRefresh" :disabled="disrefresh" success-text="已刷新">
                <!-- <subqr params="{{params.subqr}}"></subqr> -->
                <div class="shoplist" :class="params.shopstl == 0 ? '' : 'shoplista'" >
                    <div class="shoplist-top" v-if="params.shopstl == 0">
                        <div class="image-box __60">
                            <img :src="params.shoptop" />
                        </div>
                    </div>
                    <div class="content" v-if="params.shopstl == 0">
                        <div class="shoplist-tab" style="color:#fff;">
                            <div @click="change(1)" data-type="1" class="article" :class="page.pdata.type == 1 ?'color-pri':'active'">推荐</div>
                            <div @click="change(2)" data-type="2" class="article" :class="page.pdata.type == 2 ?'color-pri':'active'">销量</div>
                            <div @click="change(0)" data-type="0" class="article" :class="page.pdata.type == 0 ?'color-pri':'active'">附近</div>
                        </div>
                        <div class="shoplist-list" v-if="datalist.length > 0">
                        	<van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                            <div class="item" v-for="item in datalist" :key="item.id">
                                <router-link :to="item.appurl">
                                    <div class="img image-box __60">
                                        <img :src="item.cover" />
                                    </div>
                                    <div class="msg">
                                        <div class="info">
                                            <div class="name">
                                                <good :name="item.name" :tag="params.goodtag" :istag="item.isgood"></good>
                                            </div>
                                            <div class="local minbotom" bindtap="location" data-lat="item.lat" data-lng="item.lng" data-addname="item.name" data-address="item.street">
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
                                </router-link>
                            </div>
                            </van-list>
                        </div>


                        <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                            <image class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png"></image>
                            <div>— 暂时还没有信息 —</div>
                        </div>
                    </div>

                    <div v-if="params.shopstl == 3 || params.shopstl == 5" class="shop_stla">

                        <div class="select_box" v-if="sstype > 0">
                            <div class="mask" @click="hideselect"  ></div>
                            <div class="select_in">
                                <div v-if="sstype == 1" class="select_ina">
                                    <font @click="sorder" :class="page.pdata.type == 0 ? 'color-pri border-pri' : ''"  data-o="0">附近优先</font>
                                    <font @click="sorder" :class="page.pdata.type == 2 ? 'color-pri border-pri' : ''" data-o="2">销量最高</font>
                                    <font @click="sorder" :class="page.pdata.type == 3 ? 'color-pri border-pri' : ''" data-o="3">人气最高</font>
                                    <font @click="sorder" :class="page.pdata.type == 1 ? 'color-pri border-pri' : ''" data-o="1">热门推荐</font>
                                </div>
                                <div class="select_ina" v-if="sstype == 2">
                                    <font @click="ssort" data-sid="0" :class="page.pdata.sortid == 0 ? 'color-pri border-pri' : ''">全部分类</font>
                                    <font v-for="(inn,iindex) in sort" :key="iindex" @click="ssort" data-type="1" :data-sid="inn.id" :class="page.pdata.sortid == inn.id ? 'color-pri border-pri' : ''">{{inn.name}}</font>
                                </div>
                            </div>
                        </div>

                        <div class="shoplist-list shoplist-lista" >

                            <div class="tag sortbox" :class="{'sortbox5':params.shopstl == 5}" v-if="down.length > 0" >
                                <div @click="ssort" class="tag-item" :class="page.pdata.sorttwo == 0?'color-pri':''" data-type="1" :data-sid="page.pdata.sortid" data-stwo="0" >全部</div>
                                <div @click="ssort" class="tag-item" :class="page.pdata.sorttwo == item.id?'color-pri':''"  :data-sid="page.pdata.sortid"  :data-stwo="item.id" data-type="1" v-for="item in down" :key="item.id">{{item.name}}</div>
                            </div>

                            <template v-if="datalist.length>0 || page.waitf">
                        	<van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                            <div class="item " :class="{'itema':params.shopstl == 3,'item5':params.shopstl == 5}" v-for="item in datalist" >
                                <router-link :to="item.appurl">

                                    <div class="bottom-line nocount inner" v-if="params.shopstl == 3">
                                        <div class="top border-thin_b">
                                            <div class="pic">
                                                <img :src="item.headimg" />
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
                                                    <div v-for="inn in item.goods" class="goods_item" bindtap="navigateto" data-url="/zofui_sales/pages/good/good?id=inn.id">
                                                        <div class="icon iconfont"></div>
                                                        <div class="intro">{{inn.title}}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="goods thin-border_t" v-if="item.cards.length > 0">
                                                <div >
                                                    <div v-for="inn in item.cards" class="goods_item" bindtap="navigateto" data-url="/zofui_sales/card/info?id=item.id">
                                                        <div class="icon icon-18 iconfont"></div>
                                                        <div class="intro">{{item.name}}</div>
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
                                                <div class="name">
                                                    <good :name="item.name" :tag="params.goodtag" :istag="item.isgood"></good>
                                                </div>
                                                <div class="local minbotom" bindtap="location" data-lat="item.lat" data-lng="item.lng" data-addname="item.name" data-address="item.street">
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

                                </router-link>
                            </div>
                           	</van-list>
                            </template>

                        </div>

                        <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                            <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png" />
                            <div>— 暂时还没有信息 —</div>
                        </div>

                    </div>

                    <div class="content" v-if="params.shopstl == 4">
                        
                        <van-search v-model="searchshop" class="searchshop" @search="searchshopfn" @clear="clears" :clearable="true" placeholder="请输入名称" shape="round" />

                        <div class="tag sortbox" v-if="sort.length > 0">
                            <div @click="ssort" class="tag-item" :class="page.pdata.sortid == 0?'color-pri':''"  data-sid="0" data-stwo="0" >全部</div>
                            <div @click="showsort" class="tag-item" :class="page.pdata.sortid == item.id?'color-pri':''"  :data-sid="item.id" v-for="item in sort" :key="item.id">{{item.name}}</div>
                        </div>

                        <div class="shoplist-list" v-if="datalist.length > 0">
                            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                                <template v-for="(item,index) in datalist" >
                                    <shoplist :item="item" :goodtag="params.goodtag" :isgood="item.isgood"></shoplist>
                                </template>
                            </van-list>
                        </div>

                        <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                            <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png" />
                            <div>— 暂时还没有数据 —</div>
                        </div>

                        <van-popup v-model="showdown" bind:close="onClose" position="top" bind:click-overlay="hidedown">
                            <div class="downbox">
                                <div class="tag sortbox" >
                                    <div v-for="(item,index) in sort" :key="index" v-if="parents == item.id">
                                        <div @click="ssort" class="tag-item" :class="page.pdata.sorttwo == 0 && page.pdata.sortid == item.id ?'color-pri':''" :data-sid="parents" data-stwo="0" >全部</div>
                                        <div @click="ssort" class="tag-item" :class="page.pdata.sorttwo == inn.id?'color-pri':''" :data-sid="parents" :data-stwo="inn.id" v-for="(inn,idx) in item.down"  :key="inn.id" >{{inn.name}}</div>
                                    </div>
                                </div>
                            </div>
                        </van-popup>

                    </div>

                    <!-- <include src="/zofui_sales/common/join.wxml"/> -->
                </div>
            </van-pull-refresh>

            <shopjoin v-if="params.shpjoin == 0" :isshow="params.idxjoin == 0" :params="params"></shopjoin>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup,Search } from 'vant';
	import tabbar from '../../components/tabbar';
    import subtip from '../../components/subtip';
    import shopjoin from '../../components/shopjoin';
    import wx from 'weixin-js-sdk';
    import shoplist from '../../components/shoplist';
    import good from '../../components/good';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Search.name] : Search,
	    	tabbar,subtip,shopjoin,shoplist,good
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : false,
                inited : false,
	  			params : {},
	  			cardinfo : {},
	  			userinfo : {},
	  			sharedata :Object,
                membersnum : 0,
                showCardBenefit : false,
	  			allcard : [],
                cvisible : false,
                sstype : 0,
	  			datalist : [],
	  			page : {
	  				pdata : {
	  					doo : 'shop',
	  					op : 'list',
	  					type : 0,
	  					page : 1,
                        sortid : '',
                        sorttwo:'',
                        search : '',
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                showdown : false,
                searchshop : '',
                parents : 0,
                sort: [],
                down : [],
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
	  	beforeRouteLeave(to, from, next) {
	    	document.querySelector('body').setAttribute('style', '');
	    	next();
  		},
	  	methods: {
            scrolltop(e){
                this.disrefresh = !e;
            },
            onRefresh(){
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            change(index){
                var self = this;
                if( index == self.page.pdata.type ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.type = index;
                self.onLoad();
            },
            hideselect(){
                this.sstype = 0;
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            stype(e){
            	this.sstype = e.currentTarget.dataset.type;
            },
            sorder(e){
            	if( e.currentTarget.dataset.o == this.page.pdata.type ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.type = e.currentTarget.dataset.o;
                this.onLoad();
            },
            ssort(e){
            	//if( e.currentTarget.dataset.sid == this.page.pdata.sortid ) return false;
                var self = this;
                var down = [];
                if( e.currentTarget.dataset.type == 1 ){
                    for (var i = 0; i < self.sort.length; i++) {
                        if( self.sort[i].id == e.currentTarget.dataset.sid ){
                            down = self.sort[i].down ? self.sort[i].down : [];
                        }
                    }
                }

                this.datalist = [];
                this.isbot = false;
                self.down = down;
                this.sstype = 0;
                this.showdown = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.sortid = e.currentTarget.dataset.sid;
                this.page.pdata.sorttwo = e.currentTarget.dataset.stwo ? e.currentTarget.dataset.stwo : 0;
                this.page.pdata.search = '';
                this.onLoad();
            },
            searchshopfn(e){
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.sortid = 0;
                this.page.pdata.sorttwo = 0;
                this.page.pdata.search = e;
                this.onLoad();
            },
            hidedown(){
                this.showdown = false;
            },
            showsort(e){
                this.showdown = true;
                this.parents = e.currentTarget.dataset.sid;
            },
            clears(e){
                this.searchshopfn('');
            },
            initData(){
                var self = this;
                var query = this.$route.query;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.page.pdata.lat = loc.lat;
                if( loc.lng ) self.page.pdata.lng = loc.lng;
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
	                   	self.sort = res.data.sort;

		                if( self.params.shopstl == 0 ){
		                    var color = self.params.shopbg ? self.params.shopbg : '#000000';
		                    document.querySelector('body').setAttribute('style', 'background-color:'+color);

		                }else{
		                    document.querySelector('body').setAttribute('style', 'background-color:#ffffff');
		                }

                        self.inited = 2;
                        window.document.title = self.params.title;
                        self.$route.meta.title = self.params.title;
                        
                        self.$util.share(wx,self.sharedata);
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
body {
    background-color: #000;
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

.top .bg img {
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

body{
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
}
.select_ina{
    padding: 5px 5px 25px 5px;
}
.select_ina font{
    font-size: 13px;
    padding: 5px 10px;
    border-radius: 25px;
    color: #333;
    border:1px solid #c1c1c1;
    margin: 0 10px 10px 0;
    display: inline-block;
    min-width: 60px;
    text-align: center;
    float: left;
}

.shoplist-lista{
    margin-top: 50px;
}
.item5{
    margin: 0px 10px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
}
.sortbox5{
    padding: 0 10px;
}
.itema{
    padding: 0px 10px;
    margin-bottom: 0!important;
    margin-top: 20px;
}
.itema .bottom-line{
    overflow: hidden;
    padding: 10px;
    -webkit-box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
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
    padding-right: 14px;
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
    font-size: 14px;
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
    font-size: 14px;
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
    min-width: 60px;
}

.sortbox.tag .tag-item.active {
    color: #FF411E;
    background: rgba(255,65,30,0.08);
}
.downbox{
    padding: 10px;
    min-height: 100px;
}
.zanscan{
    position:absolute;
    top:0;
    right:0;
    background-color:rgba(0,0,0,0.8);
    color:#fff;
    padding: 3px 10px;
    border-radius: 0 0 0 10px;
}
</style>