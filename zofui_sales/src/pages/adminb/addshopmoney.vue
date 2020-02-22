<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="addcontent">
                
				<van-cell-group >
				  <van-field label="充值金额" v-model="money" type="number" placeholder="请输入充值金额" />
				</van-cell-group>

            </div>

            <div class="addmbtn bg-pri" @click="confirm" >
                确定
            </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Field,cellGroup,Dialog } from 'vant';
	export default {
        name : 'addshopmoney',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [Dialog.name] : Dialog,
	    	
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : 2,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                info : {},
                money : '',
                dev : '',
                type : '',
                tid : '',
	  		}
	  	},
	  	created:function(e){
	  		//this.$emit('loadmessage',false);

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
		    addthis : function(e){
		        this.money = e.currentTarget.dataset.m;
		    },
		    confirm(e){
		        var self = this;
		    
		        if( self.money*1 <= 0 || !self.money ) {
		            self.$toast('请填写充值金额');
		            return false;
		        }
		        var postdata = {
		            op:'payadd',
		            money : self.money,
		            type : self.type,
		            tid : self.tid,
		        };
		        if( self.payed ) return false;
		        self.payed = true;

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
										message:'支付完成',
										onClose : function(){
											self.$router.back();
										}
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
										message:'支付完成',
										onClose : function(){
											self.$router.back();
										}
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
		                self.$toast(res.message);
		            }
		            self.payed = false;
		        },true);
		    }, 
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                self.type = params.type ? params.type : '';
                self.tid = params.tid > 0 ? params.tid : '';
                var postdata = {
                	op : 'addminfo',
                	type : self.type,
                	tid : self.tid,
                }
                self.$util.http('admin','GET',postdata,function(res){
                	if (!res.errno && res.data) {
                		self.params = res.data.params;
                	}
                })
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
.addmbtn{
	margin: 20px;
	text-align: center;
	height: 48px;
	line-height: 48px;
	font-size: 14px;
  	background: #fff;
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
	border: 1px solid #eeeeee;
	text-align: center;
	font-size: 15px;
	color: #666;
	margin-bottom:10px;
}
.give_item:nth-of-type(2n){
	margin-left: 30px;
}

</style>