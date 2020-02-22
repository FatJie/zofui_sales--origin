<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
                
                <div class="order-list" v-if="goodlist.length > 0">

                    <div class="item" v-for="item in goodlist" :key="item.shopid" >
                        <div class="top thin-border_b">
                            <div class="top-code">
                                {{item.shop}}
                            </div>
                        </div>
                        <div v-for="inn in item.list" :key="inn.id" class="mes" >
                            <div class="zan-icon color-pri van-icon " :class="inn.checked ? 'van-icon-checked' : 'van-icon-circle'" @click="checkitem" :data-id="inn.cid" ></div>

                            <div class="pic-box " @click="link" :data-url="inn.appurl">
                                <div class="image-box __100">
                                    <img v-lazy="inn.thumb" >
                                </div>
                            </div>
                            <div class="mes-name" v-if="inn.fail == 0">
                                <div class="tit" @click="link" :data-url="inn.appurl">
                                    {{inn.title}}
                                </div>
                                
                                <div class="desc">{{inn.rulename}}</div>
                                <div class="order-counter thin-border">
                                    <font @click="miusVal" data-type="1" :data-id="inn.cid" class="thin-border_r" :class="inn.num <= 1 ? 'disabled' : ''">-</font>
                                    <input disabled bindinput="bindVal"  type="number" v-model="inn.num" />
                                    <font @click="miusVal" data-type="2" :data-id="inn.cid" class="thin-border_l" :class="inn.num >= inn.stock ? 'disabled' : ''">+</font>
                                </div>
                            </div>
                            <div v-else class="desc">已失效</div>
                            <div class="zan-icon zan-icon-delete van-icon van-icon-delete color-sec delicon" @click="del" :data-id="inn.cid"></div>
                        </div>
                    </div>
                </div>

                <div class="cart_empty" v-else>
                    <div class="cart_tips">购物车是空的</div>
                    <div class=" btn_box">
                        <div class="statusbtn statusbtna color-pri border-pri" @click="link" data-url="/">返回首页</div>
                        <div class="statusbtn statusbtnb lbg-pri" @click="link" data-url="/">查看我的</div>
                    </div>
                </div>

                <div class="cart_box item_cell_box"  v-if="goodlist.length > 0">
                    <div class="zan-icon color-pri van-icon" :class="checkall ? 'van-icon-checked' : 'van-icon-circle'" @click="checkallfn">
                    </div>
                    <div @click="checkallfn">全选</div> 
                    <div class="allmoney item_cell_flex color-pri" >¥{{allmoney > 0 ? allmoney : '0'}}</div>
                    <div class="cart_count lbg-pri" @click="countit">结算</div>
                </div>

        </div>
    </div>

