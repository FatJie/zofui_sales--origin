<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <van-cell-group>
                  <van-cell  :title="item.fee > 0 ? '+'+item.fee : '-'+item.fee" :value="item.ctime" v-for="item in datalist" :key="item.id" :label="item.typestr" />
                </van-cell-group>
                
                <div class="list-none"  v-if="datalist.length <= 0 && page.isend">
                    <img class="info_img" mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/79335/36/14362/12402/5dbeedd0E927c114a/160e143d9bb10bbf.png">
                    <div>— '暂时还没有数据' —</div>
                </div>
            </van-list>
            
        </div>
    </div>
    </van-pull-refresh>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Cell, CellGroup } from 'vant';
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
	  					doo : 'jifen',
	  					op : 'jifenlog',
	  					status : 0,
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
	  		this.$emit('loadmessage',false);
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

                this.isbot = false;
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
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
.btn{
	margin:10px;
	height: 44px;
	line-height: 44px;
	background: #449aff;
	text-align: center;
	border-radius: 1.5px;
	color: #fff;
}
.apply{
	margin-top: 20px;
}
.apply font{
    font-size: 12px;
}
.applyed{
	border:0.5px solid #eaeaea;
	display: inline-block;
	width: 200px;
	line-height: 50px;
	background: #fff;
	border-radius: 2.5px;
	text-align: center;
	color: #969696;
	margin-top: 20%;
	margin-left: 87.5px;
}
.addmbtn{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	text-align: center;
	height: 48px;
	line-height: 48px;
}
.money-box{
	padding: 20px 10px;
}
.money-item{
	padding: 15px 0;
	border-bottom: 0.5px solid #eee;
	font-size: 15px;
}
.money-itemm{
	padding: 0 5px;
}
.money-itemn{
	font-size: 17.5px;
	width: 65px;
}
</style>