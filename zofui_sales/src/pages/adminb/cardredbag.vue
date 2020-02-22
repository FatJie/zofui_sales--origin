<template>
	
    <div  id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
        <div id="content" v-if="inited == 2">
            

            <van-tabs v-model="actindex" color="#449aff" sticky @change="tabchange">
                <van-tab v-for="(item,index) in tab" :title="item" :key="index">

                </van-tab>
            </van-tabs>

            
            <div class="content">
                <div v-if="actindex == 0">
                    <van-cell-group>
                        <van-cell :title="card.name" is-link clickable @click="link"  :data-url="'cardinfo?id='+card.id" />
                        <van-switch-cell @change="switchfn" v-model="isredbag" title="开关红包" />
                        <van-cell title="剩余红包" is-link clickable :label="card.redbag" value="充值" @click="addm" />
                        <van-cell title="红包金额" is-link clickable :label="card.startfee + '~' + card.endfee" value="设置" @click="setfee" />
                        <van-cell title="已经发放" is-link clickable :label="card.payedred" @click="actindex = 1" value="查看" />
                    </van-cell-group>
                </div>
                <div v-if="actindex == 1">
                    
                    <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                    <template v-if="datalist.length > 0">

                        <div v-for="(item,index) in datalist" :key="index" class="redbox" >
                            <div class="item_cell_box redtop">
                                <div class="fee">￥{{item.fee}}</div>
                                <div class="item_cell_flex nick">{{item.nickname}}</div>
                                <div class="status">{{item.statusstr}}</div>
                            </div>
                            <div class="redtime">
                                <span>
                                    使用时间:{{item.ctime}} {{item.ptime ? '，发放时间:'+item.ptime : ''}} {{item.usenick ? '，优惠券使用人:'+item.usenick : ''}}
                                </span>
                            </div>
                            <div class="redbot" v-if="item.error">
                                错误：{{item.error}}
                            </div>
                            <div class="redbot bufa-box" v-if="item.status == 2">
                                <span class="bufabtn" @click="bufa(item.id,index)">补发红包</span>
                            </div>
                        </div>

                    </template>
                    </van-list>

                    <div class="list-none" v-if="datalist.length <= 0 && page.isend">
                        <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/45326/27/15063/8428/5dbeed0cEb54ebcdf/e5a1acfbf5d9d8af.png">
                        <div>— 暂时还没有数据 —</div>
                    </div>

                </div>
            </div>

            
        </div>
        </van-pull-refresh>

        <van-popup v-model="issetfee" position="bottom">
            <div>
                <van-cell-group>
                    <van-field border label="分享者最低" type="number" v-model="card.startfee" placeholder="分享人最低红包" />
                    <van-field border label="分享者最多" type="number" v-model="card.endfee" placeholder="分享人最多红包" />
                    <van-field border label="上级最低" type="number" v-model="card.startfeep" placeholder="分享人上级最低红包" />
                    <van-field border label="上级最多" type="number" v-model="card.endfeep" placeholder="分享人上级最多红包" />
                    <van-cell title="最低和最多设置一样的数值即是固定红包"  />
                </van-cell-group>
                <van-button type="info" block square @click="setfeeconfirm">提交</van-button>
            </div>
        </van-popup>

        <van-popup v-model="isaddm" position="bottom">
            <div>
                <van-cell-group>
                    <van-cell title="去支付充值" is-link clickable @click="link"  :data-url="'addshopmoney?type=card&tid='+card.id" />
                    <van-field border label="余额转红包" type="number" v-model="addfee" placeholder="输入转换金额" />
                </van-cell-group>

                <van-button type="info" block square @click="addconfirm">确定余额转红包</van-button>
            </div>
        </van-popup>

    </div>
</template>

