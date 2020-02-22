<template>
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">


            <div class="top_box">
                <div class="top_btn mybtn" @click="addadmin">添加管理员</div>
            </div>

            <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" :head-height="80" success-text="已刷新" v-scroll="scrolltop">

            <div class="goodlist_goodbox" >
                <div class="pagelist" >
                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <template v-if="datalist.length > 0">
                        <div v-for="(item,index) in datalist" :key="index" class="goodlist_item" >
                            <div class="list_top item_cell_box">
                                <div class="list_itemimg" >
                                    <img :src="item.headimg" >
                                </div>
                                <div class="item_cell_flex list_itemmid" >
                                    <div class="list_itemtitle">{{item.nickname}}（{{item.uid}}）</div>
                                    <div class="list_status" >
                                        <font>{{item.statusstr}}</font>
                                    </div>
                                </div>
                                <div class="list_btn" v-if="item.level == 0" @click="deleteadmin" :data-id="item.id">删除</div>
                            </div>
                        </div>
                        
                    </template>
                    </van-list>

                    <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                        <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/45326/27/15063/8428/5dbeed0cEb54ebcdf/e5a1acfbf5d9d8af.png">
                        <div>— 暂时还没有数据 —</div>
                    </div>

                </div>
            </div>

            </van-pull-refresh>
        
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,ImagePreview } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [ImagePreview.name] : ImagePreview,
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
                        op : 'adminlist',
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
        activated:function(e){

            this.initData();
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		
	  	},
	  	methods: {
            scrolltop(){

            },
            onRefresh(){
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            deleteadmin( e ){
                var self = this;
                var id = e.currentTarget.dataset.id;
                var postdata = {
                    id : id,
                    op : 'deleteadmin',
                };
                Dialog.confirm({
                    message: '确定删除吗？'
                }).then(() => {
                    self.$util.http('admin','GET',postdata,function(res){
                        if ( !res.errno && res.data ) {
                            self.$toast({
                                message : res.message,
                            });

                            for (let i = 0,il=self.datalist; i < il.length; i++) {
                                if( il[i].id == id ){
                                    il.splice(i,1);
                                    console.log(il)
                                    self.datalist = il;
                                }
                            }

                        }else{
                            self.$toast({
                                message : res.message,
                                onClose : function(){
                                    if( res.errno == 2 ){
                                        self.$router.push(res.data.url);
                                    }
                                }
                            });
                        }
                    },true)
                });
            },
            addadmin(){
                var self = this;
                self.$util.http('admin','GET',{op:'addadmin'},function(res){    
                    if (!res.errno && res.data) {

                        Dialog.alert({
                            message: '可将图片发给好友绑定管理员！'
                        }).then(() => {
                            ImagePreview({
                                images : [res.data.url],
                                closeOnPopstate : true,
                                showIndicators : true,
                            })
                        });

                    }else{
                        self.$toast({
                            message : res.message,
                            duration : 1000,
                            onClose : function(){
                                self.$router.push(res.data.appurl);
                            }
                        });
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                self.page.pdata.page = 1;
                self.page.isend = false;
                self.page.geting = false;
				
                self.$util.pageList(this,this.page,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
	                   	self.datalist = res.data.list;
	                	
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
#main,#content{
    min-height: 100vh;
    font-size: 15px;
    background: #fff;
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
    border-bottom: 1px solid #eee;
}

.list_itemimg{
    width: 50px;
    height: 50px;
    border-radius: 2.5px;
    overflow: hidden;
}
.list_itemimg image{
    width: 50px;
    height: 50px;
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
.list_itemprice text{
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
    align-items: center;
}
.list_bot{
    padding: 10px 0;
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
.goodbuy_top view{
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
    border-bottom: 1px solid #eaeaea;
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
    border-bottom: 1px solid #eee;
    font-size: 18px;
}
.top_box{
  padding: 15px 10px;

}
</style>