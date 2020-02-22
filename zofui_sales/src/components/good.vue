<template>
<div class="goodname">
    <div class="goodnameimg" v-if="istag == 1">
        <img :src="tag" />
    </div>
    <div>{{name}}</div>
</div>
</template>
<script type="text/javascript">

	export default {
	    props: ['name','istag','tag'],
        created:function(e){
            
        },
        methods :{
            
        }
	}
</script>
<style type="text/css" scoped>
.goodname{
    display: flex;
    align-items: center;
}
.goodname img{
    margin-right:2px;
}
.goodnameimg{
    width:20px;
    height: 20px;
}
.goodnameimg img{
    width:20px;
    height: 20px;
}
</style>