<template>
	
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
                <div class="addcontent">
                    
                    <van-field v-model="money" clearable clickable :border="true" placeholder="请输入提现金额" type="number" />

                </div>

                <div class="pd15 pt0" v-if="params.isdrkf == 1">
                    <van-cell  :title="params.drqrdesc"  :is-link="true" @click="showqr" :border="false" />
                </div>

                <div class="addmbtn " @click="confirm" >
                    确定
                </div>
            

            <div class="m-pop pop-container--visible" v-if="isqr">
                <div class="pop-shade"></div>
                <div class="pop-modal " :class="isqr ? 'bounceInUp':''">
                    <div class="infopop-wrap">
                        <div class="infopop-content">
                            <div class="info-orderpay">
                                <img class="topimg" src="https://img11.360buyimg.com/ddimg/jfs/t1/40356/11/8583/21826/5cff1f05Ebcd60c9a/e1f88171888c30a4.png">
                                <div class="area">
                                    <div class="txt">
                                        <div>{{params.drqrtip}}</div>
                                        <img :src="params.drqr" style="width:100%;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div @click="showqr" class="infopop-close">
                            <font class="iconfont"></font>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup,Field,Cell } from 'vant';
    import tabbar from '../../components/tabbar';
	export default {
        name : 'admindraw',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Field.name] : Field,
            [Cell.name] : Cell,
            tabbar
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                shop : {},
                money : '',
                isqr : false,

	  		}
	  	},
        activated:function(e){


        },
	  	created:function(e){
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
            showqr(){
                this.isqr = !this.isqr;
            },
            confirm(e){
                var self = this;
                
                if( self.money*1 <= 0 || !self.money ) {
                    self.$toast('请填写提现金额');
                    return false;
                }
                var postdata = {
                    op:'draw',
                    money : self.money,
                };

                if( self.payed ) return false;
                self.payed = true;

                self.$util.http('admin','GET',postdata,function(res){      
                    if (!res.errno) {
                        self.$toast({
                            message : res.message,
                            onClose : function(){
                                self.router.go(-1);
                            }
                        });
                    }else{
                        self.$toast(res.message);
                        if( res.errno == 2 ){
                            self.router.push(res.data.url);
                        }              
                    }
                    self.payed = false;
                },true);
                
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'drawinit',
                    pid : query.pid ? query.pid : 0,
                }
                self.$util.http('admin','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
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
@import "../../assets/css/iconfont.css";
#main{
    min-height: 100vh;
    background: #fff;
}
.van-cell{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}
.addmbtn{
    margin: 20px;
    text-align: center;
    height: 48px;
    line-height: 48px;
    font-size: 20px;
    background: #449aff;
    color: #fff;
}
.addcontent{
    padding: 20px;
}
.give_box{
    padding: 10px 0;
}
.give_item{
    display: inline-block;
    width: 150px;
    padding: 20px 0;
    border-radius: 5px;
    border: 0.5px solid #eeeeee;
    text-align: center;
    font-size: 15px;
    color: #666;
    margin-bottom:10px;
}
.give_item:nth-of-type(2n){
    margin-left: 30px;
}
.topimg{
    width: 100%;
}
</style>