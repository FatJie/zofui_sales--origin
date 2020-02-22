<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <div class="title wp">我的订单推广记录</div>
            <div class="order-list" v-if="datalist.length>0">

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">

                <div class="item" v-for="item in datalist" :key="item.id">
                    <div class="top thin-border_b">
                        <div class="top_order">订单编号：{{item.orderid}}</div>
                        <div class="top_date">{{item.statusstr}}</div>
                    </div>
                    <div class="mid" @click="link" :data-url="item.appurl">
                        <div class="mid_pic">
                            <div class="image-box __80 ">
                                <img :src="item.thumb">
                            </div>
                        </div>
                        <div class="mid_txt">
                            <div class="tit">{{item.title}}</div>
                        </div>
                    </div>
                    <div class="btm thin-border_t">
                        <div class="btm_goods">
                            {{item.num}}件，共：¥
                            <font class="price">{{item.fee}}</font>
                        </div>
                        <div class="btm_price">
                            我的佣金：
                            <div class="color color-pri" >¥
                                <font class="price">{{item.fxfee}}</font>
                            </div>
                        </div>
                    </div>
                </div>

                </van-list>

            </div>
            <div class="list-none" v-else>
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/45326/27/15063/8428/5dbeed0cEb54ebcdf/e5a1acfbf5d9d8af.png">
                <div>— 暂时没有相关订单 —</div>
            </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,List } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [List.name] : List,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
                vesion : '',
	  			userinfo : {},
	  			sharedata :{},
                datalist : [],
                page : {
                    pdata : {
                        doo : 'fenxiao',
                        op : 'orderrecord',
                        status : 0,
                        type : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
	  		}
	  	},
	  	created:function(e){
	  		this.$emit('loadmessage',false);

            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
        activated:function(e){
            if( this.reload ){
                this.initData();
                this.reload = false;
            }
        },
	  	methods: {
            onRefresh(){
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            initData(){
                var self = this;
				self.page.isend = false;
                self.page.geting = false;
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.datalist = res.data.list;
		                self.params = res.data.params;
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
#main {
    min-height: 100vh;
    background-color: #f8f8f8;
}
.title {
    height: 37px;
    font-size: 12px;
    line-height: 37px;
    color: #969696;
    background-color: #f5f5f5;
}
.order-list .item {
    margin-bottom: 11px;
    font-size: 12px;
    color: #666;
    background-color: #fff;
}
.order-list .top,.order-list .mid,.order-list .btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 0 15px;
}
.order-list .top {
    line-height: 40px;
}

.order-list .mid {
    padding-top: 12px;
    padding-bottom: 12px;
}

.order-list .mid_pic {
    width: 60px;
    margin-right: 12px;
}

.order-list .mid_txt {
    -webkit-box-flex: 1;
    flex: 1;
}

.order-list .mid_txt .tit {
    margin-top: -2px;
    margin-bottom: 7px;
    font-size: 14px;
    line-height: 19px;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.order-list .mid_txt .props .prop_item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    font-size: 12px;
    line-height: 15px;
    color: #b4b4b4;
}

.order-list .btm {
    line-height: 45px;
}

.order-list .btm_goods .price {
    font-size: 16px;
}

.order-list .btm_price .color {
    display: inline-block;
}

.order-list .btm_price .price {
    font-size: 17px;
}

</style>