<template>
	
    <div class="theme-custom01 loginmain" id="main"  v-if="islogin">
        <div id="content" >
			<van-cell-group class="loginbox" v-if="!setpass">
			  	<van-field @input="accountfn" :border="false" v-model="account" left-icon="https://img11.360buyimg.com/ddimg/jfs/t1/68086/27/3856/452/5d20266cEfeb3a33e/340eaab2bc8270ce.png" type="tel" clearable clickable placeholder="请输入用户名" />

			  	<div class="changebox" >
				  	<transition name="aaa">
				  	<van-field v-if="logintype == 0" @input="accountfn" @focus="defaultburl = false" @blur="defaultburl = true" v-model="pass" :border="false" left-icon="https://img11.360buyimg.com/ddimg/jfs/t1/65407/6/3853/599/5d202671E388da4b1/ac5480e4b21c5e9b.png" type="password" clearable clickable placeholder="请输入密码" />
				  	</transition>
				  	<transition name="aaa">
				  	<van-field v-if="logintype == 1" v-model="code" @focus="defaultburl = false" @blur="defaultburl = true" @input="accountfn" :border="false" left-icon="https://img11.360buyimg.com/ddimg/jfs/t1/50377/3/4270/794/5d202d97E147eaf24/e564644169f60469.png" type="tel" clearable clickable placeholder="请输入验证码" >
				  		<van-button slot="button" @click="getcode" size="small" round :disabled="timedown > 0" type="danger">{{timedown > 0 ? '剩余'+timedown+'秒' : '获取验证码'}}</van-button>
				  	</van-field>
				  	</transition>
			  	</div>
			  	<div class="tr logintypebox" @click="logintypefn">
			  		<div class="changein">
			  			<div>{{logintype == 0 ? '手机':'密码'}}登录</div>
			  			<div><van-icon  name="arrow" ></van-icon></div>
			  		</div>
			  	</div>

			  	<van-button type="primary" round :disabled="iscanlogin" :loading="logining" loading-text="登录中" size="large" @click="login">登录</van-button>

			  	<div class="quick-login" v-if="isshowlogin && defaultburl">
			  		<img v-if="isinstallwx" @click="loginbywx" src="https://img11.360buyimg.com/ddimg/jfs/t1/61614/33/6355/2582/5d46d777Eba2116f4/9eb880d73f6d4a29.png">
			  		<!-- <img src="https://img11.360buyimg.com/ddimg/jfs/t1/69434/16/6364/3074/5d46d805Eb403f3d8/e6a311d99d9322cf.png"> -->
			  	</div>

			</van-cell-group>


			<van-cell-group class="loginbox" v-if="setpass">
			  	<van-field  v-model="pass1" :border="false" left-icon="https://img11.360buyimg.com/ddimg/jfs/t1/65407/6/3853/599/5d202671E388da4b1/ac5480e4b21c5e9b.png" type="password" clearable clickable placeholder="请输入密码" />
			  	<van-field  v-model="pass2" :border="false" left-icon="https://img11.360buyimg.com/ddimg/jfs/t1/65407/6/3853/599/5d202671E388da4b1/ac5480e4b21c5e9b.png" type="password" clearable clickable placeholder="请确认密码" />
			  	<van-button type="primary" round :loading="logining" loading-text="登录中" size="large" @click="setpassfn">设置密码登录</van-button>

			</van-cell-group>
	    </div>
	</div>

</template>

