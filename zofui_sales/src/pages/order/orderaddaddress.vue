<template>
	
    <div :class="params.style" class="addaddress" id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            

            <van-address-edit
              :area-list="areaList"
              :address-info="address"
              show-postal
              show-delete
              show-set-default
              show-search-result
              @save="sub"
              :show-postal="false"
              :show-delete="false"
            />

            <van-button @click="back" class="backbtnoadd" type="default" size="large">返回</van-button>

        </div>
    </div>
</template>

<script type="text/javascript">
	import { Loading,List,Toast,Dialog,PullRefresh,AddressEdit,Button } from 'vant';
    import area from '../../assets/js/area.js';
    
	export default {
        name : 'orderaddaddress',
	  	components: {
	    	[List.name] : List,
	    	[Toast.name] : Toast,
	    	[Dialog.name] : Dialog,
            [PullRefresh.name] : PullRefresh,
            [AddressEdit.name] : AddressEdit,
            [Button.name] : Button,
	  	},
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : false,
	  			params : {},
	  			userinfo : {},
	  			sharedata :{},
	  			datalist : [],
                areaList : area,
	  			address : {
                    id : 0,
                    province : '',
                    city : '',
                    county : '',
                    isDefault : 0,
                    addressDetail : '',
                },
	  			from : '',
	  		}
	  	},
        activated:function(e){
        },
	  	created:function(e){
	  		this.inited = 2;
            this.initData();
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
            },
            back(){
                this.$router.go(-1);
            },
            sub : function(e){
                var self = this;
                var postdata = {
                    op : 'addaddress',
                    name : e.name,
                    tel : e.tel,
                    region : e.province+','+e.city+','+e.county,
                    street : e.addressDetail,
                    isact : e.isDefault ? 1 : 0,
                    id : self.address.id,
                }

                if( !self.$util.verify('mobile',postdata.tel) ){
                   self.$toast('手机号码格式不对');return false;
                }
                self.$util.http('user','GET',postdata,function(res){ 
                    self.$toast(res.message);
                    if (!res.errno && res.data) {
                        self.$router.go(-1);
                    }
                },true);
            },
            initData(){
                var self = this;
                var query = this.$route.query;
                self.from = query.from ? query.from : '';
                if(query.id && query.id > 0){
                    self.$util.http('user','GET',{op:'getadd',id:query.id},function(res){ 
                        self.address = res.data.address;       
                        self.address.province = res.data.address.regionarr[0];
                        self.address.city = res.data.address.regionarr[1];
                        self.address.county = res.data.address.regionarr[2];
                        self.address.addressDetail = res.data.address.street;
                        self.address.isDefault = res.data.address.isact == 1 ? true : false;
                    },true);
                }else{
                    self.address = {};
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


<style type="text/css">
.addaddress .van-address-edit__buttons{
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
}

#main.addaddress{
    min-height: 100vh;
    background: #fff;
    padding: 10px;
}
.backbtnoadd{
    margin-top: -30px;
}
</style>