<script type="text/javascript">
	import { Button,Loading,List,Toast,Dialog,PullRefresh,Popup,Field,cellGroup,Cell,SwitchCell,tabs,tab } from 'vant';
    import tabbar from '../../components/tabbar';
	export default {
        name : 'cardredbag',
	  	components: {
            [Button.name] : Button,
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [Cell.name] : Cell,
            [SwitchCell.name] : SwitchCell,
            [tabs.name] : tabs,
            [tab.name] : tab,
            tabbar
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                card : {id:0},
                isadmin : false,
                start : false,
                end : false,
                tab : ['设置红包','发放记录'],
                actindex : 0,
                isredbag : false,
                issetfee :false,
                isaddm : false,
                addfee : '',
                datalist : [],
                page : {
                    pdata : {
                        doo : 'admin',
                        op : 'redbaglog',
                        cardid : 0,
                        page : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
	  		}
	  	},
	  	created:function(e){
            this.inited = false;
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
            tabchange(index){
                var self = this;
                self.actindex = index;
            },
            switchfn(e){
                var self = this;
                var type =  e ? 1 : 0;
                var postdata = {op:'kgredbag',type :type,id:self.card.id};

                self.$util.http('admin','GET',postdata,function(res){ 
                    if (!res.errno && res.data) {
                        self.$toast(res.message);
                    }else{
                        self.$toast( res.message );
                        if( res.errno == 2 ){
                            if( res.data.url ){
                                self.$router.push(res.data.url)
                            }
                        }
                    }
                },true);
            },
            setfee(e){
                this.issetfee = !this.issetfee
            }, 
            setfeeconfirm(){
                var self = this;
                var postdata = {
                    op:'setredbagfee',
                    startfee :self.card.startfee,
                    endfee :self.card.endfee,
                    startfeep :self.card.startfeep,
                    endfeep :self.card.endfeep,
                    id:self.card.id
                };

                self.$util.http('admin','GET',postdata,function(res){ 
                    if (!res.errno && res.data) {
                        self.$toast(res.message);
                        self.setfee();
                    }else{
                        self.$toast( res.message );
                        if( res.errno == 2 ){
                            if( res.data.url ){
                                self.$router.push(res.data.url)
                            }
                        }
                    }
                },true);
            },
            addm(){
                this.isaddm = !this.isaddm
            },
            addconfirm(){
                var self = this;
                var postdata = {
                    op : 'moneytoredbag',
                    id : self.card.id,
                    fee : self.addfee
                };
                Dialog.confirm({
                    message: '确定转换吗？',
                }).then(() => {
                    self.$util.http('admin','GET',postdata,function(res){ 
                        self.$toast( res.message );
                        if (!res.errno && res.data) {
                            self.initData();
                        }else{
                            if( res.errno == 2 ){
                                if( res.data.url ){
                                    self.$router.push(res.data.url)
                                }
                            }
                        }
                    },true);
                });
            },
            bufa(e,i){
                var self = this;
                var postdata = {
                    op : 'bufaredbag',
                    id : e,
                };
                Dialog.confirm({
                    message: '确定补发红包吗？',
                }).then(() => {
                    self.$util.http('admin','GET',postdata,function(res){ 
                        self.$toast( res.message );
                        if (!res.errno && res.data) {
                            self.initData();

                        }else if( res.errno == 5 ){
                            self.datalist[i].status = 0;
                            self.datalist[i].statusstr = '待发放';
                        }else{
                            if( res.errno == 2 ){
                                if( res.data.url ){
                                    self.$router.push(res.data.url)
                                }
                            }
                        }
                    },true);
                });
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'addcardstart',
                    cid : query.cid ? query.cid : 0,
                }
                self.$util.http('admin','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.card = res.data.card;
                        self.isredbag = self.card.isredbag == 1 ? true : false;
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

                self.page.pdata.page = 1;
                self.page.isend = false;
                self.datalist = [];
                self.page.pdata.cardid = postdata.cid;
                self.onLoad();
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
#main #content{
    min-height: 100vh;
    background: #fcfcfc;
}
.content{
    padding:10px;
}
.redbox{
    font-size: 14px;
    box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.1);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 3px;
}
.fee{
    width:80px;
}
.status{
    color: #999;
    font-size: 13px;
}
.redtop{
    padding: 5px 0;
    border-bottom: 1px solid #eee;

}
.redtime{
    padding: 10px 0;
}
.redbot{
    padding: 5px 0;
    color: #999;
}
.bufa-box{
    text-align: right;
}
.bufabtn{
    display: inline-block;
    padding: 3px 10px;
    border:1px solid #999;
    border-radius: 2px;
}
</style>