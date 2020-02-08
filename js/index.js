$(function(){

    let $audio = $('audio');
    let player = new Player($audio);
    let progress;
    let voice;
    let lynic;
    
     // 获取歌曲信息
     getPlayerList();
     function getPlayerList(){
         $.ajax({
             url:'../source/musiclist.json',
             dataType:"json",
             success(res){
                 player.musicList = res;
                 let $contentList = $('.content-list ul');
                 $.each(res,function(index,value){
                     let $item = createMusic(index,value);
                     $contentList.append($item);
                 })
                 // 传递第0条是为了初始化
                 initMusicInfo(res[0]);
                 initMusicLynic(res[0]);
             },
             error:function(err){
                 console.log(err);
             }
         });
     }

    initProgress();
    // 初始化进度条
    function initProgress(){
        let $bar = $('.footer-progress-bar');    
        let $line = $('.footer-progress-line');
        let $dot = $('.footer-progress-dot');
        progress = new Progress($bar,$line,$dot);
        // 点击进度条
        progress.progressClick(function(value){
            player.musicTo(value);
        });

        // 移动进度条
        progress.progressMove(function(value){
            player.musicTo(value);
        });

        let $vbar = $('.footer-voice-bar');    
        let $vline = $('.footer-voice-line');
        let $vdot = $('.footer-voice-dot');
        voice = new Progress($vbar,$vline,$vdot);
        // 点击进度条
        voice.progressClick(function(value){
            player.voiceTo(value);
        });
        // 移动进度条
        voice.progressMove(function(value){
            player.voiceTo(value);
        });
    }
   
    // 自定义滚动条
    $(".content-list").mCustomScrollbar();

    function initMusicInfo(music){
        let $musicImg = $('.song-info-pic img');
        let $musicName = $('.song-info-name');
        let $musicSinger = $('.song-info-singer');
        let $musicZhuanji = $('.song-info-zhuanji');
        let $musicProgressName = $('.footer-progress-top').children('span').eq(0);
        let $musicProgressTime = $('.footer-progress-top').children('span').eq(1);
        let $maskBg = $('.mask-bg');

        $musicImg.attr('src',music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicZhuanji.text(music.album);
        $musicProgressName.text(music.name + '-' + music.singer);
        $musicProgressTime.text('00:00/' + music.time);
        $maskBg.css('background','url('+music.cover+')')
    }

    function initMusicLynic(music){
        lynic = new Lynic(music.link_lrc);
        let $lynicContent = $('.song-lyric');
        $lynicContent.html('')
        lynic.loadLynic(function(){
            $.each(lynic.lynic,function(index,data){
                let $item = $('<li>'+data+'</li>')
                $lynicContent.append($item)
            })
        });
    }

    initEvents();
    // 初始化事件
    function initEvents(){
        // 勾选框
        $('.content-list .list-title').delegate('i.cb','click',function(){
            /*-------------------------未优化-------------------------*/ 
            // let $li = $('.content-list .list-music i.fq').children('i');
            // let count = 0;
            // $li.each(function(i,e){
            //     if($(this).hasClass('icon-anonymous-iconfont')){
            //         count++;
            //     }
            // })
            // if(count !== $li.length){
            //     $(this).children('i').addClass('iconfont icon-anonymous-iconfont');
            //     $('.content-list .list-music').find('.q').addClass('iconfont icon-anonymous-iconfont');
            //     $('.content-list .list-music i.fq').addClass('change');

            // }
            // else{
            //     $(this).children('i').removeClass('iconfont icon-anonymous-iconfont');
            //     $('.content-list .list-music').find('.q').removeClass('iconfont icon-anonymous-iconfont')
            //     $('.content-list .list-music i.fq').removeClass('change');
            // }
            /*-------------------------未优化-------------------------*/ 
            let className = 'iconfont icon-anonymous-iconfont';
            let status = $(this).children('i').toggleClass(className).hasClass(className);
            $('.content-list .list-music i.fq').children('i').attr('class',status ? 'q ' + className : 'q');
            $('.content-list .list-music i.fq').attr('class',status ? 'fq change' : 'fq')
        })
        
        $('.content-list').delegate('.list-music i.fq','click',function(){
            $(this).children('i').toggleClass('iconfont icon-anonymous-iconfont');
            $(this).toggleClass('change');
            let $li = $('.content-list .list-music i.fq').children('i');
            // 默认全选中
            $('.content-list .list-title').find('i.cb').children('i').addClass('iconfont icon-anonymous-iconfont');
            $li.each(function(i,e){
                // 只要有一个未选中，直接取消全部选中并推出
                if(!$(this).hasClass('icon-anonymous-iconfont')){
                    $('.content-list .list-title').find('i.cb').children('i').removeClass('iconfont icon-anonymous-iconfont');
                    return false
                }
            })
            /*-------------------------未优化-------------------------*/ 
            // 当音乐菜单被选中的数量等于总数量
            // if(count == $li.length){
            //     $('.content-list .list-title').find('i.cb').children('i').addClass('iconfont icon-anonymous-iconfont')
            // }
            // else{
            //     $('.content-list .list-title').find('i.cb').children('i').removeClass('iconfont icon-anonymous-iconfont')
            // }
            /*-------------------------未优化-------------------------*/ 
        })

        // 鼠标经过显示小圈
        $('.content-list').delegate('.list-music','mouseenter',function(){
            $(this).find('.list-menu').css('display','block');
            $(this).children('.list-time').css({display:'none'}).siblings('a').css({display:'block'})
        })
        $('.content-list').delegate('.list-music','mouseleave',function(){
            $(this).find('.list-menu').css('display','none');
            $(this).children('.list-time').css({display:'block'}).siblings('a').css({display:'none'})
        })

        // 点击子菜单播放按钮
        $('.content-list').delegate('.list-menu-play','click',function(){
            let $item = $(this).parents('.list-music');
            // console.log($item.get(0).index)
            // console.log($item.get(0).music)

            // 切换当前播放图标
            $(this).children('i').toggleClass('icon-zanting')
            // 让其他的图标复原
            $item.siblings().find('.icon-zanting').removeClass('icon-zanting');
            // 让其他行的文字恢复半透明
            $item.siblings('.list-music').find('div').css('color','rgba(255,255,255,.5)')
            
            // 同步切换主播放按钮
            if($(this).children('i').hasClass('icon-zanting')){ 
                // 当类为暂停图标时，底部同步为暂停图标
                $('.footer-control').find('a').eq(1).find('i').removeClass().addClass('iconfont icon-zanting');
                // 当类为暂停图标时，此行文字高亮
                $item.find('div').css('color','#fff');
            }
            else{  
                $('.footer-control').find('a').eq(1).find('i').removeClass().addClass('iconfont icon-bofang1');
                $item.find('div').css('color','rgba(255,255,255,.5)');
            }
            // 切换数字索引为gif图
            $item.find('.list-number').toggleClass('list-number2');
            // 让其他行的数字索引恢复
            $item.siblings().find('.list-number').removeClass('list-number2');

            // 播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music)
            // 切换当前音乐信息
            initMusicInfo($item.get(0).music)
            // 切换当前歌词信息
            initMusicLynic($item.get(0).music)
        })

        // 底部播放按钮
        $('.footer-control').children('a').eq(1).click(function(){
            // 判断是否播放过音乐
            if(player.currentIndex == -1){  // 未播放过音乐
                $('.list-music').eq(0).find('.list-menu-play').trigger('click')
            }
            else{
                $('.list-music').eq(player.currentIndex).find('.list-menu-play').trigger('click')
            }
        })

        // 底部上一首按钮
        $('.footer-control').children('a').eq(0).click(function(){
            $('.list-music').eq(player.preIndex()).find('.list-menu-play').trigger('click')
        })

        // 底部下一首按钮
        $('.footer-control').children('a').eq(2).click(function(){
            $('.list-music').eq(player.nextIndex()).find('.list-menu-play').trigger('click')
        })

        // 删除单条音乐
        $('.content-list').delegate('.delete','click',function(){
            let $item = $(this).parents('.list-music');
            // 若删除的是正在播放的歌曲，即让下一首播放
            if($item.get(0).index == player.currentIndex){
                $('.footer-control').children('a').eq(2).trigger('click')
            }

            $item.remove();
            player.changeMusic($item.get(0).index);
            // 删除后序号排序有误，需重新排序
            $('.list-music').each((index,ele)=>{
                ele.index = index;
                $(ele).find('.list-number').text(index + 1);
            })
        })

        // 清空音乐
        $('.content-navtool span:last').click(function(){
            $('.content-list li.list-music').remove();
            player.musicList.splice=[]
        })

        // 监听播放进度
        player.musicTimeUpdate(function(currentTime,duration,time){
            // 同步时间
            $('.footer-progress-top span').eq(1).text(time)
            // 同步进度条
            let value = currentTime / duration * 100;
            progress.setProgress(value);
            // 同步歌词
            let index = lynic.currentIndex(currentTime);
            let $item = $('.song-lyric li').eq(index);
            $item.addClass('cur');
            $item.siblings().removeClass('cur');
            // 歌词滚动
            if(index <= 2) return;
            $(".song-lyric").css({
                marginTop: (-index + 2) * 30
            });
        })

        // 控制音量
        $('.footer-voice a i').click(function(){
            $(this).toggleClass('icon-yinliangguanbi');
            if($(this).hasClass('icon-yinliangguanbi')){
                player.voiceTo(0);
                $('.footer-voice-line').css('width',0);
                $('.footer-voice-dot').css('left',0);
            }
            else{
                player.voiceTo(1)
                $('.footer-voice-line').css('width',70);
                $('.footer-voice-dot').css('left',70);
            }
        })
    }

    

    // 动态创建音乐
    function createMusic(index,value){
        
        var $item = $("" +
        "<li class=\"list-music\">\n" +
            "<div class=\"list-check\"><i class='fq'><i class='q'></i></i></div>\n" +
            "<div class=\"list-number\">"+parseInt(index+1)+"</div>\n" +
            "<div class=\"list-name\">"+value.name+"" +
            "     <div class=\"list-menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='list-menu-play'><i class='iconfont icon-bofang'></i></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"><i class='iconfont icon-addApp'></i></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"><i class='iconfont icon-xiazai'></i></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"><i class='iconfont icon-fenxiang'></i></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"list-singer\">"+value.singer+"</div>\n" +
            "<div class=\"list-time\">\n" +value.time + "</div>\n" + 
            "<a href=\"javascript:;\" title=\"删除\" class='delete'><i class='iconfont icon-shanchu'></i></a>\n" +
             +
        "</li>");
        // 获取每条音乐的索引和数据
        $item.get(0).index = index;
        $item.get(0).music = value;
        return $item;
    }
})

