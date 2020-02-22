<template>

    <div class="headlist" :style="{color:itemout.params.color,'margin':itemout.params.mv+'px 10px'}">

        <div v-if="itemout.params.stl == 0" class="list-item item_cell_box" v-for="inn,index in itemout.params.data" @click="bindtap($event,inn.type)" :data-url="inn.appurl" :data-weburl="inn.weburl" :data-tel="inn.tel">
            <div class="list-itemimg" v-if="itemout.params.icon == 0">
                <img :src="inn.img">
            </div>
            <div class="list-itemname">{{inn.name}}</div>
        </div>

        <div v-if="itemout.params.stl == 1" class="list-item1" v-for="inn,index in itemout.params.data" @click="bindtap($event,inn.type)" :data-url="inn.appurl" :data-weburl="inn.weburl" :data-tel="inn.tel">
            <img :src="inn.img">
            <div class="list-itemname1">{{inn.name}}</div>
        </div>
        
    </div>

</template>

<script type="text/javascript">
    import { Lazyload } from 'vant';
	export default {
        components: {
            [Lazyload.name] : Lazyload,
        },
	    props: ['itemout'],
        data : function(){
            return {
                timer : null,
                show : false,
            }
        },
	    created(){
            
	    },
        methods: {
            link(e){
                this.$router.push(e.currentTarget.dataset.url);
            },
            bindtap(e,type){
                this.$util.bindtap(e,type,this);
            },

        }

	}
</script>

<style type="text/css">
@import "../../assets/css/common.css";

.headlist{
    margin: 0 10px;
    box-shadow: 0px 0px 6px 0px rgba(12,3,7,0.06);
    padding: 10px;
    border-radius: 5px;
}
.list-item{
    align-items: center;
    position: relative;
    padding: 15px 0;
    border-bottom: 1px solid #fcfcfc;
}
.list-item:last-child{
    border-bottom: 0;
}
.list-itemimg{
    margin-right: 10px;
}
.list-itemimg,.list-itemimg img{
    width: 20px;
    height: 20px;
    display: block;
}
.list-itemname{
    font-size: 14px;
}
.list-itemname:after{
    content: " ";
    width: 5px;
    height: 5px;
    right: 0;
    top: 50%;
    -webkit-transform: translateY(-50%) rotate(45deg);
    -ms-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
    position: absolute;
    border-top: 0.5px solid #979797;
    border-right: 0.5px solid #979797;
}

.list-item1{
    width: 25%;
    text-align: center;
    margin-bottom: 20px;
    display: inline-block;
    position: relative;
}
.list-item1 img{
    width: 40px;
    height: 40px;
    display: inline-block;
}
.list-itemname1{
    display: block;
    font-size: 13px;
}
</style>