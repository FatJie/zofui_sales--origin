<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            


            <div class="container ">
                
                <div class="none tcenter" v-if="datalist.length <= 0">
                    <div class="none-pic">
                        <!-- <img src="cdn/gift/image_no_address.png" style="width:284rpx;height: 226rpx;"> -->
                    </div>
                    <div class="none-tip">暂无收货地址</div>
                    <div class="truename-tip">应国家规定收件人需填写真实姓名</div>
                </div>
                <div class="list-box" v-if="datalist.length > 0">
                    <div class="list">
                        <div class="card" :data-id="item.id" v-for="item in datalist" :key="item.id">
                            <div class="left receiver black">{{item.name}}</div>
                            <div class="left phone black">{{item.tel}}</div>
                            <van-button class="right userbtn" @click="useadd" :data-id="item.id" v-if="from == 'confirm'" type="primary" size="mini">使用</van-button>
                            <div class="clear"></div>
                            <div class="address">{{item.region}} {{item.street}}</div>
                            <div class="edit-box">
                                <div @click="del" class=" van-icon van-icon-delete" :data-id="item.id" v-if="from != 'confirm'">
                                </div>
                                <div @click="link" class=" van-icon van-icon-edit " :data-url="'/orderaddaddress?id='+item.id">
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="card-truename-tip">应国家规定收件人需填写真实姓名</div>
                    </div>
                </div>
            </div>
            <div class="bottom-btn">
                <div class="btn btn-add bg-pri" @click="link" data-url="/orderaddaddress" >新增收货地址</div>
                <!-- <div class="btn btn-wechat" formType="submit" hoverClass="none" type="default" >微信地址</div> -->
            </div>


        </div>
    </div>
</template>

<script type="text/javascript">
	import { button,Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[button.name] : button,
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
	  			datalist : [],
	  			page : {
	  				pdata : {
	  					doo : 'user',
	  					op : 'address',
	  					sid : 0,
	  					page : 1,
	  				},
	  				isend : false,
	  				doing : false,
	  				geting : false,
	  				initget : false,
	  			},
	  			from : '',
	  		}
	  	},
        activated:function(e){

            this.page.pdata.page = 1;
            this.page.isend = false;
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
		    del : function(e){
		        var self = this;
		        var id = e.currentTarget.dataset.id;
		        Dialog.confirm({
				  	message: '确定要删除吗？'
				}).then(() => {
					self.$util.http('user','GET',{id:id,op:'deleteadd'},function(res){
	                    if( res.data && !res.errno ){
			                for (var i = 0; i < self.datalist.length; i++) {
			                    if( self.datalist[i].id == id ) {
			                        self.datalist.splice(i,1);
			                    }
			                }
	                    }
	                    self.$toast(res.message);
					},true)
				});
		    },
		    useadd(e){
		        var self = this;
		        var id = e.currentTarget.dataset.id;
		        for (var i = 0; i < self.datalist.length; i++) {
		            if( self.datalist[i].id == id ) {
		                self.$util.setCache('address',self.datalist[i]);
		                self.$router.go(-1);
		            }
		        }
		    },
            initData(){
                var self = this;
                var query = this.$route.query;
                self.from = query.from ? query.from : '';
				self.page.isend = false;
                self.page.geting = false;
				
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
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
#main{
    min-height: 100vh;
    background: #eee;
}

.container.grey {
    background: #efeff4;
}

.header {
    border-bottom: 1px solid #eee;
}

.none {
    margin: 130px 0 0 0;
    text-align: center;
}

.none-tip {
    margin: 22.5px 0 0 0;
    font-size: 14px;
    color: #999;
}

.truename-tip {
    margin: 7.5px 0 0 0;
    font-size: 14px;
    color: #b2b2b4;
}

.card-truename-tip {
    margin: 7.5px 0 0 15px;
    font-size: 12px;
    color: #b2b2b4;
}

.list {
    padding: 0 0 50px 0;
}

.card {
    margin: 0 0 10px 0;
    padding: 20px 0 0 15px;
    background: #fff;
}

.receiver {
    font-size: 15px;
    padding: 0 17px 0 0;
}

.phone {
    font-size: 15px;
}

.address {
    padding: 13px 15px 17px 0;
    border-bottom: 1px solid #eee;
    color: #999;
    font-size: 14px;
    line-height: 18px;
}

.edit-box {
    height: 30px;
    font-size: 20px;
    line-height: 30px;
}
.edit-box>div{
	margin-right: 10px;
}
.default {
    padding: 0;
}

.default img {
    vertical-align: top;
    padding: 11px 10px 0 0;
}

.default font {
    display: inline-block;
    padding: 14px 0 0 0;
    font-size: 13px;
    color: #333;
}

.edit {
    padding: 14px 15px 0 15px;
    height: 30px;
    font-size: 13px;
    line-height: 15px;
    color: #333;
}

.edit img {
    vertical-align: top;
    padding: 0 7px 0 0;
}

.bottom-btn {
    z-index: 100;
    position: fixed;
    bottom: 5.5px;
    left: 0;
    width: 100%;
}

div.btn {
    width: 96%;
    height: 44px;
    text-align: center;
    font-size: 16px;
    line-height: 44px;
    color: #fff;
    border: none;
    border-radius: 1px;
    float: left;
}

div.btn-add {
    background: #ff8f1a;
    margin-left: 2%;
}

div.btn-wechat {
    background: #09bb07;
    margin: 0 5px 10px 0;
}
.userbtn{
	margin-right: 10px;
}


</style>