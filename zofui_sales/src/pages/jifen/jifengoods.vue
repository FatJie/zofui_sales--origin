<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="info-swiper goods-swiper">
                <img mode="widthFix" style="width: 100%;" :src="good.thumb"  >
            </div>

            <div class="info-section" >
                <div class="info-top">
                    <div class="o-top">
                        <div class="top_tit">
                            {{good.name}}
                        </div>
                    </div>
                    <div class="o-price">
                        <div class="price">
                            <div class="price_now ">
                                需要<font class="num color-pri">{{good.need*100/100}}</font>{{params.jfbname}}
                                <template v-if="good.fee > 0">
                                    + ¥<font class="num color-pri">{{good.fee*100/100}}</font>
                                </template>
                                
                            </div>
                            <div class="price_old" v-if="good.price">¥{{good.price*100/100}}</div>
                            
                        </div>
                        <div >
                            <font>已兑换：{{good.taked}}</font>
                            <font class="color-pri"> 只剩{{good.stock}}件</font>
                        </div>
                    </div>
                </div>
            </div>

            <div class="goods_content detail-content" v-if="good.content" v-html="good.content"></div>


            <div class="fix-box" style="">
                <div class="info-menu">
                    <div class="menu-items thin-border">
                        <div @click="link" class="item thin-border_l" data-url="/">
                            <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/102209/25/1378/1341/5dbef441Ef2711ee6/ccbc77e131b90959.png">
                            <div>首页</div>
                        </div>
                        <div class="item thin-border_l" @click="shareit(true)">
                            <img class="icon" src="http://img11.360buyimg.com/ddimg/jfs/t1/85692/4/1459/1056/5dbef456E1de0e899/545ef1d83b6d7f9d.png">
                            <div>分享</div>
                        </div>
                    </div>
                    <div class="menu-btns">
                        <div class="btn btn-gray" v-if="good.stock <= 0">
                            已售罄
                        </div>
                        <div @click="changeit" class="btn lbg-pri" >立即兑换</div>
                    </div>
                </div>
                <!-- <div class="is-ipxa" v-if="{{isIPX}}"></div> -->
            </div>

            <van-popup v-model="confirm" position="bottom" :close-on-click-overlay="true">
                
                <div class="goodbuy_top">
                    <div class="goodbuy_top_l item_cell_flex">
                        <div class="goodbuy_top_title">{{good.name}}</div>
                    </div>
                    <div class="item_cell_box" style="align-items: center;">
                        <div class="goodbuy_top_l item_cell_flex">
                            <div class="goodbuy_top_price" >
                                {{good.need*100/100}}{{params.jfbname}} 
                                <font v-if="good.fee > 0">,¥{{ good.fee*100/100 }}</font>
                                <font v-if="good.express > 0">,运费{{ good.express*100/100 }}</font>
                                ,剩余{{good.stock}}
                            </div>
                        </div>                            
                        <div class="goodbuy_top_close zan-icon zan-icon-close" catchtap="togglebuy"></div>
                    </div>
                </div>

                <div class="goodbuy_add">
                    <div class="item_cell_box goodbuy_adds" @click="link" data-url="/orderaddress?from=confirm">

                        <div class="item_cell_flex" v-if="address && address.name">
                            <div class="address_name">{{address.name}} {{address.tel}}</div>
                            <div class="address_desc">{{address.region}} {{address.street}}</div>
                        </div>
                        <div class="item_cell_flex" v-else>选择收货地址</div>
                        <div class="van-icon van-icon-arrow "></div>
                    </div>
                </div>
                
                <div class="goodbuy_rule" v-if="good.isrule == 1">
                    <div class="goodbuy_rule_item" v-for="item in rule" >
                        <div class="rule_item_title">选择{{item.pro.title}}</div>
                        <div>
                            <div class="rule_item_name" :class="item.actitem == inn.id ? 'lbg-pri' : ''" v-for="inn in item.data" @click="changeRule" :data-oid="item.pro.id" :data-tid="inn.id" >{{inn.name}}</div>
                        </div>
                    </div>
                </div>
                
                <div class="buy_confirm lbg-pri" @click="confirmbuy" data-type="buy" >确定</div>

            </van-popup>

            <sharetip :isshowshare="isshowshare" @shareit="shareit" />

            <van-popup class="showposter_popup showposter" v-model="showposter" position="bottom" >
                <div class="showposter item_cell_box" >
                    <div class="showposter_item" @click="wxshare(1)" style="width:50%;">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/43656/17/11066/2582/5d483346E53967080/9b904500c5b6ea1b.png">
                        <div>转发给好友</div>
                    </div>
                    <div class="showposter_item" @click="wxshare(2)" style="width:50%;">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/75188/33/6391/5182/5d4833dcEda19ecfc/df414cdaa26e1e81.png">
                        <div>转发到朋友圈</div>
                    </div>
                </div>
            </van-popup>

        </div>
    </div>

