<template>
	
    <div  id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            

        <van-cell-group>

            <van-field v-model="card.name" clickable clearable label="卡券名称" type="text" placeholder="输入名称" >
            </van-field>

            <div class="van-cell van-cell--clickable van-field">
                <div class="van-cell__title van-field__label">
                    <span>卡券类型</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="card.type" >
                        <van-radio name="0">在线使用</van-radio>
                        <van-radio name="1">到店使用</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <div class="van-cell van-cell--clickable van-field" >
                <div class="van-cell__title van-field__label">
                    <span>前端展示</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="card.isshow" >
                        <van-radio name="0">展示</van-radio>
                        <van-radio name="1">不展示</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <div class="van-cell van-cell--clickable van-field" v-if="card.shoppay == 0">
                <div class="van-cell__title van-field__label">
                    <span>收款支付时使用</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="card.isspay" >
                        <van-radio name="0">不可使用</van-radio>
                        <van-radio name="1">可使用</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <van-field v-if="card.type == 1" v-model="card.hxtimes" clickable clearable label="核销次数" type="tel" placeholder="可到店使用的次数" >
            </van-field>
            <div class="van-cell van-cell--clickable van-field" v-if="card.type == 1">
                <div class="van-cell__title van-field__label">
                    <span>隐藏面值</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="card.hidefee" >
                        <van-radio name="0">不隐藏</van-radio>
                        <van-radio name="1">隐藏</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <van-field v-model="card.fee" clickable clearable label="卡券面值" type="number" placeholder="可抵扣的金额" >
                <div slot="button" >元</div>
            </van-field>

            <van-field v-model="card.use" clickable clearable label="使用条件" type="number" placeholder="订单金额大于条件才能使用" >
                <div slot="button" >元</div>
            </van-field>
            <van-field v-model="card.maxtake" clickable clearable label="每人可领" type="number" placeholder="每人可领取的数量" >
                <div slot="button" >次</div>
            </van-field>
            <van-field v-model="card.stock" clickable clearable label="卡券数量" type="number" placeholder="库存数量" >
                <div slot="button" >张</div>
            </van-field>
            <div class="van-cell van-cell--clickable van-field">
                <div class="van-cell__title van-field__label">
                    <span>领取权限</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="card.auth" >
                        <van-radio name="0">所有用户</van-radio>
                        <van-radio name="1">仅限会员领取</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <div class="van-cell van-cell--clickable van-field">
                <div class="van-cell__title van-field__label">
                    <span>允许赠送</span>
                </div>
                <div class="van-cell__value">
                    <div class="van-field__body">
                    <van-radio-group class="my-radio tl" v-model="card.iszs" >
                        <van-radio name="0">不可赠送</van-radio>
                        <van-radio name="1">可赠送他人</van-radio>
                    </van-radio-group>
                    </div>
                </div>
            </div>
            <van-field v-model="card.usetime" clickable clearable label="有效期" type="number" placeholder="从领取后此时间段内可使用" >
                <div slot="button" >天</div>
            </van-field>


            <van-field clickable  label="开始时间" readonly :placeholder="card.start ? card.start : '可领取的开始时间'" @click="start = true" >
            </van-field>
            <van-popup v-model="start" position="bottom" >
                <van-datetime-picker v-model="card.showstart" type="datetime" @cancel="start = false" @confirm="timefn($event,'start')"  />
            </van-popup>

            <van-field clickable  label="结束时间" readonly :placeholder="card.end ? card.end : '可领取的结束时间'" @click="end = true" >
            </van-field>
            <van-popup v-model="end" position="bottom" >
                <van-datetime-picker v-model="card.showend" type="datetime" @cancel="end = false" @confirm="timefn($event,'end')"  />
            </van-popup>

            <van-field v-model="card.gid" clickable clearable label="可使用商品" type="text" placeholder="填入商品id，若多个商品使用空格分隔" >
            </van-field>

            <van-field border v-model="card.content" clickable clearable label="使用提示" type="textarea" placeholder="提示内容" >
            </van-field>

        </van-cell-group>

        <template v-if="card.type == 1">
            <div class="tips mt20 sever_type ">使用门店</div>
            <van-cell-group v-for="(item,index) in card.shop" :key="index" class="shoplist">
                <van-field v-model="item.name" clickable clearable label="名称" type="text" placeholder="门店名称" >
                </van-field>
                <van-field v-model="item.tel" clickable clearable label="电话" type="tel" placeholder="门店电话" >
                </van-field>
                <van-field v-model="item.add" clickable clearable label="地址" type="text" placeholder="门店地址" >
                </van-field>
                <div class="delshop van-icon van-icon-close" @click="deleteCard" :data-i="index"></div>
            </van-cell-group>

            <!-- <div class="shop_itembtn" bindtap="addshop" style="display:inline-block;margin:10rpx 0;">添加一个门店</div> -->
            <div style="text-align: center;">
                <van-button type="primary" @click="addshop" size="small">添加一个门店</van-button>
            </div>
            
        </template>


    <!-- <div class="frm_group " >
        

        <div class="frm_item item_cell_box" wx:if="{{card.type == 1}}">
            <div class="frm_title">使用门店</div>
            <div class="frm_form item_cell_flex">
                <div class="shop_item item_cell_box" wx:for="{{card.shop}}">
                    <div class="item_cell_flex shop_iteml">
                        <input class="frm_input" value="{{item.name}}" type="text"  bindinput="inputvalue" data-type="shop[{{index}}].name" placeholder-style="color:#cbcfd2;"  placeholder="名称" />
                        <input class="frm_input" value="{{item.tel}}" type="number"  bindinput="inputvalue" data-type="shop[{{index}}].tel" placeholder-style="color:#cbcfd2;"  placeholder="电话" />
                        <input class="frm_input" value="{{item.add}}" type="text"  bindinput="inputvalue" data-type="shop[{{index}}].add" placeholder-style="color:#cbcfd2;"  placeholder="地址" />
                    </div>
                    <div class="shop_itembtn" bindtap="deleteCard" data-i="{{index}}">删除</div>
                </div>
                <div class="shop_itembtn" bindtap="addshop" style="display:inline-block;margin:10rpx 0;">添加一个门店</div>
            </div>
        </div>
        
    </div> -->

    <div class="bot_place"></div>

    <div class="pub_pub" @click="pub" >
        <div class="mybtn" >保存</div>
    </div>

            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Button,Loading,List,Toast,Dialog,PullRefresh,Popup,Field,cellGroup,Radio,radioGroup,DatetimePicker } from 'vant';
    import tabbar from '../../components/tabbar';
	export default {
        name : 'adminbaddcard',
	  	components: {
            [Button.name] : Button,
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [Radio.name] : Radio,
            [radioGroup.name] : radioGroup,
            [DatetimePicker.name] : DatetimePicker,
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
                card : {id:0},
                isadmin : false,
                start : false,
                end : false,

	  		}
	  	},
	  	created:function(e){
            this.inited = false;
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
            timefn(e,type){
                var t = this.$util.formDate(e);
                if( type == 'start' ){
                    this.card.start = t;
                    this.card.showstart = new Date(t);
                    this.start = false;
                }else if(type == 'end'){
                    this.card.end = t;
                    this.card.showend = new Date(t);
                    this.end = false;
                }
            },
            deleteCard(e){
                var self = this;
                self.card.shop.splice(e.currentTarget.dataset.i,1);
            }, 
            addshop(){
                var self = this;
                if( !self.card.shop ){
                    self.$set(self.card,'shop',[]);
                    //self.card.shop = [];
                }
                self.card.shop.push({
                    name : '',
                    tel : '',
                    add : ''
                });
            },
            pub(){
                var self = this;
                var card = self.card;

                if( !card.name ) {
                    self.$toast('请填入备注名称');return false;
                }
                self.savedata();
            },
            savedata(){
                var self = this;
                var form = JSON.stringify( self.card );
                self.$util.http('admin','GET',{op:'pubcard',form:form},function(res){ 
                    if (!res.errno && res.data) {
                        self.$toast( {
                            message : res.message,
                            onClose : function(){
                                self.$router.go(-1);
                            }
                        } )
                    }else{
                        self.$toast( res.message );
                        if( res.errno == 2 ){
                            if( res.data.url ){
                                self.$router.push(res.data.url)
                            }
                        }
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'addcardstart',
                    cid : query.cid ? query.cid : 0,
                }
                self.$util.http('admin','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
	                   	self.card = res.data.card.id ? res.data.card : {id:0};
		                
                        self.card.showstart = self.card.start ? new Date(self.card.start) : new Date();
                        self.card.showend = self.card.end ? new Date(self.card.end) : new Date();

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
    background: #eee;
}
.shoplist{
    padding: 10px;
    background-color: #eee;
    position: relative;
}
.delshop{
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 24px;
}
.pub_pub{
    position: fixed;
    left: 2%;
    width: 96%;
    bottom: 5px;
}
.pub_pub .btn{
    background: #449aff;
    width: 100%;
}
.bot_place{
    height: 100px;
}

.shop_item{
    align-items: center;
    width: 100%;
    background: #f3f3f3;
    margin: 2.5px 0;
}
.shop_itembtn{
    font-size: 14.5px;
    padding: 1.5px 10px;
    border: 1px solid #ddd;
    background: #fff;
}
.shop_item input{
    border-bottom: 0.5px solid #fff;
    width: 100%;
    padding: 2.5px 0;
}
.shop_iteml{
    overflow: hidden;
}
.sever_type {
    font-size: 14px;
}
</style>