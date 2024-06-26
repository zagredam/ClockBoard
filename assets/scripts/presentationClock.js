var WeekDay = new Array(7);
WeekDay[0] =  {Full:"Sunday", Abbr:"Sun"};
WeekDay[1] = {Full:"Monday", Abbr:"Mon"};
WeekDay[2] = {Full:"Tuesday", Abbr:"Tues"};
WeekDay[3] = {Full:"Wednesday", Abbr:"Wed"};
WeekDay[4] = {Full:"Thursday", Abbr:"Thur"};
WeekDay[5] = {Full:"Friday", Abbr:"Fri"};
WeekDay[6] = {Full:"Saturday", Abbr:"Sat"};
var Month = new Array(12);
Month[0] =  {Full:"January",Abbr:"Jan"};
Month[1] =  {Full:"February",Abbr:"Feb"};
Month[2] =  {Full:"March",Abbr:"Mar"};
Month[3] =  {Full:"April",Abbr:"Apr"};
Month[4] =  {Full:"May",Abbr:"May"};
Month[5] =  {Full:"June",Abbr:"Jun"};
Month[6] =  {Full:"July",Abbr:"Jul"};
Month[7] =  {Full:"August",Abbr:"Aug"};
Month[8] =  {Full:"September",Abbr:"Sep"};
Month[9] =  {Full:"October",Abbr:"Oct"};
Month[10] = {Full: "November",Abbr:"Nov"};
Month[11] = {Full: "December",Abbr:"Dec"};
var schedule = [];//[{Description:"Lunch",Time:new Date("Sat Sep 14 2020 11:54:41 GMT-0400 (Eastern Daylight Time)")},
  //escription:"Wedding",Time:new Date("Sat Sep 14 2020 14:30:00 GMT-0400 (Eastern Daylight Time)")}];
var currentTime = new Date();
SHOWSECONDS = true;
SHOWMERIDUM = true;
SHOWDATE = true;
function toggleDate(){
  SHOWDATE = !SHOWDATE;
  document.getElementById("dateContent").style.display = !SHOWDATE ? "none":"unset";
}
function toggleMeridum(){
  SHOWMERIDUM = !SHOWMERIDUM;
  document.getElementById("clockMeridium").style.display = !SHOWMERIDUM ? "none":"unset";
}
function toggleSeconds(){
  SHOWSECONDS = !SHOWSECONDS;
  document.getElementById("secondsSpan").style.display = !SHOWSECONDS ? "none":"unset";
  
}
function setTime(){
    var d = new Date();
    var n = d.getTime();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    document.getElementById("clockMeridium").innerText = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    document.getElementById("clockHourDigit1").innerText =  (hours == 0 || hours >= 10 ? "1"  : "") ; // the hour '0' should be '12'
    document.getElementById("clockHourDigit1").style.display = (hours == 0 || hours >= 10 ? "unset"  : "none") ;
    document.getElementById("clockHourDigit2").innerText =  (hours ? hours  % 10 : 2) ; // the hour '0' should be '12'
    document.getElementById("clockMinuteDigit1").innerText = Math.floor(minutes / 10);
    document.getElementById("clockMinuteDigit2").innerText = minutes % 10;
    if(SHOWSECONDS){
      document.getElementById("clockSecondDigit1").innerText = Math.floor(seconds / 10);
    document.getElementById("clockSecondDigit2").innerText = seconds % 10;
    //document.getElementById("clockSecond").innerHTML = (seconds < 10 ? '0'+seconds : seconds) ;
    // document.getElementById("timevalue").innerText=`${(hours ? hours : 12)} :${(minutes < 10 ? '0'+minutes : minutes) } : ${("clockSecond").innerHTML = (seconds < 10 ? '0'+seconds : seconds) } ${hours >= 12 ? 'pm' : 'am'}`;
    }
    if(d.getDay() != currentTime.getDay()){
      currentTime = new Date();
      document.getElementById("dateContent").innerText = WeekDay[currentTime.getDay()].Full+", "+Month[currentTime.getMonth()].Full+ " "+currentTime.getDate() +", "+currentTime.getFullYear();
    }
    updateNotifications();
}
function startPresentationTimer(){
    setInterval(setTime, 200);
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
  document.getElementById("dateContent").innerText = WeekDay[currentTime.getDay()].Full+", "+Month[currentTime.getMonth()].Full+ " "+currentTime.getDate()+", "+currentTime.getFullYear();
  
  HIDENAVTIMEOUT = null;
  document.addEventListener("mousemove",()=>{
    if(HIDENAVTIMEOUT != null) clearTimeout(HIDENAVTIMEOUT);
    document.getElementById("mainNavIcon").classList.add("show");
    document.getElementById("fullscreenButton").classList.add("show");
    Array.from(document.getElementsByClassName("buttons")).forEach(b => b.classList.add("show"));
    HIDENAVTIMEOUT = setTimeout(()=>{
      document.getElementById("mainNavIcon").classList.remove("show");
      document.getElementById("fullscreenButton").classList.remove("show");
      Array.from(document.getElementsByClassName("buttons")).forEach(b => b.classList.remove("show"));
    },2000)
  })