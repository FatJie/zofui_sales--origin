<template>
	
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="admin_box">
                <img class="admin_headimg" :src="userinfo.headimg" >
                <div class="admin_nickname">{{userinfo.nickname}}</div>
                <div  class="my_btn admin_btn btn" :class="status == 3 ? '' : 'my_btn_disabled'" @click="bind" catchtap="status == 3 ? 'bind' : ''" >{{mess}}</div>
            </div>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	export default {
        name : 'adminbindadmin',
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
	  			mess : '暂时无法绑定',
                status : 0,
                scene : 0,
	  		}
	  	},
	  	created:function(e){
            this.$emit('loadmessage',true);

            if( this.inited && this.$route.meta.keepAlive ) return false;
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
            bind(){
                var self = this;
                if( self.status != 3  ) return false;
                self.$util.http('bindadmin_app','GET',{scene : self.scene,op:'bind'},function(res){     
                    if (!res.errno && res.data) {

                        self.$toast('已绑定');

                        self.status = 1;
                        self.mess = '绑定成功';
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'check',
                    scene : query.scene ? query.scene : 0,
                }
                self.scene = postdata.scene;
                self.$util.http('bindadmin_app','GET',postdata,function(res){ 
					self.inited = 2;
	                if( !res.errno && res.data ){        
	                	
                        self.status = 3;
                        self.mess = '绑定管理员';
	                	
	                }else{
                        self.status =  res.errno;
                        self.mess =  res.message;
	                }
                    self.userinfo = res.data.userinfo;
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

.admin_box{
    padding: 10px;
}
.admin_box{
    margin-top: 20%;
    text-align: center;
}
.admin_headimg{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border:1px solid #ddd;
    display: inline-block;
}
.admin_nickname{
    color: #09345F;
    font-size: 14px;
    font-weight: 500;
    margin-top: 25px;
}

.admin_btn{
    margin-top: 50px;
}
.my_btn_disabled{
    background: #969696;
}
.admin_btn{
    height: 49px;
    line-height: 49px;
    background-color: #fb2d37;
    color: #fff;
    font-size: 16px;
}
.my_btn_disabled{
    background-color: #464646;
}

</style>