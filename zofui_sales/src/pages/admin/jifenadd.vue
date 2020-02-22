<template>
	
    <div id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="addcontent">
                <van-field v-model="money" clearable clickable :border="true" placeholder="请输入充值金额" type="number" />

                <div class="frm_tips mt20" v-if="money > 0">
                    可获得{{money*params.shopjfper}}{{params.jfbname}}
                </div>

            </div>


            <div class="addmbtn " @click="confirm" >
                确定
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Field } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Field.name] : Field,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			money : '',
                geted : 0,
                sets : false,
                draw : false,
                dev : '',
	  		}
	  	},
        activated:function(e){

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
            confirm(){
                var self = this;
                if( self.money*1 <=  0 ){
                    self.$toast( '请填写金额' ); return false;
                }
                var postdata = {
                    op:'jifenadd',
                    money : self.money,
                };
                self.$util.http('admin','GET',postdata,function(res){
                    if (!res.errno && res.data) {

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
                                    //checkpay( res.data.orderid );
                                    self.$toast({
                                        type:'success',
                                        message:'支付完成'
                                    });
                                } else {
                                    if( resa.err_msg == 'get_brand_wcpay_request:cancel' ){
                                        self.$toast('已取消支付');
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
                                    self.$toast({
                                        type:'success',
                                        message:'支付完成'
                                    });
                                } else {
                                    alert(err.code);
                                }
                            });
                        }else if(self.dev == 'wap'){
                            location.href = res.data.mweb_url;
                        }else{       
                            self.$toast('启动微信支付失败, 请检查你的支付参数.');
                        }
                            
                        self.payed = false;

                    }else{
                        self.$toast( res.message );
                        if( res.errno == 2 ){
                            self.$router.push( res.data.appurl);
                        }
                        if( res.errno == 3 ){
                            setTimeout(function(){
                                self.$router.push('/adminset');
                            },1000);

                        }                
                    }
                },true);
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();

                var query = this.$route.query;
                var postdata = {
                    op : 'drawinit',
                }

                self.$util.http('admin','GET',postdata,function(res){
                    self.inited = 2;
                    if (!res.errno && res.data) {
                        self.params = res.data.params;

                        window.document.title = '充值'+self.params.jfbname;

                    }else{
                        self.$toast( res.message );

                        if( res.errno == 2 ){
                            self.$router.push( res.data.appurl);
                        }
                        if( res.errno == 3 ){
                            setTimeout(function(){
                                self.$router.push('/adminset');
                            },1000);

                        }                
                    }
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
    background: #fff;
}
.van-cell{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}
.addmbtn{
    margin: 20px;
    text-align: center;
    height: 48px;
    line-height: 48px;
    font-size: 20px;
    background: #449aff;
    color: #fff;
}
.addcontent{
    padding: 20px;
}
.give_box{
    padding: 10px 0;
}
.give_item{
    display: inline-block;
    width: 150px;
    padding: 20px 0;
    border-radius: 5px;
    border: 0.5px solid #eeeeee;
    text-align: center;
    font-size: 15px;
    color: #666;
    margin-bottom:10px;
}
.give_item:nth-of-type(2n){
    margin-left: 30px;
}
.topimg{
    width: 100%;
}
</style>