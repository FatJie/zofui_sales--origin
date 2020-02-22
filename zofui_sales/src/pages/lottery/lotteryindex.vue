<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            

            <!-- <div class="quick-tab-wrap ">
                <div class="quick-tab">
                    <div @click="tabChange" class="item" :class="page.pdata.status == item.key ? 'active bg-pri':''" :data-status="item.key" v-for="item in tabList" >{{item.name}}</div>
                </div>
            </div> -->
			
			<div class="ohuadhead" :style="params.ohuad == 1 && showtoptab ? 'position:fixed;top:0;left:0;width:100%;' : ''">
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
            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新" v-scroll="scrolltop">
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                
                <div class="list-wrap" v-if="datalist.length > 0 && !listtype">
                    <div class="lottery-list">
                        <div class="item thin-border" @click="link" :data-url="item.appurl" v-for="item in datalist" >
                            <div class="top">
                                <div class="top_pic image-box __56">
                                    <img v-lazy="item.thumbh">
                                </div>
                                <div class="top_shop color-pri" v-if="item.shopname">{{item.shopname}} 赞助</div>
                            </div>
                            <div class="btm">
                                <div class="btm_tit">{{item.title}}</div>
                                <div class="btm_price fmt-price item_cell_box">
                                    <div class="now color-pri item_cell_flex">价值
                                        <font class="dollar">¥</font>
                                        <font class="price" v-if="item.oldprice > 0">{{item.oldprice}}</font>
                                    </div>
                                    <div class="lottstatus" :class="item.status == 0 && item.isopenlott == 0 ? 'bg-pri' : ''">{{item.btnstr}}</div>
                                </div>
                                <div class="btm-b btm_num">
                                    <div>{{item.opentime}}</div>
                                    <div>{{item.join}}人已参与</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-list" v-if="datalist.length > 0 && listtype">
                    <div class="item thin-border_b" @click="link" :data-url="item.appurl" v-for="item in datalist" >
                        <div class="top">
                            <div class="top_pic image-box" :class="params.othumb == 1 ? '__60' : '__100'">
                                <img mode="aspectFill" :src="params.othumb == 1 ? (item.thumbh ? item.thumbh : item.thumb) : item.thumb">
                            </div>
                            <div class="list-status" :class="{'__end':item.status == 3,'__saled':item.status==1}" v-if="item.status>0"></div>
                        </div>
                        <div class="btm">
                            <div class="btm_tit">
                                <font v-if="item.tag" class="tag bg-pri">{{item.tag}}</font>{{item.title}}
                            </div>
                            <div class="btm-b">
                                <div class="btm-info">
                                    <div class="btm_price fmt-price">
                                        <div class="now color-pri">
                                            <font class="dollar" v-if="item.show_price > 0">¥</font>
                                            <font class="price">{{item.show_price > 0 ? item.show_price : '免费'}}</font>
                                        </div>
                                        <div class="old" v-if="item.oldprice*1 > 0">¥{{item.oldprice}}</div>
                                    </div>
                                    <div class="btm_saled" >{{item.ncon}}：{{item.saled}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </van-list>
          
            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img v-lazy="'http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png'">
                <div>— 暂时还没有数据 —</div>
            </div>
            </van-pull-refresh>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Tab,Tabs,Search } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Tabs.name] : Tabs,
            [Tab.name] : Tab,
			[Search.name] : Search,
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
	  					doo : 'lottery',
	  					op : 'list',
	  					status : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                tabList : [{key:0,name:'全部活动'},{key:1,name:'进行中的'},{key:2,name:'往期活动'}],

                showtoptab : false,
                selecttype : 0,
                tablist : [
                    {name:'抽奖分类',id:4,icon:'zan-icon-arrow',rotate:true},
                    {name:'离我最近',id:1,icon:'zan-icon-arrow',rotate:true},
                    {name:'活动状态',id:2,icon:'zan-icon-arrow',rotate:true},
                    {name:'浏览模式',id:3,icon:'zan-icon-wap-nav',rotate:false},
                ],
                themcolor : '',
                sortindex : 0,
                showselect : false,
                ordertype : [{name:'距离最近',id:0},{name:'参与最多',id:1},{name:'价值最高',id:2}],
                goodstype : [
                    {name:'全部活动',id:0},
                    {name:'进行中的',id:1},
                    {name:'往期活动',id:2},
                ],
                listtype : false,
                sort : [],
                sorttwo : [],
                dev : '',
				searchfor : '',
	  		}
	  	},
        activated:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		
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
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
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
                this.tablist[0].name = '抽奖分类';

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
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                
                var loc = self.$util.getCache('loc');
                if( loc.lat ) self.page.pdata.lat = loc.lat;
                if( loc.lng ) self.page.pdata.lng = loc.lng;
                self.page.pdata.page = 1;
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.sort = res.data.sort;
		                
                        self.themcolor = self.$util.themcolor(res.data.params.style);

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

@import "../../assets/css/a0.css";
@import "../../assets/css/a10.css";
@import "../../assets/css/toptab.css";

.quick-tab-wrap {
    height: 48px;
    margin-bottom: 10px;
}

.quick-tab {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-shadow: 0 0 1px 0 rgba(0,0,0,0.2);
}

.quick-tab .item {
    -webkit-box-flex: 1;
    flex: 1;
    height: 48px;
    font-size: 16px;
    text-align: center;
    line-height: 48px;
    color: #333;
    background-color: #fff;
}

.list-wrap {
    padding: 0px 20px 0;
    margin-top: 10px;
}
.lottery-list .item {
    margin-bottom: 15px;
    border-color: #eee;
    background-color: #fff;
    border-radius: 4px;
}

.lottery-list .item:last-child {
    margin-bottom: 0;
}

.lottery-list .item .top {
    overflow: hidden;
    position: relative;
    border-radius: 2px 2px 0 0;
}

.lottery-list .item .btm {
    padding: 10px 5px;
}

.lottery-list .item .btm-b {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.lottery-list .top_pic {
    border-radius: inherit;
}

.lottery-list .top_shop {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 0 10px;
    font-size: 12px;
    line-height: 26px;
    height: 26px;
    color: #fc9127;
    background: rgba(221, 221, 221, 0.8);
    border-radius: 26px;
}

.lottery-list .btm_tit {
    overflow: hidden;
    margin-bottom: 5px;
    font-size: 15px;
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #2a2a2a;
}

.lottery-list .btm_price {
    margin-bottom: 10px;
}

.lottery-list .btm_price .dollar {
    margin-left: 5px;
    font-size: 20px;
}

.lottery-list .btm_price .price {
    font-size: 21px;
}

.lottery-list .btm_count {
    display: inline-block;
    vertical-align: top;
    height: 18px;
    padding: 0 5px;
    margin-left: 10px;
    font-size: 12px;
    line-height: 18px;
    color: #fc9127;
    border-color: #fc9127;
    border-radius: 7px;
}

.lottery-list .btm_num {
    font-size: 12px;
    color: #b4b4b4;
}
.lottstatus{
    background-color: #ddd;
    padding: 7.5px 20px;
    color: #666;
    border-radius: 15px;
}

</style>