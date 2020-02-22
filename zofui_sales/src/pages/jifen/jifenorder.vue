<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">

                <div class="order-tags-wrap">
                    <div class="order-tags" :style="{top:dev == 'app' ? '60px':0}">
                        <div @click="tabChange" class="item" :data-status="item.status" v-for="item in tabMenu" >
                            <font class="name" :class="item.status == page.pdata.status ? 'color-pri':''">{{item.name}}</font>
                            <div class="botline" :class="item.status == page.pdata.status ? 'bg-pri':''"></div>
                        </div>
                    </div>
                </div>
                <template v-if="datalist.length > 0">
                    <div class="order-list">
                        <div class="item" v-for="item in datalist" >
                            <div class="top thin-border_b">
                                <font class="top-code">编号：{{item.id}}</font>
                                <div class="top-statu color-pri">{{item.statusstr}}</div>
                            </div>
                            <div class="mes thin-border_b" >
                                <div class="pic-box ">
                                    <div class="image-box __100">
                                        <img :src="item.thumb">
                                    </div>
                                </div>
                                <div class="mes-name">
                                    <div class="tit">{{item.name}}</div>
                                    <div class="tit" v-if="item.rule">{{item.rule}}</div>
                                    <div class="price" v-if="item.type != 2">
                                        <font class="num color-pri">{{item.cost*100/100}}{{params.jfbname}}</font>
                                        <font class="num color-pri" v-if="item.payed > 0">，¥{{item.payed*100/100}}</font>
                                    </div>
                                </div>
                            </div>
                            <div class="bot">
                                <div class="bot_date">兑换时间:{{item.createtime}}</div>
                                <div>
                                    <div @click="como" class="but thin-border" :data-id="item.id" v-if="item.status == 1">完成</div>
                                    <div @click="express" class="but thin-border" :data-id="item.id" v-if="item.exname && item.exnum" :data-name="item.exname" :data-num="item.exnum">快递</div>
                                    <div @click="payit" class="but thin-border" :data-id="item.id" v-if="item.status == 3 && item.isfail == 0">支付</div>
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
    </van-pull-refresh>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Cell, CellGroup } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Cell.name] : Cell,
            [CellGroup.name] : CellGroup,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			sharedata :{},
	  			datalist : [],
		        tabMenu :  [{
		            name: "全部",
		            status: 0
		        }, {
		            name: "待支付",
		            status: 4
		        }, {
		            name: "待发货",
		            status: 1
		        }, {
		            name: "已发货",
		            status: 2
		        }, {
		            name: "已完成",
		            status: 3
		        }],
	  			page : {
	  				pdata : {
	  					doo : 'jifen',
	  					op : 'orderlist',
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
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		//this.$emit('loadmessage',false);
	  	},
	  	methods: {
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

        		if( e.currentTarget.dataset.status == this.page.pdata.status ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.status = e.currentTarget.dataset.status;
 				this.onLoad();
            },
            express(e){
		        var name = e.currentTarget.dataset.name;
		        var num = e.currentTarget.dataset.num;
		        Dialog.alert({
				  	title: '快递信息',
				  	message: '名称:'+name+'，编号:'+num
				});

            },
            payit(e){
                var self = this;
                var postdata = {
                    tid : e.currentTarget.dataset.id,
                    op : 'repay'
                }
                self.$util.http('jifen','GET',postdata,function(res){    
                    if ( !res.errno && res.data ) {

                        if( self.dev == 'wx' ){
                            
                            WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                'appId' : res.data.appId, 
                                'timeStamp': res.data.timeStamp,
                                'nonceStr' : res.data.nonceStr,
                                'package' : res.data.package,
                                'signType' : res.data.signType,
                                'paySign' : res.data.paySign
                            }, function(resa) {
                                if(resa.err_msg == 'get_brand_wcpay_request:ok') {
                                    for (var i = 0; i < self.datalist.length; i++) {
                                        if( self.datalist[i].id == postdata.tid ){
                                            self.datalist[i].status = 0;
                                        }
                                    }
                                } else {
                                    if( resa.err_msg == 'get_brand_wcpay_request:cancel' ){
                                        self.$toast('已取消');
                                    }else{
                                        self.$toast('启动微信支付失败, 请检查你的支付参数. 详细错误为: ' + resa.err_msg);
                                    }
                                }
                            });
						}else if(self.dev == 'app'){
							var wxPay = api.require('wxPay');
							wxPay.payOrder({
								apiKey: res.data.appid,
								orderId: res.data.prepayid,
								mchId: res.data.partnerid,
								nonceStr: res.data.noncestr,
								timeStamp: res.data.timestamp,
								package: res.data.package,
								sign: res.data.sign,
							}, function(ret, err) {
								if (ret.status) {
                                    for (var i = 0; i < self.datalist.length; i++) {
                                        if( self.datalist[i].id == postdata.tid ){
                                            self.datalist[i].status = 0;
                                        }
                                    }
								} else {
									alert(err.code);
								}
							});
						}else if(self.dev == 'wap'){
							location.href = res.data.mweb_url;
						}else{       
							self.$toast('启动微信支付失败, 请检查你的支付参数.');
						}

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            como(e){
		        var self = this;
		        var postdata = {
		            tid : e.currentTarget.dataset.id,
		            op : 'comorder'
		        }
                Dialog.confirm({
                    message: '确定完成订单吗？'
                }).then(() => {

                	self.$util.http('jifen','GET',postdata,function(res){
		                if ( !res.errno && res.data  ) {
		                    for (var i = 0; i < self.datalist.length; i++) {
		                        if( self.datalist[i].id == postdata.tid ){
		                            self.datalist[i].status = 2;
		                        }
		                    }
		                    self.$toast(res.message);
		                }else{
		                    self.$toast(res.message);
		                }
                	})

                })
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
    text-align: left;
    padding-top: 5px;
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