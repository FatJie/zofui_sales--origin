<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="login_form">
                <div class="login_form_item item_cell_box">
                    <div class="login_form_item_l login_form_account">
                        <div class="login_form_item_icon"></div>
                    </div>
                    <div class="login_form_item_r item_cell_flex">
                        <input class="login_form_input" placeholder-style="color:#969696" type="text" name="account" v-model="account" placeholder="输入账户" bindinput="input" data-name="account" />
                    </div>
                </div>
                <div class="login_form_item item_cell_box">
                    <div class="login_form_item_l login_form_pass">
                        <div class="login_form_item_icon"></div>
                    </div>
                    <div class="login_form_item_r item_cell_flex">
                        <input class="login_form_input" placeholder-style="color:#969696" type="password" name="password" v-model="pass" placeholder="输入密码" bindinput="input" data-name="pass" />
                    </div>
                </div>

                <div class="login_form_item login_form_btn" @click="login">登录</div>
                <div class="login_form_item login_form_btn login_form_btn_primary" @click="fastlogin">快速登录</div>
            </div>

            <div class="userinfo_box" v-if="showlist">
                <div class="mask" catchtouchmove="true" @click="showuserbtn"></div>
                <div class="userinfo_body" catchtouchmove="true">
                    
                    <div scroll-y class="loginshop_in">

                        <div v-for="item in admin" class="loginshop_item item_cell_box" @click="loginthis" :data-id="item.shop.id">
                            <div class="item_cell_flex">{{item.shop.name}}</div>
                            <div class="van-icon van-icon-arrow" ></div>
                        </div>
                        
                    </div>
                    <i class="close_btn van-icon van-icon-close"  @click="showuserbtn" size="34"  />
                </div>
            </div>
            
            <shopjoin v-if="params.isjoin == 0" :isshow="params.shoppj == 0" :params="params"></shopjoin>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import shopjoin from '../../components/shopjoin';
	export default {
        name : 'adminlogin',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	    	tabbar,shopjoin,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                account : '',
                pass : '',
                showlist : false,
                showlist : false,
                admin : [],
	  		}
	  	},
        activated:function(e){


        },
	  	created:function(e){
	  		this.inited = false;

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            this.inited = 2;
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            login(e){
                var self = this;
                var post = {
                    op:'login',
                    account:self.account,
                    pass:self.pass
                }
                if( !post.account ) {
                    self.$toast('请填写账户');return false;
                }
                if( !post.pass ) {
                    self.$toast('请填写密码');return false;
                }       

                self.$util.http('admin','GET',post,function(res){
                    if (!res.errno && res.data) {
                        
						Dialog.alert({
						  	message: '登录成功'
						}).then(() => {
						  	self.$router.push('/adminindex');
						});
						
                    }else{
                        self.$toast( res.message );
                    }
                },true);
            },
            fastlogin(){
                var self = this;
                if( self.admin.length <= 0 ) {
                    self.$toast('你的微信还没有绑定商户');return false;
                }
                if( self.admin.length == 1 ) {
                    self.loginbyid( self.admin[0].shopid );return false;
                }
                self.showlist = true;
            },
            showuserbtn(){
                this.showlist = !this.showlist;
            },
            loginthis(e){
                var id = e.currentTarget.dataset.id;
                this.loginbyid( id );
            },
            loginbyid(id){
                var self = this;
                var post = {
                    op:'loginbyid',
                    id:id,
                }
                self.$util.http('admin','GET',post,function(res){     
                    if (!res.errno && res.data) {
						Dialog.alert({
						  	message: '登录成功'
						}).then(() => {
						  	self.$router.push('/adminindex');
						});

                    }else{
                        self.$toast( res.message );
                    }
                },true);
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'loginstart',
                }
                self.$util.http('admin','GET',postdata,function(res){ 
                    self.inited = 1;   
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
	                   	self.admin = res.data.admin;
		                
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
#main{
    min-height: 100vh;
    background-color: #fff;
}
.login_form{
    margin-top: 100px;
    width: 300px;
    margin-left: 37.5px;
}
.login_form_item {
    background: #fff;
    margin-bottom: 20px;
    height: 44px;
    line-height: 44px;
    border-radius: 2.5px;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,.1);
    overflow: hidden;
}
.login_form_item_l{
    width: 30px;
    height: 30px;
    padding: 5px;
}

.login_form_account{
    background-position: 0.5rem 0.4rem;
    background-size: 30px 30px;
}
.login_form_item_r {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    margin-top:5px;
}
.close_btn{
    color: #fff;
}
.login_form_input{
    height: 30px;
    border: 0;
}
.userinfo_body{
    top: 50px;
}
.login_form_item_icon{
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARkAAABuCAYAAAATQGfaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkJDRTlDRTg2RjkwMTFFN0FENENFRjI3MUMwNTI2QzAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkJDRTlDRTk2RjkwMTFFN0FENENFRjI3MUMwNTI2QzAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGQkNFOUNFNjZGOTAxMUU3QUQ0Q0VGMjcxQzA1MjZDMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGQkNFOUNFNzZGOTAxMUU3QUQ0Q0VGMjcxQzA1MjZDMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgcXCAkAABZbSURBVHja7F0JuFVV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");
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    background-size: 56.25px;
}
.login_form_account .login_form_item_icon{
    background-position: 0.1rem;
}
.login_form_pass .login_form_item_icon{
    background-position: -0.8rem 0.15rem;
}
.login_form_btn{
    text-align: center;
    background: #449aff;
    color: #fff;
    font-size: 14px;
}
.login_form_btn_primary{
    background: #f3f4f9;
    color: #656565;
}
.login_logo{
    width: 230px;
    margin-top: 4rem;
    height: 36px;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 3rem;
}
.login_logo img{
    width: 230px;
    height: 36px;
}

.login_admin_box{
    display: none;
    position: relative;
    z-index: 10001;
}
.login_adminlist{
    background: #fff;
    z-index: 22222;
    position: relative;
    width: 300px;
    margin-left: 100px;
    margin-top: 10px;
    padding: 20px;
    border-radius: 3px;
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);
    max-height: 300px;
    overflow: auto;
}
.login_admin_headimg {
    width: 14px;
    height: 14px;
}
.login_admin_headimg img{
    width: 14px;
    height: 14px;
    border-radius: 50%;
}
.login_admin_item{
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}
.login_admin_item:last-child{
    border: 0;
}
.login_adminlist_top{
    text-align: center;
    font-size: 0.8rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
}

.loginshop_in{
    height: 300px;
}
.loginshop_item {
    padding: 10px 0;
    border-bottom: 0.5px solid #eaeaea;
    font-size: 14px;
}
.loginshop_item:first-child {
    padding-top: 0;
}

.loginshop_item div{
    padding: 0 15px;
}
.loginshop_item .zan-icon-arrow{
  color: #999;
}
</style>