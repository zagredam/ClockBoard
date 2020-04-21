var schedule = [];//[{Description:"Lunch",Time:new Date("Sat Sep 14 2020 11:54:41 GMT-0400 (Eastern Daylight Time)")},
  //escription:"Wedding",Time:new Date("Sat Sep 14 2020 14:30:00 GMT-0400 (Eastern Daylight Time)")}];

function setTime(){
    var d = new Date();
    var n = d.getTime();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    document.getElementById("clockMeridium").innerText = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    document.getElementById("clockHour").innerText =  hours ? hours : 12; // the hour '0' should be '12'
    document.getElementById("clockMinute").innerText = minutes < 10 ? '0'+minutes : minutes;
    document.getElementById("clockSecond").innerText = seconds < 10 ? '0'+seconds : seconds;
    updateNotifications();
}
function startPresentationTimer(){
    setInterval(setTime, 300);
}
function updateNotifications(){
    var notifications = document.getElementById("notifications");  
    var notificationsToShow = "";
    var nowish = new Date();
    schedule.map(function(x){
  
      if(x.Time >= nowish){ //if notification is in past, dont show it
        if (x.Time - nowish <60 * 60 * 1000){
          //less than one hour
          var numofMinutesLeft = Math.floor((x.Time - nowish) /(60 * 1000));
          notificationsToShow += "<div class=\"notification\">"+x.Description+" in "+(numofMinutesLeft == 0 ? "Seconds+" :numofMinutesLeft+" mins")+"</div>";
        }
        else{
          var options ={hour: "numeric", minute:"numeric"};
          notificationsToShow += "<div class=\"notification\">"+x.Description+" at "+x.Time.toLocaleTimeString('en-US', options)+"</div>";
        }
      }
      else if(nowish-x.Time > (1000*60*10)){
        //if less than 10 minutes overdue
        var numofMinutesLeft = Math.floor((nowish - x.Time) /(60 * 1000));
          notificationsToShow += "<div class=\"notification overdue\">"+x.Description+" "+numofMinutesLeft+" mins overdue</div>";
      }
    });
  
    notifications.innerHTML = notificationsToShow;
  
  }

  startPresentationTimer();