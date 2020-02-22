<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template v-if="datalist.length>0">
                
                <div class="card-list ">
                    <div class="shopitem" v-for="item in datalist" >
                        
                        <div class="item thin-border_b" >
                            <img class="avatar" v-lazy="item.headimg">
                            <div class="info">
                                <div class="info_name">{{item.name}}</div>
                            </div>
                            <div class="price tr" >
                                <div class="">获得分成</div>
                                <div class="color color-pri">{{item.giveparent}}元</div>
                            </div>
                        </div>
                        <div class="shopitem_bot item_cell_box">
                            <div class="item_cell_flex"></div>
                            <div class="shopitem_botbtn" v-if="item.statusstr">{{item.statusstr}}</div>
                            <div class="shopitem_botbtn bg-pri" @click="link" :data-url="item.appshopurl">{{params.shopbname}}</div>
                            <div class="shopitem_botbtn bg-pri" @click="link" :data-url="item.appmurl">分成</div>
                        </div>

                    </div>
                </div>
                
            </template>
            </van-list>
            <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/93221/16/1388/16880/5dbeee50E0b5adbdb/6e0e5ca28baaba06.png">
                <div>~ 暂时没有数据 ~</div>
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
	  			tabs : [{name:'全部'},{name:'拼单中'},{name:'已完成'},{name:'已失败'}],
	  			page : {
	  				pdata : {
	  					doo : 'agent',
	  					op : 'mydown',
	  					status : 0,
                        level : 0,
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

            if( this.inited && this.$route.meta.keepAlive ) return false;
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
            tabchange(e){
                var self = this;
                if( e.currentTarget.dataset.status == self.page.pdata.status ) return false;
                this.datalist = [];
                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = true;
                this.page.pdata.status = e.currentTarget.dataset.status;
                self.onLoad();
            },
            useit(e){
                var self = this;

                var postdata = {cid:e.currentTarget.dataset.id,op:'getoid'};
                self.$util.http('cut','GET',postdata,function(res){    
                    if (!res.errno && res.data ) {
                        var tourl = '/orderinfo?id='+res.data.orderid;
                        self.$router.push(tourl);
                    }else{
                        self.$toast(res.message);
                    }
                })
            },
            payit(e){
                // 4 砍价订单
                sessionStorage.setItem('zfssbuy',JSON.stringify({'cid':e.currentTarget.dataset.id,type:4}));
                var tourl = '/confirm';
                this.$router.push(tourl);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'info',
                    pid : params.pid ? params.pid : 0,
                }
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.sort = res.data.sort;
		                
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

.myteam-tabs {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    background-color: #fff;
}

.myteam-tabs .tab {
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    text-align: center;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
}

.myteam-tabs .active {
    border-bottom: 1px solid;
    padding-bottom: 12px;
}

.myteam-tabs .tr {
    text-align: right;
}

.card-list{
    padding: 10px;
}
.card-list .shopitem {
    box-shadow: 0.5px 0.5px 6.5px rgba(160, 160, 160,0.4);
    margin-bottom: 15px;
    border-radius: 5px;
    padding: 10px;
    background: #fff;
}
.shopitem_botbtn{
    font-size: 12.5px;
    padding: 2.5px 10px;
    color: #999;
    box-shadow: 0.5px 0.5px 5.5px rgba(0,0,0,0.3);
    width: 40px;
    text-align: center;
    border:1px solid #eee;
    border-radius: 20px;
    margin-left: 10px;
}
.info_name{
    font-size: 15px;
    font-weight: bold;
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
    width: 50px;
    height: 50px;
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

</style>