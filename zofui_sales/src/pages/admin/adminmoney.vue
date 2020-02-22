<template>
	
    <div id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="checkBill">

                <div class="bill-tabs thin-border_b item_cell_box draw_box">
                    <div class="money item_cell_flex">余额: ¥ <font>{{shop.money}}</font></div>
                    <div class="tr">
                        <div class="draw_btn" @click="link" data-url="/admindraw">提现</div>
                        <div class="draw_tips" @click="link" data-url="/article?type=shopdraw">
                            提现须知 <font class="van-icon van-icon-arrow"></font>
                        </div>
                    </div>
                    
                </div>

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <div class="bill-list wrap" v-if="datalist.length > 0">
                    <div class="item thin-border_b" v-for="item in datalist" >
                        <div class="top">
                            <div class="top_name">{{item.typestr}}</div>
                            <div class="top_date">{{item.ctime}}</div>
                        </div>
                        <div class="btm">
                            <div></div>
                                <div class="btm_price mius" v-if="item.money < 0">{{item.money}}</div>
                                <div class="btm_price add" v-else="item.money > 0">+{{item.money}}</div>
                        </div>
                    </div>
                </div>
                </van-list>

                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— 暂时还没有信息 —</div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
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
                        op : 'moneylog',
                        status : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                shop : false,
                sets : false,
                draw : false,
	  		}
	  	},
        activated:function(e){

            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		this.$emit('loadmessage',false);
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            drawfn(){
                var self = this;
                if( self.shop.money*1 < self.sets.leastdraw*1 ){
                    self.$toast( '最低提现金额'+ self.sets.leastdraw*1 +'元，你的余额不足' ); return false;
                }
                self.$util.http('admin','GET',{op:'draw'},function(res){ 
                    if (!res.errno && res.data) {
                        self.$toast(res.message);
                        self.shop.money = '0.00';
                    }else{
                        self.$toast( res.message );

                        if( res.errno == 2 ){
                            self.$router.push( res.data.appurl);
                        }
                        if( res.errno == 3 ){
                            setTimeout(function(){
                                self.$router.push('/adminset');
                            },1000);

                        }                
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'index',
                    pid : query.pid ? query.pid : 0,
                }
                self.page.pdata.page = 1;
                self.page.isend = false;
                self.page.geting = false;

                self.$util.pageList(this,this.page,function(res){  
					self.inited = 1;	
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
                        self.shop = res.data.shop;
                        self.sets = res.data.set;
                        self.draw = res.data.draw;
		                
	                	
						self.inited = 2;
	                }else{
	                	self.$toast(res.message);
                        if( res.errno == 2 ){
                            self.$router.push('/adminlogin');
                        }
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
.draw_box{
  padding: 30px;
  color: #999;
  font-size: 15px;
}
.draw_box .money font{
  color: #f63434;
  font-size: 20px;
}
.draw_btn{
  padding: 1.5px 10px;
  border: 1px solid #666;
  color: #666;
  text-align: center;
  display: block;
}
.draw_tips {
  margin-top: 15px;
  color: #ed414a;
  font-size: 11.5px;
}
.tr{
  text-align: right;
}
.draw_tips .zan-icon{
  font-size: 11.5px;
}

</style>