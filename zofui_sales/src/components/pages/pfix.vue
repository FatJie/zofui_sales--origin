<template>

    <div v-if="itemout.name == 'fix'" class="page_fix" :style="{'background-color':'rgba(255,255,255,0)',top:itemout.params.top+'%',right:itemout.params.right+'%','border-radius':itemout.params.radius+'px'}">
        <div class="btn-formid" @click="bindtap($event,itemout.params.type)" :data-url="itemout.params.appurl" :data-weburl="itemout.params.weburl" :data-tel="itemout.params.tel" >
            <img :style="{width:itemout.params.width+'vw',height:itemout.params.height+'vw'}" v-lazy="itemout.params.img" lazy-load />
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

.page_fix{
  position: fixed;
  overflow: hidden;
  z-index: 3;
}
</style>