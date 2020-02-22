<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
                <div class="buycard" v-if="params.pencardt == 0 || !params.pencardt">
                    <div class="buycard-top">
                        <div class="title">
                            <div class="van-icon van-icon-diamond-o"></div>
                            <div class="name">{{cardinfo.cardname}}购买</div>
                        </div>
                        <div class="tip">注:本卡一经售出，概不退换</div>
                    </div>
                    <form reportSubmit bindsubmit="FormIdsubmit" >
                        <div class="choose-card">
                            
                            <div class="card-list card-buy-list">

                                <div bindchange="chooseCard">
                                    
                                    <label class="item_label" v-if="cardinfo.cardpm == 0">
                                        <input type="radio" name="t" class="hide" v-model="t" value="1">
                                        <div class="item thin-border" :class="{'border-pri':t == 1}">
                                            <!-- <font class="icon-check iconfont icon-duihao1 " v-if="t == 1"></font>
                                            <font class="checkedbg bg-pri" v-if="t == 1"></font> -->
                                            <div class="lt">
                                                <div>
                                                    <div class="lt_name">{{cardinfo.cardname}} · 月卡</div>
                                                    <div class="lt_desc">
                                                        <span>享受会员价消费</span>
                                                    </div>
                                                </div>
                                                <div class="lt_date">有效期：<font>30天</font>
                                                </div>
                                            </div>
                                            <div class="rt">
                                                <div class="rt_price_now color-pri" >¥{{cardinfo.mcardprice}}</div>
                                                <div class="rt_price_old"  v-if="cardinfo.omcardprice">¥{{cardinfo.omcardprice}}</div>
                                            </div>
                                        </div>
                                    </label>
                                    <label class="item_label" v-if="cardinfo.twoucard == 1 && cardinfo.cardpmup == 0">
                                        <input type="radio" name="t" class="hide" v-model="t" value="3">
                                        <div class="item thin-border" :class="{'border-pri':t == 3}">
                                            
                                            <div class="lt">
                                                <div>
                                                    <div class="lt_name">{{cardinfo.upcname}} · 月卡</div>
                                                    <div class="lt_desc">
                                                        <span>享受会员价消费</span>
                                                    </div>
                                                </div>
                                                <div class="lt_date">有效期：<font>30天</font>
                                                </div>
                                            </div>
                                            <div class="rt">
                                                <div class="rt_price_now color-pri" >¥{{cardinfo.upcmprice}}</div>
                                                <div class="rt_price_old"  v-if="cardinfo.omcardprice">¥{{cardinfo.omcardprice}}</div>
                                            </div>
                                        </div>
                                    </label>
                                    <label class="item_label" v-if="cardinfo.cardpy == 0">
                                        <input type="radio" name="t" class="hide" v-model="t" value="0">
                                        <div class="item thin-border" :class="{'border-pri':t == 0}" >
                                            <!-- <font class="icon-check iconfont icon-duihao1 " v-if="t == 0"></font>
                                            <font class="checkedbg bg-pri" v-if="t == 0"></font> -->
                                            <div class="lt">
                                                <div>
                                                    <div class="lt_name">{{cardinfo.cardname}} · 年卡</div>
                                                    <div class="lt_desc">
                                                        <span>享受会员价消费</span>
                                                    </div>
                                                </div>
                                                <div class="lt_date">有效期：<font >365天</font>
                                                </div>
                                            </div>
                                            <div class="rt">
                                                <div class="rt_price_now color-pri" >¥{{cardinfo.cardprice}}</div>
                                                <div class="rt_price_old" v-if="cardinfo.ocardprice">¥{{cardinfo.ocardprice}}</div>
                                            </div>
                                        </div>
                                    </label>
                                    <label class="item_label" v-if="cardinfo.twoucard == 1 && cardinfo.cardpyup == 0">
                                        <input type="radio" name="t" class="hide" v-model="t" value="2">
                                        <div class="item thin-border" :class="{'border-pri':t == 2}" >
                                            
                                            <div class="lt">
                                                <div>
                                                    <div class="lt_name">{{cardinfo.upcname}} · 年卡</div>
                                                    <div class="lt_desc">
                                                        <span>享受会员价消费</span>
                                                    </div>
                                                </div>
                                                <div class="lt_date">有效期：<font >365天</font>
                                                </div>
                                            </div>
                                            <div class="rt">
                                                <div class="rt_price_now color-pri" >¥{{cardinfo.upcprice}}</div>
                                                <div class="rt_price_old" v-if="cardinfo.ocardprice">¥{{cardinfo.ocardprice}}</div>
                                            </div>
                                        </div>
                                    </label>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="buycard-info">
                            <div class="title thin-border_b">个人信息</div>
                            <div class="info-forma">

                                <van-cell-group>
                                	<van-field type="text" :value="address" label="地区"  placeholder="选择地区" readonly @click="showaddressfn" v-if="params.isctdl == 1 || params.isaddress == 1 || params.ucdaddress == 11" />

								  	<van-field type="text" @input="streetfn" :value="street" label="街道"  placeholder="请填写详细街道地址" v-if="params.ucdaddress == 11"  />
								  	<van-field :value="name" @input="namefn" placeholder="请填写姓名" label="姓名"  />
								  	<van-field type="tel" @input="telfn" placeholder="请填写联系电话" :value="tel" label="电话"  />
								</van-cell-group>
                            </div>
                        </div>

                        <div class="ucard_givebox" v-if="allcard.length > 0 && userinfo.level <= 0">
                            <div class="ucard_give" >
                                <div class="ucard_title">{{cardinfo.cardname}}专属礼包</div>
                                <div class="ucard_list">
                                    <div class="ucard_item item_cell_box" v-for="(item,index) in allcard" :key="index">
                                        <div class="ucard_gicon">送</div>
                                        <div class="item_cell_flex ucard_name">{{item.showname}}</div>
                                        <div class="ucard_fee color-pri">¥ {{item.fee}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="is-ipx"></div>
                        <div>
                            <div class="fix-box" style="">
                                <div class="g-fixbtn lbg-pri" @click="buyit" >确认开通</div>
                                <div class="is-ipx" v-if="isIPX"></div>
                            </div>
                        </div>
                    </form>
                </div>
                <div v-else class="prizebox">
                    
                    <div class="bg" style="background-image:url(https://img11.360buyimg.com/ddimg/jfs/t1/36311/31/4240/20194/5cbb322dE9757ba3d/3fff3f4c7c0c03a1.png);"></div>
                    
                      <carousel-3d :width="swidth" :height="sheight" :border="0" style="margin:0 auto;padding:20px 0;margin-bottom:20px;" :onSlideChange="swiperChange">
                        <slide :index="index" class="swiper-item" v-for="(item,index) in prizelist" :key="index" >
                            <div catchtap="swiperClick" class="slide-kuai" :style="{width:swidth+'px',height:sheight+'px'}" :class="{'active':swiperIndex == index}" >
                                <div class="slide-kuai_active" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/xuanzhong_libao.png);" v-if="swiperIndex == index"></div>
                                
                                <div class="slide-kuai_img" :style="{height:sheight*0.7+'px','background-image': 'url('+item.img+')'}"></div>
                                
                                <div class="slide-kuai_down">
                                    <div class="slide-kuai_down_l_o">{{item.name}}</div>
                                    <div class="slide-kuai_down_r">{{item.price}}元</div>
                                </div>
                            </div>
                        </slide>
                      </carousel-3d>

                    <div class="gift" style="background-image:url(https://img11.360buyimg.com/ddimg/jfs/t1/37642/16/3151/12386/5cbb3ee6Ed743ff6d/a3ec0ffa96408787.png);">
                        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/34925/22/4291/11458/5cbb3f85Eeee44db9/a5b2c26463868348.png" class="gifthead" />
                        <div class="gift_top">
                            <div class="gift_top_l" :style="{'background-image':'url('+actdata.img+')'}"></div>
                            <div class="gift_top_r">
                                <div class="gift_top_r_tit">{{actdata.name}}</div>
                                <div class="gift_top_r_pri">价值：<font>{{actdata.value}}元</font>
                                </div>
                            </div>
                        </div>
                        <div class="gift_down">
                            <div class="gift_down_l">
                                <div class="gift_down_l_song">送</div>
                                <div class="gift_down_l_tit" v-if="cardinfo.twoucard == 1 && actdata.cardtype*1 == 1">{{cardinfo.upcname}}会员</div>
                                <div class="gift_down_l_tit" v-else>{{cardinfo.cardname}}会员</div>
                            </div>
                            <div class="gift_down_r">{{actdata.usertime}}个月</div>
                        </div>
                        <div class="gift_down" v-for="(item,index) in actdata.list" :key="index">
                            <div class="gift_down_l">
                                <div class="gift_down_l_song">送</div>
                                <div class="gift_down_l_tit">{{item.name}}</div>
                            </div>
                            <div class="gift_down_r">{{item.price}}元</div>
                        </div>
                    </div>
                   
                    <div class="precautions" v-if="actdata.know.length > 0">
                        <div class="precautions_tit" style="background-image:url(https://fanscard.oss-cn-hangzhou.aliyuncs.com/mini/img/precautions_tit.png?t=1);"></div>
                        <div class="precautions_txt">
                            <div class="pre_item" v-for="(item,index) in actdata.know" :key="index">{{item}}</div>
                        </div>
                    </div>
                    
                    <div class="product_details" >
                        <div class="product_details_tit" style="background-image:url(https://img11.360buyimg.com/ddimg/jfs/t1/40131/9/982/3286/5cbb3df5E7ab12905/0c561cb57c6961a1.png)"></div>
                        <div class="product_details_txt" v-html="actdata.content">
                        </div>
                    </div>
                    

                    <div class="comformb" bindsubmit="FormIdsubmit" reportSubmit="true">
                        <div @click="buyprize" formType="submit" class="lijigoumai lbg-pri" >立即购买  ¥{{actdata.price}}</div>
                    </div>
                    <van-popup v-model="showconfirm" position="bottom" :overlay="true">
                        <div class="goodbuy_box">
                            <div class="info-form">
                                <van-cell-group>
                                    <van-field type="text" :value="address" label="地区"  placeholder="选择地区" readonly @click="showaddressfn" v-if="params.isctdl == 1 || params.isaddress == 1 || params.ucdaddress == 11 || params.taketype == 1" />

                                    <van-field type="text" @input="streetfn" :value="street" label="街道"  placeholder="请填写详细街道地址" v-if="params.ucdaddress == 11 || params.taketype == 1"  />
                                    <van-field :value="name" @input="namefn" placeholder="请填写姓名" label="姓名"  />
                                    <van-field type="tel" @input="telfn" placeholder="请填写联系电话" :value="tel" label="电话"  />
                                </van-cell-group>
                            </div>
                            <div class="buy_confirm lbg-pri" @click="confirmb" >确定</div>
                        </div>
                    </van-popup>
                </div>

                <van-popup v-model="showaddress" position="bottom" :overlay="true">
                    <van-area :area-list="areaList" @confirm="confirmarea" @cancel="cancelarea"  />
                </van-popup>
          	
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,Swipe,SwipeItem,List,Toast,Dialog,Field,Area,Popup,cellGroup } from 'vant';
	import area from '../../assets/js/area.js';
    import {Carousel3d,Slide} from 'vue-carousel-3d';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'buycard',
	  	components: {
	    	[Swipe.name] : Swipe,
	    	[SwipeItem.name] : SwipeItem,
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
	    	[Field.name] : Field,
	    	[Area.name] : Area,
	    	[Popup.name] : Popup,
	    	[cellGroup.name] : cellGroup,
            Carousel3d,Slide
	  	},
	  	data : function(){
	  		return {
                inited : false,
	  			params : {},
	  			cardinfo : {},
	  			userinfo : {},
	  			t : 0,
	  			sharedata :Object,
                swiperIndex : 0,
                showCardBenefit : false,
	  			allcard : [],
                cvisible : false,
	  			datalist : [],
	  			street : '',
	  			address : '',
	  			name : '',
	  			tel : '',
	  			isIPX : false,
	  			showaddress : false,
	  			areaList : area,
                actdata : {},
                showconfirm : false,
                dev : '',
                swidth : 320,
                sheight : 130,
	  		}
	  	},
	  	created:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            swiperChange(e){
                this.setPrizeinfo(e);
            },
            buyprize(){
                this.showconfirm = true;
            },
	  		cancelarea(){
	  			this.showaddress = false;
	  		},
	  		confirmarea(e){
	  			this.address = e[0].name +','+e[1].name +','+e[2].name;
	  			this.showaddress = false;
	  		},
	  		showaddressfn(){
	  			this.showaddress = true;
	  		},
		    namefn(e){
		        this.name = e;
		    },
            handleMousemove (){
                console.log('222')
            },
            goNext   (){
                console.log('222')
            },
		    telfn(e){
		        this.tel = e;
		    },
		    streetfn(e){
		        this.street = e;
		    },
            setPrizeinfo(index){
                var self = this;
                self.swiperIndex = index;
                for (var i = 0; i < self.prizelist.length; i++) {
                    if( i == index ){
                        self.actdata = self.prizelist[i];
                        if( self.prizelist[i].content ){
                            //WxParse.wxParse( 'content', 'html', self.prizelist[i].content, self, 0);
                        }else{
                            self.content = false;
                        }
                        return false;
                    }
                }
            },
            buyit(){
                var self = this;
                if( !self.name ) {
                    self.$toast('请填写姓名');
                    return false;
                }
                if( !self.$util.verify('mobile', self.tel ) ) {
                    self.$toast('请填写正确的电话号码');
                    return false;
                }
                if( self.t < 0 ) {
                    self.$toast('请选择会员卡时间');
                    return false;
                }
                var postdata = {
                    op:'pay',
                    name:self.name,
                    tel:self.tel,
                    address : self.address ? self.address : '',
                    t : self.t,
                    street : self.street,
                };
                self.$util.http('ucard','GET',postdata,function(res){
                    
                    if( res && !res.errno ){ 
                        if( res.data.payed == 1 ){
                            self.$toast({
                                type:'success',
                                message:'已开通会员',
                                onClose : function(){
                                    self.$router.go(-1);
                                }
                            })
                        }else{

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
                                            mask : true,
                                            forbidClick : true,
                                            message:'已开通会员',
                                            onClose : function(){
                                                self.$router.go(-1);
                                            }
                                        });
                                    }else{
                                        if( resa.err_msg == 'get_brand_wcpay_request:cancel' ){
                                            self.$toast('取消支付');
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
                                            mask : true,
                                            forbidClick : true,
                                            message:'已开通会员',
                                            onClose : function(){
                                                self.$router.go(-1);
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
                        }
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            confirmb(){
                var self = this;
                if( !self.name ) {
                    self.$toast('请填写姓名');
                    return false;
                }
                if( !self.$util.verify('mobile', self.tel ) ) {
                    self.$toast('请填写正确的电话号码');
                    return false;
                }
                if( self.params.taketype == 1 && !self.street ) {
                    self.$toast('请填写街道地址');
                    return false;
                }
                if( self.params.taketype == 1 && !self.address ) {
                    self.$toast('请选择地区');
                    return false;
                }
                var postdata = {
                    op:'payprize',
                    prizeid : self.actdata.id,
                    name:self.name,
                    tel:self.tel,
                    address : self.address ? self.address : '',
                    street : self.street ? self.street : ''
                };
                self.$util.http('ucard','GET',postdata,function(res){
                    if( res.data && !res.errno ){ 
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
                                        mask : true,
                                        forbidClick : true,
                                        message:'下单成功',
                                        onClose : function(){
                                            self.$router.go(-1);
                                        }
                                    });
                                }else{
                                    if( resa.err_msg == 'get_brand_wcpay_request:cancel' ){
                                        self.$toast('取消支付');
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
                                        mask : true,
                                        forbidClick : true,
                                        message:'下单成功',
                                        onClose : function(){
                                            self.$router.go(-1);
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
                    }
                },true)
            },
            initData(){
                var self = this;

                let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

                self.swidth = htmlWidth*0.8;
                self.sheight = self.swidth*0.8506;

                self.dev = self.$util.dev();
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    pid : params.pid ? params.pid : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
                self.$util.http('ucard','GET',postdata,function(res){
					self.inited = 1;
                    if( res && !res.errno ){       
                        self.allcard = res.data.allcard;
                        self.cardinfo = res.data.cardinfo;
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
                        self.params = res.data.params;
                        
                        self.t = res.data.cardinfo.cardpy == 0 ? 0 : ( res.data.cardinfo.cardpm == 0 ? 1 : 2 );   
                        self.name = res.data.userinfo.name ? res.data.userinfo.name : res.data.userinfo.nickname;
                        self.tel = res.data.userinfo.tel ? res.data.userinfo.tel : '';
                        self.prizelist = res.data.prizelist ? res.data.prizelist : [];

                        var index = 0;
                        params.pid = params.pid ? params.pid : ( params.scene ? params.scene : 0 );
                        if( params.pid ){
                            for (var i = 0; i < self.prizelist.length; i++) {
                                if( self.prizelist[i].id == params.pid ){
                                    index = i;
                                }
                            }
                        }
                        self.setPrizeinfo(index);
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }


                        self.inited = 2;
                        
                        //self.onLoad();
                    }else{
                        self.$toast(res.message);
                    }
                });
            }
	  	}
  	}
</script>
<style type="text/css" scoped>
#main,body{
	background-color:#f5f5f5;
	width:100%;
	min-height:100vh;

}
#main #content{
    padding-bottom: 0;
}
.buycard {
    color: #626262;
}
.buycard-top {
    padding: 15px;
    background-color: #fff;
}

