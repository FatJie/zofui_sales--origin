<template>
	<div class="btm-save" v-if="params.idxlbs == 1 || params.listup == 0" :style="{padding:stylea == 2 ? '0 5px' : ''}">
	    <div class="btm-saveinfo" v-if="item.save_price > 0 || item.distance">
	        <div class="btm_save" v-if="item.save_price > 0">
	            <div class="vip-price" >
	                <div >
	                    <font class="vip-pricel" style="background-image:url('https://img11.360buyimg.com/ddimg/jfs/t1/34155/32/4010/1076/5cbc76b9E327f4bae/03a7ecdeb3d91531.png');"> {{stylea == 2 && params.cardname.length > 2 ? '会员' : params.cardname}} </font>        
	                    {{stylea == 2 ? '减' : '优惠'}}<font> {{item.save_price*100/100}} </font>元
	                </div>
	            </div>
	        </div>
	        <div class="btm_distance" v-if="item.distance">{{item.distance}}</div>
	    </div>
	</div>

</template>

<script type="text/javascript">
	export default {
	    props: ['params','item','stylea'],
	    created(){
	    	//console.log(this.params,this.params)
	    	//this.params = this.params;

	    }
	}
</script>

<style type="text/css">
.vip-price {
    height: 14px;
    margin-bottom: 0px;
    white-space: nowrap;
}

.vip-price>div {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    height: 14px;
    padding-right: 5px;
    vertical-align: top;
    font-size: 7.5px;
    line-height: 14px;
    color: #fff;
    background-color: #222;
    border-radius: 2px;
}

.vip-price font {
    font-size: 7.5px;
    color: #f0d288;
}

.vip-price img {
    width: 25px;
    height: 14px;
    margin-right: 3px;
}
.btm-save{
    padding-bottom:5px;
    height:19px;
}
font.vip-pricel{
    color: #222;
    font-size: 7.5px;
    background-size: 100% 100%;
    display: inline-block;
    padding: 0 10px;
    padding-left: 2.5px;
    overflow: hidden;
    height: 30px;
    line-height: 30px;
}
.btm-saveinfo{
    padding: 5px 0;
    display: flex;
}
.btm_save{
  flex: 1;
}
.btm_distance{
    font-size: 12px;
    color: #b4b4b4;
}	

</style>