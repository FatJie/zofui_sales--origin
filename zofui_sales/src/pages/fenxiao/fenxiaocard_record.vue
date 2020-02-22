<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <div class="title wp">{{params.cardname}}推广记录</div>
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div v-if="datalist.length > 0">
                    <div class="card-list wrap">
                        <div class="item thin-border_b" v-for="item in datalist" :key="item.id">
                            <img class="avatar" v-lazy="item.headimg">
                            <div class="info">
                                <div class="info_name">{{item.nickname}}</div>
                                <div class="info_date">{{item.statusstr}}</div>
                            </div>
                            <div class="price myprice">
                                <div>我的收益</div>
                                <div class="" v-if="item.type == 5">{{item.salerfee}}元(已退款)</div>
                                <div class="color-pri" v-else>{{item.salerfee}}元</div>
                            </div>
                        </div>
                    </div>
                </div>
            </van-list>

            <div class="list-none" v-if="datalist.length <= 0 && page.isend">
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
                        type : 1,
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
    background-color: #fff;
}
.card-list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 12px 0;
}

.card-list .item .avatar {
    width: 35px;
    height: 35px;
    margin-right: 10px;
    border-radius: 50%;
}

.card-list .item .info {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 14px;
    line-height: 18px;
}

.card-list .item .info_name {
    color: #1e1e1e;
}

.card-list .item .info_date {
    color: #838383;
}

.card-list .item .price {
    font-size: 12px;
}

.card-list .item .color {
    color: #f63233;
}
.title {
    height: 37px;
    font-size: 12px;
    line-height: 37px;
    color: #969696;
    background-color: #f5f5f5;
}

.myprice {
    text-align: right;
    line-height: 17px;
    color: #838383;
}


</style>