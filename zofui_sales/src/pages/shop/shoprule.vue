<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="luckyrules">
                <div class="lattice">
                    <font class="lattice_tit">商户协议</font>
                    <div class="lattice_cont" v-html="shop.content"></div>
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
                shop : {},
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
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'shoprule',
                }
                self.$util.http('shopinfo','GET',postdata,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.shop = res.data.shop;
		                
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
.luckyrules {
    padding: 22px 15px 30.5px;
    width: 345px;
}

.luckyrules .lattice {
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 5px;
    color: #2f2f2f;
}

.luckyrules .lattice .lattice_tit {
    width: 100%;
    padding-bottom: 15px;
    text-align: center;
    display: block;
    font-size: 16px;
    font-weight: 700;
    line-height: 16px;
    border-bottom: 0.5px solid #d2d2d2;
    margin-bottom: 21px;
}

.luckyrules .lattice .lattice_cont {
    display: block;
    font-size: 14.5px;
    line-height: 25.5px;
}
</style>