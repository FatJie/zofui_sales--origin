<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="order-tags-wrap">
                <div class="order-tags" :style="{top:dev == 'app' ? '60px' : 0}">
                    <div @click="tabChange(item.status)" class="item" :data-status="item.status" v-for="item in tabMenu" >
                        <font class="name" :class="item.status == page.pdata.status ? 'color-pri':''" >{{item.name}}</font>
                        <div class="botline" :class="item.status == page.pdata.status ? 'bg-pri':''" ></div>
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
                        <div class="mes thin-border_b" @click="link" :data-url="item.appurl">
                            <div class="pic-box ">
                                <div class="image-box __100">
                                    <img :src="item.good.thumb">
                                </div>
                            </div>
                            <div class="mes-name">
                                <div class="tit">{{item.good.title}}</div>
                            </div>
                        </div>
                        <div class="bot">
                            <div class="price" v-if="item.type != 2">共{{item.num}}件{{item.hxtimes > 0 ? '，可用'+item.hxtimes+'次' : ''}}，<font class="num color-pri">¥{{item.fee}}</font>
                            </div>
                            <div class="bot_date">时间：{{item.createtime}}</div>
                            <div @click="getRefund(item.isback,item.id)" class="but thin-border" :data-id="item.id" v-if="item.isshowback == 1">{{item.isback == 0?'申请退款':'退款中'}}</div>
                            <div bindtap="tapGray" class="but thin-border" v-if="item.show_gray_btn">{{item.show_gray_btn}}</div>
                            <template v-if="item.show_red_btn">
                                <div bindtap="getEval" class="but thin-border" v-if="item.status == 7">{{item.show_red_btn}}</div>
                                <div bindtap="tapRed" class="but bg-pri" v-else>{{item.show_red_btn}}</div>
                            </template>
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
    import wx from 'weixin-js-sdk';
	export default {
        name : 'orderlist',
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
		            name: "待付款",
		            status: 1
		        }, {
		            name: "已付款",
		            status: 2
		        }, {
		            name: "待完成",
		            status: 3
		        }, {
		            name: "待评价",
		            status: 4
		        }, {
		            name: "已失效",
		            status: 5
		        }],
	  			page : {
	  				pdata : {
	  					doo : 'order',
	  					op : 'list',
	  					status : 0,
	  					page : 1,
                        zfid : 0,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
                dev : '',
	  		}
	  	},
        activated:function(e){

        },
	  	created:function(e){

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
            tabChange(index){
                var self = this;
                if( index == self.page.pdata.status ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.status = index;
                self.onLoad();
            },
		    getRefund(status,id){
		        var self = this;
		        if( status != 0 ) return false;
		        var postdata = {
		            op:'applyback',
		            oid : id,
		        };
		        Dialog.confirm({
				  	message: '确定要申请退款吗？'
				}).then(() => {
					self.$util.http('order','GET',postdata,function(res){
	                    if( res.data && !res.errno ){
		                    for (var i = 0; i < self.datalist.length; i++) {
		                        if( self.datalist[i].id == postdata.oid ){
		                            self.datalist[i].isback = 1;
		                        }
		                    }
	                    }
	                    self.$toast(res.message);
					})
				});
		    },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var query = this.$route.query;
                if( query.status ){
                    self.page.pdata.status = query.status;
                }
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
                        if( self.params.payedn ){
                            self.tabMenu[2].name = self.params.payedn;
                        }
		                
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
#content{
    background: #fff;
    min-height: 100vh;
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
    width: 20%;
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
	white-space: nowrap;
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
    font-size: 12px;
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
    font-size: 12px;
}
#main{
    background: #f8f8f8;
    color: #343434;
    min-height: 100vh;
}
</style>