<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="title">{{info.quest}}</div>
            <div class="content" v-html="info.answer"></div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'helpinfo',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                info : {},
	  		}
	  	},
	  	created:function(e){
	  		this.$emit('loadmessage',false);

            this.initData();
            
            this.$route.meta.keepAlive = true;

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
                    op : 'info',
                    id : params.id ? params.id : 0,
                }
	            self.$util.http('helpme','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.info = res.data.info;
		                
                        window.document.title = self.info.quest;
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
.title{
    font-weight: bold;
    font-size: 20px;
    color: #222;
    padding: 15px;
}
.content{
    padding: 15px;
    font-size: 14px;
}
.content img{
    max-width: 100%!important;
    display: block;
}

</style>