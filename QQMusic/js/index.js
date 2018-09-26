let QQMusic=(function () {
    //1.获取元素
    let $header = $(".QQMusic>header");
    let $main = $(".main");
    let $footer = $(".QQMusic>footer");
    let $palyBtn = $(".playBtn");
    let $songWord = $(".songWord");
    let $runTime = $(".runTime");
    let $innerL = $(".innerL");
    let $endTime = $(".endTime");
    let myAudio = $('#audio')[0];
    let timer = null;
    let $oPS = null;

    // 设置main部分的高度=一屏的高度-头部的高度尾部的高度-main的margin-songWord的padding
    function setHeight() {
        let winH = document.documentElement.clientHeight||document.body.clientHeight;
        let h=winH-$header.height()-$footer.height()-parseInt($main.css('margin-top'))-parseInt($songWord.css('padding-top'))*2;
       $main.css('height',h+'px')
    }

    function bindHtml(ary) {
        let newStr=``;
        ary.forEach(function (item,index) {
            newStr+=`<p m="${item.m}" s="${item.s}">${item.w}</p>`
        })
        $songWord.html(newStr);
        $oPS=$songWord.find('p');

    }

    function playMusic() {
        if($palyBtn.hasClass('rotateClass')){

            $palyBtn.removeClass('rotateClass')//移除类名，不再转动
            myAudio.pause();// 音频文件停止播放
        }else {
            $palyBtn.addClass('rotateClass')//添加类名，音乐图标开始转动
            myAudio.play();
            computedTime()
        }
    }
    function btnRotate() {
        myAudio.addEventListener('canplay',function () {
            playMusic();
        },false)
    }

    $palyBtn.singleTap(function () {
        playMusic();
    });

    function formteTime(time) {
        let m = parseInt(time/60);
        m=m<10?'0'+m:m;
        let s = parseInt(time-m*60)
        s=s<10?'0'+s:s;
        return `${m}:${s}`
    }

    function computedTime() {
        let duration=myAudio.duration;
        $endTime.html(formteTime(duration));
        timer=window.setInterval(function () {
            let curT=myAudio.currentTime;
            $runTime.html(formteTime(curT));
            if(curT>=duration){
                clearInterval(timer)
                $playBtn.removeClass('rotateClass');
                $songWord.css("transform",`translate(0)`)
            }else {
                matchLyric();//匹配歌词
            }
            $innerL.css('width',curT/myAudio.duration*100+'%')
        },500)
    }
    //匹配歌词
    let posY = 0;
    function matchLyric() {
        //获取已播放时间的分钟数和秒数，然后所有的p标签筛选出相同的分钟数和秒数的怕标签，给这个p标签添加类名active
        let curTime = formteTime(myAudio.currentTime);
        let [m,s]=curTime.split(':')
        let $curP = $oPS.filter(`[m="${m}"]`).filter(`[s="${s}"]`);
        if($curP.length===0)return;//一个都找不到
        if($curP.hasClass('active')) return;//已添加这个类名
        $curP.addClass('active').siblings().removeClass('active');
        console.log($curP);
        let index=$curP.index();
        if(index>2){
            posY-=$curP[0].offsetHeight;
            $songWord.css("transform",`translateY(${posY}px)`);
        }

    }


    /*function btnRotate() {
        if($palyBtn.hasClass('rotateClass')){

            $palyBtn.removeClass('rotateClass')//移除类名，不再转动
            myAudio.pause();// 音频文件停止播放
        }else {
            $palyBtn.addClass('rotateClass')//添加类名，音乐图标开始转动
            myAudio.play();
            window.setTimeout(function () {
                computedTime()
            },30)
        }
    }*/


    return {
        init:function () {
            setHeight();
            $.ajax({
                url:'data.json',
                dataType:'json',
                success:function (data) {
                    let str = data.lyric;
                    let ary=[];
                    let reg=/\[(\d{2}):(\d{2})\.\d+\]([^\[]+)/g;
                    // $0,$1,$2,$3  $0正则匹配的内容  $1 第一个分组的内容  $2 第二个分组的内容 $3 第三个分组的内容
                    str.replace(reg,function ($0,$1,$2,$3) {
                        let obj = {};
                        obj.m=$1;
                        obj.s=$2;
                        obj.w=$3;
                        ary.push(obj);
                    });
                    bindHtml(ary)
                    btnRotate();
                }
            })

        }
    }
})()
QQMusic.init();