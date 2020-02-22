<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="luckycount">
                <div class="head">
                    <div class="head_tit">获奖幸运码计算过程</div>
                    <div class="head_cont">
                        <div>计算结果：</div>
                        <div>1、求和：{{total}}（最后10条参与记录时</div>
                        <div class="head_cont_pad">间取值相加之和）</div>
                        <div>2、取余：{{total}}%{{joined}}（本次活动总</div>
                        <div class="head_cont_pad">参与人次）={{dis}}（余数）</div>
                        <div>3、结果：{{dis}}（余数）+100000= <font class="award_code">{{dis+100000}}</font>（获奖</div>
                        <div class="head_cont_mag">幸运码）</div>
                        <div>获奖幸运码：</div>
                        <div class="head_cont_xiao">
                            <font v-for="(item,index) in award" :key="index">{{item.code}}{{index == award.length - 1 ? '' : '、'}}</font> 
                        </div>
                    </div>
                    <div style="font-size:0.38667rem;">最后10条参与记录:</div>
                    <div class="head_pie" v-for="item in lastten" >
                        <div class="head_pie_left">
                            <img v-lazy="item.headimg">
                            <font>{{item.nickname}}</font>
                        </div>
                        <font>{{item.time}}</font>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	import tabbar from '../../components/tabbar';
    import wx from 'weixin-js-sdk';
	export default {
	  	components: {
	    	[List.name] : List,
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
                total : 0,
                joined : [],
                dis : 0,
                lastten : 0,
                award : {},
	  		}
	  	},
        activated:function(e){
            if( this.sharedata ){
                this.$util.share(wx,this.sharedata);
            }
            if( this.inited && this.$route.meta.keepAlive ) return false;
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
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'countrule',
                    gid : params.id ? params.id : 0,
                }
	            self.$util.http('lottery','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.total = res.data.total;
                        self.lastten = res.data.lastten;
                        self.joined = res.data.joined;
                        self.dis = res.data.dis;
                        self.award = res.data.award;
		                
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }
                        
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
#main {
    background-color: #ffd93f;
    min-height: 100vh;
}

.luckycount {
    padding: 22px 15px 40.5px;
}

.head {
    background-color: #fff;
    padding: 23.5px 14px 38px;
    border-radius: 10px;
    color: #2f2f2f;
}

.head_tit {
    font-size: 16px;
    font-weight: 700;
    width: 307.5px;
    text-align: center;
    line-height: 16px;
    border-bottom: 0.5px solid #d2d2d2;
    padding-bottom: 14.5px;
    margin-bottom: 21px;
}

.head_cont {
    font-size: 14.5px;
    line-height: 25.5px;
    margin-bottom: 15px;
}

.award_code {
    color: #ff5050;
}

.head_cont_xiao {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    color: #ff5050;
}

.head_cont_xiao font {
    display: block;
    width: 105px;
    text-align: center;
}

.head_cont_mag {
    margin-bottom: 32.5px;
}

.head_cont_pad {
    padding-left: 20px;
}

.head_pie {
    padding: 10px 0;
    border-bottom: 0.5px solid #d2d2d2;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.head_pie_left {
    display: flex;
    align-items: center;
}

.head_pie_left img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ababab;
    margin-right: 8.5px;
}

.head_pie_left font {
    width: 150px;
    font-size: 14px;
    color: #2f2f2f;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.head_pie font {
    font-size: 10px;
    color: #9b9b9b;
}
</style>