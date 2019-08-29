var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab
slideColourRender();
function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("form-page");
  console.log(x.length+"/"+currentTab);
  if(x.length>0){
     x[n].style.display = "block";
     //display of buttons
     if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
      $("#submitBtn").css("display","none");
      $("#nextBtn").css("display","inline");
     }
     else if (n == (x.length - 1)) {
       $("#submitBtn").css("display","inline");
       $("#nextBtn").css("display","none");
     }
     else{
       $("#prevBtn").css("display","inline");
       $("#nextBtn").css("display","inline");
       $("#submitBtn").css("display","none");
     }
     fixStepIndicator(n)
 }

}

function slideColourRender(){
   $('.form-page').each(function(i){
      var colour;
      $(this).find(".eachpagecomponent").each(function(i){
         $c = $(this).find("li div");
         if($c.attr("class") == "container"){
            input = $(this).find(".option");
            colour = checkedBox(input);
            // console.log(colour);
         }
      })
      var slider = $(this).find(".slidercontainer");
      if(i ==currentTab){
        $(slider).find('input[type=range]').val(50);
      }
      if(colour!=undefined && colour != null){
         //combine lightness
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
   var dark = toRgbString(hslToRgb(hsl.h,hsl.s,0.3));
   var light = toRgbString(hslToRgb(hsl.h,hsl.s,0.7));

   var rgbtoString = toRgbString(nrgb);
   $(slider).find(".colorSliderRender").attr("style","background-color:"+ rgbtoString);
   $(slider).find(".slidedark").attr("style","background-color:"+ dark);
   $(slider).find(".slidedark").css("display","inline-block")
   $(slider).find(".slidelight").attr("style","background-color:"+ light);
   $(slider).find(".slidelight").css("display","inline-block")

}
//change in slider in real-time
$('input[type=range]').on('input',
    function(){
      // console.log("change");
      var render = $('.form-save .form-page').eq(currentTab);
      var $colour = $(render).find(".container div");
      var colour = checkedBox($colour);
      // console.log(colour);
      ligColourchange($(render).find(".slidercontainer"),colour);
 });

//only keep one option and change colour of slider
$('.container input[type=radio]').change(
    function(){
      slideColourRender();
 });

function nextPrev(n) {
  href = "popup.html";

  // This function will figure out which  to display
  var x = document.getElementsByClassName("form-page");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;

  // Otherwise, display the correct tab:
  if(n==1&&currentTab!=1&&currentTab!=x.length-1){
    centeredPopup(href,'myWindow','400','300','yes')
  }

  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = false;
  x = document.getElementsByClassName("form-page");
  y = x[currentTab].getElementsByTagName("input");
  //no question
  if(y.length == 0){
     return true;
 }
 //handle last question
 if(currentTab==x.length-1){
    var radiovalid = true;
    $(".rating").each(function(i){
      var input = $(this).find("input");
      var radio = false;
      for(i=0;i<input.length;i++){
         if(input[i].checked){
            radio = true;
         }
      }
      if(!radio){
         radiovalid = false;
      }
   });
   return radiovalid;
}
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
     if(y[i].checked){
        valid = true;
     }
  }
  if(!valid){
      alert("You have to complete the question before click 'next'");
 }
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

$("form").submit(function(event){
   if(!validateForm()){
      alert("You have to complete the questionnaire before submission.");
      return false;
   };
   event.preventDefault();
   var form = $('form').serialize();
   console.log(form);
   addData(form);
   alert("Thank you for your participation");
   //!! handle last questions
   $("#result").css("display","inline");
})

function addData(form){
   var table = $("#quan");
   var quatable = $("#qua");
   var data = form.split("&");
   var row = [];
   var num = 0;
   for(i=0;i<data.length-6;i++){

      var tr = document.createElement("tr");
      var object = document.createElement("td");
      var cth = document.createElement("td");
      var lth = document.createElement("td");
      object.innerHTML = ++num;
      $(tr).append(object);
      var colour = data[i].split("=")[1];
      cth.innerHTML = colour;
      $(tr).append(cth);
      i++;
      var lig = data[i].split("=")[1];
      lth.innerHTML = lig;
      $(tr).append(lth);
      $(table).append(tr);
   }

   for(i=data.length-6;i<data.length;i++){
      var tr = document.createElement("tr");
      var trID = document.createElement("td");
      var trAnswer = document.createElement("td");
      var answer = data[i].split("=");
      trID.innerHTML = answer[0];
      trAnswer.innerHTML = answer[1];
      $(tr).append(trID);
      $(tr).append(trAnswer);
      $(quatable).append(tr);
   }
   $("#result").append(form);
}

var popupWindow = null;
function centeredPopup(url,winName,w,h,scroll){
  LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
  TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
  settings =
  'height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+',scrollbars='+scroll+',resizable'
  popupWindow = window.open(url,winName,settings)
}
