let totalseconds = 180;
const timer = document.getElementById('counter1');
 var int1 = setInterval(UpdateTimer, 1000)

function UpdateTimer(){
    var minutes = Math.floor(totalseconds/60);
    var seconds = totalseconds % 60;
   
   

    if(seconds<10){

        seconds = "0"+seconds
    }
    if(totalseconds<=0){
        timer.innerHTML = "00:00:00"
        clearInterval(int1);
        
    }
    timer.innerHTML = "00:" + "0"+minutes+":" +seconds;
    totalseconds--;
}