.buycard-top .title {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 16px;
}

.buycard-top .title .icon {
    margin-right: 10px;
}

.buycard-top .tip {
    color: #ccc;
    font-size: 12px;
    margin: 10px 0;
}

.choose-card {
    background-color: #fff;
}

.choose-card .caption {
    padding: 0 15px;
    font-size: 14px;
    line-height: 35px;
}

.card-list {
    font-size: 16px;
}

.card-list .content {
    position: relative;
    padding: 0 15px;
}

.card-list .content .radio {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.card-list .active {
    background-color: #f8f7f3;
    box-shadow: 0 0 1px 0 rgba(0,0,0,0.2);
}

.card-list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 10px 0;
}

.card-list .item .lt .name {
    font-size: 14px;
}

.card-list .item .lt .time {
    font-size: 12px;
}

.card-list .item .rt {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: baseline;
    align-items: baseline;
}

.card-list .item .rt .nowprice {
    font-size: 14px;
}

.card-list .item .rt .nowprice .txt {
    font-size: 18px;
    font-weight: 500;
}

.card-list .item .rt .oldprice {
    font-size: 12px;
    text-decoration: line-through;
    color: #999;
    margin-left: 5px;
}

.buycard-info {
    background-color: #fff;
    margin-top: 10px;
    color: #626262;
    font-size: 14px;
}

