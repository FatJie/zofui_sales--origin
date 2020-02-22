<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

        <van-cell-group>
            <van-field  v-model="nickname" clickable label="设置昵称" placeholder="输入昵称" >
                <van-button v-if="nickname && nickname != userinfo.nickname" slot="button" size="mini" type="primary" @click="savedata('name')" >确定</van-button>
            </van-field>
        </van-cell-group>

        <van-cell-group  class="upbox" style="padding: 0;">
            <van-uploader :max-count="1" :after-read="uploada" style="width: 100%;">
                <div class="item_cell_box" style="padding: 10px 15px;align-items:center;">
                    <div class="headh">设置头像</div>
                    <div class="van-uploader__wrapper">
                        <div class="van-uploader__upload" :style="{'background-image':'url('+headtemp+')','background-size':'cover'}">
                            <i class="van-icon van-icon-plus van-uploader__upload-icon"></i>
                        </div>
                    </div>
                </div>
            </van-uploader>
            
        </van-cell-group>


        <div class="btn save bg-pri"  @click="loginout">退出登录</div>
        
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,Button,Field,cellGroup,Uploader,Cell } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'userset',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [Button.name] : Button,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [Cell.name] : Cell,
            [Uploader.name] : Uploader,
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
                sets : false,
                headtemp : '',
                bgtemp : [],
                nickname : '',
                headimg : '',
	  		}
	  	},
        activated:function(e){

        },
	  	created:function(e){
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
            uploada(e){
                var self = this;
                self.$util.upimg(e.file,function(res){
                    self.headtemp = res.url;
                    self.headimg = res.attachment;
                    self.savedata('headimg');
                })
            },
            savedata(type){
                var self = this;
                var postdata = {
                    op : 'saveset',
                    type : type,
                    name : self.nickname,
                    headimg : self.headimg,
                };

                self.$util.http('user','get',postdata,function(res){     
                    self.$toast( res.message );
                },true);
            },
            loginout(){
                var self = this;
                var postdata = {
                    op : 'loginout',
                };

                self.$util.http('user','get',postdata,function(res){     
                    if (!res.errno && res.data) {
                        self.$router.push('login');
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'set',
                }
                self.$util.http('user','GET',postdata,function(res){  
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
	                   	self.userinfo = res.data.userinfo;
                        self.nickname = self.userinfo.nickname;

                        self.headtemp = self.userinfo.headimg;
                        
						self.inited = 2;
                    }else{
                        self.$toast({
                            message : res.message,
                            duration : 1000,
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
    background: #fff;
    width: 100%;
}
.btn{
    height: 44px;
    line-height: 44px;
    background: #449aff;
    text-align: center;
    border-radius: 1.5px;
    color: #fff;
    margin: 10px;
    width: 355px;
}
.save{
    margin-top: 10px;
    font-size: 15px;
}
.save font{
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
.time_item{
    width: 45px;
    height: 30px;
    border:0.5px solid #eaeaea;
    text-align: center;
    margin: 0 2.5px;
}
.frm_form{
    font-size: 14px;
}
.upbox{
    padding: 10px;
    font-size: 14px;
    overflow: hidden;
}
.upbox>div{
    float: left;
    margin-right: 20px;
}
.van-uploader__input-wrapper{
    width: 100%;
}
.headh{
    width: 90px;
}
</style>