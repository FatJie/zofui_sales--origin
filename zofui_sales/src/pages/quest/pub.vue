<template>
	
    <div :class="params.style" id="main">
        <div id="content" >
            
            <textarea class="text" bindinput="contentfn" v-model="content" placeholder="输入提问内容" />

            <div class="mt20">
                <!-- <picker bindchange="setsort" range="{{sort}}" range-key="name">
                    <van-cell title="选择分类" value="{{sortname ? sortname : ''}}" border="{{ false }}" is-link />
                </picker> -->
                <van-cell title="选择分类" :value="sortname ? sortname : ''" is-link @click="show = true" />
            </div>

            <div class="btn mybtn lbg-pri" @click="pub">发布</div>

            <van-popup v-model="show" position="bottom">
                <van-picker :columns="sort" value-key="name" :show-toolbar="true" @cancel="show = false" @confirm="confirm" />
            </van-popup>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,cell,Picker,Popup } from 'vant';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [cell.name] : cell,
            [Picker.name] : Picker,
            [Popup.name] : Popup,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                gid : 0,
                content : '',
                sort : [],
                sortname : '',
                sortid : '',
                show : false,
	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		//this.$emit('loadmessage',false);
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            confirm(e){
                this.sortname = e.name;
                this.sortid = e.id;
                this.show = false;
            },
            pub(){
                var self = this;
                var postdata = {
                    op : 'add',
                    sortid : self.sortid,
                    gid : self.gid,
                    content : self.content,
                }

                self.$util.http('quest','GET',postdata,function(res){
                    if( res && res.data ){        
                        
                        self.$dialog.alert({
                            message: res.message
                        }).then(() => {
                            self.$router.back();
                        });

                    }else{
                        self.$toast(res.message);
                    }
                },true);
            },
            initData(){
                var self = this;
                var params = this.$route.query;
                var postdata = {
                    op : 'pubinfo',
                }
                if( params.gid > 0 ){
                    self.gid = params.gid;
                }

	            self.$util.http('quest','GET',postdata,function(res){
					self.inited = 1;
	                if( res && res.data ){        
	                	
                        self.sort = res.data.sort;
	                   	self.title = res.data.title;
                        self.params = res.data.params;
		                
                        //window.document.title = self.title;

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
#content{
    padding: 15px;
    box-sizing: border-box;
}
.text{
    border:1px solid #eee;
    box-sizing: border-box;
    min-height: 150px;
    border-radius: 2.5px;
    padding: 10px;
    font-size: 14px;
}
.van-cell{
    padding-left: 0!important;
    padding-right: 0!important;
    border-bottom: 0.5px solid #eee;
}
.btn{
    margin-top: 50px;
    font-size: 14px;
    background: #fff;
}

</style>