</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';

	export default {
        name : 'cart',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	tabbar
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : false,
                inited : false,
	  			params : {},
	  			cardinfo : {},
	  			userinfo : {},
	  			sharedata :{},
	  			checkall : false,
	  			allmoney : 0,
                goodlist : [],
	  		}
	  	},
	  	created:function(e){
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;        
	  	},       
	  	methods: {
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            countit(){
                var self = this;
                var arr = [];
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].checked ){
                            var ina = {cid:item[j].cid,num:item[j].num*1};
                            arr.push( ina );
                        }
                    }
                }

                if( arr.length < 1 ){
                    self.$toast('还没选择');return false;
                }
                self.$util.setCache('zfssbuy',{arr:arr,type:'cart'});
                var tourl = '/orderconfirm';
                self.$router.push(tourl);
            },
            del(e){
                var self = this;
                var postdata = {
                    op:'delete',
                    id : e.currentTarget.dataset.id
                }
                self.$util.http('cart','GET',postdata,function(res){    
                    self.$toast(res.message);
                    if (!res.errno && res.data) {

                        for (var i = 0; i < self.goodlist.length; i++) {
                            var item = self.goodlist[i].list;

                            for (var j = 0; j < item.length; j++) {
                                
                                if( item[j].cid == postdata.id ){
                                    self.goodlist[i].list.splice(j,1);

                                    if( self.goodlist[i].list.length <= 0 ){
                                        self.goodlist.splice(i,1);
                                    }
                                    return false;
                                }
                            }
                        }
                    }
                },true);
                self.count();
            },
            checkitem(e){
                var self = this;
                var id = e.currentTarget.dataset.id;
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].cid == id ){
                            // 考虑到失效的商品
                            var status = item[j].fail == 1 ? false : !item[j].checked;
                            self.goodlist[i].list[j].checked = status;
                            self.checkall = false;
                            break;
                        }
                    }
                }
                self.count();
            },
            count(){
                var self = this;
                var num = 0;
                var money = 0;
                for (var i in self.goodlist) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( !item[j].fail && item[j].checked ){
                            money += item[j].num*item[j].show_price*1;
                        }
                    }
                }
                self.allmoney = money.toFixed(2)*1;
            },
            checkallfn(){
                var self = this;
                self.checkall = !self.checkall;
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( !item[j].fail ){
                            self.goodlist[i].list[j].checked = self.checkall;
                        }
                    }
                }
                self.count();
            },
            miusVal(e) {
                var self = this;
                var id = e.currentTarget.dataset.id;
                var type = e.currentTarget.dataset.type;
                var num = 1;
                for (var i = 0; i < self.goodlist.length; i++) {
                    var item = self.goodlist[i].list;
                    for (var j = 0; j < item.length; j++) {
                        if( item[j].cid == id ){
                            
                            if( type == 1 ){
                                num = item[j].num*1 - 1;
                                if( item[j].num <= 1 ){
                                    num = 1;
                                }
                            }else{
                                num = item[j].num*1 + 1;
                                if( item[j].num >= item[j].stock ){
                                    num = item[j].stock;
                                }
                            }
                            self.$set(item[j],'num',num*1);
                            break;
                        }
                    }
                }
                self.count();
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'info',
                    zfid : query.zfid ? query.zfid : 0,
                }
	            self.$util.http('cart','GET',postdata,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.goodlist = res.data.goodlist;

                        self.$util.share(wx,self.sharedata);
		                
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

.order-list .item {
    background: white;
    font-size: 12px;
    margin-top: 12px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    margin:10px;
    padding: 5px;
    border-radius: 4px;
}
.order-list .item .mes {
    padding: 5px 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #f7f7f7
}
.item .mes:last-child{
    border-bottom: 0;
}

.order-list .item .mes .pic-box {
    width: 70px;
    margin-right: 10px;
    flex-shrink: 0;
}
.order-list .item .mes .mes-name {
    -webkit-box-flex: 1;
    flex: 1;
}

.order-list .item .mes .mes-name .tit {
    height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
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
.order-list .item .top .top-code {
    font-size: 15px;
    display: inline-block;
    font-weight: bold;
}
.order-list .item .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 10px 0px;
    font-size: 12px;
}
.mes .zan-icon{
    font-size: 20px;
    margin-right: 5px;
}
.mes .delicon{
    font-size: 18px;
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

.order-counter text.disabled {
    color: #d8d8d8;
}

.order-counter input {
    width: 34px;
    height: 25px;
    text-align: center;
    background-color: #fff;
    border: 0;
    box-shadow: 0;
}
.mes-name .desc{
    padding: 5px 0;
    color: #8d8d8d;
}
.zan-icon-shop{
  padding-right: 5px;
  color: #8d8d8d;
  font-size: 15px;
  font-weight: bold;
}
.cart_box {
    position: fixed;
    bottom: 56px;
    left: 0;
    width: 100%;
    padding: 0 10px;
    z-index: 3;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    border-top: 0.5px solid #f7f7f7;
    align-items: center;
}

.cart_box .cart_count {
    width: 100px;
    text-align: center;
    height: 100%;
}
.cart_box .zan-icon{
    font-size: 20px;
    padding-right: 2.5px;
}
.cart_boxall text{
    display: inline-block;
}
.allmoney{
    text-align: right;
    padding-right: 5px;
    font-size: 15px;
}
.cart_tips{
    text-align: center;
    font-size: 12.5px;
    color: #999;
    margin-top: 100px;
}
.btn_box{
    text-align: center;
    margin-top: 50px;
}
.statusbtn{
    display: inline-block;
    border:1px solid #ff985a;
    padding: 10px 25px;
    border-radius: 25px;
    font-size: 16px;
    color: #ff985a;
    margin: 0 10px;
}

.statusbtn:last-child{
    background-color: #ff985a;
    color: #fff;
}



</style>