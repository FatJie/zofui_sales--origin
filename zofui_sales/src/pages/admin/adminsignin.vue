<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="" style="width: 100%;height:100wv;text-align:center;">
                <img class="statusimg" v-if="sign.status == 1" src="https://img11.360buyimg.com/ddimg/jfs/t1/67185/18/3771/23548/5d1efcb6Ed29f507d/115762208bfb0b66.png" >
                <img class="statusimg" v-if="sign.status == 2" src="https://img11.360buyimg.com/ddimg/jfs/t1/82315/18/3731/25708/5d1efcb1E75afb819/703dfae9a412b6bb.png" >
                <div>
                    <div class="statustitle">{{sign.status == 1 ? '签到成功' : '签到失败'}}</div>
                    <div class="statusdesc">{{sign.err}}</div>
                </div>
                
                <div class=" btn_box">
                    <div class="statusbtn statusbtna" @click="link" data-url="/">返回首页</div>
                    <div class="statusbtn statusbtnb" wx:if="sign.actid > 0" @click="link" :data-url="'/signinfo?id='+sign.actid">查看活动</div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
	  			sign : {},
	  			page : {},
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
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'sign',
                    signid : query.scene ? query.scene : 0,
                }
                self.$util.http('admin','GET',postdata,function(res){   
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sign = res.data.sign;
	                	self.inited = 2;
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
.statusimg{
	display: inline-block;
	width: 100px;
	height: 100px;
	margin-top: 22%;
}
.statustitle{
	font-weight: bold;
	font-size: 16px;
	color: #222;
	margin-top: 25px;
}

.statusdesc{
	color: #999;
	font-size: 13px;
	margin-top: 12.5px;
}

.btn_box{
	text-align: center;
	margin-top: 50px;
}
.statusbtn{
	display: inline-block;
	border:0.5px solid #ff985a;
	padding: 10px 25px;
	border-radius: 25px;
	font-size: 16px;
	color: #ff985a;
	margin: 0 10px;
}

.statusbtn:last-child{

	background-color: #ff985a;
	color: #fff;
}

</style>