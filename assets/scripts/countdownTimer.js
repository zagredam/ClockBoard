var countDowns = [];
var updateInterval = null;
var flashZeroInterval = null;
var timerSection = document.getElementById("timersSection");
var timerIndex = 0;
function startTimer(){
//   if(flashZeroInterval != null){
//     clearInterval(flashZeroInterval);
//     flashZeroInterval = null;
//   }
  var numMinutes = document.getElementById("timerValueMinute").value;
  var numSeconds = document.getElementById("timerValueSecond").value;
  if((numMinutes === "" && numSeconds === "") || isNaN(numMinutes) || isNaN(numSeconds)) return;
  var timeToCountdownEnd = new Date();
  timerSection.innerHTML += '<div class="timer" index="'+countDowns.length+'"><div class="timerValues"><div class="timeSection timerHour"></div><div class="timeSection timerMinute"></div> <div class="timeSection timerSecond"></div></div><div class="timerLabel">'+document.getElementById("timerValueLabel").value+'</div><div class="buttons"><i class="fas fa-undo-alt actionIcon  resetTimer" onclick="resetTimer(this)"></i><i class="far fa-window-close actionIcon  closeTimer" onclick="closeTimer(this)"></i><i class="fas fa-pause closeTimer actionIcon " onclick="toggleTimer(this)"></i></div></div>';
  
  countDowns.push({paused:false,active:true,timerValue:(60*1000*(numMinutes||0)) + (1000*(numSeconds||0)),timeToExp:new Date(timeToCountdownEnd.getTime() + (60*1000*(numMinutes||0)) + (1000*(numSeconds||0)))});

}

function closeTimer(e){
    var timersparent = $(e).parent().parent();    
    countDowns[timersparent.attr("index")].active = false;
    timersparent.css("display","none");
}

function toggleTimer(e){
  var timersparent = $(e).parent().parent();
  var nowish = new Date();
  if(!countDowns[timersparent.attr("index")].paused){
    countDowns[timersparent.attr("index")].paused = true;
    var diffinTimesinSeconds = (countDowns[timersparent.attr("index")].timeToExp - nowish)/1000;
    countDowns[timersparent.attr("index")].timeLeft = diffinTimesinSeconds;
  }
  else{
    countDowns[timersparent.attr("index")].timeToExp=new Date(nowish.getTime() + (countDowns[timersparent.attr("index")].timeLeft*1000));
    countDowns[timersparent.attr("index")].timeLeft = null;
    countDowns[timersparent.attr("index")].paused = false;
    
  }
  
  $(e).toggleClass("fa-pause");
  $(e).toggleClass("fa-play");
}


function resetTimer(e){
    var timersIndex = $(e).parent().parent().attr("index");
    $(".timer[index="+timersIndex+"] .timerValues").removeClass("invisible");
    countDowns[timersIndex].timeToExp=new Date(new Date().getTime() + countDowns[timersIndex].timerValue);
}
  

function updateCountdownValue(){
    for(var i=0; i<countDowns.length; i++){
        if(!countDowns[i].active || countDowns[i].paused) continue;
        var nowish = new Date();
        var diffinTimesinSeconds = (countDowns[i].timeToExp - nowish)/1000;
        if(diffinTimesinSeconds < 0){
          flashZero(i);
        }
        else{
        if(Math.floor(diffinTimesinSeconds / 3600) > 0){
          $(".timer[index="+i+"] .timerHour")[0].innerText = Math.floor(diffinTimesinSeconds / 3600) +":"
        }
        else{
            $(".timer[index="+i+"] .timerHour")[0].innerText = "";
        }
        if(Math.floor((diffinTimesinSeconds % 3600)/60) > 0){
            $(".timer[index="+i+"] .timerMinute")[0].innerText = (Math.floor((diffinTimesinSeconds % 3600)/60) < 10 ?"0" : "")+Math.floor((diffinTimesinSeconds % 3600)/60) +":"
        }
        else{
            $(".timer[index="+i+"] .timerMinute")[0].innerText = "00:";
        }
        $(".timer[index="+i+"] .timerSecond")[0].innerText = Math.floor(diffinTimesinSeconds % 60) < 10 ? "0"+Math.floor(diffinTimesinSeconds % 60) : Math.floor(diffinTimesinSeconds % 60);
        }
    }
}

function flashZero(index){
    
        $(".timer[index="+index+"] .timerValues").toggleClass("invisible");
    
  
}
setInterval(updateCountdownValue,200);