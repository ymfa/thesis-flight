var origin = null;
var destination = null;
function fillValues(){
  var form = document.forms[0];
  var target = parseFloat(document.getElementById("target").value);
  var progress = parseFloat(document.getElementById("progress").value);
  var f = progress / target;
  if (f >= 0 && f <= 1){
    form.f.value = f.toFixed(4);
  }
  else{
    if (!(target > 0)){
      window.alert("Please enter your target.");
      document.getElementById("target").focus();
    }
    else {
      window.alert("Please enter a word count that is between 0 and your target.");
      document.getElementById("progress").focus();
    }
    return false;
  }
  if (!form.c.value){
    window.alert("Please give a title to your map.");
    document.getElementById("caption").focus();
    return false;
  }
  if (origin){
    form.ay.value = origin.lat().toFixed(3);
    form.ax.value = origin.lng().toFixed(3);
    ga('set', 'dimension1', document.getElementById("pac-origin").value);
  }
  if (destination){
    form.by.value = destination.lat().toFixed(3);
    form.bx.value = destination.lng().toFixed(3);
    ga('set', 'dimension2', document.getElementById("pac-destination").value);
  }
  return true;
}
function initControls(){
  var input1 = document.getElementById('pac-origin');
  var autocomplete1 = new google.maps.places.Autocomplete(input1);
  autocomplete1.addListener('place_changed', function(){
    var place = autocomplete1.getPlace();
    if (!place.geometry){
      window.alert("Invalid place of departure: '" + place.name + "'.");
      origin = null;
    }
    else{
      origin = place.geometry.location;
    }
  });
  var input2 = document.getElementById('pac-destination');
  var autocomplete2 = new google.maps.places.Autocomplete(input2);
  autocomplete2.addListener('place_changed', function(){
    var place = autocomplete2.getPlace();
    if (!place.geometry){
      window.alert("Invalid destination: '" + place.name + "'.");
      destination = null;
    }
    else{
      destination = place.geometry.location;
    }
  });
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-105723042-1', 'auto');
ga('send', 'pageview');