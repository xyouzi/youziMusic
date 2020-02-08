
(function(window){
    function Lynic(path){
        return Lynic.prototype.init(path)
    }
    Lynic.prototype = {
        init:function(path){
            this.path = path;
        },
        time:[],
        lynic:[],
        index:-1,
        loadLynic:function(callback){
            let $this = this;
            $.ajax({
                url:$this.path,
                dataType:'text',
                success:function(res){
                    // console.log(res)
                    $this.parseLynic(res);
                    callback();
                },
                error:function(err){
                    console.log(err)
                }
            })
        },
        // 解析歌词
        parseLynic:function(res){
            // console.log(res)
            let $this = this;
            $this.lynic = [];
            $this.time = [];
            let data = res.split('\n');
            let timeReg = /\[(\d*:\d*\.\d*)\]/;
            $.each(data,function(index,value){
                let lyn = value.split(']')[1];
                // console.log(value.split(']'))
                
                if(lyn.length == 1){
                    return true
                } 
                $this.lynic.push(lyn);

                let res = timeReg.exec(value)
                if(res == null){
                    return true
                }
                // console.log(res[1]) xx:xx:xx
                let timeStr = res[1];
                let res2 = timeStr.split(':');
                let Min =   parseInt(res2[0] * 60);
                let Sec = parseFloat(res2[1]);
                let time = Number((Min + Sec).toFixed(2));
                // console.log(value)
                $this.time.push(time);
            })
        },
        currentIndex:function(currentTime){
            if(currentTime >= this.time[0]){
                this.index++;
                this.time.shift();
            }
            return this.index;
        }
    }
    Lynic.prototype.init.prototype = Lynic.prototype;
    window.Lynic = Lynic;
})(window)