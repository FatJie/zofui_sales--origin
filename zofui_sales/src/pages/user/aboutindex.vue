<template>
	
    <van-pull-refresh v-model="isrefresh" @refresh="onRefresh" success-text="已刷新">
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
                <img :src="info.head" class="myhead">
                
                <div class="name">{{info.name}}</div>
                <div class="vision">v {{vesion}}</div>
                <div class="desc" v-if="info.desc" >
                    <div v-for="item in info.desc">{{item}}</div>
                </div>


                <div class="list">
                    <div class="item_cell_box item" v-for="item in info.params" @click="bindtap($event,item.type)" :data-url="item.url" :data-weburl="item.url" :data-tel="item.url" :data-copy="item.url">
                        <div class="item_t">
                            {{item.itemt}}
                        </div>
                        <div class="item_d item_cell_flex">
                            {{item.itemd}}
                        </div>
                        <div class="zan-icon zan-icon-arrow" v-if="item.type != 0"></div>
                    </div>
                    
                </div>
            
        </div>
    </div>
    </van-pull-refresh>


</template>

<script type="text/javascript">
	import { Toast,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'aboutindex',
	  	components: {
            [PullRefresh.name] : PullRefresh,
            [Toast.name] : Toast,
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
                info : {},
	  		}
	  	},
	  	created:function(e){
	  		this.$emit('loadmessage',false);

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
            bindtap(e,type){
                var self = this;
                if( type == 'copy' ){
                    this.$copyText(e.currentTarget.dataset.copy).then(function (e) {
                         self.$toast('已复制');
                    }, function (e) {
                        self.$toast('复制失败');
                    })
                }else if(type == 'callphone'){
                    window.location.href = 'tel://' + e.currentTarget.dataset.tel;
                }else if(type == 'toweburl'){
                    window.location.href = e.currentTarget.dataset.weburl;
                }else if(type == 'navigateto'){
                    window.location.href = e.currentTarget.dataset.url;
                }
            },
            initData(){
                var self = this;
                var postdata = {
                    op : 'aboutus',
                }
	            self.$util.http('helpme','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.info = res.data.info;
		                self.vesion = res.data.vesion;
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
.myhead{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 1px 1px 6px rgba(0,0,0,0.2);
    display: block;
    margin: 0 auto;
    margin-top: 15px;
}
.vision{
    text-align: center;
    color: #999;
    padding: 5px;
    font-size: 12.5px;
}
.name{
    font-weight: bold;
    text-align: center;
    padding: 5px;
    font-size: 22px;
}
.desc{
    padding: 15px;
    font-size: 14px;
    line-height: 22px;
    color: #777;
}
.list{
    padding: 15px;
}
.list .item{
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    align-items: center;
    color: #222;
}
.item_t{
    width: 85px;
    padding-right: 10px;
    font-weight: 500;
}
.item .zan-icon{
    color: #999;
    font-size: 11.5px;
}
</style>