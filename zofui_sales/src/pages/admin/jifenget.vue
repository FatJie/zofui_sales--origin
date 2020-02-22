<template>
	
    <div id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="tips tc">{{tips}}</div>
            <div class=" btnbox">
                <div class="btnitem" @click="link" data-url="/">返回首页</div>
                <div class="btnitem" @click="link" v-if="shopid > 0" :data-url="'/shopinfo?id='+shopid">进店看看</div>
            </div>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Field } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Field.name] : Field,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			shopid : 0,
                tips : '',
	  			sharedata :{},
	  		}
	  	},
        activated:function(e){

            this.initData();
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		//this.$emit('loadmessage',false);
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
                self.dev = self.$util.dev();

                var query = this.$route.query;
                var postdata = {
                    op : 'getjifen',
                    code : query.code
                }

                self.$util.http('admin','GET',postdata,function(res){
                    self.inited = 2;
                    if (res.data) {
                        self.shopid = res.data.shopid ? res.data.shopid : 0;
                        self.tips = res.data.tips;
                    }
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
    background: #fff;
}
.tips{
    margin-top: 100px;
    margin-bottom: 50px;
    font-size: 14px;
}
.btnbox{
    text-align: center;
}
.btnitem{
    display: inline-block;
    margin: 0 20px;
    font-size: 14px;
    border-radius: 30px;
    border:1px solid #eee;
    padding: 8px 20px;
}
</style>