(function(window){
    function Progress($bar,$line,$dot){
        return new Progress.prototype.init($bar,$line,$dot)
    }
    Progress.prototype = {
        constructor:Progress,
        init:function($bar,$line,$dot){
            isMove = false;
            this.$bar = $bar;
            this.$line = $line;
            this.$dot = $dot;
        },
        progressClick:function(callback){
            let $this = this;
            this.$bar.click(function(e){
                // 在当前作用域中的this指向的是触发click事件的对象，所以在外层声明变量赋值this
                let normalLeft = $(this).offset().left;
                let eventLeft = e.pageX;
                let curLeft = eventLeft - normalLeft;
                $this.$line.css('width',curLeft);
                $this.$dot.css('left',curLeft - ($this.$dot.width()/2))
                let value = curLeft / $(this).width();
                callback(value);
            })
        },
        progressMove:function(callback){
            let $this = this;
            let curLeft;
            this.$bar.mousedown(function(){
                $this.isMove = true;
                let normalLeft = $(this).offset().left;
                $(document).mousemove(function(e){
                    let eventLeft = e.pageX;
                    curLeft = eventLeft - normalLeft;
                    if(curLeft >= $this.$bar.width() || curLeft <= 4){
                        return false
                    }
                    $this.$line.css('width',curLeft);
                    $this.$dot.css('left',curLeft - ($this.$dot.width()/2))
                    
                    // 若音量控制拉到最低，切换图标和音量
                    if(curLeft<=5){
                        $('.footer-voice a i').addClass('icon-yinliangguanbi');
                        let $audio = $('audio');
                        let player = new Player($audio);
                        player.audio.pause()
                    }
                    else if(curLeft>1){
                        $('.footer-voice a i').removeClass('icon-yinliangguanbi');
                        let $audio = $('audio');
                        let player = new Player($audio);
                        player.audio.play()

                    }
                })
            });
            $(document).mouseup(function(){
                $this.isMove = false;
                $(document).off('mousemove');
                let value = curLeft / $this.$bar.width();
                callback(value);
            })
        },
        setProgress:function(value){
            if(this.isMove){
                return false
            }
            this.$line.css({
                width:value + '%'
            });
            this.$dot.css({
                left:value + '%'
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)