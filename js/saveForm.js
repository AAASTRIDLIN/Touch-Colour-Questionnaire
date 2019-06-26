function insertIntoTemplate(){
   var template = document.createElement("form");
   template.className="form-save"
   var aPage = createStep();
   var num=0,numElements = $(".render-wrap ul>li").length;
   //count number of elements without pagebreak
   $(".render-wrap ul>li").each(function (i) {
      var divname = $(this).find('div:nth-child(1)').attr("id");
      var component = document.createElement("div");
      component.className = "eachpagecomponent";
         if(divname!=undefined &&divname.startsWith("pagebreak")){
            //add in different tag for page break
            $(template).append(aPage);
            aPage = createStep();
            num++;
         }
         else if(i == numElements-1){
            num++;
            //last element in the form
            $(component).append(this);
            $(aPage).append(component);
            $(template).append(aPage);
            // add prev/next btn
            $(template).append(createBtn());
         }
         else{
            console.log("new page");
            $(component).append(this);
            $(aPage).append(component);
         }
    });
    $(template).append(createStepsscale(num));
    //remove previous contents and scripts
    $("body div").remove();
    $("body").append(template);
    showTab(0);
}

function addScript(){
   var script = document.createElement("script");
   script.src = "js/formsteps.js";
   return script
}
function createStep(){
   var step = document.createElement("div");
   step.className = "form-page";
   return step;
}

function createBtn(){
    var btn = "<div class = \"stepbtn\"><button type=\"button\" id=\"prevBtn\" onclick=\"nextPrev(-1)\" class=\"btn btn-outline-secondary\">Previous</button><button type=\"button\" id=\"nextBtn\" onclick=\"nextPrev(1)\"class=\"btn btn-outline-secondary\">Next</button></div>"

    return btn;
}

function createStepsscale(i){
   var div = "<div style=\"text-align:center;margin-top:40px;\">";
   for(a=0;a<i;a++){
      div+="<span class=\"step\"></span>";
   }
   div +="</div>"
   return div;
}
