<template>
	
    
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

        	<van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">

                <template v-if="datalist.length > 0" >
                	<van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    	
                		<div class="moneybag_item "  >
                			<div class="moneybag_sname">{{params.ptname}}</div>
                			<div class="moneybag_top item_cell_box">
                				<div class="moneybag_icon lbg-pri">￥</div>
                				<div class="moneybag_num">{{userinfo.money}}</div>
                			</div>
                			<div class="moneybag_name">仅限在平台购买商品使用</div>
                		</div>

                		<div class="moneybag_item " v-for="(item,index) in datalist" :key="index" @click="link" :data-url="item.appurl">
                			<div class="moneybag_sname">{{item.shopname}}</div>
                			<div class="moneybag_top item_cell_box">
                				<div class="moneybag_icon lbg-pri">￥</div>
                				<div class="moneybag_num">{{item.money}}</div>
                			</div>
                			<div class="moneybag_name">仅限在{{item.shopname}}店付款使用</div>
                		</div>

                    </van-list>
                </template>
                <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                    <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/97805/32/1463/15072/5dbeec6eE88aef72d/b84e464d3b8cae52.png">
                    <div>— 暂时还没有数据 —</div>
                </div>
           	
            </van-pull-refresh>
            
        </div>
    </div>
    
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Cell,CellGroup } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Cell.name] : Cell,
            [CellGroup.name] : CellGroup,
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
	  					doo : 'user',
	  					op : 'monegbag',
	  					status : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
	  			userinfo : {},
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
                this.datalist = [];
                this.isbot = false;
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

                self.page.pdata.page = 1;
                self.page.isend = false;
                self.page.doing = false;
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
	                   	self.userinfo = res.data.userinfo;

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
#main #content{
    min-height: 100vh;
    background-color: #fcfcfc;
}
.moneybag_item{
	margin: 20px;
	font-size: 14px;
	padding: 10px;
	border-radius: 5px;
	box-shadow: 1px 1px 5px 1px rgba(0,0,0,0.1);
	position: relative;
	background-image: url('http://img11.360buyimg.com/ddimg/jfs/t1/86484/27/4880/3839/5de9bb1fE9956c619/cb77209ee57f2bb2.png');
	background-repeat: no-repeat; 
	background-position: 100% 0;
}
.moneybag_sname{
	padding: 10px 0;
	color: #333;
}
.moneybag_top{
	padding: 10px 0;
	align-items: center;
}
.moneybag_name{
	padding: 10px 0;
	font-size: 12px;
	color: #999;
}
.moneybag_num{
	font-weight: bold;
	font-size: 30px;
	padding-left: 10px;
}
.moneybag_icon {
	display: inline-block;
	width: 22px;
	font-size: 12px;
	text-align: center;
	border-radius: 3px;
}
</style>