.buycard-info .title {
    line-height: 35px;
    padding: 0 15px;
}

.buycard-info .info-form {
    padding: 0 15px;
}

.buycard-info .info-form textarea {
    width: 100%;
    height: 65px;
}

.buycard-info .info-form .textarea {
    font-size: inherit;
    line-height: inherit;
}

/**/
.ucard_give{
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border:1px solid #ddd;
    box-shadow: 0.5px 0.5px 11px rgba(0,0,0,0.2);
    font-size: 13px;
    background: #fff;
}
.ucard_title{
    padding: 0;
    color: #333;
    font-weight: bold;
    border-left: 3px solid #000;
    height: 15px;
    line-height: 15px;
    padding-left: 10px;
    margin: 10px 0;
    font-size: 15px;
}
.ucard_bot{
    text-align: center;
    margin-top: 15px;
}
.ucard_botbtn{
    display: inline-block;
    padding: 7.5px 30px;
    border-radius: 40px;
    border: 1px solid #ddd;
}
.ucard_item{
    padding: 10px 0;
    align-items: center;
}
.ucard_gicon{
    margin-right: 10px;
    padding: 0px 3px;
    border-radius: 1px;
    background-color: #2dbb00;
    color: #fff;
    font-size: 12px;
}
.ucard_name{
  color: #666;
}
.ucard_fee{
    padding: 1.5px 10px;
    background-color: rgba(251, 45, 55, 0.1);
}
.ucard_givebox{
    padding:10px;
    background:#fff;
    margin-top:5px;
}

