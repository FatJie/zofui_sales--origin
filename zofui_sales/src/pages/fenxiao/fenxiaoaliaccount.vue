<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

                    
            <div class="frm_group " >
                <van-cell-group>
                    <van-field v-model="userinfo.aliname" label="支付宝姓名" required placeholder="请输入用户名" />
                    <van-field v-model="userinfo.aliaccount" label="支付宝账户" required placeholder="请输入支付宝账户" />
                </van-cell-group>
            </div>
            <div class="btn-group wrap" style="margin-top: 50rpx;">
                <div class="g-fixbtn bg-pri" @click="formSubmit">保存</div>
            </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,Field,cellGroup } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {

	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
	    	tabbar,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
                vesion : '',
	  			userinfo : {},
	  			sharedata :{},
                dataInfo : {},
                reload : false,
	  		}
	  	},
	  	created:function(e){
	  		this.$emit('loadmessage',false);

            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
        activated:function(e){
            if( this.reload ){
                this.initData();
                this.reload = false;
            }
        },
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            formSubmit(){
                var self = this;
                var postdata = {
                    op :'saveali',
                    name : self.userinfo.aliname,
                    aliaccount : self.userinfo.aliaccount,
                };
                self.$util.http('fenxiao','GET',postdata,function(res){     
                    if( !res.errno && res.data ){
                        self.$router.go(-1);
                    }
                    self.$toast(res.message);
                },true);
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'bill',
                    //zfid : zfid
                }
	            self.$util.http('fenxiao','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
		                self.params = res.data.params;
						
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

.frm_group {
    padding: 20px;
    padding-left: 10px;
}
.change-bank {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 44px;
    padding: 0 15px;
    font-size: 14px;
    line-height: 44px;
}

.change-bank .name {
    -webkit-box-flex: 1;
    flex: 1;
    color: #000;
}

.change-bank .tip {
    color: #3ba0fc;
}

.change-bank:before {
    content: '\e613';
    position: absolute;
    right: -2px;
    top: 0;
    font-size: 12px;
    font-family: 'iconfont';
    color: #acacac;
}

.get-money {
    padding: 15px;
    font-size: 13px;
    line-height: 36px;
    color: #666;
}

.get-money .price {
    font-size: 22px;
    font-weight: 500;
    color: #333;
}

</style>