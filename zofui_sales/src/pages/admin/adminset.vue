<template>
	
    <div id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

        <van-cell-group>
            <van-field  v-model="shop.name" :label="params.shopbname+'名称'" :placeholder="'输入'+params.shopbname+'名称'" />
            <van-field  v-model="shop.desc" type="textarea" :label="params.shopbname+'描述'" :placeholder="'输入'+params.shopbname+'描述'" />
        </van-cell-group>

        <van-cell-group>
            <!-- <van-field  :label="params.shopbname+'位置'" placeholder="" readonly placeholder="选择位置" /> -->
            
            <van-field v-model="shop.tel" type="tel" :label="params.shopbname+'电话'" :placeholder="'输入'+params.shopbname+'电话'" />
            <van-field v-model="shop.auth.startm" type="number" label="起购金额" placeholder="配送到家的订单起购金额" >元</van-field>
            <van-field v-model="shop.auth.expfee" type="number" label="默认配送费" placeholder="下单需要的配送费" >元</van-field>
            <van-field v-model="shop.auth.pakfee" type="number" label="默认包装费" placeholder="下单需要的包装费" >元</van-field>
            <van-field v-model="shop.severkm" type="tel" label="服务范围" placeholder="超过范围不可下单" >米</van-field>

            <van-field v-model="shop.auth.opentime" label="展示营业时间" :placeholder="'在'+params.shopbname+'主页展示'" ></van-field>

            <div class="frm_item item_cell_box">
                <div class="frm_title">可下单时间</div>
                <div class="frm_form item_cell_flex item_cell_box">
                    <input class="frm_input time_item" v-model="shop.severtime.sh" type="number"  bindinput="inputvalue" data-type="severtime" data-id="sh" placeholder-style="color:#cbcfd2;" maxlength="20"  /> :
                    <input class="frm_input time_item" v-model="shop.severtime.sm" type="number"  bindinput="inputvalue" data-type="severtime" data-id="sm" placeholder-style="color:#cbcfd2;" maxlength="20"  /> -
                    <input class="frm_input time_item" v-model="shop.severtime.eh" type="number"  bindinput="inputvalue" data-type="severtime" data-id="eh" placeholder-style="color:#cbcfd2;" maxlength="20"  /> :
                    <input class="frm_input time_item" v-model="shop.severtime.em" type="number"  bindinput="inputvalue" data-type="severtime" data-id="em" placeholder-style="color:#cbcfd2;" maxlength="20"  />
                </div>
                <div class="frm_tips"></div>
            </div> 
        </van-cell-group>

        <van-cell-group v-if="sets.paytype == 1">
            <van-field  v-model="shop.aliname" label="提现支付宝名称" placeholder="输入提现支付宝名称" />
            <van-field  v-model="shop.aliaccount" type="textarea" label="提现支付宝账户" placeholder="输入提现支付宝账户" />
        </van-cell-group>

        <van-cell-group class="upbox">
            <van-uploader :upload-text="params.shopbname+'头像'" v-model="shop.showheadimg" :max-count="1" :after-read="uploada" />
            <van-uploader :upload-text="params.shopbname+'背景'" v-model="shop.showcover" :max-count="1" :after-read="uploadb" />
        </van-cell-group>
        <div class="frm_group " >

            <!-- <van-uploader :upload-text="params.shopbname+'头像'" v-model="showthumb" :max-count="1" :after-read="uploada" /> -->

            <!-- <div class="frm_item frm_up_item">
                <div class="div_img_item" v-if="{{shop.headtemp || shop.showheadimg}}">
                    <image src="{{shop.headtemp ? shop.headtemp : shop.showheadimg}}" mode="widthFix" ></image>
                </div>
                <div class="div_img_item frm_item_upload" bindtap="uploadTap" data-type="head">
                    <div class="upload_add">+</div>
                    <div class="upload_text">{{params.shopbname}}头像</div>
                </div>
            </div>
            <div class="frm_item frm_up_item">
                <div class="div_img_item div_img_itemin" v-if="{{shop.bgtemp || shop.showcover}}">
                    <image mode="widthFix" src="{{shop.bgtemp ? shop.bgtemp : shop.showcover}}" mode="widthFix" ></image>
                </div>
                <div class="div_img_item frm_item_upload" bindtap="uploadTap" data-type="bg">
                    <div class="upload_add">+</div>
                    <div class="upload_text">{{params.shopbname}}背景</div>
                </div>
            </div> -->

        </div> 
        

        <div class="btn save"  @click="save">保存</div>
            
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Field,cellGroup,Uploader } from 'vant';
	import tabbar from '../../components/tabbar';
	export default {
        name : 'adminset',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [Uploader.name] : Uploader,
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
                shop : {auth:{},severtime:{}},
                sets : false,
                headtemp : [],
                bgtemp : [],
	  		}
	  	},
        activated:function(e){


        },
	  	created:function(e){
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
            uploada(e){
                var self = this;
                self.$util.upimg(e.file,function(res){
                    self.shop.showheadimg = [{content:res.url}];
                    self.shop.headimg = res.attachment;
                })
            },
            uploadb(e){
                var self = this;
                self.$util.upimg(e.file,function(res){
                    self.shop.showcover = [{content:res.url}];
                    self.shop.cover = res.attachment;
                })
            },
            save(){
                var self = this;

                var shop = self.shop;

                if( !shop.name ) {
                    self.$toast('请填入名称');return false;
                }
                if( !shop.desc ) {
                    self.$toast('请填入描述');return false;
                }      
                if( !shop.tel ) {
                    self.$toast('请填入电话');return false;
                }
                self.shop.content = '';
                self.shop.mark = '';

                var form = JSON.stringify( self.shop );
                self.$util.http('admin','post',{op:'saveset',form:form},function(res){     
                    if (!res.errno && res.data) {
                        self.$toast({
                            message : res.message,
                            onClose : function(){
                                self.$router.go(-1);
                            }
                        });
                    }else{
                        self.$toast( res.message );
                        if( res.errno == 2 ){
                            self.$router.push(res.da.url);
                        }
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                var postdata = {
                    op : 'set',
                }
                self.$util.http('admin','GET',postdata,function(res){  
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
                        self.params = res.data.params;
	                   	self.shop = res.data.shop;
                        self.sets = res.data.set;
                        self.shop.auth = res.data.shop.auth ? res.data.shop.auth : {};
		                self.shop.auth.startm = res.data.shop.auth.startm ? res.data.shop.auth.startm : '';

                        self.headtemp = self.shop.showheadimg ? [self.shop.showheadimg] : [];
                        self.bgtemp = self.shop.showcover ? [self.shop.showcover] : [];
						
                        if( self.shop ){
                            self.shop.showheadimg = [{content:self.shop.showheadimg}];

                            self.shop.showcover = [{content:self.shop.showcover}];
                        }

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
#main{
    min-height: 100vh;
    background: #eee;
}
.btn{
    height: 44px;
    line-height: 44px;
    background: #449aff;
    text-align: center;
    border-radius: 1.5px;
    color: #fff;
    margin: 10px;
    width: 355px;
}
.save{
    margin-top: 10px;
    font-size: 15px;
}
.save font{
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
    width: 45px;
    height: 30px;
    line-height: 30px;
    border:0.5px solid #eaeaea;
    text-align: center;
    margin: 0 2.5px;
}
.frm_form{
    font-size: 14px;
}
.upbox{
    padding: 10px;
    font-size: 14px;
    overflow: hidden;
}
.upbox>div{
    float: left;
    margin-right: 20px;
}
</style>