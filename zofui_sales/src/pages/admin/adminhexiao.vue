<template>
	
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" />
        <div id="content" v-if="inited == 2">
          
    <div class="frm_group mt20" >
        <van-field v-model="code" label="编码" placeholder="输入编码" :right-icon=" dev == 'wx' ? 'scan' : ''" @click-right-icon="scan" />
    </div>

    <div class="orderinfo_good item_cell_box mt20" v-if="good">
        <div class="good_thumb">
            <img v-lazy="good.thumb">
        </div>
        <div class="good_title item_cell_flex">
            {{good.title}}
        </div>
    </div>

    <div class="orderinfo mt20" v-if="order">
        <div class="order_item item_cell_box">
            <div class="item_cell_flex">订单编号</div>
            <div>{{order.orderid}}</div>
        </div>
        <div class="order_item item_cell_box">
            <div class="item_cell_flex">订单金额</div>
            <div v-if="order.fee*1 > 0">{{order.fee*100/100}}</div>
        </div>
        <div class="order_item item_cell_box">
            <div class="item_cell_flex">购买数量</div>
            <div>{{order.num}}</div>
        </div>     
        <div class="order_item item_cell_box">
            <div class="item_cell_flex">支付方式</div>
            <div v-if="order.paytype == 0">在线微信支付</div>
            <div v-if="order.paytype == 1">在线余额支付</div>
            <div v-if="order.paytype == 2">到店支付</div>
        </div>
        <div class="order_item item_cell_box" v-if="order.address && order.address.name">
            <div class="">买家信息</div>
            <div class="item_cell_flex">
                <div>{{order.address.name}} {{order.address.tel}}</div>
                <div>{{order.address.address}}</div>
            </div>
        </div>
        <div class="order_item item_cell_box" v-if="order.name" >
            <div class="item_cell_flex">买家姓名</div>
            <div>{{order.name}}</div>
        </div> 
        <div class="order_item item_cell_box" v-if="order.tel" @click="bindtap($event,'tel')" :data-tel="order.tel">
            <div class="item_cell_flex">买家电话</div>
            <div>{{order.tel}}</div>
        </div>

        <div class="order_item item_cell_box" v-if="order.yydate">
            <div class="item_cell_flex">预约时间</div>
            <div>{{order.yydate}} {{order.yytime}}</div>
        </div>
        <div class="order_item item_cell_box" v-if="order.mess">
            <div class="item_cell_flex">买家备注</div>
            <div>{{order.mess}}</div>
        </div>
        <div class="order_item item_cell_box" v-if="order.lotinfo && order.lotinfo.lotpname">
            <div class="item_cell_flex">中奖等级</div>
            <div>{{order.lotinfo.lotpname}}</div>
        </div>
        <div class="order_item item_cell_box" v-if="order.lotinfo && order.lotinfo.lotptip">
            <div class="item_cell_flex">中奖提示</div>
            <div>{{order.lotinfo.lotptip}}</div>
        </div>

        <div class="order_item item_cell_box" v-if="order.subform.length > 0" v-for="(item,index) in order.subform" :key="index">
            <div class="item_cell_flex">{{item.name}}</div>
            <div v-if="item.type == 'multi' || item.type == 'region'">
                <font v-for="(inn,i) in item.value" :key="i"> {{ inn }}， </font>
            </div>
            <div v-else>{{item.value}}</div>
        </div>

        <div class="order_item item_cell_box" >
            <div class="item_cell_flex">还可{{params.hxbname}}</div>
            <div>{{order.hxtimes}}次</div>
        </div>

        
        <van-field v-model="times" :label="params.hxbname+'数量'" :placeholder="'输入'+params.hxbname+'数量'" right-icon="edit" />

    </div>
    <div class="btn save" @click="hexiao" v-if="order">{{params.hxbname}}</div>
    <div class="btn save" @click="select" v-else>查询</div>            
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Field } from 'vant';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'adminhexiao',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Field.name] : Field,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                feedata : {},
                times : 1,
                order : false,
                good : {},
                code : '',
                dev : '',
	  		}
	  	},
        activated:function(e){

        },
	  	created:function(e){
            this.initData();
            this.inited = 2;
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
            scan(){
                console.log('123')
                wx.scanQRCode();
            },
            select(){
                var self = this;
                if( !self.code ) {
                    self.$toast('请输入编码');return false;
                }

                self.$util.http('admin','GET',{op:'selecthexiao',code:self.code},function(res){      
                    if (!res.errno && res.data ) {
                        self.order = res.data.order;
                        self.good = res.data.good;
						self.params = res.data.params;
                    }else{
                        self.$toast( res.message );
                        self.order = null;
                        self.good = null;
                        
                        if( res.errno == 2 ){
                            self.$router.push('/adminlogin');
                        }
                    }
                },true);
            },
            hexiao(){
                var self = this;
                if( !self.code ) {
                    self.$toast('请输入编码');return false;
                }
                self.$util.http('admin','GET',{op:'hexiao',code:self.code,times:self.times},function(res){
                    if (!res.errno && res.data) {
                        Toast({
                            message : res.message,
                        })
                        self.order = null;
                        self.good = null;
                        self.code = '';

                    }else{
                        self.$toast( res.message );
                        if( res.errno == 2 ){
                            self.$router.push('/adminlogin');
                        }
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;

                self.dev = self.$util.dev();

                if( query.scene && query.scene.length > 1 ){
                    self.code = query.scene;
                    self.select();
                }
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
.van-cell{
    padding-left: 10px;
    border-bottom: 1px solid #eee;
}
.orderinfo .van-cell{
    padding-left: 0;
    padding-right: 0;
}
.btn{
    height: 44px;
    line-height: 44px;
    background: #fb2d37;
    text-align: center;
    border-radius: 1.5px;
    color: #fff;
    position: fixed;
    left: 0px;
    width: 100%;
    bottom: 0;
}
.save{
    margin-top: 10px;
}
.save font{
    font-size: 12px;
}
.applyed{
    border:0.5px solid #eaeaea;
    display: inline-block;
    width: 200px;
    line-height: 50px;
    background: #fff;
    border-radius: 2.5px;
    text-align: center;
    color: #969696;
    margin-top: 20%;
    margin-left: 87.5px;

}
.time_item{
    width: 60px;
    border:0.5px solid #eaeaea;
    text-align: center;
    margin: 0 2.5px;
}

.orderinfo {
    padding: 10px;
    background: #fff;
}
.order_item{
    padding: 10px 0;
    border-bottom: 0.5px solid #eaeaea;
    align-items: center;
}

.orderinfo_good{
    padding: 10px;
    background: #fff;
}
.good_thumb{
    width: 50px;
    height: 50px;
}
.good_thumb img{
    width: 50px;
    height: 50px;
}
.good_title{
    padding: 10px;
}

div{
    font-size: 14px;
}

/*form*/
.frm_form{
    position: relative;
    border-bottom: 0.5px solid #eee;
}
.frm_place{
    position: absolute;
    left: 5px;
    top: 5px;
    color: #969696;
    font-size: 14px;
}
.frm_item{
    padding: 10px;
    background: #fff;
    border-bottom: 0.5px solid #eaeaea;
}
.frm_item:last-child{
    border:0;
}
.frm_title{
    color: #656565;
    width: 75px;
}
.frm_input{
    padding: 5px;
    width: 100%;
}
.frm_tips{
    color: #969696;
    font-size: 11px;
}
.frm_notips{
    color: #cbcfd2;
    padding: 5px;
}
.frm_pick{
    padding: 5px;
}
.input{
    color: #333;
    line-height: 0px;
    padding-left: 10px;
}
.tips{
    padding: 0;
    font-size: 11px;
}
</style>