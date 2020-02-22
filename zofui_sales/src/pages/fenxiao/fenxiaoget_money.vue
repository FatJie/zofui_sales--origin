<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <div class="form-group" v-if="params.paytype == 1">
                <div class="change-bank" @click="link" data-url="/fenxiaoaliaccount">
                    <div class="name" >{{userinfo.aliname ? userinfo.aliname : '未设置'}}，{{userinfo.aliaccount ? userinfo.aliaccount : '未设置'}}</div>
                    <div class="tip">修改到账账户</div>
                </div>
            </div>
            <div class="form-group">
                <div class="get-money">
                    <div class="tip">
                        可提现佣金（{{userinfo.money}}）
                        <font v-if="params.drawserver > 0">,提现需扣除{{params.drawserver*100/100}}%手续费</font>
                        <font class="drawtip" @click="link" data-url="/article?type=fxdraw">提现须知</font>
                        <font class="zan-icon zan-icon-arrow"></font>                
                    </div>

                    <van-field v-model="money" label="¥" label-width="20" size="large" placeholder="请输入金额" />

                    <!-- <div class="price">¥{{userinfo.money}}</div> -->
                </div>
                <div class="pd15 pt0" v-if="params.isdrkf == 1">
                    <van-cell  :title="params.drqrdesc"  :is-link="true" @click="showqr" />
                </div>
                
            </div>
            <div class="btn-group wrap">
                <div class="g-fixbtn bg-pri" @click="formSubmit">申请提现</div>
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
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,ImagePrediv,Field,Cell } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'fenxiaorank',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [Field.name] : Field,
            [Cell.name] : Cell,
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
                type : 0,
                myrank : 0,
                rank : [],
                money : 0,
                isqr : false,
	  		}
	  	},
	  	created:function(e){
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
            showqr(){
                this.isqr = !this.isqr;
            },
            formSubmit(e){
                var self = this;
                self.$util.http('fenxiao','GET',{op:'draw',money:self.money},function(res){
                    self.$toast(res.message);  
                    if (!res.errno && res.data) {
                        self.userinfo.money = (self.userinfo.money*1 - self.money*1).toFixed(2);
                        self.money = 0;
                    }
                },true);
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'bill',
                    //zfid : zfid1
                }
	            self.$util.http('fenxiao','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.userinfo = res.data.userinfo;
		                self.params = res.data.params;
						self.money = self.userinfo.money;
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

@import "../../assets/css/iconfont.css";
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
.van-cell{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}
.change-bank .name {
    -webkit-box-flex: 1;
    flex: 1;
    color: #000;
}

.change-bank .tip {
    color: #3ba0fc;
    padding-right: 15px;
}

.change-bank:before {
    content: '\e60d';
    position: absolute;
    right: 15px;
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
.drawtip{
    display: inline-block;
    color: #3ba0fc;
}
.zan-icon-arrow{
    color: #3ba0fc;
    font-size: 11px;
}
.topimg{
    width: 100%;
}
</style>