<template>
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            

        <van-tabs v-model="actindex" sticky @change="tabchange" color="#449aff">
            <van-tab v-for="(item,index) in tab" :title="item" :key="index">
                
            <div class="goodlist_goodbox" >
                <div class="pagelist" >

                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <template v-if="datalist.length > 0">

                        <div v-for="item in datalist" :key="item.id" class="goodlist_item" >
                            <div class="list_top item_cell_box">
                                <div class="list_itemimg" @click="link" :data-url="item.appurl">
                                    <img v-lazy="item.thumb" >
                                </div>
                                <div class="item_cell_flex list_itemmid" @click="link" :data-url="item.appurl">
                                    <div class="list_itemtitle">{{item.title}}</div>
                                    <div class="list_itemdesc">{{item.desc}}</div>
                                    <div class="list_itemprice" >{{item.pricetext}} {{item.per ? '/'+item.per : ''}}</div>
                                    <div class="list_status" v-if="item.status == 1">      <font>已下架</font>
                                    </div>
                                    <div class="list_status" v-if="item.issh == 1"><font>审核中</font></div>
                                    <div class="list_status" v-if="item.issh == 2"><font>审核未通过</font></div>
                                </div>
                                <div class="list_itemm zan-icon zan-icon-close" @click="deletegoods" :data-id="item.id" ></div>
                            </div>
                            <div class="list_bot item_cell_box">
                                <div class="item_cell_flex">{{params.goodbname}}id：{{item.id}}</div>
                                <div class="list_btn" @click="link" :data-url="item.appurl">详情</div>
                                <div class="list_btn" v-if="params.iscpub != 1" @click="link" :data-url="'/adminpub?gid='+item.id">编辑</div>
                                <!-- <div class="list_btn">二维码</div> -->
                            </div>
                        </div>

                    </template>
                    </van-list>

                    <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                        <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/45326/27/15063/8428/5dbeed0cEb54ebcdf/e5a1acfbf5d9d8af.png">
                        <div>— 暂时没有数据 —</div>
                    </div>

                </div>
            </div>

            </van-tab>
        </van-tabs>


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
                        op : 'goodslist',
                        type : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                tab : ['全部','普通','限抢','拼团','砍价','报名','抽奖','秒杀'],
                actindex : 1,
                showexpress : false,
                showtaked : false,
                expressname : '',
                expressnum : '',

	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
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
                    self.$util.http('admin','GET',{op:'deletegoods',id:id},function(res){
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
				self.page.isend = false;
                self.page.geting = false;
				
                self.$util.pageList(this,this.page,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
                        self.iscomo = res.data.iscomo;
		                self.actindex = 0;

                        //self.maincolor = self.$util.

	                	
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
#main{
    min-height: 100vh;
    font-size: 15px;
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
    padding-left: 15px;
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
.order_byprice_icon img{
    width: 100%;
}

.list_top{
    border-bottom: 0.5px solid #eaeaea;
    padding-bottom: 10px;
}
.list_bot{
    padding: 10px 0;
}
.list_btn{
    padding: 1.5px 5px;
    border: 1px solid #969696;
    color: #969696;
    margin-left: 10px;
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
    left:10px;
    width:355px;
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
    height: 55px;
}
.orderlist_top .zan-tab__bd--scroll{
    height: 55px!important;
}

</style>