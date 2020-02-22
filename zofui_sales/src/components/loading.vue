<template>
    <div class="full-loading">
        <div class="center" v-show="showtype == 0">
            <img class="loading ani-loading" src="../assets/images/loading.png" />
            <div>加载中</div>
        </div>
        <div class="center" v-show="showtype == 1">
            <div class="btn btnindex" @click="link" data-url="/">首页</div>
            <div class="btn btnback" @click="update">刷新</div>
        </div>
    </div>
</template>
<script type="text/javascript">

	export default {
	    props: ['inited'],
        data : function(){
            return {
                showtype : this.inited

            }
        },
        created:function(e){
            
        },
        methods :{
            update(){
                this.$parent.initData();
            },
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
        },
        watch: {
            inited(newValue, oldValue) {
                this.showtype = newValue;
                return newValue;
            },
        }
	}
</script>
<style type="text/css" scoped>
.btn{
    border: 1px solid #c1c1c1;
    padding: 5px 20px;
    border-radius: 20px;
    display: inline-block;
    color: #c1c1c1;

}
.btn:nth-of-type(1){
    border:1px solid #ff4756;
    color: #ff4756;
}

.btn:nth-of-type(2){
    margin-left: 20px;
}
</style>