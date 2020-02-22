<template>
    <div :class="params.style" id="main">
    	<loading v-if="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">

                <div class="verify_top item_cell_box">
                    <div>
                        <img :src="user.headimg" />
                    </div>
                    <div class="item_cell_flex nick">{{user.nickname}}</div>
                </div>

                <template v-if="subed" >
                    <div class="ved">已审核</div> 
                </template>
                <template v-else>
                    
                    <template v-if="type == 'agent'">
                        <div class="frm_group " >
                            <div class="frm_item item_cell_box">
                                <div class="frm_title">姓名</div>
                                <div class="frm_form item_cell_flex infotip">
                                    {{join.name}}
                                </div>
                            </div>
                            <div class="frm_item item_cell_box">
                                <div class="frm_title">电话</div>
                                <div class="frm_form item_cell_flex infotip">
                                    {{join.tel}}
                                </div>
                            </div>
                            <div class="frm_item item_cell_box">
                                <div class="frm_title">地址</div>
                                <div class="frm_form item_cell_flex infotip">
                                    {{join.address}}
                                </div>
                            </div>
                        </div>
                    </template>
                    
                    <template v-else-if="type == 'fx'">
                        <div class="frm_group " >
                            <div class="frm_item item_cell_box">
                                <div class="frm_title">昵称</div>
                                <div class="frm_form item_cell_flex infotip">
                                    {{user.nickname}}
                                </div>
                            </div>
                            <div class="frm_item item_cell_box">
                                <div class="frm_title">姓名</div>
                                <div class="frm_form item_cell_flex infotip">
                                    {{join.name}}
                                </div>
                            </div>
                            <div class="frm_item item_cell_box">
                                <div class="frm_title">电话</div>
                                <div class="frm_form item_cell_flex infotip">
                                    {{join.tel}}
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        
                        <van-cell-group>
                            <van-field v-model="join.shopname" label="商户名称" placeholder="输入商户名称" />
                            <van-field v-model="join.account" label="登录账户" placeholder="登录的账户" />
                            <van-field v-model="join.pass" label="登录密码" placeholder="登录的密码" />
                            <van-field v-model="join.tel" type="tel" label="联系电话" placeholder="登录的密码" />

                            <van-field clickable  label="商户分类" readonly :placeholder="join.sortname ? join.sortname : '选择分类'" @click="popupsort = true" >
                            </van-field>
                            <van-popup v-model="popupsort" position="bottom" >
                                <van-picker :columns="sort"  value-key="name" confirm-button-text="确定" show-toolbar @cancel="popupsort = false" @confirm="onChangesort" />
                            </van-popup>

                            <van-field clickable  label="到期时间" readonly :placeholder="join.end ? join.end : '设置时间'" @click="endtime = true" >
                            </van-field>
                            <van-popup v-model="endtime" position="bottom" >
                                <van-datetime-picker v-model="join.showendtime" type="datetime"  @cancel="endtime = false" @confirm="timefn($event,'endtime')"  />
                            </van-popup>

                        </van-cell-group>

                        <div class="frm_group " >
                            
                            
                            
                            <!-- <div class="frm_item item_cell_box">
                                <div class="frm_title">商户分类</div>
                                <div class="frm_form item_cell_flex">
                                    <picker mode="selector" value="{{join.sortvalue}}" range-key="name" range="{{sort}}" bindchange="getsortvalue">
                                        <div class="frm_notips" wx:if="{{!join.sortname}}">选择分类</div>
                                        <div class="frm_pick" wx:else>{{join.sortname}}</div>
                                    </picker>
                                </div>
                            </div> -->

                        </div>

                        <!-- <div class="frm_item item_cell_box">
                            <div class="frm_title">到期时间</div>
                            <div class="frm_form item_cell_flex">
                                <div class="frm_place"></div>
                                <picker mode="multiSelector" value="{{dateTime.end}}" bindchange="changeDateTimeColumn1" data-type="end"  range="{{dateTimeArray.end}}" >
                                    <div class="tui-picker-detail">
                                        <div class="frm_notips" wx:if="{{!join.end}}">选择时间</div>
                                        <div class="frm_pick" wx:else>{{join.end}}</div>
                                    </div>
                                </picker>
                            </div>
                            <div class="frm_tips"></div>
                        </div> -->

                    </template>

                    <div class="cf_box">
                        <div class="bg-pri mybtn" @click="pass">审核通过</div>
                    </div>
                </template>
    
        
        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,Popup,DatetimePicker,Picker,Field,cellGroup } from 'vant';
	export default {
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [Popup.name] : Popup,
            [Field.name] : Field,
            [cellGroup.name] : cellGroup,
            [DatetimePicker.name] : DatetimePicker,
            [Picker.name] : Picker,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
                subed : false,
                join : {},
                user : {},
                sort : {},
                popupsort : false,
                endtime : false,
                type : '',
	  		}
	  	},
        activated:function(e){

            this.initData();
            this.$route.meta.keepAlive = true;
        },
	  	created:function(e){
	  		
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            timefn(e,type){
                var t = this.$util.formDate(e);
                if( type == 'endtime' ){
                    this.join.end = t;
                    this.join.showendtime = new Date(t);
                    this.endtime = false;
                }
            },
            onChangesort(tar){
                this.join.sortid = tar.id;
                this.join.sortname = tar.name;
                this.popupsort = false;
            },
            pass(e){
                
                var self = this;
                var join = JSON.stringify( self.join );
                
                var pdata = {op:'verifypass',join:join,type:self.type};
                self.$util.http('webadmin','GET',pdata,function(res){    
                    self.$toast( res.message );
                    if (!res.errno && res.data) {
                        self.subed = true;
                    }
                },true);

            },
            initData(){
                var self = this;
                var query = this.$route.query;

                var joinid = query.joinid ? query.joinid : '';
                var type = query.type ? query.type : '';
                self.type = type;
                var pdata = {op:'verify',joinid:joinid,type : type};

                self.$util.http('webadmin','GET',pdata,function(res){ 
					self.inited = 1;
	                if( !res.errno && res.data ){        
	                	
	                   	self.params = res.data.params;
                        self.user = res.data.user;
                        self.join = res.data.join;
                        self.sort = res.data.sort;

                        self.join.showendtime = new Date();

						self.inited = 2;
	                }else{
                        self.$toast( res.message );
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
    font-size: 15px;
    background: #eee;
}
.cf_box{
    padding: 10px;
    margin-top: 20px;
}
.verify_top{
    background:#f3f4f9;
    padding: 10px;
    align-items: center;
}
.verify_top img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.verify_top .nick{
    font-weight: 400;
    font-size: 16px;
    padding-left: 15px;
}
.ved{
    text-align: center;
    padding: 25px;
    color: #999;
}
.infotip{
    font-size:15px;
}
</style>