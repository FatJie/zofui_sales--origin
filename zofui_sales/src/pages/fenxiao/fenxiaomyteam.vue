<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

           <!--  <div class="myteam-tabs">
                <div @click="team" class="tab" data-l="0">
                    <font :class="page.pdata.level == 0 ? 'active color-pri border-pri':''">我的团队</font>
                </div>
                <div @click="team" class="tab" data-l="1" v-if="params.fxlevel >= 1">
                    <font :class="page.pdata.level == 1 ? 'active color-pri border-pri':''">二级团队</font>
                </div>
                <div @click="team" class="tab" data-l="2" v-if="params.fxlevel >= 2">
                    <font :class="page.pdata.level == 2 ? 'active color-pri border-pri':''">三级团队</font>
                </div>
            </div> -->

            <van-tabs v-model="page.pdata.level" :color="color" @change="team">
              <van-tab :title="'我的团队('+downnum.one+')'"></van-tab>
              <van-tab :title="'二级团队('+downnum.two+')'" v-if="params.fxlevel >= 1"></van-tab>
              <van-tab :title="'三级团队('+downnum.three+')'" v-if="params.fxlevel >= 2"></van-tab>
            </van-tabs>

            <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
            <template v-if="datalist.length > 0">
                
                <div class="card-list wrap">
                    <div class="item thin-border_b" v-for="item in datalist" :key="item.id">
                        <img class="avatar" :src="item.headimg ? item.headimg : 'http://img11.360buyimg.com/ddimg/jfs/t1/85694/7/1473/4619/5dc03cacE40b2e890/1bcfeaf2565c682e.png'">
                        <div class="info">
                            <div class="info_name">{{item.nickname ? item.nickname : ''}}（{{item.id}}）</div>
                            <!-- <div class="info_date">{{item.ctime}}</div> -->
                        </div>
                        <div class="price tr" >
                            <div class="">获得提成</div>
                            <div class="color color-pri" v-if="page.pdata.level == 0">{{item.giveparant}}元</div>
                            <div class="color color-pri" v-if="page.pdata.level == 1">{{item.givepp}}元</div>
                            <div class="color color-pri" v-if="page.pdata.level == 2">{{item.giveppp}}元</div>
                        </div>
                    </div>
                </div>
                
            </template>
            </van-list>
            <div class="list-none listnone" v-if="datalist.length <= 0 && page.isend">
                <img mode="widthFix" src="http://img11.360buyimg.com/ddimg/jfs/t1/93221/16/1388/16880/5dbeee50E0b5adbdb/6e0e5ca28baaba06.png">
                <div>~ 暂时没人 ~</div>
            </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh,Dialog,ImagePrediv,List,Tab,Tabs } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'fenxiaomyteam',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
            [Dialog.name] : Dialog,
            [List.name] : List,
            [Tab.name] : Tab,
            [Tabs.name] : Tabs,
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
                        doo : 'fenxiao',
                        op : 'myteam',
                        status : 0,
                        level : 0,
                        page : 1,
                        isinit : 1,
                    },
                    isend : false,
                    doing : true,
                    geting : false,
                    initget : false,
                },
                color : '',
                downnum : {},
	  		}
	  	},
	  	created:function(e){
	  		//this.$emit('loadmessage',false);

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
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.pdata.isinit = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            team(e){
                var self = this;
                //if( e == self.page.pdata.level )  return false;
                this.datalist = [];
                this.page.pdata.page = 1;
                this.page.isend = false;
                this.page.doing = false;
                this.page.pdata.level = e;
                this.onLoad();
            },
            initData(){
                var self = this;
	            self.$util.pageList(this,this.page,function(res){
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.datalist = res.data.list;
		                self.params = res.data.params;
                        self.downnum = res.data.downnum;
						self.inited = 2;
                        self.page.pdata.isinit = 0;

                        var maincolor = self.$util.themcolor(self.params.style);
                        self.color = maincolor;
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

#main #content{
    min-height: 100vh;
    background-color: #fcfcfc;
}

.myteam-tabs {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    background-color: #fff;
}

.myteam-tabs .tab {
    position: relative;
    -webkit-box-flex: 1;
    flex: 1;
    text-align: center;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
}

.myteam-tabs .active {
    border-bottom: 1px solid;
    padding-bottom: 12px;
}

.myteam-tabs .tr {
    text-align: right;
}

.card-list .item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 12px 0;
}

.card-list .item .avatar {
    width: 35px;
    height: 35px;
    margin-right: 10px;
    border-radius: 50%;
}

.card-list .item .info {
    -webkit-box-flex: 1;
    flex: 1;
    font-size: 14px;
    line-height: 18px;
}

.card-list .item .info_name {
    color: #1e1e1e;
}

.card-list .item .info_date {
    color: #838383;
}

.card-list .item .price {
    font-size: 12px;
}

.card-list .item .color {
    color: #f63233;
}

</style>