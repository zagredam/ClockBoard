var stopWatches = [];
var updateInterval = null;
var flashZeroInterval = null;
var timerSection = document.getElementById("timersSection");
var timerIndex = 0;
const stopWatchIntervalTime = 200;
function startStopWatch(){
  var timeToCountdownEnd = new Date();
  timerSection.innerHTML += '<div class="timer" sindex="'+stopWatches.length+'"><div class="timerValues"><div class="timeSection timerHour"></div><div class="timeSection timerMinute">00:</div> <div class="timeSection timerSecond">00</div></div><div class="timerLabel">'+document.getElementById("stopwatchValueLabel").value+'</div><div class="buttons"><i class="fas fa-undo-alt resetTimer actionIcon " onclick="resetStopWatch(this)"></i><i class="far fa-window-close closeTimer actionIcon " onclick="closeStopWatch(this)"></i><i class="fas fa-pause closeTimer actionIcon " onclick="toggleStopWatch(this)"></i></div></div>';
  stopWatches.push({paused:false,active:true,milisecondsFromStart:0,markedTime: new Date(), pausedDiff:0});
}

function closeStopWatch(e){
    var timersparent = $(e).parent().parent();    
    stopWatches[timersparent.attr("sindex")].active = false;
    timersparent.css("display","none");
}

function toggleStopWatch(e){
  var timersparent = $(e).parent().parent();
  stopWatches[timersparent.attr("sindex")].paused = !stopWatches[timersparent.attr("sindex")].paused;
  if(stopWatches[timersparent.attr("sindex")].paused){
    stopWatches[timersparent.attr("sindex")].pausedDiff = new Date() - stopWatches[timersparent.attr("sindex")].markedTime + stopWatches[timersparent.attr("sindex")].pausedDiff;
    
  }
  else{
    stopWatches[timersparent.attr("sindex")].markedTime = new Date();
  }
  
  $(e).toggleClass("fa-pause");
  $(e).toggleClass("fa-play");
}


function resetStopWatch(e){
    var timersIndex = $(e).parent().parent().attr("sindex");
    stopWatches[timersIndex].milisecondsFromStart = 0;
    stopWatches[timersIndex].markedTime = new Date();
}

function resetStopWatchByIndex(stopWatchIndex){
    stopWatches[stopWatchIndex].milisecondsFromStart = 0;
    stopWatches[stopWatchIndex].markedTime = new Date();
}

function closeStopWatchByIndex(stopWatchIndex){
    stopWatches[stopWatchIndex].active = false;
    $(".timer[sindex="+stopWatchIndex+"]").css("display","none");
}
  

function updateCountdownValue(){
    const currentTime = new Date();
    for(var i=0; i<stopWatches.length; i++){
        if(!stopWatches[i].active || stopWatches[i].paused) continue;
        //stopWatches[i].milisecondsFromStart += stopWatchIntervalTime;
        // var diffinTimesinSeconds = stopWatches[i].milisecondsFromStart / 1000;
        var diffinTimesinSeconds = (currentTime - stopWatches[i].markedTime + stopWatches[i].pausedDiff) / 1000;
        if(Math.floor(diffinTimesinSeconds / 3600) > 0){
          $(".timer[sindex="+i+"] .timerHour")[0].innerText = Math.floor(diffinTimesinSeconds / 3600) +":"
        }
        else{
            $(".timer[sindex="+i+"] .timerHour")[0].innerText = "";
        }
        if(Math.floor((diffinTimesinSeconds % 3600)/60) > 0){
            $(".timer[sindex="+i+"] .timerMinute")[0].innerText = (Math.floor((diffinTimesinSeconds % 3600)/60) < 10 ?"0" : "")+Math.floor((diffinTimesinSeconds % 3600)/60) +":"
        }
        else{
            $(".timer[sindex="+i+"] .timerMinute")[0].innerText = "00:";
        }
        $(".timer[sindex="+i+"] .timerSecond")[0].innerText = Math.floor(diffinTimesinSeconds % 60) < 10 ? "0"+Math.floor(diffinTimesinSeconds % 60) : Math.floor(diffinTimesinSeconds % 60);
        
    }
}

setInterval(updateCountdownValue,stopWatchIntervalTime);