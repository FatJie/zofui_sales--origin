<template></template>
<script type="text/javascript">
	export default {
        data : function(){
            return {
                isinit : false,
            }
        },
	    created(){
            var self = this;           
	    	if( self.$util.const.scrollinit ) return false;
            self.$util.const.scrollinit = true;          

            function bodyScroll(){
                var scrolltop = document.documentElement.scrollTop;
                if( scrolltop <= 0 ){
                    console.log('123')
                    self.$emit('scrolltop', true);
                }else{
                    self.$emit('scrolltop', false);
                }
            }
            
            window.addEventListener('scroll',bodyScroll)
            window.removeEventListener('scroll',function(){});

	    }
	}
</script>