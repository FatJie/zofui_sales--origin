<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="shopenter-top">
                <div class="topimg">
                    <img src="http://img11.360buyimg.com/ddimg/jfs/t1/99294/5/1424/22680/5dbef56bE3159992e/e20471c9875e9286.jpg">
                </div>
                <div class="shopenter-form">

                    <van-cell-group>
                        
                        <van-field v-model="name" placeholder="你的姓名" label="姓名"  />
                        
                        <van-field type="tel"v-model="tel" label="手机" placeholder="手机号,作为登录账户" :value="tel"  />

                        <van-field type="tel" v-model="pass" label="密码" placeholder="设置登录密码"  />

                        <van-field v-model="shopname" :placeholder="params.shopbname+'名称'" :label="params.shopbname"  />

                        <van-field type="text" :value="ctaddress"  placeholder="选择地区" label="地区" readonly @click="showaddressfn" v-if="params.isctdl == 1" />

                        <van-field type="text" :value="address"  placeholder="填写地址" label="地址" readonly @click="locCity"  />

                        <van-field type="tel" label="邀请码" v-model="code" v-if="agentcode <= 0" placeholder="邀请码（选填）"  />
                        
                    </van-cell-group>

                    <div class="frm_group "  >
                        <div class=" item_cell_box">
                            <div class=" item_cell_flex item_cell_box">
                                <van-checkbox v-model="checkedrule">同意商户协议</van-checkbox>
                                <font class="scanrule" @click="link" data-url="/shoprule">查看协议详情</font>
                            </div>
                        </div>
                    </div>

                    <div v-if="params.joinfee*1 > 0 || params.givetimes*1 > 0" style="color:#666;height:1.4rem;line-height:1.4rem;padding:0 25rpx;" class="address" >
                        提示：{{params.joinfee*1 > 0 ? '需交纳入驻费¥'+params.joinfee : ''}}
                        {{params.givetimes*1 > 0 ? '提交后获得'+params.givetimes+'天体验期' : ''}}
                    </div>
                    <div class="submit" @click="submit" :class="status == 1 ? 'joined' : ''" >
                        {{params.joinfee*1 > 0 ? '立即入驻（¥'+params.joinfee+'）' : '提交申请'}} 
                    </div>

                </div>
            </div>

            <van-popup v-model="showaddress" position="bottom" :overlay="true">
                <van-area :area-list="areaList" @confirm="confirmarea" @cancel="cancelarea"  />
            </van-popup>

            <van-popup position="right" v-model="showloc" class="locbox">
                <div class="van-icon van-icon-close closeloc" @click="closeloc"></div>
                <iframe id="mapPage" width="100%" height="100%" frameborder=0
                    :src="'https://apis.map.qq.com/tools/locpicker?search=1&type=1&key='+params.tenkey+'&referer=myapp'">
                </iframe>
            </van-popup> 

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Field,Area,Popup,cellGroup,RadioGroup,Checkbox } from 'vant';
	import tabbar from '../../components/tabbar';
    import area from '../../assets/js/area.js';

	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Field.name] : Field,
            [Area.name] : Area,
            [Popup.name] : Popup,
            [Checkbox.name] : Checkbox,
            [RadioGroup.name] : RadioGroup,
            [cellGroup.name] : cellGroup,
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
                name : '',
                tel : '',
                shopname : '',
                showaddress : false,
                code : '',
                address : '',
                areaList : area,
                status : 0,
                pass : '',
                ctaddress : '',
                agentcode : 0,
                checkedrule : false,
				dev : '',
                lat : false,
                lng : false,
                showloc : false,
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
            cancelarea(){
                this.showaddress = false;
            },
            confirmarea(e){
                this.ctaddress = e[0].name +','+e[1].name +','+e[2].name;
                this.showaddress = false;
            },
            showaddressfn(){
                this.showaddress = true;
            },
            closeloc(){
                this.showloc = false;
            },
            locCity(){
                var self = this;

                self.showloc = true;
                function setloc(event){
                    var loc = event.data;
                    if (loc && loc.module == 'locationPicker') {
                        self.lat = loc.latlng.lat;
                        self.lng = loc.latlng.lng;
                        self.address = loc.poiaddress;
                        self.showloc = false;
                    }
                }
                window.removeEventListener('message',setloc,false);
                window.addEventListener('message',setloc, false);
            },
            submit(e){
                var self = this;
                var postdata = {
                    op : 'join',
                    name : self.name,
                    shopname : self.shopname,
                    tel : self.tel,
                    pass : self.pass,
                    lat : self.lat,
                    lng : self.lng,
                    address : self.address,
                    code : self.code > 0 ? self.code : self.agentcode,
                    ctaddress : self.ctaddress ? self.ctaddress : '',
                }
                if( !postdata.name ) {
                    self.$toast('请填写姓名');return false;
                }
                if( !postdata.tel || !self.$util.verify('mobile', postdata.tel) ) {
                    self.$toast('手机格式不正确');return false;
                }
                if( !postdata.shopname ) {
                    self.$toast('请填写名称');return false;
                }
                if( !postdata.lat ) {
                    self.$toast('请选择地址');return false;
                }
                if( !postdata.pass ) {
                    self.$toast('请填写登录密码');return false;
                }
                if( postdata.pass.length < 6 || postdata.pass.length > 32 ) {
                    self.$toast('登录密码在6-32位字符之间');return false;
                }
                if( !self.checkedrule ) {
                    self.$toast('同意商户协议才可以入驻');return false;
                }
                
                self.$util.http('shopinfo','GET',postdata,function(res){
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
									self.$toast({
										type:'success',
										message: res.data.mess,
										onClose : function(){
											self.$router.push('/adminlogin');
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
										message: res.data.mess,
										onClose : function(){
											self.$router.push('/adminlogin');
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
                        Dialog.alert({
                            message: res.message
                        }).then(() => {
                             if( res.data.isto == 1 ){
                                self.$router.push('/adminlogin');
                            }
                        });
                        if (!res.errno && res.data) {
                            self.status = 1;
                        }
                    }
                },true);
            },
            initData(){
                var self = this;
				self.dev = self.$util.dev();
                var params = this.$route.query;
                var code = params.agentcode ? params.agentcode : '';
                var postdata = {
                    op : 'joininfo',
                    gid : params.id ? params.id : 0,
                }
	            self.$util.http('shopinfo','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
                        self.status = res.data.status;
                        self.sharedata = res.data.sharedata;
                        self.agentcode = code;
		                
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
    background-color: #fff;
}
.van-field{
    padding-left: 0;
}
.shopenter-top .topimg {
    width: 100%;
    height: 129px;
    margin-bottom: 35px;
    position: relative;
    z-index: 1;
}
.frm_group{
    margin-top: 10px;
}
.shopenter-top .topimg img {
    display: block;
    width: 100%;
    height: 100%;
}

.shopenter-form {
    padding: 0 20px;
    font-size: 14px;
}

.shopenter-form .title {
    font-size: 17px;
    text-align: center;
    margin-bottom: 28px;
}

.shopenter-form .item {
    padding: 8px 12.5px;
    margin-bottom: 24px;
    background-color: #f8f8f8;
    border-radius: 3px;
}

.shopenter-form .submit {
    height: 44px;
    margin: 20px auto 0;
    font-size: 16px;
    text-align: center;
    line-height: 43px;
    color: #1b1b1b;
    background-color: #FFD258;
    border-radius: 3px;
}
.scanrule{
    color: #0000ff!important;
    font-size: 15px!important;
}
.locbox{
    width: 100%;
    height: 100%;
}
.closeloc{
    position: fixed;
    bottom: 15px;
    right: 5px;
    color: #666;
}
</style>