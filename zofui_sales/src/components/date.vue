<template>

<div>
<div class='calendar_title item_cell_box'>
    <div class='icon' @click='lastMonth'>
        <img src='http://img11.360buyimg.com/ddimg/jfs/t1/76640/1/14595/4351/5dc2401eE6bd458f3/490237b3d24c10b7.jpg' />
    </div>
    <div class="thism">{{year}}年{{month}}月</div>
    <div class='icon' @click='nextMonth'>
        <img src='http://img11.360buyimg.com/ddimg/jfs/t1/76640/1/14595/4351/5dc2401eE6bd458f3/490237b3d24c10b7.jpg' />
    </div>
</div>

<!-- 日历主体 -->
<div class='calendar'>
    <div class='header'>
        <div v-for="(item,index) in date" :class="{'weekMark':index == todayIndex && isTodayWeek}">{{item}}</div>
    </div>

    <div class='date-box'>
        <template v-for='item in dateArr' >
            
            <div class='date-head' :class="{'nowDay':isToday == item.isToday}" :style="{background:actday == item.isToday ? '#07d535' : '',color:actday == item.isToday ? '#ffffff' : item.status == 1 ? '#ddd':''}" @click="lookHuoDong" :data-status="item.status" :data-day='item.isToday' :data-year='year' :data-month='month' :data-datenum='item.dateNum'>
                {{item.dateNum}}
            </div>
            
        </template>
    </div>

</div>
</div>


</template>

<script type="text/javascript">
	export default {
	    props: ['dateday','showdate'],
        data : function(){
            return {
                year: 0,
                month: 0,
                date: ['日', '一', '二', '三', '四', '五', '六'],
                dateArr: [],
                isToday: 0,
                isTodayWeek: false,
                todayIndex: 0,
                actday : '',
            }
        },
	    created(){
            this.dateInit();
	    },
        watch: {
            showdate(newValue, oldValue) {
                if( newValue ){
                    this.dateInit();
                }
                return newValue;
            },
        },
        methods: {
            dateInit: function (setYear, setMonth) {

                if( !setYear ){
                    let nowa = new Date();
                    let yeara = nowa.getFullYear();
                    let montha = nowa.getMonth() + 1;
                    
                    
                    this.actday = '',
                    this.year = yeara,
                    this.month = montha,
                    this.isToday = '' + yeara + this.setnum(montha) + this.setnum(nowa.getDate())
                }

                //全部时间的月份都是按0~11基准，显示月份才+1
                let dateArr = [];                       //需要遍历的日历数组数据
                let arrLen = 0;                         //dateArr的数组长度
                let now = setYear ? new Date(setYear, setMonth) : new Date();
                let year = setYear || now.getFullYear();
                let nextYear = 0;
                let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
                let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
                let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();                          //目标月1号对应的星期

                let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
                let obj = {};
                let num = 0;
                if (month + 1 > 11) {
                  nextYear = year + 1;
                  dayNums = new Date(nextYear, nextMonth, 0).getDate();
                }
                arrLen = startWeek*1 + dayNums*1;
                for (let i = 0; i < arrLen; i++) {
                  if (i >= startWeek) {
                    num = i - startWeek + 1;
                    obj = {
                      isToday: '' + year + this.setnum((month + 1)) + this.setnum(num),
                      dateNum: num,
                      weight: 5,
                      status : 0,
                    }

                    if( obj.isToday*1 < this.dateday.start*1 || obj.isToday*1 > this.dateday.end*1 ){
                        obj.status = 1;
                    }

                  } else {
                    obj = {};
                  }
                  dateArr[i] = obj;
                }
                
                this.dateArr = dateArr;
                
                let nowDate = new Date();
                let nowYear = nowDate.getFullYear();
                let nowMonth = nowDate.getMonth() + 1;
                let nowWeek = nowDate.getDay();
                let getYear = setYear || nowYear;
                let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
                if (nowYear == getYear && nowMonth == getMonth) {
                    
                    this.isTodayWeek = true;
                    this.todayIndex = nowWeek
                    
                } else {
                    
                    this.isTodayWeek = false;
                    this.todayIndex = -1;
                    
                }
            },
            setnum(num){
                if( num*1 <= 9 ) return '0'+num;
                return num;
            },
            lastMonth: function () {
                //全部时间的月份都是按0~11基准，显示月份才+1
                let year = this.month - 2 < 0 ? this.year - 1 : this.year;
                let month = this.month - 2 < 0 ? 11 : this.month - 2;
                
                this.year = year,
                this.month = (month + 1)
                
                this.dateInit(year, month);
            },
            nextMonth: function () {
                //全部时间的月份都是按0~11基准，显示月份才+1
                let year = this.month > 11 ? this.year + 1 : this.year;
                let month = this.month > 11 ? 0 : this.month;
                
                this.year = year,
                this.month = (month + 1)
                
                this.dateInit(year, month);
            },
            lookHuoDong(e){
                if( e.currentTarget.dataset.status == 1 ) return false;
                let day = e.currentTarget.dataset.day;
                let Y = e.currentTarget.dataset.year;
                let m = e.currentTarget.dataset.month;
                let d = e.currentTarget.dataset.datenum;
                
                this.actday = day;
                
                this.$emit('getdatefn',Y+'-'+m+'-'+d);
            }

        }

	}
</script>

<style type="text/css" scoped>
.calendar_title{
    width: 100%;
    margin: 10px auto;
    justify-content:space-between;
    font-size: 17.5px;
    display: flex;
    align-items: center;
}
.calendar_title .icon{
    height: 25px;
}
.calendar_title .icon:nth-of-type(3){
    transform:rotate(180deg);
}
.calendar_title .icon img{
    width: 25px; 
    height: 25px;
}
.thism{
    margin:0 50px;
    font-size: 14px;
}
/* 日历 */
.calendar{
    width: 100%;
    margin-top: 5px;
    background: #fff;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 0 0 10px;
    border-bottom: 1px solid #eeeeee;
}
.header{
    font-size: 0;
    width: 100%;
    margin: 0 auto;
}
.header>div{
    display: inline-block;
    width: 14.285%;
    color: #333;
    font-size: 17.5px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #eeeeee;
    padding: 10px 0;
}
.weekMark{
    position: relative;
    width: 100%;
    margin: 0 auto;
}
.date-box{
    font-size: 0;
    padding: 5px 0;
    width: 100%;
    margin: 0 auto;
}
.date-box>div{
    position: relative;
    display: inline-block;
    width: 49.25px;
    height: 49.25px;
    line-height:49.25px;
    color: #333;
    text-align: center;
    vertical-align: middle;
}
.date-head{
    font-size: 16px;
    border-radius: 50%;
    text-align: center;
}
.nowDay.date-head{
    color: #000;
    background-color: #eee;
    margin: 0 auto;
}
</style>