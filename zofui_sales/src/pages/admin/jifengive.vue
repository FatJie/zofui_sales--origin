<template>
	
    <div id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="give_top ">
                <div class="give_topt item_cell_box">
                    <div class=" give_desc">
                        <div class="give_num">{{shop.jifen > 0 ? shop.jifen : 0}}</div>
                        <div>剩余{{params.jfbname}}</div>
                    </div>
                    <div class="item_cell_flex"></div>
                    <div class="give_add" @click="link" data-url="/adminjifenadd">充值</div>
                    <div class="give_add" @click="showgive">赠送</div>
                </div>
            </div>
            <van-tabs active="0" @change="onChange" color="#449aff">
              <van-tab title="全部"></van-tab>
              <van-tab title="已领取"></van-tab>
              <van-tab title="未领取"></van-tab>
            </van-tabs>
            
            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template v-if="datalist.length > 0">
                <div class="list_item " v-for="(item,index) in datalist" :key="index">
                    <div class="item_cell_box">
                        <div class="top_name item_cell_flex">{{item.jifen}}</div>
                        <div class="top_date">{{item.statusstr}}</div>
                    </div>
                    <div class="" v-if="item.user">领取人{{item.user.nickname}}（{{item.user.id}}），领取时间{{item.gettime}}</div>
                    <div class="btm item_cell_box">
                        <div class="item_cell_flex">生成:{{item.createtime}}</div>
                        <div class="list_btn" v-if="item.type == 1 && item.status == 0" @click="viewqr" :data-id="item.id">查看二维码</div>
                    </div>
                </div>
            </template>
            </van-list>
            
            <div class="list-none" v-if="datalist.length <= 0 && !page.waitf">
                <img class="info_img" mode="widthFix" src="https://ui.fhcloudapi.cn/xcx_urm/img/listnone-info.png">
                <div>— 暂时还没有数据 —</div>
            </div>

            
            <van-popup v-model="isshowgive" position="bottom">
                <div class="show_item">
                    <van-field v-model="money" :label="'赠送'+params.jfbname" placeholder="请输入赠送数量"  />
                </div>
                <div class="show_item" v-if="stype == 2">
                    <van-field v-model="uid" label="用户ID" placeholder="请输入用户ID"  />
                </div>
                <div class="show_item item_cell_box">
                    <div class="show_l" >
                        赠送方式
                    </div>
                    <div>
                        <van-tag @click="radio(1)"  custom-class="radio" plain :type="stype == 1 ? 'primary' : ''">二维码赠送</van-tag>
                        <van-tag @click="radio(2)"  custom-class="radio" plain :type="stype == 2 ? 'primary' : ''">ID赠送</van-tag>
                    </div>
                </div>

                <van-button style="margin-top:20px;" type="info" square block @click="confirm">{{stype == 1 ? '生成二维码' : '确定'}}</van-button>
            </van-popup>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Tabs,Tab,ImagePreview,Popup,Button,Field,Tag } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Tabs.name] : Tabs,
            [Tab.name] : Tab,
            [Popup.name] : Popup,
            [Button.name] : Button,
            [Field.name] : Field,
            [Tag.name] : Tag,
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
                        doo : 'admin',
                        op : 'givelog',
                        status : 0,
                        page : 1,
                        isint : 1,
                    },
                    isend : false,
                    doing : false,
                    geting : false,
                    initget : false,
                },
                shop : false,
                isshowgive : false,
                money : '',
                uid : '',
                stype : 1,
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
            showgive(){
                this.isshowgive = !this.isshowgive;
            },
            radio(e){
                this.stype = e;
            },
            viewqr(e){
                var self = this;
                var postdata = {
                    op:'viewqr',
                    id : e.currentTarget.dataset.id,
                };

                self.$util.http('admin','GET',postdata,function(res){ 
                    if (!res.errno && res.data) {
                        ImagePreview({
                            images : [res.data.url],
                            closeOnPopstate : true
                        });
                    }else{
                        self.$toast( res.message );

                        if( res.errno == 2 ){
                            self.$router.push( res.data.appurl);
                        }
                        if( res.errno == 3 ){
                            setTimeout(function(){
                                self.$router.push('/adminset');
                            },1000);

                        }                
                    }
                },true);
            },
            onChange(e){
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.geting = false;
                this.page.pdata.status = e;
                this.onLoad();
            },
            confirm(){
                var self = this;
                
                if( self.money*1 <= 0 || !self.money ) {
                    self.$toast('请填写增加数量');
                    return false;
                }
                var postdata = {
                    op:'givejifen',
                    money : self.money,
                    type : self.stype,
                    uid : self.uid,
                };
                Dialog.confirm({
                    message: '提交后将扣除相应的'+self.params.jfbname+'，确定要提交吗？'
                }).then(() => {
                    self.$util.http('admin','GET',postdata,function(res){ 
                        if (!res.errno && res.data) {
                            self.$toast(res.message);

                            if( self.stype == 1 ){
                                ImagePreview({
                                    images : [res.data.url],
                                    closeOnPopstate : true
                                });
                            }
                            self.shop.jifen = self.shop.jifen*1 - self.money*1;
                            self.isshowgive = false;
                            
                        }else{
                            self.$toast( res.message );
                            if( res.errno == 2 ){
                                self.$router.push( res.data.appurl);
                            }
                            if( res.errno == 3 ){
                                setTimeout(function(){
                                    self.$router.push('/adminset');
                                },1000);
                            }                
                        }
                    },true);
                })
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'index',
                    pid : query.pid ? query.pid : 0,
                }
                self.page.pdata.page = 1;
                self.page.isend = false;
                self.page.geting = false;
                self.page.pdata.isint = 1;

                self.$util.pageList(this,this.page,function(res){  
					self.inited = 1;	
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
	                   	self.datalist = res.data.list;
                        self.shop = res.data.shop;
                        self.page.pdata.isint = 0;
		                
                        window.document.title = '赠送'+self.params.jfbname;
						self.inited = 2;
	                }else{
	                	self.$toast(res.message);
                        if( res.errno == 2 ){
                            self.$router.push('/adminlogin');
                        }
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
#main #content{
    min-height: 100vh;
    background: #fcfcfc;
}
.give_top{
    background: #449aff;
    padding: 20px;
    color: #fff;
    font-size: 13px;
}
.give_topt{
    align-items: center;
}
.give_desc{
    text-align: center;
}
.give_num{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
}
.give_add{
    padding: 2.5px 10px;
    border:1px solid #fff;
    border-radius: 20px;
    margin-left: 10px;
}
.show_item{
    padding-top: 20px;
    font-size: 14px;
}
.show_l{
    width:90px;
    padding-left:15px;
}
.radio{
    margin-right:10px;
}

.list_item{
    background: #fff;
    margin-top: 5px;
    padding: 10px;
    font-size: 13px;
}
.top_name{
    font-size: 17.5px;
    font-weight: bold;
}
.top_date{
    color: #999;
}
.list_item>div{
    padding: 10px 0;
}
.btm {
    border-top: 1px solid #fcfcfc;
    color: #999;
}
.list_btn{
    border:1px solid #666;
    padding: 3px 10px;
    border-radius: 2.5px;
}
</style>