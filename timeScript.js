const fs = require('fs');

var running = true;

module.exports = {
    startTimer: function(){
        running = true;
    },

    pauseTimer: function(){
        running = false;
    },

    addTime: function (time){
        try{
            let data = fs.readFileSync('time.txt', 'utf8');
            updatedTime = parseInt(data) + parseInt(time);
            fs.writeFileSync('time.txt', updatedTime.toString());
        }
        catch(e){
            console.log('Error when added time to timer: ' + e);
        }
    },

    updateTime: function (){
        if (running){
            try{
                let data = fs.readFileSync('time.txt', 'utf8');
                updatedTime = parseInt(data) - 1;
                fs.writeFileSync('time.txt', updatedTime.toString());
            }
            catch(e){
                console.log('Error when updating timer: ' + e);
            }
        }
    },

    setTimer: function(time){
        try{
            fs.writeFileSync('time.txt', time.toString());
        }
        catch(e){
            console.log('Error when setting timer: ' + e);
        }
    },

    getTime: function (){
        try{
            let data = fs.readFileSync('time.txt', 'utf8');
            return data;
        }
        catch(e){
            console.log('Error when getting time: ' + e);
        }
    }
}