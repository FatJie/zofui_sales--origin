<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="order-tags-wrap">
                <div class="order-tags">
                    <div @click="tabChange" class="item" :data-status="item.status" v-for="item in tabMenu" >
                        <font class="name" :class="item.status == page.pdata.status ? 'color-pri':''">{{item.name}}</font>
                        <div class="botline" :class="item.status == page.pdata.status ? 'bg-pri':''"></div>
                    </div>
                </div>
            </div>

            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template v-if="datalist.length > 0">
                <div class="order-list">
                    <div class="item" v-for="item in datalist" >
                        <div class="top thin-border_b">
                            <font class="top-code">订单号：{{item.orderid}}</font>
                            <div class="top-statu color-pri">{{item.statusstr}}</div>
                        </div>
                        <div class="mes thin-border_b" v-if="item.type == 8">
                            <div class="mes-name">
                                <div class="tit">区域会员卡提成</div>
                            </div>
                        </div>
                        <div class="mes thin-border_b" v-else-if="item.type == 7">
                            <div class="mes-name">
                                <div class="tit">商户收款提成</div>
                            </div>
                        </div>
                        <div class="mes thin-border_b" v-else-if="item.type == 1">
                            <div class="mes-name">
                                <div class="tit">商户入驻支付提成</div>
                            </div>
                        </div>
                        <div class="mes thin-border_b" v-else-if="item.type == 3">
                            <div class="mes-name">
                                <div class="tit">商户续期提成</div>
                            </div>
                        </div>
                        <div class="mes thin-border_b" v-else>
                            <div class="pic-box ">
                                <div class="image-box __100">
                                    <img v-lazy="item.thumb">
                                </div>
                            </div>
                            <div class="mes-name">
                                <div class="tit">{{item.title}}</div>
                            </div>
                        </div>
                        <div class="bot">
                            <div>
                                <div class="price" v-if="item.type != 2">
                                    共{{item.type == 8 ? 1 : item.num}}件，商户收入
                                    <font class="num color-pri">¥{{item.shopfee}}</font>
                                    ，提成
                                    <font class="num color-pri">¥{{item.agentfee}}</font>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </template>
            </van-list>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/45326/27/15063/8428/5dbeed0cEb54ebcdf/e5a1acfbf5d9d8af.png">
                <div>— 暂时没有相关订单 —</div>
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
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
                tabMenu :  [{
                    name: "全部",
                    status: 0
                }, {
                    name: "已结算",
                    status: 1
                }, {
                    name: "未结算",
                    status: 2
                }, {
                    name: "已失效",
                    status: 3
                }],
	  			page : {
	  				pdata : {
	  					doo : 'agent',
	  					op : 'orderlist',
                        type : '',
	  					status : 0,
                        shopid : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},

	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		this.$emit('loadmessage',false);
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
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    pid : params.pid ? params.pid : 0,
                }
                self.page.pdata.type = params.type ? params.type : '';
                self.page.pdata.status = params.status ? params.status : '';
                self.page.pdata.shopid = params.shopid ? params.shopid : '';

	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.sort = res.data.sort;
		                
	                	self.inited = 2;
	                }else{
	                	self.$toast(res.message);
	                }
	                self.isrefresh = false;
	            });
            },
	  		onLoad() {
	  			var self = this;
				self.page.isend = false;
                self.page.geting = false;
				
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
    background: #f8f8f8;
    color: #343434;
}

.order-tags-wrap {
    height: 48px;
}

.order-tags {
    height: 48px;
    line-height: 48px;
    position: fixed;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
    background-color: #fff;
    box-shadow: 0 0 1.5px 0 rgba(0,0,0,0.2);
}

.order-tags .item {
    font-size: 14px;
    text-align: center;
    position: relative;
    width: 25%;
}

.order-tags .item .botline {
    position: absolute;
    height: 2px;
    width: 23px;
    left: 50%;
    margin-left: -11.5px;
    bottom: 0px;
}

.order-list .item {
    background: white;
    font-size: 12px;
    margin-top: 12px;
}

.order-list .item .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 10px 15px;
    font-size: 12px;
}

.order-list .item .top .top-code {
    font-size: 13.5px;
}

.order-list .item .top .top-statu {
    font-size: 12px;
}

.order-list .item .mes {
    padding: 11px 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.order-list .item .mes .pic-box {
    width: 65px;
    margin-right: 13px;
    flex-shrink: 0;
}

.order-list .item .mes .mes-name {
    -webkit-box-flex: 1;
    flex: 1;
}

.order-list .item .mes .mes-name .tit {
    height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    overflow: hidden;
    font-size: 14px;
    line-height: 20px;
}

.order-list .item .mes .mes-name .attrs {
    margin-top: 10px;
    font-size: 12px;
    color: #787878;
}

.order-list .item .price {
    font-size: 13.5px;
    text-align: right;
    padding: 9px 0;
}

.order-list .item .num {
    font-size: 15px;
}

.order-list .item .bot {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 0 13px;
    color: #8b8b8b;
}

.order-list .item .bot .bot_date {
    padding: 9px 0;
}

.order-list .item .bot .but {
    display: inline-block;
    margin: 9px 0 10px 10px;
    color: #343434;
    position: relative;
    border-radius: 27px;
    border-color: #999;
    height: 27px;
    line-height: 27px;
    min-width: 50px;
    padding: 0 8px;
    text-align: center;
}
</style>