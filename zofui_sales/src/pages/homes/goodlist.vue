<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <div class="cate-wrap">
                <div class="scroll-wrap">
                    <div scrollX class="scroll" :style="{top:dev=='app' ? '60px' : 0}">
                        <div class="top-scroll">
                            <div @click="tabChange" class="item" :class="0 == page.pdata.status ? 'color-pri border-pri' : ''" data-status="0"  >
                                <font>全部</font>
                            </div>
                            <div @click="tabChange" class="item" :class="item.id == page.pdata.status ? 'color-pri border-pri' : ''" :data-status="item.id"  v-for="item in sort" :key="item.id">
                                <font>{{item.name}}</font>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <van-pull-refresh v-model="isrefresh" :head-height="80" @refresh="onRefresh" :disabled="disrefresh" success-text="已刷新">
                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">

                <template v-if="datalist.length > 0">

                    <div class="main-list">
                        <div class="item thin-border_b" @click="link" :data-url="item.appurl" v-for="item in datalist" :key="item.id">
                            <div class="top">
                                <div class="top_pic image-box " :class="params.othumb == 1 ? '__60' : '__100'">
                                    <img  v-lazy="params.othumb == 1 ? (item.thumbh ? item.thumbh : item.thumb) : item.thumb">
                                </div>
                            </div>
                            <div class="btm">
                                <div class="btm_tit">{{item.title}}</div>

                                <vipprice :params="params" :item="item" :stylea="1" />

                                <div class="btm-b">
                                    <div class="btm-info">
                                        <div class="btm_price fmt-price">
                                            <div class="now color-pri">
                                                <font class="dollar" >¥</font>
                                                <font class="price">{{item.show_price}}</font>
                                            </div>
                                            <div class="old" style="display:block;" v-if="listtype && item.oldprice >0">¥{{item.oldprice}}</div>
                                        </div>
                                        <div class="btm_saled" >已售：{{item.saled}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                </template>
                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                    <div>— 暂时还没有数据 —</div>
                </div>
                </van-list>
            </van-pull-refresh>

        	
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import vipprice from '../../components/vipprice';
    import wx from 'weixin-js-sdk';
    
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	tabbar,vipprice
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : true,
                inited : false,
	  			params : {},
	  			cardinfo : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			page : {
	  				pdata : {
	  					doo : 'sort',
	  					op : 'list',
	  					status : 0,
	  					page : 1,
                        type : 1,
                        lat : 0,
                        lng : 0,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                sort : [],
                dev : '',
                listtype : false,
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
                this.disrefresh = !e;
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
                if( e.currentTarget.dataset.status == self.page.pdata.status ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.status = e.currentTarget.dataset.status;
                self.onLoad();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                self.dev = self.$util.dev();
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

                        self.$util.share(wx,self.sharedata);
	                	self.inited = 2;
                        if( !loc ){
                            self.$util.getLocation(function(){
                                self.initData();
                            },self.params.tenkey,wx)
                        }
                        
                        self.$emit('loadmessage',{title:'列表'});

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
.cate-wrap {
    margin-bottom: 15px;
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

</style>