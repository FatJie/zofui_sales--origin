<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

            <van-pull-refresh v-model="isrefresh" :head-height="80" @refresh="onRefresh" :disabled="disrefresh" success-text="已刷新">
                
                <div class="desc">
                    {{desc}}
                    <div class="desc_btn bg-pri" @click="copy">复制文案内容</div>
                </div>


                <div class="img" v-if="pic.length > 0">
                    <img :src="item" v-for="(item,index) in pic" :key="index" @click="prev" :data-img="index">
                    <div class="tips">点击图片可查看大图，长按保存至相册</div>
                </div>

            </van-pull-refresh>
        	
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,ImagePreview } from 'vant';
    import wx from 'weixin-js-sdk';
    
	export default {
        name : 'goodsshare',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [ImagePreview.name] : ImagePreview,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                disrefresh : true,
                inited : false,
	  			params : {},
                desc : '',
                pic : [],
	  		}
	  	},
	  	created:function(e){
            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
	  	},
	  	methods: {
            scrolltop(e){
                this.disrefresh = !e;
            },
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            prev(e){
                var self = this;
                ImagePreview({
                    images : self.pic,
                    closeOnPopstate : e.currentTarget.dataset.index,
                    showIndicators : true,
                })
            },
            copy(){
                var self = this;
                self.$copyText(self.desc).then(function (e) {
                    self.$toast('已复制');
                }, function (e) {
                    self.$toast('复制失败');
                })
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                self.dev = self.$util.dev();

                var postdata = {
                    op : 'sharedesc',
                    id : query.id ? query.id : 0,
                }
                self.$util.http('good','GET',postdata,function(res){
                    self.inited = 1;
                    if( !res.errno && res.data ){        
                        
                        self.params = res.data.params;
                        self.desc = res.data.desc;
                        self.pic = res.data.pic ? res.data.pic : [];
                        
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


#main #content{
    min-height: 100vh;
    background: #fff;
    padding: 15px;
    box-sizing: border-box;
}
.desc{
    padding: 10px;
    border-radius: 4px;
    min-height: 150px;
    border:1px solid #f3f3f3;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
    position: relative;
}
.img{
    padding: 10px 0;
    margin-top: 15px;
    position: relative;
    font-size: 13px;
}
.img img{
    border-radius:3px;
    overflow: hidden;
    width: 105px;
    height: 165px;
    border:1px solid #f3f3f3;
    margin-right:5px;
}
.desc_btn{
    position: absolute;
    right: 5px;
    bottom: 5px;
    border-radius: 5px;
    padding: 5px 15px;
    font-size: 13px;
}
.img .desc_btn{
    bottom:-25px;
}
.tips{
    padding-left: 0;
    text-align: center;
}
</style>