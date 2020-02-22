<template>
	
    <div  id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
        <div id="content" v-if="inited == 2">
            

            
            <div class="content">

                <van-list v-model="page.doing" :immediate-check="page.initget" :finished="page.isend" loading-text=" " finished-text="" :offset="100" @load="onLoad">
                <template v-if="datalist.length > 0">

                    <div v-for="(item,index) in datalist" :key="index" class="redbox" >
                        <div class="item_cell_box redtop">
                            <div class="fee item_cell_flex">{{item.nickname}}</div>
                            <div class="status">{{item.statusstr}}</div>
                        </div>
                        <div class="redtime">
                            <span>
                                领取时间:{{item.ctime}} {{item.utime ? '，使用时间:'+item.utime : ''}}
                            </span>
                        </div>
                        <div class="redbot" v-if="item.error">
                            错误：{{item.error}}
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
        </van-pull-refresh>


    </div>
</template>

<script type="text/javascript">
	import { Button,Loading,List,Toast,Dialog,PullRefresh } from 'vant';
    import tabbar from '../../components/tabbar';
	export default {
        name : 'cardredbag',
	  	components: {
            [Button.name] : Button,
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
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
                actindex : 0,
                isredbag : false,
                issetfee :false,
                isaddm : false,
                addfee : '',
                datalist : [],
                page : {
                    pdata : {
                        doo : 'admin',
                        op : 'cardgetlog',
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
            initData(){
                var self = this;
                var query = this.$route.query;

                self.page.pdata.page = 1;
                self.page.isend = false;
                self.datalist = [];
                self.page.pdata.cardid = query.id;

                self.$util.pageList(this,this.page,function(res){ 
                    self.inited = 1;
                    if( !res.errno && res.data ){        
                        
                        self.datalist = res.data.list;
                        self.inited = 2;
                    }else if( res.errno == 2 ){
                        self.$toast( res.message );
                        self.$router.push(res.data.appurl);
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

</style>