<script type="text/javascript">
	import { Button,Loading,CellGroup,Field,Icon,Dialog } from 'vant';
	
	export default {
		name : 'login',
	  	components: {
	    	[Loading.name]: Loading,
	    	[Button.name]: Button,
	    	[CellGroup.name] : CellGroup,
	    	[Field.name] : Field,
	    	[Icon.name] : Icon,
	  	},
	  	data : function(){
	  		return {
	  			islogin : false,
	  			code : '',
	  			pass : '',
	  			account : '',
	  			logining : false,
	  			logintype : 0,
	  			iscanlogin : true,
	  			timedown : 0,
	  			timer : null,
	  			setpass : false,
	  			pass1 : '',
	  			pass2 : '',
	  			isshowlogin : false,
	  			wx : false,
	  			dev : '',
	  			isinstallwx : false,
	  			defaultburl : true,
	  		}
	  	},
	  	beforeRouteEnter(to,from,next){
	  		if( from.fullPath && from.name != 'login' && from.fullPath != '/' ){
	  			var url = from.fullPath;
	  			var expires = new Date();
                var value = encodeURI(url);
                expires.setTime(expires.getTime() + (1000 * 8888));
                document.cookie = "loginburl=" + escape(value) + "; expires=" + expires.toGMTString() + "; path=/";
	  		}
	  		next();
	  	},
	  	created:function(e){
    		var self = this;
    		self.dev = self.$util.dev();
    		var params = self.$route.params;

    		if( self.dev == 'app' ){
				self.isshowlogin = true;

				var wx = api.require('wx');
				wx.isInstalled(function(ret, err) {
				    if (ret.installed) {
				        self.isinstallwx = true;
				    }
				});
    		}

    		// 微信
    		if( params.type == 2 ){
    			self.islogin = true;
    		}else{

    			var fromurl = self.$util.cookie.get('loginburl');
    			fromurl = fromurl ? fromurl : '/';

    			var fromurl = self.$util.Murl('index','') + '#'+fromurl;
    			var url = self.$util.apiUrl({do:'authlogin',fromurl:encodeURIComponent(fromurl)});
    			location.href = url;
	    		
    		}
	  	},
	  	mounted:function(){
	  		
	  	},
	  	methods: {
	  		logintypefn(){
	  			this.logintype = !this.logintype;
	  			this.checkLogin();
	  		},
	  		accountfn(e){
	  			this.checkLogin();
	  		},
	  		setpassfn(){
	  			var self = this;
	  			var postdata = {
	  				op : 'setpassword',
	  				pass1 : this.pass1,
	  				pass2 : this.pass2,
	  			}

  				if( postdata.pass1.length < 6 || postdata.pass2 < 6 ){
  					self.$toast('密码至少6位字符');return false;
  				}
  				if( postdata.pass1 != postdata.pass2 ){
  					self.$toast('两次密码不一致');return false;
  				}

	            self.$util.http('login','GET',postdata,function(res){
	            	self.$toast(res.message);
	                if( !res.errno ){
	                	var url = self.$util.cookie.get('loginburl');
	                	url = url ? url : '/';
		               	self.$router.push(url);
	                }
	            },true);
	  		},
	  		getcode(){
	  			var self = this;
	  			if( this.timedown > 0 ) return false;
	  			var postdata = {
	  				op : 'getcode',
	  				tel : this.account,
	  			}

  				if( !postdata.tel || !this.$util.verify('mobile', postdata.tel ) ){
  					self.$toast('请填写手机号');return false;
  				}

	            self.$util.http('login','GET',postdata,function(res){
	            	self.$toast(res.message);
	                if( res.data && !res.errno ){
	                	self.timedown = 60;
	    				self.timedownfn();
	                }
	            },true);
	  		},
	  		timedownfn(){
	  			var self = this;
	  			self.timer = setInterval(function(){
	  				if( self.timedown <= 0 ){
	  					self.timedown = 0;
	  					clearInterval(self.timer);
	  					self.timer = null;
	  				}
	  				self.timedown -- ;
	  			},1000) 
	  		},
	  		login(){
	  			var self = this;
	  			var postdata = {
	  				op : 'wap',
	  				account : this.account,
	  				pass : this.pass,
	  				code : this.code,
	  				type : this.logintype ? 1 : 0,
	  			}

  				if( !postdata.account || !this.$util.verify('mobile', this.account ) ){
  					self.$toast('请填写登录账户');return false;
  				}

	  			if( postdata.type == 0 ){
	  				if( !postdata.pass ){
	  					self.$toast('请填写登录密码');return false;
	  				}
	  			}else{
	  				if( !postdata.code ){
	  					self.$toast('请填写验证码');return false;
	  				}
	  			}
	            self.$util.http('login','GET',postdata,function(res){
	            	self.$toast(res.message);
	                if( res.data && !res.errno && res.data.token ){
	    				
	    				self.$util.cookie.set('token',res.data.token,888888);
	    				if( res.data.setpass == 1 ){
	    					self.setpass = true;
	    				}else{
		                	var url = self.$util.cookie.get('loginburl');
		                	url = url ? url : '/';
		                	console.log('tobeforepage')
			               	self.$router.push(url);
	    				}
	                }
		            
	            },true);
	  		},
	  		checkLogin(){
	  			if( this.logintype == 0 ){
	  				if( this.account && this.pass.length >= 6 && this.$util.verify('mobile', this.account ) ){
	  					this.iscanlogin = false;
	  				}else{
	  					this.iscanlogin = true;
	  				}
	  			}else{
	  				if( this.account && this.code.length >= 4 && this.$util.verify('mobile', this.account ) ){
	  					this.iscanlogin = false;
	  				}else{
	  					this.iscanlogin = true;
	  				}
	  			}
	  		},
	  		loginbywx(){
	  			var self = this;
				self.wx = api.require('wx');
				self.wx.auth({}, function(ret, err) {
					
				    if (ret.status) {
				        self.getWxToken(ret.code);
				    } else {
				        alert(err.code);
				    }
				});
	  		},
	  		getWxToken(code){
	  			var self = this;
				self.wx.getToken({
					apiKey: '',
					apiSecret: '',
					code: code
				},function(ret, err){
					if(ret.status){
				        var postdata = {
				        	op : 'loginapp',
				        	token : ret.accessToken,
				        	openid : ret.openId,
				        }
			            self.$util.http('login','GET',postdata,function(res){
			            	self.$toast(res.message);
			                if( res.data && !res.errno ){
			    				self.$util.cookie.set('token',res.data.token,888888);
			                	var url = self.$util.cookie.get('loginburl');
			                	url = url ? url : '/';
				               	self.$router.push(url);
			                }
			            },true);
					}else{
						alert(err.code);
					}
				});
	  		}
	  	},
	  	beforeRouteLeave(to, from, next) {
            to.meta.keepAlive = false;
            next();
        }
  	}



</script>
<style type="text/css">
.loginmain{
	min-height: 100vh;
	background-color: #fff;
}
.loginbox{
	padding: 40px;
	border: 0;
	margin-top: 33%;
}	
.loginbox .van-cell{
	align-items: center;
    background: #f3f4f9;
    margin: 20px 0;
    border-radius: 30px;
}
[class*=van-hairline]::after{
	border: 0;
}
.logintypebox{
	font-size: 12px;
	align-items: center;
	padding: 10px 0;
	text-align: right;
}
.logintypebox>div{
	display: inline-flex;
	color: #999
}

.aaa-enter-active, .aaa-leave-active {
    transition: opacity 1s
}
.aaa-enter, .aaa-leave-to {
    opacity: 0
}
.changebox{
	height: 60px;
	position: relative;
}
.changebox .van-cell{
	position: absolute;
	top: 0;
	left: 0;
	margin: 0;
}
.changein{
	display: flex;
	align-items: center;
}

.quick-login{
	position: fixed;
	bottom: 10px;
    text-align: center;
    width: 100%;
    left: 0;
}
.quick-login img{
	width: 50px;
	height: 50px;
	margin: 0 20px;
	display: inline-block;
}

</style>