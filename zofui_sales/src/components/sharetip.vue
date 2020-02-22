<template>
    <van-popup v-model="show" @close="hide" class="sharetipbox" :overlay="true">
        <img src="https://img11.360buyimg.com/ddimg/jfs/t1/59849/5/4032/18255/5d23fcb8E4ff4afbd/e00b919fcd8a9be7.png">
    </van-popup>
</template>

<script type="text/javascript">
    import { Popup } from 'vant';

	export default {
        components: {
            [Popup.name] : Popup,
        },
	    props: ['isshowshare'],
        data : function(){
            return {
                show : this.isshowshare
            }
        },
        created:function(e){
            
        },
        methods :{
            hide(){
                this.show = false;
                this.$emit('shareit',false);
            }
        },
        watch: {
            isshowshare(newValue, oldValue) {
                this.show = newValue;
                return newValue;
            },
        }
	}
</script>

<style type="text/css" scoped>
.sharetipbox{
    background: rgba(0, 0, 0, 0)!important;
    top: 100px!important;
}
.sharetipbox img{
    width: 100%;
    background: rgba(0, 0, 0, 0);
    width: 350px;
    top: -50%;
}
</style>