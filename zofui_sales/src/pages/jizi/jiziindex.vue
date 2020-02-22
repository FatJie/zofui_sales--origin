<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="quick-tab-wrap">
                <div class="quick-tab" :style="{top:dev == 'app' ? '60px' : 0}">
                    <div @click="tabChange" class="item" :class="page.pdata.status == item.key ? 'active bg-pri':''" :data-status="item.key" v-for="item in tabList" >{{item.name}}</div>
                </div>
            </div>

            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template v-if="datalist.length > 0">
                <div class="main-list">
                    <div class="item thin-border_b" @click="link" :data-url="item.appurl" v-for="item in datalist" >
                        <div class="top">
                            <div class="top_pic image-box __60">
                                <img mode="aspectFill" v-lazy="item.thumb">
                            </div>
                            <div class="list-status" :class="item.sstatus == 1?'__end':''" v-if="item.sstatus > 0"></div>
                        </div>
                        <div class="btm">
                            <div class="btm_tit">{{item.title}}</div>
                            <div class="btm-b">
                                <div class="btm-info">
                                    <div class="btm_price fmt-price">
                                        {{item.distance}}
                                    </div>
                                    <div class="btm_saled" >参与：{{item.joined}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </template>
            </van-list>
            
            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                <div>— 暂时还没有活动 —</div>
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
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
	  					doo : 'jizi',
	  					op : 'list',
	  					status : 1,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : true,
	  				geting : false,
	  				initget : false,
	  			},
                tabList : [{key:1,name:'进行中的'},{key:2,name:'已结束的'},{key:3,name:'我参与的'}],
                dev : '',
	  		}
	  	},
        activated:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) {
                return false;
            }
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            tabChange(e){
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
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                self.page.pdata.zfid = query.zfid ? query.zfid : 0;
                
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
	                   	self.datalist = res.data.list;
	                   	self.sort = res.data.sort;
		                
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
#main{
    min-height: 100vh;
    background-color: #fff;
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

.quick-tab-wrap {
    height: 48px;
    margin-bottom: 20px;
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
    color: #fff;
    background-color: #424242;
}

.quick-countdown {
    padding-bottom: 20px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    color: #666;
}

.quick-countdown font {
    display: inline-block;
    vertical-align: top;
    width: 20px;
    height: 20px;
    color: #fff;
    background-color: #222;
}

.main-list .item {
    margin-bottom: 15px;
    width: 335px;
    box-shadow: 0.5px 0.5px 5.5px rgba(0,0,0,0.2);
    border-radius: 2.5px;
    overflow: hidden;
}
.main-list .item .btm {
    padding: 10px;
}
.main-list .btm_tit {
    font-size: 13px;
    line-height: 18px;
}



</style>