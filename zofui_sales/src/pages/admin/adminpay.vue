<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
                 
            <div class="shopinfo">
                <div class="shopinfo_top">
                    <div class="shopinfo_head">
                        <img :src="shop.headimg" >
                    </div>
                    <div class="shopinfo_nick">
                        {{shop.name}}
                    </div>
                </div>
            </div>
            <div class="order-form">
                <div class="order-section">
                    <van-cell-group>
                        <van-field size="large" clickable border label="¥" label-width="20px"  >
                            <div slot="input">
                                <input class="moneyinput" type="number" v-model="money" @input="moneyfn" placeholder="输入支付金额">
                            </div>
                        </van-field>
                        <van-checkbox v-if="shop.spcut > 0 && shop.spcut < 10" :checked-color="color" v-model="isdis" class="isdisbtn" >输入不参与优惠金额</van-checkbox>
                        <van-field v-if="shop.spcut > 0 && shop.spcut < 10 && isdis" @input="dismoneyfn" :value="dismoney" type="number" size="large" clickable border  placeholder="输入不参与优惠金额" />

                        <div v-if="allcard.length > 0" class="form-celltip item_cell_box form-card"  @click="showcard">
                            <div class="item_cell_flex">{{usecardname ? usecardname : '选择优惠券'}}</div>
                            <div>{{carddis > 0 ? '-'+carddis : ''}}</div>
                            <div class="van-icon van-icon-arrow"></div>
                        </div>

                        <van-field v-model="mess" type="textarea" autosize placeholder="添加备注内容"   />
                    </van-cell-group>
                </div>
            </div>

            <div class="paytypebox" v-if="params.shopdlm == 1" >
                <van-radio-group v-model="paytype">
                  <van-radio :name="0" style="margin-bottom:10px;">微信支付</van-radio>

                  <van-radio :name="1">余额支付（{{userinfo.money}}）</van-radio>
                </van-radio-group>
                <div class="toadd item_cell_box" @click="link" :data-url="'/addshopmoney?type=shopuser&tid='+shop.id">
                    <div>去充值</div>
                    <div class="van-icon van-icon-arrow"></div>
                </div>
            </div>

            <div class="paytips">
                <div class="" v-if="givejf > 0">
                    赠送{{givejf}}{{params.jfbname}}
                </div>
                <div class="" v-else-if="params.spgjf*1 > 0">
                    赠送支付金额的{{params.spgjf*100/100}}%{{params.jfbname}}
                </div>
                <span class="" v-if="shop.spcut > 0 && shop.spcut < 10">{{givejf > 0 || params.spgjf > 0 ? ',' : ''}}最后支付按{{shop.spcut*100/100}}折优惠</span>
                <span v-if="yh*1 > 0">，优惠</span><span v-if="yh*1 > 0" class="color-pri">￥{{yh}}</span>
                <span v-if="payfee*1 > 0">，实付</span><span v-if="payfee*1 > 0" class="color-pri">￥{{payfee}}</span>
            </div>

            <div class="order-menu">
                <div class="order_btn only_btn">
                    <div @click="confirm" class="btn btn-formid bg-pri">确定付款</div>
                </div>
            </div>
            
            <van-popup v-model="isshowcard" position="bottom">
                <div class="info-calendar info-card">
                    
                    <div class="coupon" v-for="item in allcard" :data-id="item.id" :key="item.id">
                        <div class="coupon_text">
                            <div class="coupon_title"><font>¥</font> {{item.fee}}</div>
                            <div class="coupon_rule">
                                <font class="coupon_tagname" >{{item.name}}</font>
                            </div>
                            <div class="coupon_rule">
                                <font class="coupon_tagname" >订单满{{item.use}}元使用</font>
                            </div>
                        </div>
                        <div class="btn_view" :class="payfee >= item.use ?'get_btn':'cant_get'"  @click="usecard($event,item.use)" :data-id="item.id">
                            {{payfee >= item.use?'使用':'不可使用'}}
                        </div>
                    </div>
                    
                </div>
            </van-popup>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Field,cellGroup,Checkbox,CheckboxGroup,Popup,RadioGroup,Radio } from 'vant';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'adminpay',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Field.name] : Field,
            [Checkbox.name] : Checkbox,
            [CheckboxGroup.name] : CheckboxGroup,
            [cellGroup.name] : cellGroup,
            [Popup.name] : Popup,
            [RadioGroup.name] : RadioGroup,
            [Radio.name] : Radio,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                shop : {},
                money : '',
                mess : '',
                givejf : 0,
				dev : '',
                dismoney : '',
                isdis : false,
                color:'',
                payfee : 0,
                yh : 0,
                carddis : 0,
                usecardname : '',
                isshowcard : false,
                allcard : [],
                usecardid : 0,
                paytype : 0,
	  		}
	  	},
        activated:function(e){

        },
	  	created:function(e){
	  		
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }

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
            moneyfn(e){
                this.countres();
            },
            dismoneyfn(e){
                this.dismoney = e;
                this.countres();
            },
            spaytype(e){
                this.paytype = e;
            },
            countres(){

                var cut = this.shop.spcut > 0 && this.shop.spcut < 10 ? this.shop.spcut*1 : 10;

                var payfee = (this.money*1 - this.dismoney*1)*cut/10 + this.dismoney*1;
                var yh = this.money*1 - payfee;
                var give = ( payfee * this.params.spgjf/100).toFixed(2) * 1;

                if( this.usecardid > 0 ){
                    for (var i = 0; i < this.allcard.length; i++) {
                        if( this.allcard[i].id == this.usecardid ){
                            if( payfee*1 > this.allcard[i].use*1 ){
                                payfee -= this.allcard[i].fee*1;
                                yh += this.allcard[i].fee*1;
                                
                                this.usecardid = this.allcard[i].id;
                                this.usecardname = this.allcard[i].name;
                                this.carddis = this.allcard[i].fee;
                                
                            }else{
                                
                                this.usecardid = 0;
                                this.carddis = 0;
                                this.usecardname = '';
                                
                            }
                        }
                    }
                }

                payfee = payfee <= 0 ? 0 : payfee;

                this.givejf = give >= 0.01 ? give : 0;
                this.payfee = payfee.toFixed(2) * 1;
                this.yh = yh.toFixed(2) * 1;
            },
            showcard(){
                this.isshowcard = !this.isshowcard
            },
            usecard(e){
                var self = this;
                self.usecardid = e.currentTarget.dataset.id;
                self.countres();
                self.showcard();
            },
            confirm(){
                var self = this;
                if( !self.money ) {
                    self.$toast('请输入支付金额');
                    return false;
                }
                
                var postdata = {
                    op:'pay',
                    sid : self.shop.id,
                    mess : self.mess,
                    money : self.money,
                    dismoney : self.dismoney,
                    usecardid : self.usecardid,
                    paytype : self.paytype,
                };
                if( self.payed ) return false;
                self.payed = true;

                self.$util.http('shoppay','GET',postdata,function(res){      
                    self.payed = false;
                    if (!res.errno && res.data) {
                        if( res.data.payed == 1 ){
                            self.$toast({
                                type:'success',
                                message:'支付成功',
                                onClose : function(){
                                    self.paysuc();
                                }
                            });
                            return false;
                        }
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
										self.$toast({
											type:'success',
											message:'支付成功',
											onClose : function(){
                                                self.paysuc();
											}
										});
									} else {
										if( resa.err_msg == 'get_brand_wcpay_request:cancel' ){
											self.$toast('已取消支付');
                                            self.usecardid = '';
                                            self.usecardname = '';
                                            self.carddis = 0;
                                            self.initData();
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
										message:'支付成功',
										onClose : function(){
											self.paysuc();
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
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            paysuc(){
                var self = this;
                self.mess = '';
                self.money = '';
                self.usecardid = '';
                self.usecardname = '';
                self.carddis = 0;
                if( self.params.spurl ){
                    location.href = self.params.spurl;
                }else{
                    self.initData();
                }
            },
            initData(){
                var self = this;
				self.dev = self.$util.dev();
                var query = this.$route.query;
                var postdata = {
                    op : 'info',
                    sid : query.shopid ? query.shopid : 0,
                }
                self.$util.http('shoppay','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.shop = res.data.shop;
                        self.allcard = res.data.allcard;
                        self.userinfo = res.data.userinfo;
		                  
                        self.color = self.$util.themcolor(self.params.style);

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
.order-form .cell__bd {
    text-align: left;
}
.order-form .ems_radio:nth-of-type(2) {
    margin-left: 20px;
}
.order-counter {
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    border-color: #ccc;
    font-size: 14px;
    text-align: center;
    line-height: 25px;
    color: #222;
    border-radius: 6px;
}

.order-counter font {
    position: relative;
    z-index: 2;
    width: 34px;
    border-color: #ccc;
    font-size: 18px;
    font-weight: 500;
}

.order-counter font.disabled {
    color: #d8d8d8;
}

.order-counter input {
    width: 34px;
    height: 25px;
    text-align: center;
}

.order-price {
    font-size: 15px;
    line-height: 21px;
    color: #222;
}

.order-price .area {
    padding: 15px 0;
}

.order-price .area_tit {
    margin-bottom: 10px;
}

.order-price .count {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}
.tips{
    padding: 0;
    padding-bottom: 7.5px;
    font-size: 12.5px;
}
.order-menu{
  margin: 20px;
  margin-top: 50px;
}
.order_btn{
    text-align: center;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
}
.order_btn div{
    text-align: center;
}

.shopinfo_head {
    text-align: center;
    margin-top: 20px;
}
.shopinfo_head img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0.5px 0.5px 0.5px rgba(0,0,0,0.3);
}
.shopinfo_nick{
    font-weight: bold;
    text-align: center;
    padding: 10px;
    font-size: 16px;
}

.order-section{
    margin: 20px;
    box-shadow: 0.5px 0.5px 11px rgba(0,0,0,0.1);
    border-radius: 2.5px;
}
.payicon{
    color: #999;
    line-height: 45px;
}
.paynum,.paymess{
    height: 45px;
    line-height: 45px;
}
.paynum{
    font-size: 25px;
    padding-left: 25px;
}
.paymess{
    padding-left: 35px;
}
.deftype{
    color: #ddd;
}
.paytips{
    padding: 0 20px;
    font-size:13px;
    color: #999;
}
.paytips>div{
    display: inline-block;
}
.form-celltip{
    font-size: 14px;
    color: #999;
    padding: 15px;
    border-top: 1px solid #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
    align-items: center;
}
.form-celltip .zan-icon{
    font-size: 19px;
}
.isdisbtn{
    padding:10px;
    font-size: 14px;
}

.moneyinput{
    line-height: 45px;
    height: 45px;
    width:100%;
    border:0;
    border-radius: 0;
    font-size: 20px;
}
.van-cell--large{
    align-items: center;
}


/**/

.info-card{
    max-height: 450px;
    text-align: center;
    padding-top: 25px;
}
.card_disnum{
    color: #666;
}

/**/
/**/
.coupon {
    width: 355px;
    height: 80px;
    background-image: url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/ticket.png);
    background-size: 100% 100%;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding: 10px;
}

.coupon {
    display: inline-flex;
    justify-content: space-between;
    text-align: left;
}

.coupon_text {
    flex: 1;
}

.coupon_title {
    font-size: 18px;
    color: #ff8585;
}
.coupon_title font{
    font-size: 10px;
}

.coupon_rule {
    font-size: 10px;
    margin-top: 2.5px;
    line-height: 15px;
    z-index: 1;
    width: 100%;
}

.coupon_tagname {
    font-size: 10px;
    margin-right: 5px;
    color: #ff8585;
    white-space: nowrap;
    overflow: hidden;
    width: 250px;
    display: block;
}

.get_hint {
    margin-top: 5px;
    color: #FF6A6A;
    font-size: 10px;
    text-align: center;
}

.btn_view {
    z-index: 1;
    position: relative;
    font-size: 12px;
    height: 25px;
    text-align: center;
    line-height: 25px!important;
    border-radius: 50px;
    width: 70px;
    color: white;
    margin-top: 17.5px;
}

.get_btn {
    background-color: #ff5050;
}

.cant_get {
    background-color: #d2d2d2;
}

.has_get {
    border: 1px solid #ff5050;
    background-color: transparent;
    color: #ff5050!important;
}
.paytypebox{
    font-size:14px;
    margin:0 20px;
    padding-bottom: 10px;
    position: relative;
}
.toadd{
    font-size: 12px;
    position: absolute;
    right: 0;
    bottom: 10px;
    align-items: center;
}
</style>