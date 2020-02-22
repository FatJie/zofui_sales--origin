<template>
    <div class="type-bar lbg-pri" v-if="good.type != 6 && good.type != 5 && good.start > 0 && good.type != 0 && ((good.over_type == 0 && good.islasttimer == 1) || good.over_type == 2 || (good.over_type == 3 && good.type == 3 ) )">
        <div class="lt">
            <img v-if="good.type == 1" class="lt_img" src="https://img11.360buyimg.com/ddimg/jfs/t1/51793/25/299/3327/5cd42f16E59c58960/34d4465db890f575.png">
            <img v-else-if="good.type == 2" class="lt_img" src="https://img11.360buyimg.com/ddimg/jfs/t1/41617/16/4450/3058/5cd43268E287b8d24/78970b34c779fb9c.png">
            <img v-else-if="good.type == 3" class="lt_img" src="https://img11.360buyimg.com/ddimg/jfs/t1/53286/32/279/3279/5cd435f2Ef8397a88/7ccbdcb9ba7675f9.png">
            <img v-else-if="good.type == 99" class="lt_img" src="https://img11.360buyimg.com/ddimg/jfs/t1/80877/20/258/2622/5ce676f5Edda648a9/e7440e6948a1eb55.png">
            <img v-else class="lt_img" src="https://img11.360buyimg.com/ddimg/jfs/t1/39588/12/6864/3195/5cd432d4E73b91c7d/71998eee103a99c0.png">
        </div>
        <div class="rt" v-if="good.over_type == 0 || good.over_type == 2">
            距{{good.over_type == 0?'结束':''}}{{good.over_type == 2?'开始':''}}
            <div class="countdown" >
                <template v-if="Countdown.day != 0">
                    <font>{{Countdown.day}}</font> 天
                </template>
                <font>{{Countdown.hour}}</font> :
                <font>{{Countdown.minute}}</font> :
                <font>{{Countdown.second}}</font>
            </div>
        </div>
        <div class="rt" v-if="good.over_type == 3">已结束</div>
    </div>
</template>

<script type="text/javascript">
	export default {
	    props: ['good','cut'],
        data : function(){
            return {
                Countdown : {},
                timer : null,
            }
        },
	    created(){
            var self = this;
            clearInterval(self.timer);

            self.countTime();
            
            self.timer = null;
            self.timer = setInterval(function(){
                self.countTime();
            },1000);

	    },
        methods : {
            countTime(){
                var self = this;
                var date = new Date();
                var time = date.getTime();

                var endTime = 0;
                if( self.good.over_type == 0 ) {
                    endTime = self.good.end + '000';
                }
                if( self.good.over_type == 2 ) {
                    endTime = self.good.start + '000';
                }

                if( self.good.over_type == 0 && self.cut && self.cut.status == 0 && self.cut.endtime > time/1000 ) {
                    endTime = self.cut.endtime + '000';
                }

                if(self.good.type != 0 && endTime != 0 && self.good.opentime != 1){
                    var lag = (endTime*1 - time);
                    if(lag > 0){
                        var second = Math.floor(lag/1000%60);     
                        var minite = Math.floor(lag/1000/60%60);
                        var hour = Math.floor(lag/1000/60/60%24);
                        var day = Math.floor(lag/1000/60/60/24);
                    }else{
                        var second = 0;
                        var minite = 0;
                        var hour = 0;
                        var day = 0;
                        if( self.good.over_type == 0 ){
                            self.good.over_type = 3;
                        }else if( self.good.over_type == 2 ){
                            self.good.over_type = 0;
                        }
                    }
                    this.Countdown = {day:day,hour:hour,minute:minite,second:second};
                    this.$emit("countdownfn",this.Countdown);
                }
            },
        }
	}
</script>

<style type="text/css">
.type-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    width: 100%;
    padding: 0 15px;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    margin-left: -15px;
}
.type-bar .lt_img {
    width: 80px;
    height: 21px;
}
</style>