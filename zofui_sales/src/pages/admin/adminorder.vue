<template>
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            

        <van-tabs v-if="page.pdata.type == 0" v-model="actindex" sticky @change="tabchange" color="#449aff">
            <van-tab v-for="(item,index) in tab" :title="item" :key="index">
            </van-tab>
        </van-tabs>

        <div class="goodlist_goodbox" >
            <div class="pagelist" >

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <template v-if="datalist.length > 0">
                    <div v-for="item in datalist" class="goodlist_item" :key="item.id">
                        <div class="goodlist_top item_cell_box">
                            <div class="item_cell_flex">订单id：{{item.orderid}}</div>
                            <div class="list_status">{{item.statusstr}}{{item.taketype == 2 ? '，配送到家' : ''}}</div>
                        </div>
                        <div class="list_top item_cell_box" v-if="item.type == 0">
                            <div class="list_itemimg" @click="link" :data-url="item.appgoodurl">
                                <img v-lazy="item.thumb" >
                            </div>
                            <div class="item_cell_flex list_itemmid" @click="link" :data-url="item.appgoodurl">
                                <div class="list_itemtitle">{{item.title}}</div>
                                <div class="list_itemprice" ><font>¥ {{item.fee}}</font></div>
                            </div>
                        </div>
                        <div class="list_top item_cell_box" v-if="item.type == 7">
                            <div class="" >
                                <div class="list_itemprice" >收款订单 <font>¥ {{item.fee}}</font></div>
                            </div>
                        </div>
                        <div class="list_bot item_cell_box">
                            <div class="item_cell_flex">{{item.timestr}}</div>
                            
                            <template v-if="item.type == 0">
                                <div class="list_btn" @click="link" :data-url="item.appurl" :data-id="item.orderid">详情</div>
                                <div class="list_btn" v-if="(item.status == 1) && item.taketype == 2" @click="dealorder" data-type="send" :data-id="item.orderid">发货</div>
                                <div class="list_btn" v-if="item.status == 1 && item.taketype == 2 && item.istaked == 0" @click="dealorder" data-type="take" :data-id="item.orderid">接单</div>
                                <div class="list_btn" v-if="(item.status == 1 || item.status == 2) && iscomo == 0" @click="dealorder" data-type="com" :data-id="item.orderid">完成</div>
                                <!-- <div class="list_btn" v-if="item.status == 0 || item.status == 3" @click="dealorder" data-type="cancel" :data-id="item.orderid">删除</div> -->
                                <div class="list_btn"  v-if="item.isback == 1" @click="dealorder" data-type="refund" :data-id="item.orderid">退款</div>
                            </template>
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

        <van-popup v-model="showtaked">
            <div class="goodbuy_box">
                <div class="goodbuy_num item_cell_box intaked_box">
                    <div class="intaked_l">
                        <div class="goodbuy_name">备注内容：</div>
                    </div>
                    <div class="goodbuy_quantity item_cell_flex intaked_r">
                        <input type="text" class="intaked_input" bindinput="intaked" />
                    </div>
                </div>
                <div class="buy_confirm" catchtap="confirmtaked" data-id="" >确定</div>
            </div>
        </van-popup>


        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup,Tab,Tabs,Field,cellGroup } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name:'adminorder',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Tab.name] : Tab,
            [Tabs.name] : Tabs,
            [Field.name] : Field,
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
                
                page : {
                    pdata : {
                        doo : 'admin',
                        op : 'orderlist',
                        status : 0,
                        page : 1,
                        type : 0,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                tab : ['全部','待付款','待完成','已完成','已退款','退款中','已失效'],
                actindex : 1,
                showexpress : false,
                showtaked : false,
                expressname : '',
                expressnum : '',

	  		}
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
            subexpress(){
                var self = this;
                var postdata = {
                    op : 'send',
                    oid : self.expressoid,
                    name : self.expressname,
                    num : self.expressnum,
                };
                self.$util.http('admin','GET',postdata,function(res){    
                    if ( !res.errno && res.data ) {
                        for (var i = 0; i < self.datalist.length; i++) {
                            if( self.datalist[i].orderid == self.expressoid ){
                                self.datalist.splice(i,1);
                                self.datalist = self.datalist;
                                self.showexpress = false;
                                
                                self.$toast(res.message);
                            }
                        }
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            dealorder(e){
                var self = this;
                var id = e.currentTarget.dataset.id;
                var type = e.currentTarget.dataset.type;
                var postdata = {
                    oid : id,
                    op:'order'+type
                };
                if( type == 'cancel' || type == 'com' || type == 'refund' ){
                    var nostr = '确定删除订单吗？';
                    var comstr = '已删除';
                    if( type == 'com' ) {
                        var nostr = '确定完成订单吗？';
                        var comstr = '已完成';
                    }
                     if( type == 'refund' ) {
                        var nostr = '确定为此订单退款吗？';
                        var comstr = '已退款';
                    }

                    Dialog.confirm({
                        message: nostr
                    }).then(() => {
                        self.$util.http('admin','GET',postdata,function(res){
                            if ( !res.errno && res.data ) {
                                for (var i = 0; i < self.datalist.length; i++) {
                                    if( self.datalist[i].orderid == id ){
                                        self.datalist.splice(i,1);
                                        self.datalist = self.datalist;
                                        self.$toast(comstr);
                                    }
                                }
                            }else{
                                self.$toast(res.message);
                            }
                        },true)
                    });

                }else if( type == 'send' ){
                    self.expressoid = id;
                    self.showexpress = true;
                }else if( type == 'take' ){

                    self.$util.http('admin','GET',postdata,function(res){    
                        if ( !res.errno && res.data ) {
                            for (var i = 0; i < self.datalist.length; i++) {
                                if( self.datalist[i].orderid == id ){
                                    self.datalist[i].istaked = 1;
                                    self.$toast('已设为接单');
                                }
                            }
                        }else{
                            self.$toast(res.message);
                        }
                    },true);
                }
            },
            tabchange(index){
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
            initData(){
                var self = this;
                var query = this.$route.query;
				self.page.isend = false;
                self.page.geting = false;
                self.page.pdata.type = query.type ? query.type : 0;
				
                self.$util.pageList(this,this.page,function(res){  
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
                        self.iscomo = res.data.iscomo;
		                self.actindex = 0;

                        //self.maincolor = self.$util.

	                	
						self.inited = 2;
                    }else if( res.errno == 2 ){
                        self.$toast( res.message );
                        self.$router.push(res.data.appurl);
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
#main #content{
    min-height: 100vh;
    font-size: 14px;
    background: #fcfcfc;
}
.goodlist_top{
    padding: 7.5px 0;
    background: #fff;
    width: 100%;
}
.goodlist_order_item{
    width: 25%;
    padding: 2.5px 0; 
    text-align: center;
    font-size: 14px;
    color: #666;
}
.goodlist_order_item .zan-icon-arrow{
    transform: rotate(90deg);
    padding-left: 2.5px;
    display: inline-block;

}

.priceuptodown{
    animation:priceuptodown 0.5s;
    animation-fill-mode : forwards;
}
@keyframes priceuptodown
{
    from {transform:rotate(90deg);}
    to {transform:rotate(-90deg);}
}

.pricedowntoup{
    animation:pricedowntoup 0.5s;
    animation-fill-mode : forwards;
}
@keyframes pricedowntoup
{
    from {transform:rotate(-90deg);}
    to {transform:rotate(-270deg);}
}


.goodlist_goodbox{
    margin-top: 10px;
    padding-bottom: 100px;
}

.goodlist_item{
    background: #fff;
    padding: 10px;
    margin-top: 10px;
}

.list_itemimg{
    width: 75px;
    height: 75px;
    border-radius: 2.5px;
    overflow: hidden;
}
.list_itemimg img{
    width: 75px;
    height: 75px;
}
.list_itemmid{
    padding: 0 10px;
    padding-left: 15px;
}
.list_itemtitle{
    font-weight: 400;
    font-size: 15px;
    color: #656565;
}
.list_itemdesc{
    color: #969696;
    padding: 2.5px 0;
    font-size: 12px;
}
.list_itemprice{
    color: #969696;
    font-size: 12px;
    padding: 2.5px 0;
}
.list_status{
    color: #969696;
}
.list_itemprice font{
    color: #449aff;
    font-size: 15px;
}
.list_itemm{
    display: flex;
    height: 100%;
    color: #969696;
    font-size: 25px;
}


.goodlist_headbox{
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    background: #fff;
    z-index: 1;
}
.goodlist_headlist{
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
.goodlist_head{
    border-bottom: 1px solid #eee;

}
.gsort_item{
    display: inline-block;
    padding: 10px;
    font-size: 14px;
    color: #333;
}
.gsort_act{
    color: #ed414a;
    border-bottom: 1px solid #ed414a;
}
.order_byprice_box{
    margin: 0 auto;
    text-align: center;
    width: 50px;
}
.order_byprice_icon{
    width: 13px;
}
.order_byprice_icon img{
    width: 100%;
}

.list_top{
    border-bottom: 0.5px solid #fcfcfc;
    padding: 10px 0;
}
.list_bot{
    padding: 10px 0;
    font-size: 14px;
}
.list_btn{
    padding: 2.5px 10px;
    border: 1px solid #969696;
    color: #969696;
    margin-left: 10px;
    border-radius: 1.5px;
}
.list_bot .item_cell_flex{
    color: #969696;
    font-size: 12px;
}
.pub_btn{
    padding: 10px;
    padding-bottom: 0;
}
.pub_btn .btn{
    position: fixed;
    bottom: 5px;
    width: 355px;
    left: 10px;
    padding-bottom: 0;
}

/*dioa*/

.goodbuy_top,.goodbuy_num {
    padding: 10px;
}
.goodbuy_top div{
    color: #969696;
}
.goodbuy_top_close {
    font-size:25px;
}
.buy_confirm{
    background: #449aff;
    color: #fff;
    height: 44px;
    line-height: 44px;
    text-align: center;
}
.goodbuy_rule{
    max-height: 300px;
}
.goodbuy_rule_item {
    padding: 5px 10px;
    border-bottom: 0.5px solid #eaeaea;
}
.rule_item_name{
    color: #656565;
    font-size: 13px;
    padding-bottom: 5px;
}
.rule_item_price{
    color: #449aff;
    font-size: 12px;
}
.goodbuy_rule_item .zan-icon{
    color: #449aff;
    font-size: 25px;
}
.goodbuy_name{
    color: #969696;
}
.intaked_box{
    padding: 15px 0;
}
.intaked_input{
    padding: 15px 0;
    border-bottom: 0.5px solid #eee;
    font-size: 18px;
}
.goodlist_top{
  padding-bottom: 10px;
  color: #666;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}
.orderlist_top{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
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

.orderlist_top .zan-tab__bd--scroll{
    height: 55px!important;
}

</style>