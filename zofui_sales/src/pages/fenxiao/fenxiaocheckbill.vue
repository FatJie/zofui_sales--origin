<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            <div class="checkBill">
                <div class="bill-tabs thin-border_b">
                    <div @click="tapClick" class="item thin-border_r" :class="page.pdata.type==0?'active':''" data-type="0">收入</div>
                    <div @click="tapClick" class="item " :class="page.pdata.type==1?'active':''" data-type="1">支出</div>
                </div>
                <div class="bill-list wrap" v-if="datalist.length">

                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">

                    <div class="item thin-border_b" v-for="item in datalist" wx:key="key">
                        <div class="top">
                            <div class="top_name">{{item.typestr}}</div>
                            <div class="top_date">{{item.ctime}}</div>
                        </div>
                        <div class="btm">
                            <div></div>
                            <div class="btm_price mius" v-if="item.money < 0">-¥{{-item.money}}</div>
                            <div class="btm_price add" v-else-if="item.money > 0">+¥{{item.money}}</div>
                        </div>
                    </div>
                    </van-list>
                </div>
                <div class="list-none" v-else>
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— 暂时还没有信息 —</div>
                </div>
            </div>
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,ImagePrediv,List } from 'vant';
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
	  			sharedata :{},
                datalist : [],
                page : {
                    pdata : {
                        doo : 'fenxiao',
                        op : 'checkbill',
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
            tapClick(e){
                var self = this;
                if( e.currentTarget.dataset.type == self.page.pdata.type )  return false;
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.type = e.currentTarget.dataset.type;
                this.onLoad();
            },
            initData(){
                var self = this;
				self.page.isend = false;
                self.page.geting = false;
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
		                self.params = res.data.params;
                        self.datalist = res.data.list;
						
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
.bill-tabs {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.bill-tabs .item {
    -webkit-box-flex: 1;
    flex: 1;
    text-align: center;
    line-height: 39px;
    font-size: 14px;
}

.bill-tabs .active {
    color: #f78549;
}

.bill-list .item {
    padding: 10px;
    font-size: 12px;
    line-height: 20px;
}

.bill-list .top,.bill-list .btm {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
}

.bill-list .top_name {
    -webkit-box-flex: 1;
    flex: 1;
    padding-right: 15px;
    font-size: 13px;
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    color: #585858;
}

.bill-list .top_date {
    color: #a2a2a2;
}

.bill-list .btm_price {
    color: #b4b4b4;
}

.bill-list .btm_price.add {
    color: #32b16c;
}

.bill-list .btm_price.mius {
    color: #f63434;
}
</style>