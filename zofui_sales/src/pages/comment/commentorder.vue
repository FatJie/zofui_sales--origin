<template>
	
    <div :class="params.style" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            
            <div class="discuss">
                <div class="discuss-goods thin-border_b">
                    <div class="lt">
                        <div class="img image-box __100">
                            <img v-lazy="good.thumb">
                        </div>
                    </div>
                    <div class="rt">
                        <div class="name">{{good.title}}</div>
                    </div>
                </div>
                <div class="discuss-textarea">
                    <textarea name="contents" v-model="content" placeholder="说出你的购物心情，分享给想买的他们吧" placeholderClass="placeholder"></textarea>
                </div>

                <div class="discuss-textarea">
                    <van-rate v-model="star" size="25" />
                </div>

                <div class="discuss-uploadimg" >
                    <div class="van-uploader__preview" v-for="(item,index) in fileList" :key="index">
                        <div class="van-image van-uploader__preview-image">
                            <img :src="item.url" class="van-image__img">
                            <i @click="deletet(index)"  class="van-icon van-icon-delete van-uploader__preview-delete"></i>
                        </div>
                    </div>
                    <van-uploader @delete="deletet" :preview-image="true" :multiple="true" :after-read="upload" :max-count="9" accept="image/*" />
                </div>
                <div class="fix-box" style="">
                    <div class="discuss-btn thin-border_t">
                        <div class="btn __sure bg-pri" @click="savedata">发表评论</div>
                    </div>
                </div>
                
            </div>

            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,ImagePreview,Uploader,Rate } from 'vant';
    import wx from 'weixin-js-sdk';
	export default {
        name : 'commentorder',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [ImagePreview.name] : ImagePreview,
            [Uploader.name] : Uploader,
            [Rate.name] : Rate,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			user : {},
	  			sharedata :{},
                datalist : [],
                good : {},
                star : 5,
                fileList : [],
                filetemp : [],
                content : '',
	  		}
	  	},
	  	created:function(e){

            this.$emit('loadmessage',false);
            this.$emit('bar',false);

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
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },
            starfn(e){
                this.star = e.currentTarget.dataset.id;
            },
            deletet(e){
                this.fileList.splice(e,1);
            },
            upload(e){
                var self = this;
                if( e instanceof Array ){
                    for (let i = 0; i < e.length; i++) {
                        self.$util.upimg(e[i].file,function(res){
                            self.fileList.push({
                                id : new Date().getTime(),
                                url : res.url,
                                att : res.attachment,
                            });
                        })
                    }
                }else{
                    self.$util.upimg(e.file,function(res){
                        self.fileList.push({
                            id : new Date().getTime(),
                            url : res.url,
                            att : res.attachment,
                        });
                    })
                }
            },
            savedata(e){
                var self = this;
                var POST = {
                    oid : self.oid,
                    op : 'subcomment',
                    content : self.content,
                    pic : JSON.stringify( self.fileList ),
                    star : self.star,
                };

                if( !POST.content ) {
                    self.$toast('请填写评价内容');return false;
                }

                self.$util.http('order','GET',POST,function(res){     
                    if (!res.errno && res.data) {
                        self.$toast({
                            message : '已评价',
                            onOpened : function(){
                                self.$router.go(-1);
                            }
                        });
                        
                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'orderinfo',
                    oid : query.id ? query.id : 0,
                    zfid : query.zfid ? query.zfid : 0,
                }
	            self.$util.http('order','GET',postdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.sharedata = res.data.sharedata;
                        self.params = res.data.params;
                        self.good = res.data.good;
                        self.oid = postdata.oid;

                        window.document.title = self.good.title;
                        if( self.sharedata ){
                            self.$util.share(wx,self.sharedata);
                        }

		                self.onLoad();

	                	self.inited = 2;
	                }else{
	                	self.$toast(res.message);
	                }
	                self.isrefresh = false;
	            });
            },
	  		onLoad() {
	  			var self = this;
	            /*self.$util.pageList(this,this.page,function(res){
	                if( res && res.data && res.data.list.length > 0 ){        
	                	if( self.datalist.length > 0 ){
	                		self.datalist = self.datalist.concat(res.data.list)
	                	}else{
	                		self.datalist = res.data.list;
	                	}
	                }
	            });*/
	  		},
	  		
	  	}
  	}
</script>
<style type="text/css" scoped>
@import "../../assets/css/iconfont.css";
.discuss-goods .rt .name {
    overflow: hidden;
    display: box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
}

.discuss-goods .rt .name {
    -webkit-line-clamp: 2;
}

.discuss {
    padding: 0 15px;
}

.discuss-goods {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 20px 0;
}

.discuss-goods .lt {
    min-width: 70px;
    margin-right: 10px;
}

.discuss-goods .lt .img img {
    border-radius: 5px;
}

.discuss-goods .rt .name {
    color: #222222;
    font-size: 13px;
    margin-bottom: 12px;
}

.discuss-goods .rt .intro {
    color: #999999;
    font-size: 13px;
}

.discuss-textarea {
    padding: 15px 0;
    font-size: 15px;
    color: #222;
}

.discuss-textarea textarea {
    width: 100%;
    height: 90px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border-color: #eee;
}

.discuss-textarea textarea .placeholder {
    color: #bbb;
}

.discuss-textarea .star {
    width: 25px;
    height: 25px;
    display: inline-block;
    margin-right: 15px;
}

.discuss-uploadimg {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;
}

.discuss-imgs {
    width: 80px;
    margin: 0 6px 10px 0;
}

.discuss-upload {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 15px;
    box-sizing: border-box;
    text-align: center;
    width: 80px;
    height: 80px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    color: #bbb;
    font-size: 12px;
}

.discuss-upload .icon {
    font-size: 25px;
}

.discuss-btn {
    color: #222222;
    font-size: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.discuss-btn .btn {
    font-size: 16px;
    line-height: 49px;
    border-radius: unset;
}

.discuss-btn .__cancel {
    -webkit-box-flex: 2;
    flex: 2;
}

.discuss-btn .__sure {
    -webkit-box-flex: 3;
    flex: 3;
    text-align: center;
}
</style>