</template>

<script type="text/javascript">
	import { Dialog,Toast,PullRefresh,ImagePrediv,List,Popup } from 'vant';
    import sharetip from '../../components/sharetip';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'jifengoods',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [List.name] : List,
            [Popup.name] : Popup,
            [Dialog.name] : Dialog,
            sharetip,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                good : {},
                value : '',
                rule : {},
                rulemap : {},
                address : {},
                confirm : false,
                actmap : '',
                getAddress : false,
                isshare : false,
                isshowshare : false,
                showposter : false,
                dev : '',
	  		}
	  	},
	  	activated:function(e){

            if( this.getAddress ) {
                var address = this.$util.getCache('address');
                if( address ){
                    this.address = address;
                    this.confirm = true;
                    this.$util.setCache('address','');
                }
                return false;
            }
            //this.$emit('loadmessage',false);
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            //this._setData();
            this.initData();
            

	  	},
        beforeRouteLeave(to,from,next){
            if( to.name == 'orderaddress' ){
                this.getAddress = true;
            }else{
                this.getAddress = false;
            }
            next();
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            shareit(bool){
                if( this.dev == 'app' ){
                    this.showposter = true;
                }else{
                    this.isshowshare = bool;
                }
            },
            search(){
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
                return false;
            },
            wxshare(type){
                var self = this;
                var scene = 'session';
                if(type == 2){
                    scene = 'timeline';
                }
                var wx = api.require('wx');
                wx.shareWebpage({
                    apiKey: '',
                    scene: scene,
                    title: self.sharedata.title,
                    description: self.sharedata.desc,
                    thumb: 'widget://image/logomini.png',
                    contentUrl: self.sharedata.link
                }, function(ret, err) {
                    if (ret.status) {
                        self.$toast('已分享');
                    } else {
                        self.$toast(err.code);
                    }
                });
            },
            changeit(){
                var self = this;
                if( self.userinfo.jifen*1 < self.good.need*1 ){
                    self.$toast('你的'+self.params.jfbname+'不足');return false;
                }

                self.confirm = true;
            },
            changeRule( e ){
                var self = this;
                for (var i = 0; i < self.rule.length; i++) {
                    if( self.rule[i].pro.id == e.currentTarget.dataset.oid ){
                        var target = 'rule['+i+'].actitem';
                        self.$set(self.rule[i],'actitem',e.currentTarget.dataset.tid);

                        var selectarr = [];
                        
                        for (var j = 0; j < self.rule.length; j++) {
                            if( self.rule[j].actitem ) {
                                selectarr.push( self.rule[j].actitem );
                            }
                        }
                        if( selectarr.length < self.rule.length ) return false;
                        
                        for (var j = 0; j < self.rulemap.length; j++) {
                            var thisstr = ( self.rulemap[j].id + '' ).split(":");
                            
                            if( thisstr.sort().toString() == selectarr.sort().toString() ){
                                
                                self.good.stock = self.rulemap[j].stock;
                                self.good.fee = self.rulemap[j].nowprice;
                                self.good.need = self.rulemap[j].jifen;
                                self.actmap = self.rulemap[j].id;
                                
                                return false;
                            }
                        }
                        return false;
                    }
                }
            },
            confirmbuy : function(){
                var self = this;

                if( !this.address ){
                    self.$toast('请先选择地址');return false;
                }
                if( !this.address.name ){
                    self.$toast('请先选择地址');return false;
                }
                if( !this.address.tel ){
                    self.$toast('请先选择地址');return false;
                }

                if( self.good.isrule == 1 ){
                    for (var i = 0; i < self.rule.length; i++) {
                        if( !self.rule[i].actitem || typeof self.rule[i].actitem == 'undefined' ){
                            self.$toast('请选择规格');return false;
                        }
                    }
                }

                var postdata = {
                    op : 'changegoods',
                    gid : self.good.id,
                    name : self.address.name,
                    tel : self.address.tel,
                    map : self.actmap,
                    address : self.address.region + self.address.street,
                }

                Dialog.confirm({
                    message: '确定兑换吗？'
                }).then(() => {
                    self.$util.http('jifen','GET',postdata,function(res){
                        if( res.data && !res.errno ){        
                            if( res.data.paySign ){
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
											self.confirm = false;
											self.good.stock = self.good.stock*1 - 1;
											self.good.taked = self.good.taked*1 + 1;
											
											self.$toast('兑换完成，请等待系统处理');
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
											self.confirm = false;
											self.good.stock = self.good.stock*1 - 1;
											self.good.taked = self.good.taked*1 + 1;
											
											self.$toast('兑换完成，请等待系统处理');
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
                                self.confirm = false;
                                self.good.stock = self.good.stock*1 - 1;
                                self.good.taked = self.good.taked*1 + 1;
                                self.$toast(res.message);
                            }

                        }else{
                            self.$toast(res.message);
                        }
                        
                    },true)
                });
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = self.$route.query;
                var postdata = {
                    op : 'goodsinfo',
                    gid : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
	            self.$util.http('jifen','GET',postdata,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.good = res.data.good;
                        self.params = res.data.params;
                        self.rule = res.data.good.rulearray ? res.data.good.rulearray.rule : {};
                        self.rulemap = res.data.good.rulearray ? res.data.good.rulearray.rulemap : {};
                        self.userinfo = res.data.userinfo;
                        self.address = res.data.address;

                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }

                        window.document.title = self.good.name;
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
#main{
    min-height: 100vh;
    background: #eee;
}
button{
    font-style: initial;
    background: initial;
}
#content{
  background: #fff;
}
.info-top .o-price {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    margin: 10px;
    font-size: 13px;
    line-height: 15px;
    color: #999;
}
.fix-box{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
.info-top .price_now {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
}

.info-top .price_now .num {
    font-size: 25px;
}

.info-top .price_old {
    display: inline-block;
    margin-left: 7.5px;
    text-decoration: line-through;
}

.info-top .o-top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 10px;
}

.info-top .top_tit {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 18px;
    font-weight: 500;
    line-height: 25px;
    color: #222;
}
.goods_content{
  padding: 10px;
  background: #fff;
  margin-top: 5px;
  font-size: 15px;
}
.goods_content img{
  display: block;
  max-width: 100%!important;
}

.goodbuy_box{
    position: relative;
}

.buy_confirm{
    color: #fff;
    height: 50px;
    line-height: 50px;
    text-align:center;
    font-size: 15px;
}
.goodbuy_top {
    padding: 10px;
    border-bottom: 1px solid #eee;
    align-items: center;
}
.goodbuy_add{
  padding: 10px;
}
.goodbuy_top_img{
    position: absolute;
    top: -25px;
    left: 10px;
    width: 75px;
    height: 75px;
    border-radius: 5px;
    overflow: hidden;
}
.goodbuy_top_l{
    font-size: 16px;
    font-weight: bold;
}
.goodbuy_top_title{
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
.goodbuy_top_close{
    width: 35px;
    height: 35px;
    text-align: center;
    font-size: 25px;
    color: #999;
}

.goodbuy_top_price{
    font-size: 13px;
    font-weight: initial;
    color: #999;
}
.goodbuy_adds{
    color: #999;
    font-size: 15px;
    padding: 10px 0;
    align-items: center;
}
.address_name{
    font-size: 16px;
    font-weight: bold;
    color: #333;
    padding: 5px 0;
}
.address_desc{
    color: #666;
}

/**/
.goodbuy_rule,.goodbuy_num{
    padding: 15px 10px;
}
.goodbuy_rule{
    border-top: 1px solid #eee;
    max-height: 200px;
    margin-bottom: 20px;
}
.goodbuy_num {
    align-items: center;
}
.goodbuy_quantity{
    text-align: right;
}
.goodbuy_num_last{
    color: #999;
    font-size: 14px;
}
.goodbuy_name{
    font-size: 14px;
}

.goodbuy_rule_item{
    margin-bottom: 15px;
}
.rule_item_title{
    font-size: 13px;
    color: #999;
}
.rule_item_name{
    display: inline-block;
    margin: 7.5px 10px 0 0;
    background: #eee;
    color: #666;
    border-radius: 2.5px;
    font-size: 14px;
    padding: 3px 10px;
    min-width: 20px;
    text-align: center;
}
.actrule{
    background: #ed414a;
    color: #fff;
}
</style>