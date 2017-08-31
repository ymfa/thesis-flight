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
  }
  if (destination){
    form.by.value = destination.lat().toFixed(3);
    form.bx.value = destination.lng().toFixed(3);
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