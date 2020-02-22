<template>

    <div  class="i-nav" :style="{padding:itemout.params.paddingv+'px 0'}">
        <div  class="item" v-for="item in itemout.params.data" :key="item.id" @click="bindtap($event,item.type)" :data-url="item.appurl" :data-weburl="item.weburl" :data-tel="item.tel">
            <img class="icon" v-lazy="item.img" :style="{width:itemout.params.imgwid+'vw',height:itemout.params.imgheight+'vw','border-radius':itemout.params.radius+'px'}" />
            <div :style="{'margin-top':itemout.params.martop+'px',color:itemout.params.fontcolor}">{{item.title}}</div>
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
.i-nav {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    margin: 0px 15px;
}

.i-nav .item {
    -webkit-box-flex: 1;
    flex: 1;
    min-width: 20%;
    font-size: 12px;
    text-align: center;
    line-height: 1.2;
    color: #191919;
}

.i-nav .item .icon {
    width: 30px;
    height: 30px;
    margin-bottom: 5px;
}
</style>