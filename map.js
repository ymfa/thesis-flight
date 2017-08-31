/* analyze query string */
var query = {};
location.search.substr(1).split("&").forEach(function(item){
  var parts = item.split("=");
  if (parts[0] == 'c') query[parts[0]] = decodeURIComponent(parts[1].replace(/\+/g, " "));
  else query[parts[0]] = parseFloat(parts[1]);
});
if (!(query['ay'] >= -85 && query['ay'] <= 85 && query['by'] >= -85 && query['by'] <= 85 && query['ax'] >= -180 && query['ax'] <= 180 && query['bx'] >= -180 && query['bx'] <= 180 && query['f'] >= 0 && query['f'] <= 1)){
  window.location.replace('index.html');
}
if (!query['c']) query['c'] = "Thesis==Flight";
query['c'] += " (" + Math.round(query['f']*100) + "%)";
document.title = query['c'];
var night = query['n'] ? true : false;
/* utilities */
if (typeof(Number.prototype.toRadians) === "undefined"){
  Number.prototype.toRadians = function(){
    return this * Math.PI / 180;
  }
}
if (typeof(Number.prototype.toDegrees) === "undefined"){
  Number.prototype.toDegrees = function(){
    return this / Math.PI * 180;
  }
}
function getNearbyValues(f){
  var i = f < 0.01 ? 0 : f - 0.01;
  var j = f > 0.99 ? 1 : f + 0.01;
  return {i: i, j: j};
}
/* draw map */
function initMap(){
  var a = new google.maps.LatLng(query['ay'], query['ax']);
  var b = new google.maps.LatLng(query['by'], query['bx']);
  var f = query['f'];
  var c = google.maps.geometry.spherical.interpolate(a, b, f);
  var distance1 = google.maps.geometry.spherical.computeDistanceBetween(a, c);
  var distance2 = google.maps.geometry.spherical.computeDistanceBetween(c, b);
  distance = Math.sqrt(distance1 * distance2);
  var scale = Math.ceil(Math.log(distance/500000) / Math.log(2));
  if (scale < -12) scale = -12;
  else if (scale > 7) scale = 7;
  var map = new google.maps.Map(document.getElementById('map'), {
    center: c,
    zoom: 8 - scale,
    mapTypeId: night ? 'hybrid' : 'roadmap',
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false
  });
  /* draw route */
  var flightPlanCoordinates = [a, c];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: night ? 'red' : 'blue',
    strokeOpacity: 0.8,
    strokeWeight: 10
  });
  flightPath.setMap(map);
  var flightPlanCoordinates = [c, b];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: night ? 'white' : 'gray',
    strokeOpacity: 0.8,
    strokeWeight: 10
  });
  flightPath.setMap(map);
  /* draw plane */
  var nearby = getNearbyValues(f);
  var ci = google.maps.geometry.spherical.interpolate(a, b, nearby.i);
  var cj = google.maps.geometry.spherical.interpolate(a, b, nearby.j);
  var deltaY = (cj.lat()-ci.lat()) / Math.cos(c.lat().toRadians());
  var deltaX = cj.lng()-ci.lng();
  var angle = Math.atan2(deltaY, deltaX).toDegrees();
  var plane = {
    path: 'm-121.26543,-27.56258l108.45623,80.60171c-0.80268,12.45185 -1.32473,40.25627 -0.85468,45.4176c3.94034,43.26647 31.23018,24.63012 31.48335,5.32037c0.0693,-5.28136 1.01502,-32.59839 1.10471,-50.83662l107.04016,-82.47602l0.28427,-25.82013l-110.50058,50.48239l-3.99332,-80.29163l32.04257,-22.93816l0.20384,-16.89693l-42.27177,11.59566l-0.008,-0.1395l-42.71311,-10.91879l0.50929,16.88213l32.45374,22.39903l-2.61132,80.35205l-111.35995,-48.50611l0.73494,25.77295l-0.00037,0z',
    scale: 0.4,
    rotation: -90 - angle,
    fillColor: night ? 'black' : 'white',
    fillOpacity: 1.0,
    strokeColor: night ? 'white' : 'black',
    strokeWeight: 5
  }
  var marker = new google.maps.Marker({
    position: map.getCenter(),
    icon: plane,
    map: map
  });
  /* draw caption */
  var controlDiv = document.createElement('div');
  controlDiv.className = 'control';
  var title = document.createElement('div');
  title.innerText = query['c'];
  title.className = 'title';
  controlDiv.appendChild(title);
  var command = document.createElement('div');
  command.innerHTML = "<a href='index.html'>Create a new map</a>";
  controlDiv.appendChild(command);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-105723042-1', 'auto');
ga('send', 'pageview');