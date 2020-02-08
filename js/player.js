(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor:Player,
        musicList:[],
        init:function($audio){
            this.$audio = $audio;
            // 转换为原生对象
            this.audio = $audio.get(0)
        },
        currentIndex:-1,
        // 播放音乐
        playMusic:function(index,music){
            // 判断当前点击的是否是同一首
            if(this.currentIndex == index){
                if(this.audio.paused){
                    this.audio.play();
                }
                else{
                    this.audio.pause();
                }
            }
            else{   // 若不是 修改当前音乐链接并播放
                this.$audio.attr('src',music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex:function(){
            let index = this.currentIndex - 1;
            if(index < 0){
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex:function(){
            let index = this.currentIndex + 1;
            if(index > this.musicList.length - 1){
                index = 0;
            }
            return index
        },
        changeMusic:function(index){
            this.musicList.splice(index,1);
            // 判断当前删除的音乐是否处于当前播放音乐的前面
            if(index < this.currentIndex){
                this.currentIndex--;
            }
        },
        musicTimeUpdate:function(callback){
            let $this = this;
            this.$audio.on('timeupdate',function(){
                // console.log(player.getMusicDuration())
                // console.log(player.getMusicCurrentTime())
                let duration = $this.audio.duration;
                let current = $this.audio.currentTime;
                
                let time = $this.formatTime(current,duration);
                callback(current,duration,time);
            })
        },
        formatTime:function(current,duration){
            let curMin = parseInt(current / 60);
            let curSec = parseInt(current % 60);
            let durMin = parseInt(duration / 60);
            let durSec = parseInt(duration % 60);
            if(curMin < 10){
                curMin = '0' + curMin;
            }
            if(curSec < 10){
                curSec = '0' + curSec;
            }
            if(durMin < 10){
                durMin = '0' + durMin;
            }
            if(durSec < 10){
                durSec = '0' + durSec;
            }
            if(isNaN(durMin)){
                durMin = '00'
            }
            if(isNaN(durSec)){
                durSec = '00'
            }
            return (curMin + ':' + curSec + '/' + durMin + ':' + durSec)
        },
        musicTo:function(value){
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        voiceTo:function(value){
            if(isNaN(value)) return;
            if(value < 0 || value > 1) return;
            this.audio.volume = value;
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window)