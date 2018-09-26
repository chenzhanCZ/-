let QQMusic=(function () {
   let $header = $(".QQMusic>header"); 
   let $footer= $(".QQMusic>footer"); 
   let $main = $(".main"); 
   let $playBtn=$('.playBtn');
   let $songWord=$('.songWord');
   let $runTime=$('.runTime');
   let $endTime=$('.endTime');
   let $innerL=$('.innerL');
   let myAudio=$('#audio')[0];
   let timer=null;
   let $oPS = null;

   function setHeight() {
       var winH=document.documentElement.clientHeight||document.body.clientHeight
       var h = winH-$header.height()-$footer.height()-parseInt($main.css('main-top'))-parseInt($songWord.css('padding-top'))*2;
       $main.css('height',h+'px')
   }
   function bindHtml(ary) {
       let newStr=``;
       ary.forEach(function (item,index) {
           newStr+=`<p m="${item.m}" s="${item.s}">${item.w}</p>`;
       })
       $songWord.html(newStr);
       $oPS=$songWord.find('p')
   }

   function playMusic() {
       if($playBtn.hasClass('rotateClass')){
           $playBtn.removeClass('rotateClass');
           myAudio.pause();
       }else {
           $playBtn.addClass('rotateClass');
           myAudio.play();
           computedTime();
       }
   }
  /* function btnRotate() {
       myAudio.addEventListener('canplay',function () {
           playMusic();
       },false)
   }*/
   $playBtn.singleTap(function () {
       playMusic();
   })

    function formteTime(time) {
        let m=parseInt(time/60);
        m=m<10?'0'+m:m;
        let s = parseInt(time-m*60)
        s=s<10?'0'+s:s;
        return `${m}:${s}`
    }

    function computedTime() {
        let duration=myAudio.duration;
        $endTime.html(formteTime(duration));
        timer=setInterval(function () {
            let curT=myAudio.currentTime;
            $runTime.html(formteTime(curT));
            if(curT>=duration){
                clearInterval(timer);
                $playBtn.removeClass('rotateClass');
                $songWord.css('transform',`translate(0)`);
            }else {
                matchLyric();
            }
            $innerL.css('width',curT/duration*100+'%')
        },500)
    }
    let posY=0;
    function matchLyric() {
        let curTime=formteTime(myAudio.currentTime);
        let [m,s]=curTime.split(':');
        let $curP=$oPS.filter(`[m='${m}']`).filter(`[s='${s}']`);
        if($curP.length===0) return;
        if($curP.hasClass('active')) return;
        $curP.addClass('active').siblings().removeClass('active');
        let index=$curP.index();
        if(index>2){
            posY-=$curP[0].offsetHeight;
            $songWord.css('transform',`translateY(${posY}px)`)
        }
    }

   
   
   return {
       init:function () {
           setHeight();
           $.ajax({
               url:'data.json',
               dataType:'json',
               success:function (data) {
                   let str=data.lyric;
                   let ary=[];
                   let reg=/\[(\d{2}):(\d{2})\.\d+\]([^\[]+)/g;
                   str.replace(reg,function ($0,$1,$2,$3) {
                       let obj={};
                       obj.m=$1;
                       obj.s=$2;
                       obj.w=$3;
                       ary.push(obj)
                   })
                   bindHtml(ary)
                 //  btnRotate();
               }
           })
       }
   }
   
   
   
})()

QQMusic.init();