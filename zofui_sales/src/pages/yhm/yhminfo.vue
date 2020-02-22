<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="100" success-text="已刷新"> 

            <div class="main">
                <div class="coupon">
                    <div class="coupon_wrap">
                        
                        <div class="shop_name">{{info.code}}</div>
                        <div class="get_part" >
                            <div @click="copy" :data-copy="info.code" class="get_btn bg-pri" >复制优惠码</div>
                        </div>
                    </div>
                </div>
            </div>

            <template v-if="info.isall == 0">

                <template v-if="shoplist.length > 0">
                    <div class="sub_title ">
                        <font class="">以下{{params.shopbname}}可使用</font>
                    </div>
                    <div class="sub_shop">
                        <template v-for="(item,index) in shoplist" >
                            <shoplist :item="item"></shoplist>
                        </template>
                        
                    </div>
                </template>

                <template v-if=" goodslist.length > 0 ">
                    <div class="sub_title ">
                        <font class="">以下{{params.goodbname}}可使用</font>
                    </div>
                    <div class="sub_goods">
                        <div class="goods_item" :data-url="item.url" bindtap="navigateto" v-for="(item,index) in goodslist">
                            <img v-lazy="item.thumb" />
                            <font class="goods_tit">{{item.title}}</font>
                            <div class="goods_ft">
                                <font class="yhtext">优惠后</font>
                                <font class="price_cur item_cell_flex">{{item.afterprice}}</font>
                                <font class="price_org" v-if="item.oldprice*1 > 0">原价{{item.oldprice}}</font>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
           
            <div v-if="info.isall == 1" class="tips">此码适用于平台所有商品</div>
            
                
        </van-pull-refresh>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import shoplist from '../../components/shoplist';
	export default {
        name : 'yhmindex',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	shoplist,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                sort : [],
                goodslist : [],
                shoplist : [],
                info : {},
	  		}
	  	},
        activated:function(e){
            this.initData();
            
        },
	  	created:function(e){
	  		
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            copy(e){
                var self = this;
                this.$copyText(e.currentTarget.dataset.copy).then(function (e) {
                     self.$toast('已复制');
                }, function (e) {
                    self.$toast('复制失败');
                })
            },
            initData(){
                var self = this;
                self.dev = self.$util.dev();
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    id : params.id ? params.id : 0,
                    zfid : params.zfid ? params.zfid : 0,
                }
                self.$util.http('yhm','GET',postdata,function(res){
                    self.inited = 1;
                    if( !res.errno && res.data ){        
                        
                        self.params = res.data.params;
                        self.info = res.data.info;
                        self.shoplist = res.data.shoplist ? res.data.shoplist : [];
                        self.goodslist = res.data.goodslist ? res.data.goodslist : [];
                        
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
    position: relative;
}

.main {
    box-sizing: border-box;
    padding: 20px 15px 0px 15px;
}

.coupon {
    box-sizing: border-box;
    width: 345px;
    background-color: white;
    border-radius: 5px;
    padding: 20px 14.5px 5px 14.5px;
    position: relative;
}

.coupon_header {
    width: 345px;
    height: 5px;
    position: absolute;
    top: 0;
    left: 0;
}

.shop_logo {
    width: 59px;
    height: 59px;
    border: 0.5px solid #d2d2d2;
    border-radius: 50%;
    margin-bottom: 10px;
}

.coupon_wrap {
    position: relative;
    text-align: center;
    padding-bottom: 26px;
}

.shop_name {
    font-size: 20px;
    text-align: center;
    font-weight: bold;
}

.coupon_name {
    font-size: 30px;
    color: #ff4040;
    text-align: center;
    margin-top: 15px;
}



.code_wrap {
    height: 120px;
    width: 120px;
    margin: 0 auto 0px auto;
    position: relative;
}

.code {
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
}

.send_btn {
    font-size: 16px;
    color: white;
    margin: 0 auto;
    margin-top: 15.5px;
    text-shadow: 0.5px 1px #d23997;
    background: linear-gradient(to bottom,#ff6469,#ff2c72);
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 222px;
    border-radius: 50px;
}

.coupon_info {
    padding-top: 20.5px;
}

.info_item {
    margin-bottom: 31.5px;
}

.info_title {
    color: #353535;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10.5px;
}

.info_title::before {
    content: "\00A0\00A0";
    height: 16px;
    background-color: #ff6f6f;
    margin-right: 7.5px;
}

.info_content {
    font-size: 14px;
    line-height: 30px;
}

.record_item:first-child {
    margin-top: 0;
}

.record_item {
    font-size: 14px;
    color: #353535;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 17px;
}

.record_admin {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.admin_avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #e6e6e6;
}

.admin_name font {
    margin: 0 5.5px;
}

.get_btn {
    width: 222.5px;
    height: 40px;
    border-radius: 50px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: white;
    text-shadow: 0.5px 1px #d23997;
    margin: 20px auto 0px auto;
}

.can_click {
    background: linear-gradient(to bottom,#ff616a,#ff2b72);
}

.not_click {
    background-color: #d2d2d2;
    text-shadow: 0 0 white;
}

.share_btn {
    width: 39px;
    height: 12px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
}



/**/
.help_Mid {
    background-size: 100% 80px;
    width: 100%;
    overflow: hidden;
    height: 80px;
}
.sub_title {
    color: #353535;
    font-size: 16px;
    text-align: center;
    display: block;
    font-weight: bold;
    margin-top: 15px;
}

.sub_title::after {
    background-color: #999;
    width: 20px;
    height: 4px;
    display: block;
    content: " ";
    margin: 14px auto 0;
}

.sub_goods {
    margin: 25px 10px 0;
    display: flex;
    flex-wrap: wrap;
}

.goods_item {
    background-color: #fff;
    width: 165px;
    padding: 5px;
    height: 175px;
    overflow: hidden;
    box-sizing: content-box;
    margin-bottom: 10px;
    text-align: left;
}

.goods_item:nth-child(2n-1) {
    margin-right: 5px;
}

.goods_item img {
    width: 165px;
    height: 92.5px;
    display: block;
    background-color: #eee;
}

.goods_item .goods_tit {
    color: #353535;
    font-size: 14px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 10px 0;
}

.price_cur {
    color: #ff4040;
    font-size: 16px;
    margin-right: 7.5px;
    font-family: 'DIN';
}

.price_org {
    color: #cccccc;
    font-size: 12px;
    text-decoration: line-through;
    font-family: 'DIN';
}
.sub_singlegood {
    padding: 0 15px;
    text-align: left;
}

.sub_singlegood font {
    margin-top: 10px;
}

.sub_singlegood>img {
    width: 345px;
    height: 194px;
    margin: 10px 0 5px;
}

.sub_singlegood .tit {
    font-size: 16px;
}

.sub_singlegood .tit .leibie {
    display: inline-block;
    color: #353535;
    padding: 4px 7.5px;
    font-size: 11px;
    background: #ffd926;
    position: relative;
    top: -2.5px;
}

.sub_singlegood .foot {
    padding: 0;
    margin-top: 12px;
}

.sub_singlegood .foot1 {
    padding: 0;
    margin-top: 5px;
    margin-bottom: 20px;
}

.sub_singlegood .price {
    color: #ff4040;
    font-size: 12px;
    display: flex;
    align-items: flex-end;
}

.sub_singlegood .price .big {
    font-size: 24px;
    font-family: 'DIN'!important;
    line-height: 1;
}

.sub_singlegood .price .fensi.active {
    display: inline;
}

.sub_singlegood .price .fensi {
    display: none;
    color: #353535;
}

.sub_singlegood .price .fensi img {
    width: 14px;
    height: 14px;
    margin: 0 2.5px -1.5px 7.5px;
}

.sub_singlegood .shanchu {
    text-decoration: line-through;
    color: #888;
    font-size: 12px;
}

.sub_singlegood .buy {
    text-align: right;
}

.sub_singlegood .buy>view {
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    border-radius: 5px;
    background: #d2d2d2;
    color: #888;
}

.sub_singlegood .buy>view.active {
    background: #ff5050;
    color: #fff;
}

.sub_singlegood .buy>font {
    font-size: 12px;
    color: #888;
}

.goods_ft {
    display: flex;
    align-items: center;
}

.yhtext {
    font-size: 10px;
    color: #ff4040;
    border: 0.5px solid #ff4040;
    padding: 0 1px;
    margin-right: 5px;
    height: 14px;
}

.kanjiatk {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    top: 0;
    z-index: 999;
    text-align: center;
}

.kanjiatk .infotext {
    background-color: #fff;
    width: 230px;
    font-size: 14px;
    color: #353535;
    padding: 22.5px;
    border-radius: 10px;
    height: 309px;
    margin: 122.5px auto 0;
    text-align: left;
    line-height: 1.6;
}

.kanjiatk .info_tit {
    font-size: 16px;
    text-align: center;
    font-weight: bold;
}

.kanjiatk .info_tit .tit_line {
    background: #ffd93f;
    width: 20px;
    height: 3px;
    margin: 10px auto 20px;
}

.kan_icon_alarm {
    width: 50px;
    height: 49.5px;
}

.text_kan {
    color: #888888;
}

.text_kan2 {
    font-size: 12px;
    color: #353535;
}

.red {
    color: #ff5050;
}
.shopInfo_add{
  border-bottom: 1px solid #eee;
}
.tips{
    margin-top: 20px;
    font-size: 13px;
    text-align: center;
}
.sub_shop{
    padding: 0 15px;
}


</style>