/**/
.prizebox{
    background-color: #FFD93F;
    position: relative;
    padding-bottom: 75px;
}
.bg {
    width: 375px;
    height: 322.5px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
}

.swiper-block {
    height: 235px;
    width: 100%;
    position: relative;
    top: -6px;
    margin-bottom: 10px;
}

.swiper-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    overflow: unset;
}

.slide-kuai {
    height: 154.5px;
    width: 181px;
    border-radius: 3.5px;
    box-shadow: 0px 15px 25px 0px rgba(255,217,63,0.84);
    background-color: #fff;
    margin: 0px auto;
    z-index: 1;
}

.slide-kuai_img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 4.5px 4.5px 0 0;
    background-color: #333;
    margin-bottom: 9.5px;
    background-repeat: no-repeat;
    background-size: cover;
}

.slide-kuai_down {
    padding: 0 12px;
}

.slide-kuai_down_l_o {
    width: 155px;
    font-size: 12px;
    line-height: 12px;
    color: #353535;
    margin-bottom: 9.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.slide-kuai_down_l_t {
    font-size: 9px;
    line-height: 9px;
    color: #888888;
}

.slide-kuai_down_r {
    font-size: 12px;
    color: #ff5050;
}

.active {
    transform: scale(1.01);
    transition: all .2s ease-in 0s;
    z-index: 20;
}

.slide-kuai_active {
    width: 38px;
    height: 38px;
    position: absolute;
    top: 0;
    right: 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.gift {
    width: 330px;
    padding: 35px 10px 19.5px;
    position: relative;
    margin: 0 auto 22px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    box-sizing: content-box;
    text-align: left;
    overflow: initial;
}

.gift_top {
    display: flex;
    justify-content: space-between;
}

.gift_top_l {
    width: 80px;
    height: 80px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #333;
}

.gift_top_r {
    width: 200px;
}

.gift_top_r_tit {
    font-size: 14px;
    height: 48px;
    line-height: 24px;
    color: #353535;
    margin-bottom: 15px;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.gift_top_r_pri {
    font-size: 14px;
    line-height: 14px;
    color: #353535;
}

.gift_top_r_pri font {
    color: #ff5050;
}

.gift_down {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
}

.gift_down_l {
    display: flex;
}

.gift_down_l_song {
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    color: #fff;
    background-color: #2ac814;
    font-size: 11px;
    margin-right: 6px;
}

.gift_down_l_tit {
    color: #353535;
    line-height: 15px;
    font-size: 12px;
    flex: 1;
}

.gift_down_r {
    padding: 0 5px;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #ff5050;
    background-color: #fff3f3;
    text-align: center;
    white-space: nowrap;
}

.privilege,.precautions,.product_details {
    position: relative;
    width: 345px;
    background-color: #fff;
    padding: 22.5px 0 34.5px;
    margin: 0 auto 20px;
}
.product_details img{
  width: 100%!important;
}

.privilege_tit {
    width: 138.5px;
    height: 15.5px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin: 0 auto 15px;
}

.privilege_con {
    padding-left: 11px;
    margin-top: 25px;
    display: flex;
}

.privilege_con_img {
    width: 50px;
    height: 50px;
    margin-right: 8.5px;
}

.privilege_con_zi {
    width: 275px;
    padding: 6px 0 3px;
}

.privilege_con_zi_o {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 16px;
    color: #353535;
    font-weight: 700;
}

.privilege_con_zi_t {
    font-size: 12px;
    line-height: 18px;
    color: #888888;
}

.precautions_tit {
    width: 136.5px;
    height: 15.5px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin: 0 auto 35px;
}

.precautions_txt {
    padding: 0 15px;
    font-size: 13px;
}
.pre_item{
  padding: 5px 0;
}

.product_details_tit {
    width: 103px;
    height: 15.5px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin: 0 auto 35px;
}

.product_details_txt {
    padding: 0 15px;
    font-size: 16px;
}

.nchd_pic {
    width: 293.5px;
    height: 53px;
    display: block;
    margin: 0 auto 20px;
}

.lijigoumai,.comformb div {
    width: 345px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 14px;
    position: fixed;
    left: 15px;
    bottom: 20.5px;
    border-radius: 20px;
    z-index: 10;
}

.shuang_but {
    width: 345px;
    position: fixed;
    bottom: 20.5px;
    left: 15px;
    display: flex;
    justify-content: space-between;
}

.shuang_but_l {
    width: 163px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 14px;
    background-color: #ff5050;
    color: #fff;
    border-radius: 20px;
}

.shuang_but_l2 {
    background-color: #ff803b;
    overflow: visible;
    display: flex;
    justify-content: center;
}

.shuang_but_l3 {
    width: 345px;
}

.present_kuai_thr2_jiangli {
    height: 25.5px;
    position: absolute;
    top: -25.5px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    padding: 0 10px;
}

.zhuan {
    width: 90.5px;
    height: 28px;
    background-color: #fff;
    position: fixed;
    right: 0;
    top: 212.5px;
    display: flex;
    align-items: center;
    border-radius: 28px 0 0 28px;
    font-size: 12px;
    color: #6f6f6f;
    z-index: 998;
    border: 1px solid #cdcdcd;
    border-right: none;
}

.zhuan img {
    width: 20px;
    height: 20px;
    margin: 0 5px;
}

.Black_card {
    margin: 17px 15px 0;
    background-color: #fff;
    padding: 22.5px 15px;
}

.Black_card_tit {
    font-size: 16px;
    line-height: 16px;
    color: #353535;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    margin-bottom: 17.5px;
}

.Black_card_tit img {
    width: 15px;
    height: 15px;
    margin-left: 9px;
    transition: 0.5s ease-in;
}

.Black_card_tit_img {
    transform: rotate(180deg);
}

.liberty_da {
    height: 0;
    overflow: hidden;
    transition: 0.5s ease-in;
}

.liberty_da2 {
    height: 360px;
}

.liberty {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 19px;
}

.liberty_left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.liberty_left div {
    width: 12px;
    margin-right: 10.5px;
    font-size: 12px;
    line-height: 15px;
    color: #BBBBBB;
}

.liberty_left img {
    width: 1px;
    height: 52px;
}

.liberty_right {
    display: flex;
    width: 322.5px;
}

.liberty_right_few {
    width: 33.33333%;
    text-align: center;
    font-size: 12px;
    line-height: 12px;
}

.liberty_right_few_ava {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #DDCDA0;
    margin: 0 auto 7px;
}

.liberty_right_few_tit {
    margin-bottom: 5px;
    color: #353535;
    overflow: hidden;
}

.liberty_right_few_info {
    color: #CCCCCC;
    overflow: hidden;
}

.mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    position: fixed;
    top: 0;
    z-index: 500;
}

.Nonmembers {
    z-index: 510;
    width: 280px;
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%,-50%);
}

.Nonmembers_da {
    text-align: center;
    padding-top: 44px;
    padding-bottom: 32px;
    background-size: 280px 71px;
    background-repeat: no-repeat;
    background-color: white;
    border-radius: 10px;
}

.Nonmembers_da3 {
    padding-top: 31px;
}

.Nonmembers_da_ava {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #fff;
    margin: 0 auto;
    background-color: #333;
    margin-bottom: 11px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.Nonmembers_da_tit {
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    margin-bottom: 36.5px;
}

.Nonmembers_da_tit2 {
    line-height: 16px;
    font-size: 16px;
    margin-bottom: 52.5px;
}

.Nonmembers_da_txt {
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #888888;
    margin: 0 35px 31.5px;
}

.Nonmembers_da_txt2 {
    color: #353535;
    text-align: left;
    text-indent: 2em;
}

.Nonmembers_da_txt3 {
    margin: 0 20px 21.5px;
}

.Nonmembers_da_but {
    background-color: #FFD93F;
    width: 230.5px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    border-radius: 17px;
    margin: 0 auto;
}

.Nonmembers_da_but2 {
    height: 40px;
    line-height: 40px;
    background-color: #ff5050;
    color: #fff;
    border-radius: 22.5px;
}

.Nonmembers_close {
    width: 32.5px;
    height: 32.5px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -19%;
}

.Nonmembers_close2 {
    bottom: -8%;
}

@media (min-width:480px) {
    .Nonmembers {
        width: 140px;
    }

    .Nonmembers_da {
        padding-top: 22px;
        padding-bottom: 16px;
        background-size: 140px 35.5px;
        border-radius: 5px;
    }

    .Nonmembers_da3 {
        padding-top: 15.5px;
    }

    .Nonmembers_da_ava {
        width: 30px;
        height: 30px;
        margin: 0 auto;
        margin-bottom: 5.5px;
    }

    .Nonmembers_da_tit {
        font-size: 7px;
        line-height: 9px;
        margin-bottom: 18px;
    }

    .Nonmembers_da_tit2 {
        line-height: 8px;
        font-size: 8px;
        margin-bottom: 26px;
    }

    .Nonmembers_da_txt {
        font-size: 7px;
        line-height: 12px;
        margin: 0 17.5px 15.5px;
    }

    .Nonmembers_da_txt3 {
        margin: 0 10px 10.5px;
    }

    .Nonmembers_da_but {
        background-color: #FFD93F;
        width: 115px;
        height: 17px;
        line-height: 17px;
        font-size: 7px;
        border-radius: 8.5px;
        margin: 0 auto;
    }

    .Nonmembers_da_but2 {
        height: 20px;
        line-height: 20px;
        border-radius: 11px;
    }

    .Nonmembers_close {
        width: 16.5px;
        height: 16.5px;
    }
}
.gifthead{
    position: absolute;
    width: 131.5px;
    height: 38px;
    left: 50%;
    margin-left: -65.5px;
    top: -16px;
}
.buy_confirm{
    color: #fff;
    height: 50px;
    line-height: 50px;
    text-align:center;
    font-size: 16px;
}
.goodbuy_box .info-form{
    padding: 10px;
}
/**/
.card-buy-list {
    padding: 10px;
}

.card-buy-list .item_label {
    position: relative;
}

.card-buy-list .radio {
    position: absolute;
    visibility: hidden;
}

.card-buy-list .item {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    min-height: 72px;
    padding: 0 15px;
    margin-bottom: 10px;
    border-color: #dcdcdc;
    
}

.card-buy-list .icon-check {
    display: none;
    position: absolute;
    top: 0;
    right: -12.5px;
    width: 34px;
    height: 34px;
    font-size: 20px;
    line-height: 34px;
    color: #fff;
    z-index: 2;
}

.card-buy-list .lt {
    -webkit-box-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 7.5px 15px 7.5px 0;
    font-size: 14px;
    line-height: 19px;
    color: #585858;
}

.card-buy-list .card-main .user_name,.card-main .card-buy-list .user_name,.card-buy-list .card-main .user_vip,.card-main .card-buy-list .user_vip,.card-buy-list .lt_name,.card-buy-list .lt_desc {
    height: 19px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.card-buy-list .lt_name {
    margin-bottom: 8px;
}

.card-buy-list .lt_desc {
    margin-bottom: 5px;
    font-size: 15px;
    font-weight: 500;
    color: #313131;
}

.card-buy-list .lt_date {
    font-size: 12px;
    line-height: 16px;
    color: #969696;
}

.card-buy-list .lt_date font {
}

.card-buy-list .rt {
    text-align: center;
}

.card-buy-list .rt_price_now {
    font-size: 18px;
    color: #ff6e7e;
}

.card-buy-list .rt_price_old {
    font-size: 11px;
    text-decoration: line-through;
    color: #aeaeae;
}

.card-buy-list .radio[checked]+.item .icon-check {
    display: block;
}
.checkedbg{
    position:absolute;
    top:-7.5px;
    right:-30px;
    width:90px;
    height:34px;
    font-size:18.5px;
    line-height:34px;
    font-weight:blod;
    text-align:center;
    transform:rotate(45deg);
}
</style>