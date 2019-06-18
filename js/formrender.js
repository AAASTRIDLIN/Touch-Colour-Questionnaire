var FormRender = function FormRender(options, element) {
    var formRender = this;

    var defaults = {
        //container: false,
        dataType: 'json', //form datatype
        formData: false, //whether render form data
        showTitle: false //whether render title
    };
    //combine options with default setting, turn true if press the preview btn
    var opts = $.extend(true, defaults, options);

    if (opts.formData) {
        var formJson = JSON.parse(opts.formData);
        // console.log(formJson);
        var form = document.createElement('div');
        form.className = "form-render";

        var liControl;
        var title = document.createElement('p');
        title.id = formJson.id;
        title.name = formJson.name;
        title.innerHTML = formJson.text;
        title.className = "title";
		title.width = form.width - 10;

        if (opts.showTitle) {
            var controlBox = document.createElement('div');
            controlBox.className = 'controlbox';

            var btnClose = document.createElement('span');//close button
            btnClose.className = 'close';
            btnClose.innerHTML = 'X';

            controlBox.appendChild(btnClose);
            title.appendChild(controlBox);
        }
        form.appendChild(title);

        var list = document.createElement('ul');
        var controls = formJson.contains;
        var controlData, controlLabel;
        for (var i = 0; i < controls.length; i++) {
            liControl = document.createElement('li');

            controlData = {};
            controlData.id = controls[i].id;
            controlData.tag = controls[i].tag;
            controlData.type = controls[i].type;
            controlData.required = controls[i].required;
            controlData.label = controls[i].label;
            controlData.text = controls[i].text;
            controlData.options = controls[i].options;
            // console.log(controlData);
            if (typeof controlData.label != 'undefined') {
               //return label with text
                controlLabel = renderLabel(controlData.label);
                if (controlData.required) { controlLabel.appendChild(renderRequired()); }
                liControl.appendChild(controlLabel);
            }

            if (controlData.tag == "SELECT"){
                liControl.appendChild(renderSelectControl(controlData));
                list.appendChild(liControl);
            }
            else if(controlData.id.startsWith("ColourSelector")){
               liControl.appendChild(renderSelectColorControl(controlData));
               liControl.className="container";
               list.appendChild(liControl);
            }
            else if (controlData.id.startsWith("colorslider")){
               liControl.appendChild(renderColorsliderControl(controlData));
               liControl.className="slidercontainer";
               list.appendChild(liControl);
            }
            else{
               liControl.appendChild(renderControl(controlData));
               list.appendChild(liControl);
            }
        }

        form.appendChild(list);
        element.appendChild(form);
    }

    $(document).on('click', '.form-render>.title>.controlbox>.close', function (event) {
        $(element).empty();
    });

    return formRender;
}

$.fn.formRender = function (options) {
    options = options || {};
    return this.each(function () {
        var formRender = new FormRender(options, this);
        $(this).data('formRender', formRender);

        return formRender;
    });
};

//render control
function renderControl(controlData) {

    var control = document.createElement(controlData.tag);
    control.id = controlData.id;
    control.type = controlData.type;

    if (typeof controlData.text != 'undefined' && typeof controlData.label == 'undefined') {
        control.innerText = controlData.text;
    }

    if (controlData.options != null && controlData.options != "undefined" && controlData.options.length > 0) {
        control.className = "control";
        var opItem, options = JSON.parse(controlData.options);
        for (var i = 0; i < options.length; i++) {
            opItem = document.createElement('div');
            v = document.createElement('input'); //childcontrol
            v.type = options[i].type;
            v.checked = options[i].checked;
            v.name = i;

            t = document.createElement('span'); //child text
            t.innerText = options[i].text;

            opItem.appendChild(v);
            opItem.appendChild(t);
            opItem.className = "option";
            control.appendChild(opItem);
        }
    }

    return control;
}

//render all controls
function renderSelectControl(controlData) {

    var control = document.createElement(controlData.tag);
    control.id = controlData.id;
    control.type = controlData.type;

    var options = JSON.parse(controlData.options);
    var op; //select options
    for (var i = 0; i < options.length; i++) {
        op = new Option(options[i].text, options[i].value);
        if (options[i].checked) { op.selected = "selected"; }
        control.options.add(op);
    }

    return control;
}

//render color selections
function renderSelectColorControl(controlData){

   var control = document.createElement(controlData.tag);
    control.id = controlData.id;
    control.type = controlData.type;
    var options = JSON.parse(controlData.options);
    if(options.length>0){
         control.className = "container row";
         for (var i = 0; i < options.length; i++) {
             opItem = document.createElement('div');

             v = document.createElement('input'); //childcontrol
             v.type = options[i].type;
             v.checked = options[i].checked;
             v.name = i;
             t = document.createElement('div'); //child text
             t.className="colorsquare";
             t.name = options[i].type+"-"+control.id;
             t.style = "background-color:"+options[i].color;

             opItem.appendChild(v);
             opItem.appendChild(t);
             opItem.className = "col-lg option";
             control.appendChild(opItem);
         }

    }
    return control;
}

function renderColorsliderControl(controlData){
    var control = document.createElement(controlData.tag);
    var colorRender = document.createElement("div");
    control.id = controlData.id;
    control.type = controlData.type;
    colorRender.className = "colorSliderRender";

    var v,t,options = JSON.parse(controlData.options);
    opItem = document.createElement('div');
    opItem.className="slidercontainer";
   v = document.createElement('input'); //childcontrol
   v.type = control.type;
   v.className= "slider";
   v.min = options[0].min;
   v.max = options[0].max;
   colorRender.style = "background-color:"+hslToHex(options[0].color,options[0].value);
   //change to transition of colors later
   // v.style = "background-color:"+options[0].color;
   opItem.appendChild(colorRender);
   opItem.appendChild(v);
   control.appendChild(opItem);
   console.log(opItem);
   return control;
}
//render options in each control
function renderOption(optionData) {

    var timestamp = new Date().getTime();

    var options = JSON.parse(optionData);
    var opItem, element;

    element = document.createElement('div');
    element.className = "control";

    for (var i = 0; i < options.length; i++) {
        opItem = document.createElement('div'); //子项控件
        v = document.createElement('input');
        v.type = options[i].type;
        v.checked = options[i].checked;
        v.name = options[i].type + "-" + timestamp;

        t = document.createElement('span'); //子项文本
        t.innerText = options[i].text;

        opItem.appendChild(v);
        opItem.appendChild(t);
        opItem.className = "option";
        element.appendChild(opItem);
    }

    return element;
}

//render labels
function renderLabel(text) {

    var element = document.createElement('label');
    element.innerHTML = text;
    //element.setAttribute("for", forName);

    return element;
}

//render required label
function renderRequired() {

    var element = document.createElement('span');
    element.innerHTML = "*";
    element.className = "required";
    //element.setAttribute("for", forName);

    return element;
}
