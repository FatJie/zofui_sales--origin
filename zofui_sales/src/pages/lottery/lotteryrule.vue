<template>
	
    <div id="main">
    	<loading v-show="inited == 0 || inited == 1" :inited="inited" />
        <div id="content" v-if="inited == 2">
            
            <div class="luckyrules">
                <div class="lattice">
                    <font class="lattice_tit">幸运码计算方式</font>
                    <div class="lattice_cont" v-html="rule"></div>
                </div>
            </div>

        </div>
    </div>
</template>

<script type="text/javascript">

	export default {
	  	data : function(){
	  		return {
                isrefresh : false,
                inited : true,
	  			rule : "<p>本活动完全公平和随机，规则如下:</p><p>1、每个用户参与活动将按顺序获得一个幸运码，邀请好友参与可以获得更多幸运码；</p><p>2、到达活动开奖时间后，系统将取最后10名参与用户的时间的数值进行求和，得到数值A(每个时间按天、时、分、秒的顺序组合，如10日19：25：53则为10192553)；</p><p>3、用数值A除以总计幸运码个数，得到的余数+100000，得到获奖幸运码，拥有幸运码者，即获得该期奖品。（什么是余数？如：100除以33，则1为余数）；</p><p>4、若奖品有多份，则取“获奖幸运码”之后相近的几个幸运码也为“获奖幸运码”（如：奖有3份，“获奖幸运码”为1000128，则1000129、1000130也为“获奖幸运码”）</p><p>5、每个用户只能中奖1次，若用户有多个幸运码获奖，则该用户其他获奖幸运码自动往后推到后一个参与用户的幸运码获奖。</p>"
	  		}
	  	},
	  	activated:function(e){
	  		this.inited = 2;
	  	},
	  	methods: {
            onRefresh(){
                this.initData();
            },
            link(e){
            	this.$router.push(e.currentTarget.dataset.url);
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

.luckyrules {
    padding: 22px 15px 30.5px;
    width: 345px;
}

.luckyrules .lattice {
    background-color: #fff;
    border-radius: 10px;
    padding: 23.5px 15px 25px;
    color: #2f2f2f;
}

.luckyrules .lattice .lattice_tit {
    width: 307.5px;
    padding-bottom: 15px;
    text-align: center;
    display: block;
    font-size: 16px;
    font-weight: 700;
    line-height: 16px;
    border-bottom: 0.5px solid #d2d2d2;
    margin-bottom: 21px;
}

.luckyrules .lattice .lattice_cont {
    display: block;
    font-size: 14.5px;
    line-height: 25.5px;
}
</style>