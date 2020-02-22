<template>
	
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="orderinfo mt20" v-if="card">
                <div class="order_item item_cell_box">
                    <div class="item_cell_flex">名称</div>
                    <div>{{card.name}}</div>
                </div>
                <div class="order_item item_cell_box">
                    <div class="item_cell_flex">面值</div>
                    <div >¥ {{card.fee*100/100}}</div>
                </div>
                <div class="order_item item_cell_box" >
                    <div class="item_cell_flex">状态</div>
                    <div>{{card.takedstatus == 0 ? '待使用' : '已使用'}}</div>
                </div>
                <div class="order_item item_cell_box">
                    <div class="item_cell_flex">使用条件</div>
                    <div>满 ¥{{card.use*100/100}}</div>
                </div>
                <div class="order_item item_cell_box" >
                    <div class="item_cell_flex">过期时间</div>
                    <div>{{card.endtime}}</div>
                </div>
                <div class="order_item item_cell_box" >
                    <div class="item_cell_flex">剩余使用次数</div>
                    <div>{{card.lasttimes}}</div>
                </div>
            </div>

            <div class="btn save" @click="hexiao" v-if="card">{{ishexiao == 1 ? '已核销' : '核销'}}</div>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh } from 'vant';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                ishexiao : false,
                card : false,
                cid : '',
	  		}
	  	},
        activated:function(e){

            if( this.inited && this.$route.meta.keepAlive ) return false;
            this.initData();
            this.inited = 2;
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
            select(){
                var self = this;
                if( !self.cid ) {
                    self.$toast('请重新扫码');return false;
                }

                self.$util.http('admin','GET',{op:'selecthexiaocard',cid:self.cid},function(res){      
                    if (!res.errno && res.data ) {
                        self.card = res.data.card;
                    }else{
                        self.$toast( res.message );
                    }
                },true);
            },
            hexiao(){
                var self = this;
                if( self.ishexiao == 1 ) return false;
                if( !self.code ) {
                    self.$toast('请输入核销编码');return false;
                }
                self.$util.http('admin','GET',{op:'hexiaocard',cid:self.cid},function(res){
                    if (!res.errno && res.data) {
                        Toast({
                            message : res.message,
                        })
                        self.ishexiao = 1;
                        self.card.takedstatus = 1;
                        self.card.lasttimes = (self.card.lasttimes-1);
						
                    }else{
                        self.$toast( res.message );
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                if( query.scene && query.scene.length > 1 ){
                    self.cid = query.scene;
                    self.select();
                }
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
.btn{
    height: 44px;
    line-height: 44px;
    background: #fb2d37;
    text-align: center;
    border-radius: 1.5px;
    color: #fff;
    position: fixed;
    left: 10px;
    width: 355px;
    bottom: 5px;
}
.save{
    margin-top: 10px;
}
.save text{
    font-size: 12px;
}
.applyed{
    border:0.5px solid #eaeaea;
    display: inline-block;
    width: 200px;
    line-height: 50px;
    background: #fff;
    border-radius: 2.5px;
    text-align: center;
    color: #969696;
    margin-top: 20%;
    margin-left: 87.5px;

}
.time_item{
    width: 60px;
    border:0.5px solid #eaeaea;
    text-align: center;
    margin: 0 2.5px;
}

.orderinfo {
    padding: 10px;
    background: #fff;
}
.order_item{
    padding: 10px 0;
    border-bottom: 0.5px solid #eaeaea;
}

.orderinfo_good{
    padding: 10px;
    background: #fff;
}
.good_thumb{
    width: 100px;
    height: 100px;
}
.good_thumb image{
    width: 100px;
    height: 100px;
}
.good_title{
    padding: 10px;
}

div{
    font-size: 14px;
}

/*form*/
.frm_form{
    position: relative;
    border-bottom: 0.5px solid #eee;
}
.frm_place{
    position: absolute;
    left: 5px;
    top: 5px;
    color: #969696;
    font-size: 14px;
}
.frm_item{
    padding: 10px;
    background: #fff;
    border-bottom: 0.5px solid #eaeaea;
}
.frm_item:last-child{
    border:0;
}
.frm_title{
    color: #656565;
    width: 75px;
}
.frm_input{
    padding: 5px;
    width: 100%;
}
.frm_tips{
    color: #969696;
    font-size: 11px;
}
.frm_notips{
    color: #cbcfd2;
    padding: 5px;
}
.frm_pick{
    padding: 5px;
}


</style>