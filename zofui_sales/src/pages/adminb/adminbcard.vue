<template>
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">


        <van-tabs v-model="actindex" color="#449aff" sticky @change="tabchange">
            <van-tab v-for="(item,index) in tab" :title="item" :key="index">
                
            <div class="goodlist_goodbox" >
                <div class="pagelist" >

                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <template v-if="datalist.length > 0">

                <div v-for="(item,index) in datalist" :key="index" class="goodlist_item" >
                    <div class="list_top item_cell_box">
                        <div class="item_cell_flex">{{item.feestr}}</div>
                        <div class="list_itemprice">{{item.statusstr}}</div>
                    </div>
                    <div class="list_top item_cell_box">
                        <div class="item_cell_flex list_itemmid" @click="link" :data-url="item.appurl">
                            <div class="list_itemtitle">{{item.name}}</div>
                            <div class="list_itemprice" >
                                
                            </div>
                        </div>
                    </div>
                    <div class="list_bot item_cell_box">
                        <div class="item_cell_flex"></div>
                        <div class="list_btn" v-if="params.cardbag == 0" @click="link" :data-url="'/cardredbag?cid='+item.id">红包</div>
                        <div class="list_btn" @click="link" :data-url="item.logappurl">记录</div>
                        <div class="list_btn" @click="link" :data-url="item.appurl">详情</div>
                        <div class="list_btn" @click="link" :data-url="'/adminbaddcard?cid='+item.id">编辑</div>
                        <div class="list_btn" @click="deletegoods" >删除</div>
                        
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

            </van-tab>
        </van-tabs>


        <div class="pub_btn" @click="link" data-url="/adminbaddcard">
            <div class="mybtn">添加优惠券</div>
        </div>
        
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup,Tab,Tabs,Field,cellGroup } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
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
                        op : 'cardlist',
                        type : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                tab : ['在线使用','到店使用'],
                actindex : 0,
                showexpress : false,
                showtaked : false,
                expressname : '',
                expressnum : '',

	  		}
	  	},
        activated:function(e){

            this.initData();
            this.$route.meta.keepAlive = true;
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
            deletegoods(e){
                var self = this;
                var id = e.currentTarget.dataset.id;

                Dialog.confirm({
                    message: '确定删除吗？'
                }).then(() => {
                    self.$util.http('admin','GET',{op:'deletecard',id:id},function(res){
                        if ( !res.errno && res.data ) {
                            self.$toast({
                                message : res.message,
                                onClose : function(){
                                    for (let i = 0,il=self.datalist; i < il.length; i++) {
                                        if( il[i].id == id ){
                                            il.splice(i,1);
                                            self.datalist = il;
                                        }
                                    }
                                }
                            });
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
            tabchange(index){
                var self = this;
                if( index == self.page.pdata.type ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.type = index;
                self.onLoad();
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
                        self.params = res.data.params;
	                	
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
    background: #eee;
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
    padding-bottom: 100px;
}

.goodlist_item{
    background: #fff;
    padding: 10px;
    margin-top: 10px;
    border-bottom: 0.5px solid #eaeaea;
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
    padding-left: 0px;
}
.list_itemtitle{
    font-weight: 700;
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
.order_byprice_icon image{
    width: 100%;
}

.list_top{
    border-bottom: 0.5px solid #eaeaea;
    padding: 15px 0;
}
.list_bot{
    padding: 10px 0;
}
.list_btn{
    padding: 1.5px 10px;
    border: 1px solid #969696;
    color: #969696;
    margin-left: 5px;
    border-radius: 1.5px;
    font-size: 13px;
}
.list_status{
  font-size: 15px;
  color: #999;
}
.list_bot .item_cell_flex{
    color: #969696;
    font-size: 12px;
}
.pub_btn{
    padding-bottom: 0;
    position:fixed;
    left:2%;
    width:96%;
    bottom:5px;

}
.pub_btn .btn{
    position: fixed;
    bottom: 5px;
    width: 355px;
    left: 10px;
    padding-bottom: 0;
}
.orderlist_top{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}
</style>