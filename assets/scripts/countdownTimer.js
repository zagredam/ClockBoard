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
  var timeToCountdownEnd = new Date();
  timerSection.innerHTML += '<div class="timer" index="'+countDowns.length+'"><div class="timerValues"><div class="timeSection timerHour"></div><div class="timeSection timerMinute"></div> <div class="timeSection timerSecond"></div></div><div class="buttons"><i class="fas fa-undo-alt resetTimer" onclick="resetTimer(this)"></i><i class="far fa-window-close closeTimer" onclick="closeTimer(this)"></i></div><div class="timerLabel">'+document.getElementById("timerValueLabel").value+'</div></div>';
  
  countDowns.push({active:true,timerValue:(60*1000*(numMinutes||0)) + (1000*(numSeconds||0)),timeToExp:new Date(timeToCountdownEnd.getTime() + (60*1000*(numMinutes||0)) + (1000*(numSeconds||0)))});
}

function closeTimer(e){
    var timersparent = $(e).parent().parent();
    countDowns[timersparent.attr("index")].active = false;
    timersparent.css("display","none");
}

function resetTimer(e){
    var timersIndex = $(e).parent().parent().attr("index");
    countDowns[timersIndex].timeToExp=new Date(new Date().getTime() + countDowns[timersIndex].timerValue);
}
  

function updateCountdownValue(){
    for(var i=0; i<countDowns.length; i++){
        if(!countDowns[i].active || countDowns[i].timeToExp == null) continue;
        var nowish = new Date();
        var diffinTimesinSeconds = (countDowns[i].timeToExp - nowish)/1000;
        if(diffinTimesinSeconds < 0){
          countDowns[i] = null;
          flashZeroInterval = setInterval(flashZero,1000);
        }
        else{
        if(Math.floor(diffinTimesinSeconds / 3600) > 0){
          $(".timer[index="+i+"] .timerHour")[0].innerText = Math.floor(diffinTimesinSeconds / 3600) +":"
        }
        else{
            $(".timer[index="+i+"] .timerHour")[0].innerText = "";
        }
        if(Math.floor((diffinTimesinSeconds % 3600)/60) > 0){
            $(".timer[index="+i+"] .timerMinute")[0].innerText = Math.floor((diffinTimesinSeconds % 3600)/60) +":"
        }
        else{
            $(".timer[index="+i+"] .timerMinute")[0].innerText = "";
        }
        $(".timer[index="+i+"] .timerSecond")[0].innerText = Math.floor(diffinTimesinSeconds % 60) < 10 ? "0"+Math.floor(diffinTimesinSeconds % 60) : Math.floor(diffinTimesinSeconds % 60);
        }
    }
}

function flashZero(){
    for(var i=0; i<countDowns.length; i++){
        if(countDowns[i].timeToExp != null) continue;
        if($(".timer[index="+i+"] .timerHour")[0].innerText == ""){
            $(".timer[index="+i+"] .timerHour")[0].innerText = "00:";
            $(".timer[index="+i+"] .timerMinute")[0].innerText = "00:";
            $(".timer[index="+i+"] .timerSecond")[0].innerText = "00";
          }
          else{
            $(".timer[index="+i+"] .timerHour")[0].innerText = "";
            $(".timer[index="+i+"] .timerMinute")[0].innerText = "";
            $(".timer[index="+i+"] .timerSecond")[0].innerText = "";
          }
    }
  
}
setInterval(updateCountdownValue,300);