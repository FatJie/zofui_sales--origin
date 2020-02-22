<template>
	
    
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
			
			<div class="ohuadhead" :style="params.ohuad == 1 && showtoptab ? 'position:fixed;top:0;left:0;width:100%;z-index:6' : ''">
			<van-search placeholder="请输入搜索内容" v-model="searchfor" shape="round" :clearable="true" :background="themcolor" @search="searchfn" @clear="clearfn" v-if="!showtoptab" />
            <van-tabs v-model="sortindex" :line-width="0" title-active-color="#ffffff" title-inactive-color="#ffffff"  :background="themcolor">
                <van-tab >
                    <div slot="title" @click="tabChange" class="item" :class="0 == page.pdata.sortid ? ' actsort' : ''" data-status="0" >
                        <font>全部</font>
                    </div>
                </van-tab>
                <van-tab v-for="(item,index) in sort" :key="item.id">
                    <div slot="title" @click="tabChange"  class="item" :class="item.id == page.pdata.sortid ? 'actsort' : ''" :data-status="item.id" :data-index="index+1" >
                        <font>{{item.name}}</font>
                    </div>
                </van-tab>
            </van-tabs>

            <div class="top_select item_cell_box"  :style="showtoptab && params.ohuad == 0?'top:'+ (dev == 'app' ?'60px' : 0) + ';position:fixed;':''">
                <div class="sitem" @click="showselectfn" :data-type="item.id" v-for="item in tablist">
                    {{item.name}}
                    <font class="van-icon van-icon-arrow" :class="selecttype == item.id && showselect ? 'animaterot color-pri' : 'animaterotback'" v-if="item.rotate"></font>
                    <font class="van-icon van-icon-apps-o" :class="listtype ? 'color-pri' : ''" v-else></font>
                </div>
            </div>
			</div>
			
            <div class="top_selecttar" v-if="showselect">
                <div class="mask" catchtouchmove="false" @click="showselectfb"></div>
                <div class="selecttar_body" v-if="selecttype == 1" :style="{top:!showtoptab?'4rem': (params.ohuad == 1 ? '2.5rem':'1.4rem')}">
                    <div class="selecttar_item item_cell_box" @click="sorder" v-for="item in ordertype" :data-type="item.id">
                        <div class="item_cell_flex">{{item.name}}</div>
                        <div v-if="page.pdata.otype == item.id" class="van-icon van-icon-success"></div>
                    </div>
                </div>
                <div class="selecttar_body" v-if="selecttype == 2" :style="{top:!showtoptab?'4rem': (params.ohuad == 1 ? '2.5rem':'1.4rem')}">
                    <div class="selecttar_item item_cell_box" @click="selectgood"  v-for="item in goodstype" :data-type="item.id">
                        <div class="item_cell_flex">{{item.name}}</div>
                        <div v-if="page.pdata.gtype == item.id" class="van-icon van-icon-success"></div>
                    </div>
                </div>
                <div class="selecttar_body" v-if="selecttype == 4" :style="{top:!showtoptab?'4rem': (params.ohuad == 1 ? '2.5rem':'1.4rem')}">
                    <div class="selecttar_item item_cell_box" @click="ssorttwo" :data-type="item.id" v-for="item in sorttwo">
                        <div class="item_cell_flex">{{item.name}}</div>
                        <div v-if="page.pdata.sorttwo == item.id" class="van-icon van-icon-success"></div>
                    </div>
                </div>
            </div>

                <van-pull-refresh v-model="isrefresh" :disabled="disrefresh"  v-scroll="scrolltop" :head-height="80" @refresh="onRefresh" success-text="已刷新">

                <template v-if="datalist.length">
                    <div class="main-list">
                        <div class="item thin-border_b" @click="link" :data-url="item.appurl" v-for="item in datalist" :class="listtype ? 'widthfull' : ''">
                            <div class="top">
                                <div class="top_pic image-box" :class="params.othumb == 1 ? '__60' : '__100'">
                                    <img mode="aspectFill" :src="params.othumb == 1 ? (item.thumbh ? item.thumbh : item.thumb) : item.thumb">
                                </div>
                                <div class="list-status" :class="{'__end' : item.status==3 , '__saled' : item.status==1}" v-if="item.status > 0"></div>
                            </div>
                            <div class="btm">
                                <div class="btm_tit">
                                    <font v-if="item.tag" class="tag bg-pri">{{item.tag}}</font>{{item.title}}
                                </div>
                                <vipprice :params="params" :item="item" stylea="1" />
                                <div class="btm-b">
                                    <div class="btm-info">
                                        <div class="btm_price fmt-price">
                                            <div class="now color-pri">
                                                <font class="dollar" v-if="item.show_price > 0">¥</font>
                                                <font class="price">{{item.show_price > 0 ? item.show_price : '免费'}}</font>
                                            </div>
                                            <div class="old" v-if="(item.show_fx <= 0 && item.fanxm <= 0 && item.userpricejb <= 0) || listtype && item.oldprice > 0" style="display:block;">¥{{item.oldprice}}</div>
                                            <div class="btm_fx bg-pri" v-if="item.show_fx > 0 && item.userpricejb <= 0">赚{{item.show_fx}}</div>
                                            <div class="btm_fx bg-pri" v-if="item.show_fx <= 0 && item.fanxm > 0 && item.userpricejb <= 0">返{{item.fanxm}}</div>
                                            <div class="btm_fx bg-pri" v-if="item.userpricejb > 0">{{item.userpricejb*100/100}} {{params.umname}}</div>
                                        </div>
                                        <div class="btm_saled" >{{item.ncon}}{{item.saled}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                </van-pull-refresh>

                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                    <div>— '暂时还没有数据' —</div>
                </div>

            </van-list>
            

        </div>
    </div>
    
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Cell,CellGroup,Tab,Tabs,Search } from 'vant';
	import tabbar from '../../components/tabbar';
	import vipprice from '../../components/vipprice';
    import wx from 'weixin-js-sdk';

	export default {
        name : 'sortindex',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Cell.name] : Cell,
            [CellGroup.name] : CellGroup,
            [Tabs.name] : Tabs,
            [Tab.name] : Tab,
			[Search.name] : Search,
	    	tabbar,
	    	vipprice
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : false,
                inited : false,
	  			params : {},
	  			sharedata :{},
	  			datalist : [],
	  			sort : [],
                sorttwo : [],
	  			page : {
	  				pdata : {
	  					doo : 'sort',
	  					op : 'list',
	  					sortid : 0,
	  					page : 1,
                        sorttwo : 0,
                        gtype : 0,
                        otype : 0,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                showtoptab : false,
                selecttype : 0,
                tablist : [
                    {name:'商品分类',id:4,icon:'zan-icon-arrow',rotate:true},
                    {name:'离我最近',id:1,icon:'zan-icon-arrow',rotate:true},
                    {name:'全部类型',id:2,icon:'zan-icon-arrow',rotate:true},
                    {name:'浏览模式',id:3,icon:'zan-icon-wap-nav',rotate:false},
                ],
                themcolor : '',
                sortindex : 0,
                showselect : false,
                ordertype : [{name:'距离最近',id:0},{name:'销量最高',id:1},{name:'价格最低',id:2}],
                goodstype : [
                    {name:'全部',id:0},
                    {name:'普通',id:1},
                    {name:'限抢',id:2},
                    {name:'拼单',id:3},
                    {name:'减价',id:4},
                    {name:'报名',id:5},
                    {name:'抽奖',id:6},
                    {name:'秒杀',id:7},
                ],
                listtype : false,
                dev : '',
				searchfor : '',
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
	  		scrolltop(e){
                if( e >= 40 ){
                    this.showtoptab = true;
                }else{
                    this.showtoptab = false;
                }
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
            tabChange(e){
            	var self = this;
            	if( e.currentTarget.dataset.status == self.page.pdata.sortid )  return false;
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.sortid = e.currentTarget.dataset.status;
                this.page.pdata.sorttwo = 0;
                this.tablist[0].name = self.params.goodbname+'分类';
                this.sortindex = e.currentTarget.dataset.index;

                for (var i = 0; i < self.sort.length; i++) {
                    if( self.sort[i].id == e.currentTarget.dataset.status ){
                        self.sorttwo = self.sort[i].down;
                    }
                }

                this.onLoad();
            },
            searchfn(e){
                var self = this;
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.search = e;
                this.onLoad();
            },
            clearfn(e){
                this.searchfn('');
            },
            sorder(e){
                var self = this;
                var otype = e.currentTarget.dataset.type;

                if( otype == self.page.pdata.otype )  return false;
                this.datalist = [];
                this.showselect = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.otype = otype;

                for (var i = 0; i < self.ordertype.length; i++) {
                    if( self.ordertype[i].id == otype ){
                        self.tablist[1].name = self.ordertype[i].name;
                    }
                }

                this.onLoad();
            },
            selectgood(e){
                var self = this;
                var gtype = e.currentTarget.dataset.type;
                if( gtype == self.page.pdata.gtype )  return false;
                this.datalist = [];
                this.showselect = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.gtype = gtype;

                for (var i = 0; i < self.goodstype.length; i++) {
                    if( self.goodstype[i].id == gtype ){
                        self.tablist[2].name = self.goodstype[i].name;
                    }
                }

                this.onLoad();
            },
            ssorttwo(e){
                var self = this;
                var sort = e.currentTarget.dataset.type;
                if( sort == self.page.pdata.sorttwo )  return false;
                this.datalist = [];
                this.showselect = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.sorttwo = sort;

                for (var i = 0; i < self.sorttwo.length; i++) {
                    if( self.sorttwo[i].id == sort ){
                        self.tablist[0].name = self.sorttwo[i].name;
                    }
                }

                this.onLoad();
            },
            showselectfn(e){
                if( e.currentTarget.dataset.type == 1 ){
                    this.showselect = this.selecttype == 1 &&  this.showselect ? false : true;
                    this.selecttype  = 1;
                }else if(e.currentTarget.dataset.type == 2){
                    this.showselect = this.selecttype == 2 &&  this.showselect ? false : true;;
                    this.selecttype  = 2;
                }else if(e.currentTarget.dataset.type == 3){
                    this.showselect = false;
                    this.listtype  = !this.listtype;
                }else if(e.currentTarget.dataset.type == 4){
                    this.showselect = this.selecttype == 4 &&  this.showselect ? false : true;
                    this.selecttype  = 4;
                }
            },
            showselectfb(){
                this.showselect = !this.showselect;
            },
            onPageScroll(e){
                if( e.scrollTop > 100 ){
                    this.setData({
                        showtoptab : false
                    })
                }else{
                    this.setData({
                        showtoptab : true
                    })
                }
            },
            onReachBottom : function(){
                var self = this;
                app.com.getPage(self,self.data.page,20,function(res){
                    self.setData({
                        datalist : self.data.datalist.concat(res.data.data.list)
                    });
                });
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                self.page.pdata.sortid = query.status ? query.status : 0;
                self.page.pdata.sorttwo = query.sorttwo ? query.sorttwo : 0;
                self.page.pdata.tag = query.tag ? query.tag : 0;

                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.page.pdata.lat = loc.lat;
                if( loc.lng ) self.page.pdata.lng = loc.lng;
                self.page.isend = false;
                self.page.geting = false;
				self.page.pdata.page = 1;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){       
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.listtype = self.params.opail == 1 ? true : false;
	                   	self.datalist = res.data.list;
	                   	self.sort = res.data.sort;
		                self.themcolor = self.$util.themcolor(res.data.params.style);
                        self.tablist[0].name = res.data.params.goodbname+'分类';
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        
	                	self.inited = 2;

                        if( query.sorttwo > 0 ){
                            for (var i = 0; i < res.data.sort.length; i++) {
                                for (var j = 0; j <  res.data.sort[i].down.length; j++) {
                                    if( query.sorttwo == res.data.sort[i].down[j].id ){
                                        self.sorttwo = res.data.sort[i].down;
                                        self.page.pdata.sortid = res.data.sort[i].id;
                                        
                                    }
                                }
                            }
                        }
                        if( query.status > 0 ){
                            for (var i = 0; i < res.data.sort.length; i++) {
                                if( query.status == res.data.sort[i].id ){
                                    self.sorttwo = res.data.sort[i].down;
                                }
                            }
                        }

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

@import "../../assets/css/a0.css";
@import "../../assets/css/a10.css";
@import "../../assets/css/toptab.css";

.cate-wrap {
    margin-bottom: 15px;
    height: 40px;
}

.b2c-swiper {
    height: 150px;
    margin-bottom: 15px;
}

.b2c-swiper swiper-item {
    padding: 0 20px;
    box-sizing: border-box;
}

.b2c-swiper swiper-item img {
    display: block;
    width: 100%;
    height: 150px;
    border-radius: 2px;
}
.btm-save{
	margin-top: -5px;
}

.scroll-wrap {
    position: relative;
    height: 40px;
}

.scroll-wrap .scroll {
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
    height: 40px;
    background-color: #fff;
    border-bottom: 0.5px solid #eee;
}

.scroll-wrap .scroll:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 0;
    height: 100%;
    box-shadow: 0 0 7.5px 10px #fff;
}

.top-scroll {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    overflow-x: auto;
}

.top-scroll .item {
    -webkit-box-flex: 1;
    flex: 1;
    height: 40px;
    padding: 0 10px;
    border-color: transparent;
    font-size: 14px;
    text-align: center;
    line-height: 37px;
}

.top-scroll .item font {
    position: relative;
    display: inline-block;
    vertical-align: top;
    padding: 0 5px;
    box-sizing: border-box;
    border-color: inherit;
    white-space: nowrap;
}

.main-list .btm_tit {
    font-size: 13px;
    line-height: 18px;
}

.main-list {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20px;
}

.main-list .item {
    margin-bottom: 15px;
    width: 160px;
}

.main-list .item:nth-last-child(1):after,.main-list .item:nth-last-child(2):after {
    visibility: hidden;
}

.main-list .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px;
}

.main-list .item .btm {
    padding: 15px 0 10px;
}

.main-list .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: end;
    align-items: flex-end;
}

.main-list .item .btm-info {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.main-list .btm_tit {
    height: 36px;
    margin-bottom: 10px;
    font-weight: 400;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #2a2a2a;
}

.main-list .btm_tit .tag {
    display: inline-block;
    vertical-align: top;
    padding: 0 7.5px;
    margin-right: 10px;
    font-size: 10px;
    text-align: center;
    line-height: inherit;
    color: #fff;
    border-radius: 1px;
}

.main-list .btm_price .old {
    display: none;
}

.main-list .btm_saled {
    margin-left: 10px;
    font-size: 12px;
    color: #b4b4b4;
}
.widthfull{
    width: 340px!important;
}

</style>