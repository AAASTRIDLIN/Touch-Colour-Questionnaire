var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab
slideColourRender();
function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("form-page");
  if(x.length>0){
     x[n].style.display = "block";
     // ... and fix the Previous/Next buttons:
     if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
     } else {
      document.getElementById("prevBtn").style.display = "inline";
     }
     if (n == (x.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Submit";
     } else {
      document.getElementById("nextBtn").innerHTML = "Next";
     }
 }

  // ... and run a function that displays the correct step indicator:
  // fixStepIndicator(n)
}

function slideColourRender(){
   $('.form-page').each(function(i){
      var colour;
      $(this).find(".eachpagecomponent").each(function(i){
         $c = $(this).find("li div");
         if($c.attr("class") == "container"){
            input = $(this).find(".option");
            colour = checkedBox(input);
            console.log(colour);
         }
      })
      if(colour!=undefined && colour != null){
         //combine lightness
         var slider = $(this).find(".slidercontainer");
         ligColourchange(slider,colour);
      }
      else{
         $(this).find(".slidercontainer .colorSliderRender").attr("style","display=none;");
      }
   })
}

function checkedBox(input){
   var colour;
   for(i = 0;i<input.length;i++){
      if(input.eq(i).find("input").prop("checked") == true){
         colour = input.eq(i).find(".colorsquare").css("background-color");
      }
   }
   return colour;
}
function ligColourchange(slider,colour){
   //get lightness from slider
   var lightness = $(slider).find('input[type=range]').val();
   //convert rgb string
   var rgb = getRGB(colour);
   //convert rgb to hsl conversion
   var hsl =rgbToHsl(rgb.red,rgb.green,rgb.blue);
   //convert hsl to new rgb
   var nrgb = hslToRgb(hsl.h,hsl.s,lightness/100);
   console.log(nrgb);
   var rgbtoString = toRgbString(nrgb);
   console.log(rgbtoString);
   $(slider).find(".colorSliderRender").attr("style","background-color:"+ rgbtoString);
}
//change in slider in real-time
$('input[type=range]').on('input',
    function(){
      console.log("change");
      var render = $('.form-save .form-page').eq(currentTab);
      var $colour = $(render).find(".container div");
      var colour = checkedBox($colour);
      console.log(colour);
      ligColourchange($(render).find(".slidercontainer"),colour);
 });
//only keep one option and change colour of slider
$('.container input[type=radio]').change(
    function(){
   //    //only keep one checkbox
   // $('.form-save .form-page').eq(currentTab).find("input[type=checkbox]").not(this).prop('checked', false);
      slideColourRender();
 });

function nextPrev(n) {
  // This function will figure out which  to display
  var x = document.getElementsByClassName("form-page");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("form-page");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}
