<template>
	
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
        <div class="user-top" style="background-color:#449aff;">
            <div class="info item_cell_box" @click="link" :data-url="'/shopinfo?id='+shop.id">
                <div class="info_avatar">
                    <img class="avatar" :src="shop.headimg" />
                </div>
                <div class="name item_cell_flex">{{shop.name}}</div>
                <van-icon name="arrow" size="16" />
            </div>
            <div class="detial">
                <div class="item">
                    <div class="num">{{shop.todayfee}}</div>
                    今日销售
                    
                </div>
                <div class="item">
                    <div class="num">{{shop.todayorder}}</div>
                    今日订单
                    
                </div>
                <div class="item">
                    <div class="num">{{shop.todayscan}}</div>
                    今日访客
                    
                </div>
                <div class="item">
                    <div class="num">{{shop.money*100/100}}</div>
                    账户余额
                    
                </div>
            </div>
        </div>

        <div class="sindex_box">
            <div class="sindex_item" @click="link" data-url="/adminorder">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_a.png" >
                </div>
                <div class="sindex_name">订单管理</div>
            </div>
            <div class="sindex_item" @click="link" data-url="/admingoods" v-if="params.amhide == 0 || !params.amhide">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_b.png" >
                </div>
                <div class="sindex_name">{{params.goodbname}}管理</div>
            </div>
            <div class="sindex_item" @click="link" data-url="/adminpub" v-if="(params.amhide == 0 || !params.amhide) && shop.iscpub != 1">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_e.png" >
                </div>
                <div class="sindex_name">发布{{params.goodbname}}</div>
            </div>
            <div class="sindex_item" @click="link" data-url="/adminbcard" v-if="params.amhide == 0 || !params.amhide">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_m.png" >
                </div>
                <div class="sindex_name">优惠券</div>
            </div>
            <div class="sindex_item" @click="link" data-url="/adminset" v-if="params.amhide == 0 || !params.amhide">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_c.png" >
                </div>
                <div class="sindex_name">{{params.shopbname}}设置</div>
            </div>
            <div class="sindex_item" @click="link" data-url="/adminmoney" v-if="params.amhdraw == 0 || !params.amhdraw">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_d.png" >
                </div>
                <div class="sindex_name">资金管理</div>
            </div>
            
            <div class="sindex_item" @click="link" :data-url="'/shopinfo?id='+shop.id" v-if="params.amhide == 0 || !params.amhide">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_g.png" >
                </div>
                <div class="sindex_name">预览{{params.shopbname}}</div>
            </div>
            <div class="sindex_item" @click="qrcode" data-type="shop" v-if="params.amhide == 0 || !params.amhide">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_h.png" >
                </div>
                <div class="sindex_name">{{params.shopbname}}二维码</div>
            </div>
            <div class="sindex_item" @click="toggleDialog" v-if="shop.auth && shop.auth.ispay != 1 && params.shoppay == 0" >
                <div class="sindex_img">
                    <img src="../../assets/images/admin_h.png" >
                </div>
                <div class="sindex_name">支付收款</div>
            </div>
            <div class="sindex_item" v-if="shop.auth && shop.auth.ispay != 1 && params.shoppay == 0" @click="link" data-url="/adminorder?type=7">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_a.png" >
                </div>
                <div class="sindex_name">收款订单</div>
            </div>
            <div class="sindex_item" @click="link" data-url="/adminhexiao" >
                <div class="sindex_img">
                    <img src="../../assets/images/admin_i.png" >
                </div>
                <div class="sindex_name">{{params.hxbname}}订单</div>
            </div>
            <div class="sindex_item" @click="link" data-url="/adminbadmin" v-if="isadmin || auth.admin == 1">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_k.png" >
                </div>
                <div class="sindex_name">管理人员</div>
            </div>
            <!-- <div class="sindex_item" @click="link" data-url="/adminbprint" v-if="params.amhide == 0 || !params.amhide">
                <div class="sindex_img">
                    <img src="/assets/images/admin_l.png" >
                </div>
                <div class="sindex_name">云打印机</div>
            </div> -->
            <div class="sindex_item" @click="showaction" v-if="params.isshopjf == 1">
                <div class="sindex_img">
                    <img src="http://img11.360buyimg.com/ddimg/jfs/t1/64691/33/15453/6587/5dccad07E5691cc85/de6c340e98361e2d.png" >
                </div>
                <div class="sindex_name">我的{{params.jfbname}}</div>
            </div>
            <div class="sindex_item" @click="link" :data-url="'/kefulist?role=shop&shopid='+shop.id" v-if="params.isgkf == 1">
                <div class="sindex_img">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t1/64907/2/1624/5932/5cfd126cE8f3c4bbe/91e1f95c528e37ef.png" >
                </div>
                <div class="sindex_name">客服中心</div>
            </div>

            <div class="sindex_item" @click="link" data-url="/adminbhelplist">
                <div class="sindex_img">
                    <img src="https://img11.360buyimg.com/ddimg/jfs/t30343/19/1476372028/7196/d51e2c1d/5ce1656bN3745e27d.png" >
                </div>
                <div class="sindex_name">帮助中心</div>
            </div>
            <div class="sindex_item" @click="loginout">
                <div class="sindex_img">
                    <img src="../../assets/images/admin_f.png" >
                </div>
                <div class="sindex_name">退出登录</div>
            </div>
        </div>


        <!-- <div class="sindex_box mt10">
            <div class="item_cell_box data_item">
                <div class="data_in ">
                    <div class="data_int">{{shopdata.todayorder}}</div>
                    <div class="data_inb">今日订单量</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.todayfee}}</div>
                    <div class="data_inb">今日销售额</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.todayshopfee}}</div>
                    <div class="data_inb">今日订单收入<div>(完成和未完成)</div> </div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.good}}</div>
                    <div class="data_inb">{{params.goodbname}}数量</div>
                </div>
            </div>
            <div class="item_cell_box data_item">
                <div class="data_in ">
                    <div class="data_int">{{shopdata.todaycom}}</div>
                    <div class="data_inb">今日完成订单</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.todaycomfee}}</div>
                    <div class="data_inb">今日完成订单总额</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.todaycomshopfee}}</div>
                    <div class="data_inb">今日完成订单收入</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.allfee}}</div>
                    <div class="data_inb">累计完成订单收入</div>
                </div>
            </div>
            <div class="item_cell_box data_item">
                <div class="data_in ">
                    <div class="data_int">{{shopdata.allcom}}</div>
                    <div class="data_inb">累计完成订单量</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.allwail}}</div>
                    <div class="data_inb">待完成订单量</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.waitfee}}</div>
                    <div class="data_inb">待完成订单总额</div>
                </div>
                <div class="data_in ">
                    <div class="data_int">{{shopdata.refund}}/{{shopdata.allrefund}}</div>
                    <div class="data_inb">已退款订单量 <div>/总额</div> </div>
                </div>
            </div>
        </div> -->
        <van-action-sheet v-model="isshopjf" :actions="jfactions" :title="'剩余'+params.jfbname+' '+ (shop.jifen > 0 ? shop.jifen*100/100 : '0')" round @close="showaction" @select="onSelectjf" />

        <van-popup v-model="showpayqr" position="bottom">
            <div class="zan-dialog__container item_cell_box">
                <div class="payqr_item bg-pri" @click="link" :data-url="'/adminpay?shopid='+shop.id">
                    收款页面
                </div>
                <div class="payqr_item" @click="qrcode" data-type="pay">
                    收款二维码
                </div>
            </div>
        </van-popup>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup,ImagePreview,Icon,ActionSheet } from 'vant';
    import tabbar from '../../components/tabbar';
	export default {
        name : 'adminindex',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Icon.name] : Icon,
            [ActionSheet.name] : ActionSheet,
            tabbar
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
                isadmin : false,
                showpayqr : false,
                shopdata : {},
                auth : {},
                isshopjf : false,
                jfactions : [
                    {name:'充值积分',url:'/adminjifenadd'},
                    {name:'赠送积分',url:'/adminjifengive'},
                    {name:'积分记录',url:'/adminjifenlog'}
                ]
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
            loginout(){
                var self = this;
                self.$util.http('admin','GET',{op:'loginout'},function(res){     
                    if (!res.errno && res.data) {

                        Toast({
                            message : '已退出',
                            type : 'success',
                            onOpened : function(){
                                self.$router.push(res.data.appurl);
                            }
                        })
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            qrcode(e){
                var self = this;
                var postdata = {
                    op:'shopqrcode',
                    type : e.currentTarget.dataset.type
                }
                self.$util.http('admin','GET',postdata,function(res){     
                    if (!res.errno && res.data) {
                        ImagePreview({
                            images : [res.data.url],
                            closeOnPopstate : true
                        });
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            toggleDialog(){
                this.showpayqr = !this.showpayqr;
            },
            showaction(){
                this.isshopjf = !this.isshopjf;
            },
            onSelectjf(e){
                this.$router.push(e.url)
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'index',
                    pid : query.pid ? query.pid : 0,
                }
                self.$util.http('admin','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.isadmin = res.data.isadmin;
                        self.params = res.data.params;
	                   	self.shop = res.data.shop;
                        self.shopdata = res.data.shopdata;
                        self.bindurl = res.data.bindurl;
                        self.auth = res.data.auth;
		                
                        self.jfactions[0].name = '充值'+self.params.jfbname;
                        self.jfactions[1].name = '赠送'+self.params.jfbname;
                        self.jfactions[2].name = self.params.jfbname+'记录';

						self.inited = 2;
	                }else{
	                	self.$toast({
                            message : res.message,
                            duration : 1000,
                            onClose : function(){
                                self.$router.push(res.data.appurl);
                            }
                        });
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
    background: #fcfcfc;
}
.user-top {
    margin-bottom: 9px;
    padding: 10px;
}

.user-top .info {
    padding-top: 0px;
    color: #fff;
    align-items: center;
}

.user-top .info .name {
    font-size: 18px;
    font-weight: bold;
    padding-left:10px;
}

.user-top .info .rank {
    font-size: 14px;
}

.user-top .detial {
    position: relative;
    z-index: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    margin-top: 15px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 2.5px 0 rgba(0,0,0,0.1);
}
.info_avatar{
    width: 50px;
    height: 50px;
}
.user-top .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fcfcfc;
}

.user-top .detial .item {
    -webkit-box-flex: 1;
    flex: 1;
    padding: 12px 0;
    font-size: 12px;
    text-align: center;
    line-height: 23px;
}

.user-top .detial .item .num {
    font-size: 18px;
    color: #449aff;
}

.sindex_box{
    overflow: hidden;
    padding: 10px 0;
    background: #fff;
}
.sindex_item{
      width: 25%;
      float: left;
      text-align: center;
    padding: 10px 0;
}
.sindex_item:nth-of-type(4n){
  border-right: 0;
}
.sindex_img{
    height: 40px;
}
.sindex_item img{
    width: 25px;
    height: 25px;
    display: inline-block;
}
.sindex_name,.sindex_num{
    padding: 5px 0;
}
.sindex_name{
    font-size: 13px;
    padding-top:10px;
}
.sindex_num{
    color: #969696;
    padding-top: 0;
    font-size: 12px;
    height: 15px;
}
.payqr_item{
    text-align: center;
    width: 50%;
    padding: 20px 0;
    font-size: 15px;
}
.payqr_item:first-child{
    border-right: 0.5px solid #eee;
}

.data_in{
    text-align: center;
    padding-bottom: 10px;
    width: 25%;
    color: #999;
    font-size: 12px;
}
.data_int{
    padding-bottom: 5px;
    font-size: 17px;
    color: #333;
    font-weight: bold;
}
.data_inb{
    max-width: 90px;
}

</style>