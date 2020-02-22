<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            
    <div class="page"  >
        <van-card
          :title="good.shopname"
          :thumb="good.shopimg"
          centered
          @click="link" :data-url="good.appshopurl"
        />

        <van-card
          :title="good.title"
          :thumb="good.thumb"
          centered
          @click="link" :data-url="good.appurl"
        />

        <div class="orderinfo_data ">
            <div class="data_item item_cell_box">
                <div class="item_cell_flex">订单编号</div>
                <div>{{order.orderid}}</div>
            </div>     
            <div class="data_item item_cell_box">
                <div class="item_cell_flex">下单数量</div>
                <div>{{order.num}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.rule">
                <div class="item_cell_flex">购买规格</div>
                <div>{{order.rule}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.yydate">
                <div class="item_cell_flex">预约时间</div>
                <div>{{order.yydate}} {{order.yytime}}</div>
            </div>
            <div class="data_item item_cell_box">
                <div class="item_cell_flex">订单状态</div>
                <div v-if="order.isfail == 1">已失效，</div>
                <div v-if="order.status == 0">待支付</div>
                <div v-if="order.status == 1 || order.status == 2">待完成</div>
                <div v-if="order.status == 3">已完成</div>
                <div v-if="order.status == 4">已评价</div>
                <div v-if="order.status == 5">已退款</div>
            </div>
            <div class="data_item data_total item_cell_box">
                <div class="item_cell_flex">订单总价</div>
                <div class="total_money" >¥ {{order.fee}}</div>
            </div>
            <div class="data_item data_total item_cell_box" v-if="order.hxtimes > 0">
                <div class="item_cell_flex">还可使用</div>
                <div class="total_money" >{{order.hxtimes}}次</div>
            </div>
            <div class="data_item item_cell_box">
                <div class="item_cell_flex">{{params.shopbname}}收入</div>
                <div class="total_money" >¥ {{order.shopfee}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.sever > 0">
                <div class="item_cell_flex">服务费用</div>
                <div class="total_money" >¥ {{order.sever}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.fanxianm > 0">
                <div class="item_cell_flex">返现金额</div>
                <div class="total_money" >¥ {{order.fanxianm}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.jifendis > 0">
                <div class="item_cell_flex">{{params.jfbname}}抵扣</div>
                <div class="total_money" >¥ {{order.jifendis}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.cardfee > 0">
                <div class="item_cell_flex">优惠券减免</div>
                <div class="total_money" >¥ {{order.cardfee}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.hbdis > 0">
                <div class="item_cell_flex">红包减免</div>
                <div class="total_money" >¥ {{order.hbdis}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.salerfee > 0">
                <div class="item_cell_flex">一级{{params.fxbname}}支出</div>
                <div class="total_money" >¥ {{order.salerfee}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.salerfeea > 0">
                <div class="item_cell_flex">二级{{params.fxbname}}支出</div>
                <div class="total_money" >¥ {{order.salerfeea}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.salerfeeb > 0">
                <div class="item_cell_flex">三级{{params.fxbname}}支出</div>
                <div class="total_money" >¥ {{order.salerfeeb}}</div>
            </div>
            <div class="data_item item_cell_box">
                <div class="item_cell_flex">配送方式</div>
                <div class="total_money" >{{order.taketype == 1 ? '到店使用' : '配送到家'}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.expfee > 0">
                <div class="item_cell_flex">配送费</div>
                <div class="total_money" >¥ {{order.expfee}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.pakfee > 0">
                <div class="item_cell_flex">包装费</div>
                <div class="total_money" >¥ {{order.pakfee}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.toshopname">
                <div class="item_cell_flex">选择门店</div>
                <div class="total_money" >{{order.toshopname}}</div>
            </div>
            <div class="data_item item_cell_box">
                <div class="item_cell_flex">支付方式</div>
                <div class="total_money" >
                    {{order.paytype == 0 ? '微信支付' : ''}}
                    {{order.paytype == 1 ? '余额支付' : ''}}
                    {{order.paytype == 2 ? '到店支付' : ''}}
                </div>
            </div>
            <div class="data_item item_cell_box" v-if="order.hxuser">
                <div class="item_cell_flex">{{params.hxbname}}人</div>
                <div class="total_money" >{{order.hxuser}}</div>
            </div>
            <div class="data_item  item_cell_box">
                <div class="item_cell_flex">姓名</div>
                <div class="total_money" >{{order.name}}</div>
            </div>
            <div class="data_item  item_cell_box">
                <div class="item_cell_flex">电话</div>
                <div class="total_money" >{{order.tel}}</div>
            </div>
            <div class="data_item  item_cell_box" v-if="order.address">
                <div class="item_cell_flex">地址</div>
                <div class="total_money" >{{order.address}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.exname">
                <div class="item_cell_flex">快递名称</div>
                <div class="total_money" >{{order.exname}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.exnum">
                <div class="item_cell_flex">快递编号</div>
                <div class="total_money" >{{order.exnum}}</div>
            </div>
            <div class="data_item item_cell_box" v-if="order.subform.length > 0" v-for="(item,index) in order.subform" :key="index">
                <div class="item_cell_flex">{{item.name}}</div>
                <div class="total_money" v-if="item.type == 'multi' || item.type == 'region'">
                    <font v-for=" (inn,i) in item.value"  :key="i"> {{ inn }}， </font>
                </div>
                <div class="total_money" v-else>{{item.value}}</div>
            </div>
        </div>

        <div v-if="order.mess" class="mt20 orderinfo_mess item_cell_box">
            <div class="mess_title">备注内容</div>
            <div class="item_cell_flex mess_content">{{order.mess}}</div>
        </div>

        <div v-if="order.log" class="mt20 orderinfo_log">
            <div v-for="item in order.log" class="log_item item_cell_box">
                <div class="log_item_l">{{item.t}}</div>
                <div class="item_cell_flex">{{item.s}}</div>
            </div>
        </div>

        <div v-if="hexiao.length > 0" class=" orderinfo_log">
            <div v-for="item in hexiao" class="log_item item_cell_box">
                <div class="log_item_l">{{item.time}}</div>
                <div class="item_cell_flex">{{item.nickname}}{{params.hxbname}}{{item.times <= 0 ? 1 : item.times}}次</div>
            </div>
        </div>

        <van-steps direction="vertical" :active="0" v-if="express.length > 0">
            <van-step v-for="item in express">
                <div>{{item.time}}</div>
                <p>{{item.desc}}</p>
            </van-step>
        </van-steps>

    </div>

    <div class="footer_box" >
        <div class="item_cell_box order_foot">
            <div class="item_cell_flex"></div>
            <!-- <div v-if="{{order.status == 0}}" class="bot_btn" bindtap="dealorder" data-type="cancel" >删除订单</div> -->
            <div class="bot_btn"  @click="bindtap($event,'tel')" :data-tel="order.tel ? order.tel : order.address.tel" >联系买家</div>
            <div v-if="(order.status == 1 || order.status == 2) && order.taketype == 2" class="bot_btn"  @click="dealorder" data-type="send" >发货</div>
            <div v-if="(order.status == 1 || order.status == 2) && order.iscomo == 0" class="bot_btn"  @click="dealorder" data-type="com" >完成</div>
            <div v-if="order.istaked == 0 && order.taketype == 2 && order.status == 1" class="bot_btn" @click="dealorder" data-type="take" >接单</div>
        </div>
    </div>


        <van-popup v-model="showexpress" position="bottom">
            <div class="icon_box">
                <div class="express_head">填写快递信息</div>
                <van-cell-group>
                    <van-field  v-model="expressname"  label="快递名称" placeholder="" />
                    <van-field  v-model="expressnum"  type="tel" label="快递编号" placeholder="" />
                </van-cell-group>

                <div class="my_btn express_btn bg-pri" @click="subexpress">提交</div>         
            </div>
        </van-popup>
            
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Card,Popup,Field,cellGroup,Step,Steps } from 'vant';
	export default {
        name : 'adminorderinfo',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [Card.name] : Card,
            [Step.name] : Step,
            [Steps.name] : Steps,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                good : false,
                hexiao: false,
                order : false,
                showexpress : false,
                expressname : '',
                expressnum : '',
                express : [],
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
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            dealorder( e ){
                var self = this;
                var id = self.order.orderid;
                var type = e.currentTarget.dataset.type;
                var postdata = {
                    oid : id,
                    op:'order'+type
                };
                if( type == 'cancel' || type == 'com' || type == 'take' ){
                    var nostr = '确定删除订单吗？';
                    if( type == 'com' ) {
                        var nostr = '确定完成订单吗？';
                    }
                    if( type == 'take' ) {
                        var nostr = '确定接单吗？';
                    }

                    Dialog.confirm({
                        message: nostr
                    }).then(() => {
                        self.$util.http('admin','GET',postdata,function(res){
                            if ( !res.errno && res.data ) {
                                if( type == 'cancel' ){
                                    self.$toast('已删除');
                                    self.$router.go(-1);

                                }else if(type == 'com'){
                                    self.$toast('已完成');
                                    self.order.status = 3;
                                }else if(type == 'take'){
                                    self.$toast('已接单');
                                    self.order.istaked = 1;
                                }

                            }else{
                                self.$toast(res.message);
                            }
                        },true)
                    });
                }else if( type == 'pay' || type == 'com' || type == 'express' ){
                    self.$util.http('order','GET',postdata,function(res){     
                        self.$toast(res.message);
                    });
                }else if( type == 'send' ){
                    self.expressoid = id;
                    self.showexpress = true;
                }
            },
            subexpress(){ // 发货
                var self = this;
                var postdata = {
                    op : 'send',
                    oid : self.expressoid,
                    name : self.expressname,
                    num : self.expressnum,
                };
                self.$util.http('admin','GET',postdata,function(res){ 
                    if ( !res.errno && res.data ) {
                        self.order.status = 2;
                        self.showexpress = false;
                    }
                    self.$toast(res.message);
                });
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'orderinfo',
                    oid : query.id ? query.id : 0,
                }
                self.$util.http('admin','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.hexiao = res.data.hexiao;
                        self.params = res.data.params;
	                   	self.order = res.data.order;
                        self.good = res.data.good;
		                
						self.inited = 2;

                        if(self.order.exname && self.order.exnum){
                            var postdata = {
                                op:'express',
                                name:self.order.exname,
                                num:self.order.exnum,
                            }
                            self.$util.http('admin','GET',postdata,function(res){
                                if( !res.errno && res.data  ){
                                    self.express = res.data;
                                }
                            })
                        }

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
    padding-bottom: 75px;
}

.zan-steps__icons{
    background-color : rgba(255, 255, 255, 0)!important;
}
.orderinfo_bg{
    background: #ed414a;
    padding: 20px 10px;
    color: #fff;
}
.zan-steps--steps .zan-steps__step--done {
    color:#fff;
}
.zan-steps--steps .zan-steps__step {
    color:#fff;
}

.orderinfo_bg2{
    background: #ed414a;
    color: #fff;
    padding: 30px 10px;
}
.orderlist_goods_title{
    min-height: 40px;
}
.orderinfo_goods {
    padding: 10px;
    background: #fff;
    margin-bottom: 10px;
}
.orderlist_mid_item{
    background: #f1f1f1;
    padding: 5px;
    border-bottom: 1px solid #fff;
}
.orderinfo_data{
    background: #fff;
    padding: 10px;
    font-size: 14px;
    margin-bottom: 10px;
}
.data_item{
    padding: 10px 0;
    color: #656565;
}
.data_item div{
    color: #656565;
}

.data_total{
    padding: 10px 0;
    border-top: 1px solid #eee;
    color: #333;
}
.data_total .total_money{
    color: #449aff;
    font-size: 16px;
}

.orderinfo_log{
    padding: 10px;
    background: #fff;
    font-size: 14px;
}
.log_item{
    padding: 2.5px 0;
}
.log_item_l{
    width: 140px;
    padding-right: 10px;
}
.bot_btn{
    padding: 2.5px 10px!important;
    border:1px solid #ddd!important;
    border-radius: 2.5px!important;
    margin-right: 10px!important;
    color: #666!important;
    font-size: 14px!important;
}
.order_foot{
    padding: 10px 0;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 0.5px solid #eaeaea;
}
.orderinfo_address{
    align-items: center;
    background: #fff;
    padding: 5px;
}
.orderinfo_address .item_cell_flex{
    padding-left: 10px;
}
.orderinfo_tel,.orderinfo_add{
    font-size: 14px;
    color: #999;
}
.orderinfo_tel{
    padding-left: 10px;
}
.orderinfo_shop{
    background: #fff;
    padding: 10px;
    margin: 10px 0;
    align-items: center;
    font-size: 12px;
}

.orderinfo_shop_r{
    padding-left: 10px;
}
.orderinfo_shop_btn{
    display: inline-block;
}
.orderinfo_shopbtn_item{
    width: 50%;
}
.orderinfo_mess{
    background: #fff;
    font-size: 14px;
    padding: 10px;
    color: #333;
}
.mess_content{
    padding-left: 5px;
}

.orderinfo_qr{
    margin-top: 5px;
}
.orderinfo_qr_r{
    width: 150px;
    padding-left: 10px;
}
.orderinfo_qr_r img{
    width: 150px;
    height: 150px;
    border: 1px solid #eee;
}
.orderinfo_shop_tip{
    color: #666;
    font-size: 13px;
}
.zan-steps{
    overflow:hidden;
}
.zan-steps__title{
    font-size: 15px!important;
}

.orderinfo_goods_rule{
    font-size: 14px;
    line-height: 16px;
}

.formdata_l{
    width: 100px;
}
.formdata_item{
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}
.formdata_item:last-child{
    border-bottom: 0;
}

.zan-steps--vsteps .zan-steps__step {
    display: flex;
}
.zan-steps--vsteps .zan-steps__step .zan-steps__title:nth-of-type(1){
    width: 90px;
}
.zan-steps--vsteps .zan-steps__step {
    padding:10px 0;
}

.express_list{
    max-height: 100vw;
    
}

/**/
.orderinfo_shop_t {
    padding: 10px 0;
}
.orderinfo_shop_t:first-child{
    border-bottom: 0.5px solid #eaeaea;
}

.shopinfo {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px;
}
.shopinfo_head img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding-right: 10px;
}
.shopinfo_nick {
    color: #656565;
    font-weight: 500;
}
.zan-icon{
    color: #969696;
}
.orderinfo_shop_l{
    color: #656565;
}
.mess_title{
    color: #656565;
}


.express_head{
    font-size: 16px;
    padding: 10px;
    text-align: center;
}
.express_item,.tips{
    padding: 10px;
    align-items: center;
}
.tips{
    font-size: 13px;
    color: #999;
}
.express_btn{
    width: 100%;
    border-radius: 0;
    height: 44px;
    line-height: 44px;
    text-align: center;
}
.icon_item_r input{
    border-bottom: 1px solid #ddd;
    height: 40px;
    padding-left: 10px;
}

.zan-steps{
    overflow:hidden;
}
.zan-steps__title{
    font-size: 15px!important;
    padding-left:27px!important;
    display: block!important;
}
.zan-steps--vsteps .zan-steps__step {
    padding:10px 0;
}

.express_list{
    max-height: 100vw;
    
}


</style>