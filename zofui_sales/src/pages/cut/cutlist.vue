<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
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
            <template v-if="datalist.length>0">
                <div  v-if="!listtype" class="cutlist" @click="link" :data-url="item.appurl" v-for="item in datalist" >
                    <div class="item cutlist-list">
                        <div class="top">
                            <div class="img image-box __60">
                                <img v-lazy="item.thumbh">
                            </div>
                            <div class="divs">浏览量：{{item.scan}}</div>
                        </div>
                        <div class="btm">
                            <div class="title">{{item.title}}</div>
                            <div class="msg" v-if="item.joinlist">
                                <div class="pic">
                                    <img v-lazy="userpic_item.headimg" v-if="0<=userpic_index<7" v-for="(userpic_item,userpic_index) in item.joinlist">
                                    <div class="overflow" v-if="item.joinlist.length > 7">...</div>
                                </div>
                                <div class="total" v-if="item.join > 0">已有{{item.join}}人参与活动</div>
                            </div>
                            <div class="info">
                                <div class="price">
                                    <div class="now color-pri" v-if="item.show_price*1 <= 0">
                                        <font>底价</font>免费</div>
                                    <div class="now color-pri" v-else>
                                        <font>底价</font>
                                        <font class="small color-pri">¥</font>{{item.show_price}}
                                    </div>
                                    <div class="old" v-if="item.oldprice*1 > 0">原价¥{{item.oldprice}}</div>
                                </div>
                                <div class="btn bg-end" v-if="item.status == 1">已售罄</div>
                                <div class="btn bg-end" v-else-if="item.status == 2">活动未开始</div>
                                <div class="btn bg-end" v-else-if="item.status == 3">活动已结束</div>
                                <div class="btn bg-pri" v-else>{{item.btn}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="main-list" v-if="listtype">
                    <div class="item thin-border_b" @click="link" :data-url="item.appurl" v-for="item in datalist" >
                        <div class="top">
                            <div class="top_pic image-box " :class="params.othumb == 1 ? '__60' : '__100'">
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

            </template>
            </van-list>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
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
	  					doo : 'cut',
	  					op : 'list',
	  					status : 0,
	  					page : 1,
                        zfid : 0,
                        sortid : 0,
                        sorttwo : 0,
                        gtype : 0,
                        otype : 0,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                Menu: [{
                    url: "/",
                    iconPath: "/images/tabbar01.png",
                    selectedIconPath: "/images/tabbar01_on.png",
                    title: "首页",
                }, {
                    url: "/cutlist",
                    iconPath: "/images/tabbar06.png",
                    selectedIconPath: "/images/tabbar06_on.png",
                    title: "砍价"
                }, {
                    url: "/cutmylist",
                    iconPath: "/images/tabbar07.png",
                    selectedIconPath: "/images/tabbar07_on.png",
                    title: "我的"
                }],
                showtoptab : false,
                selecttype : 0,
                tablist : [
                    {name:'减价分类',id:4,icon:'zan-icon-arrow',rotate:true},
                    {name:'离我最近',id:1,icon:'zan-icon-arrow',rotate:true},
                    {name:'减价状态',id:2,icon:'zan-icon-arrow',rotate:true},
                    {name:'浏览模式',id:3,icon:'zan-icon-wap-nav',rotate:false},
                ],
                themcolor : '',
                sortindex : 0,
                showselect : false,
                ordertype : [{name:'距离最近',id:0},{name:'参与最多',id:1},{name:'底价最低',id:2}],
                goodstype : [
                    {name:'进行中的',id:1},
                    {name:'已经结束',id:2},
                    {name:'还未开始',id:3},
                ],
                listtype : false,
                sort : [],
                sorttwo : [],
                dev : '',
				searchfor : '',
	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		//this.$emit('loadmessage',false);
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
                this.tablist[0].name = '减价分类';

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

#main {
    background-color: #fff;
    min-height: 100vh;
}

.cutlist {
    padding: 15px 15px 0;
}

.cutlist .item {
    background-color: #fff;
    border-radius: 4px;
}

.cutlist-list .top {
    position: relative;
    height: 206.5px;
}

.cutlist-list .top .img img {
    border-radius: 4px 4px 0 0;
}

.cutlist-list .top .divs {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 12px;
    color: #fff;
    background-color: rgba(0,0,0,0.6);
    padding: 0 12px;
    line-height: 25px;
    border-radius: 12.5px;
}

.cutlist-list .btm {
    padding: 10px 15px;
    border-radius: 0 0 4px 4px;
}

.cutlist-list .btm .title {
    font-size: 15px;
}

.cutlist-list .btm .msg {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    margin: 5px 0 14px;
}

.cutlist-list .btm .msg .pic {
    -webkit-box-flex: 1;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.cutlist-list .btm .msg .pic img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: -5px;
}

.cutlist-list .btm .msg .pic img:first-child {
    margin-left: unset;
}

.cutlist-list .btm .msg .pic .overflow {
    width: 20px;
    height: 20px;
    line-height: 10px;
    border-radius: 50%;
    background-color: #bfbfbf;
    text-align: center;
    margin-left: -5px;
    color: #fff;
}

.cutlist-list .btm .msg .total {
    font-size: 12px;
    color: #7d7d7d;
}

.cutlist-list .btm .info {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    font-size: 12px;
}

.cutlist-list .btm .info .price {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: baseline;
    align-items: baseline;
}

.cutlist-list .btm .info .price .now {
    font-size: 17px;
    margin-right: 10px;
}

.cutlist-list .btm .info .price .now font {
    font-size: 12px;
}

.cutlist-list .btm .info .price .now .small {
    margin-right: unset;
}

.cutlist-list .btm .info .price .old {
    text-decoration: line-through;
    color: #7d7d7d;
}

.cutlist-list .btm .info .btn {
    width: 75px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    color: #fff;
    border-radius: 2px;
}

.cutlist-list .btm .info .bg-end {
    background-color: #959595;
}
</style>