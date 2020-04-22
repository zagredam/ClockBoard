function makeFullscreen(){
    var elem = document.getElementById("app");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
  document.getElementById("fullscreen-close").style.display = "initial";
  document.getElementById("fullscreen-open").style.display = "none";
}

function closeFullscreen(){
  var elem = document.getElementById("app");
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
  document.getElementById("fullscreen-close").style.display = "none";
  document.getElementById("fullscreen-open").style.display = "initial";
}

function toggleNav(){
  $(".overlay").toggleClass("show");
}

function changeTheme(){
  var clubClass = $("#themeSelect").val();
  $("body")[0].classList=clubClass;
}