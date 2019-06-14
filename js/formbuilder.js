(function ($) {
    var FormBuilder = function FormBuilder(options, element) {
        var formBuilder = this;
        var formData;
        var defaults = {
            //save : null
        };

        var opts = $.extend(true, defaults, options);
        var timestamp = new Date().getTime();//time stamp
        var formId = "form-" + timestamp;//Window ID

        $(".fb-designer p").prop("id", formId);
        $(".fb-designer p").prop("name", "Form");
        $(".fb-designer p").text("Window");

        showFormProperty(formId);

        /************Toolbox************/
        $(document).on('mousedown', '.fb-toolbox ul>li', function (event) {
            var $this = $(this);
            var toolItem = this;
            var tag = $this.attr('data-ctrl');
            $this.css({ "cursor": "move" });

            var disX = dixY = disWid = disHigh = 0;
            var event = event || window.event;

            disX = event.clientX - this.offsetLeft;
            disY = event.clientY - this.offsetTop;
            disWid = this.offsetWidth
            disHigh = this.offsetHeight

            var toolTemp = this.cloneNode(true);//temp tool
            var $toolTemp = $(toolTemp);
            $toolTemp.css({ "display": "none" });
            $toolTemp.appendTo("body");

            var emptyLi = "<li class='empty'><b></b></li>";
            $(".fb-designer ul").append(emptyLi);
            var $emptyLi = $(".fb-designer ul .empty");

            //event:mouse movement
            $(document).mousemove(function (event) {
                var event = event || window.event;
                var iL = event.clientX - disX;
                var iT = event.clientY - disY;
                var maxL = $(document).width() - disWid;
                var maxT = $(document).height() - disHigh;
                var zIndex = 10;

                iL <= 0 && (iL = 0);
                iT <= 0 && (iT = 0);
                iL >= maxL && (iL = maxL);
                iT >= maxT && (iT = maxT);

                $toolTemp.css({
                    "z-Index": zIndex++,
                    "opacity": "0.5",
                    "filter": "alpha(opacity=50)",
                    "display": "block",
                    "position": "absolute",
                    "left": iL + "px",
                    "top": iT + "px"
                });

                //[event]box entering designer container
                $(document).on('mouseover', '.fb-designer', function (event) {
                    $emptyLi.css("display", "block");
                });

                //[event]leaving designer container
                $(document).on('mouseleave', '.fb-designer', function (event) {
                    $emptyLi.css("display", "none");
                });

                return false;
            });

            //[event]left click mouse button up
            $(document).mouseup(function (event) {
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");

                $this.css({
                    "z-Index": $toolTemp.css("z-Index"),
                    "opacity": "1",
                    "filter": "alpha(opacity=100)"
                });

                var designer = $('.fb-designer')[0];
                var p_event = { x: event.clientX, y: event.clientY };//lightening label coor
                var p_designer = { x: designer.offsetLeft, y: designer.offsetTop, w: designer.offsetWidth, h: designer.offsetHeight };//designer coordinate

                //mouse in design area
                //if ($('.fb-designer')[0].contains(target)) {
                if (p_event.x > p_designer.x && p_event.x < (p_designer.x + p_designer.w) && p_event.y > p_designer.y && p_event.y < (p_designer.y + p_designer.h)) {
                    var controlItem = $("<li></li>").append(createControl(tag));
                    $(".fb-designer ul").append(controlItem);//add components in designer
                    $(controlItem).trigger("click");
                }

                $toolTemp.remove();
                $emptyLi.remove();

                toolItem.releaseCapture && toolItem.releaseCapture();
            });

            this.setCapture && this.setCapture();
            return false;
        });

        /************designer container************/
        //event mouse press down in container
        $(document).on('mousedown', '.fb-designer ul>li', function (event) {

            var $this = $(this);
            var controlItem = this;

            var event = event || window.event;
            controlSelected(controlItem);
            if (event.target.className == 'close') {
                $this.remove();
            }
            else {

                var disX = dixY = disWid = disHigh = 0;
                disX = event.clientX - this.offsetLeft;
                disY = event.clientY - this.offsetTop;
                disWid = this.offsetWidth
                disHigh = this.offsetHeight

                var controlTemp = this.cloneNode(true);
                var $controlTemp = $(controlTemp);
                $controlTemp.appendTo("body");
                $controlTemp.css({ "display": "none" });

                var op_ctrlTemp = { x: 0, y: 0 };//temp control coor
                var p_ctrlTemp = { x: 0, y: 0, w: 0, h: 0 };//temp control coor
                var p_designer = { x: 0, y: 0, w: 0, h: 0 };//designer coor
                var p_lastctrl = { x: 0, y: 0, w: 0, h: 0 };//last design coor
                p_lastctrl.y = $(".fb-designer ul>li:last").position().top;
                p_lastctrl.w = $(".fb-designer ul>li:last").height();

                var emptyLi = "<li class='empty'><b></b></li>";
                $(emptyLi).insertBefore(controlItem);
                $(emptyLi).css("display", "none");

                var $emptyLi = $(".fb-designer ul .empty");

                //event highlight label movement
                $(document).mousemove(function (event) {

                    $this.css("display", "none");
                    $emptyLi.css("display", "block");

                    var event = event || window.event;
                    var iL = event.clientX - disX;
                    var iT = event.clientY - disY;
                    var maxL = $(document).width() - disWid;
                    var maxT = $(document).height() - disHigh;
                    var zIndex = 10;

                    iL <= 0 && (iL = 0);
                    iT <= 0 && (iT = 0);
                    iL >= maxL && (iL = maxL);
                    iT >= maxT && (iT = maxT);

                    $controlTemp.addClass('controlTemp');

                    $controlTemp.css({
                        "z-Index": zIndex++,
                        //"opacity" : "0.5",
                        //"filter" : "alpha(opacity=50)",
                        "display": "block",
                        //"position" : "absolute",
                        "left": iL + "px",
                        "top": iT + "px"
                    });

                    op_ctrlTemp.x = $controlTemp.position().left - ($controlTemp.width() / 2);
                    op_ctrlTemp.y = $controlTemp.position().top - ($controlTemp.height() / 2);

                    p_ctrlTemp.x = $controlTemp.position().left;
                    p_ctrlTemp.y = $controlTemp.position().top;
                    p_ctrlTemp.w = $controlTemp.width();
                    p_ctrlTemp.h = $controlTemp.height();

                    //insert component according to highlighted label coor
                    $(".fb-designer ul>li").each(function () {
                        if ((event.clientY > $(this).position().top - $(this).height() / 2) && (event.clientY < ($(this).position().top + $(this).height()))) {
                            $emptyLi.insertBefore(this);
                        }
                        else if (event.clientY > (p_lastctrl.y + p_lastctrl.w)) {//&& ($this.prop("id") != $(".fb-designer ul>li:last").prop("id"))
                            $emptyLi.insertAfter(this);
                        }
                    });

                    p_designer.x = $(".fb-designer").position().left;
                    p_designer.y = $(".fb-designer").position().top;
                    p_designer.w = $(".fb-designer").width();
                    p_designer.h = $(".fb-designer").height();

                    //check if dragged out of the tool window
                    if (p_ctrlTemp.x - p_designer.x <= 0) {
                        controlTemp.style.left = p_designer.x + "px";
                    }
                    if (p_ctrlTemp.y - p_designer.y <= 0) {
                        controlTemp.style.top = p_designer.y + "px";
                    }
                    if (p_ctrlTemp.x + p_ctrlTemp.w - p_designer.x >= p_designer.w) {
                        controlTemp.style.left = p_designer.x + p_designer.w - p_ctrlTemp.w + "px";
                    }
                    if (p_ctrlTemp.y + p_ctrlTemp.h - p_designer.y >= p_designer.h) {
                        controlTemp.style.top = p_designer.y + p_designer.h - p_ctrlTemp.h + "px";
                    }
                    return false;
                });

                $(document).mouseup(function () {
                    $(document).unbind("mousemove");
                    $(document).unbind("mouseup");

                    $this.css({
                        "z-Index": $controlTemp.css("z-Index"),
                        "opacity": "1",
                        "filter": "alpha(opacity=100)"
                    });

                    var arr = {
                        left: controlTemp.offsetLeft,
                        top: controlTemp.offsetTop
                    };

                    $this.insertBefore($emptyLi);
                    $this.css("display", "block");

                    $controlTemp.remove();
                    $emptyLi.remove();

                    controlItem.releaseCapture && controlItem.releaseCapture();
                });

                this.setCapture && this.setCapture();
            }

            return false;
        });

        //designed form component selected
        $(document).on('click', '.fb-designer .title', function (event) {
            $(".fb-designer ul>li").removeClass("selected");
            showFormProperty(this.id);
        });

        //designed form component selected
        $(document).on('click', '.fb-designer ul>li', function (event) {
            controlSelected(this);
        });

        //designer click
        $(document).on('click', '.fb-designer', function (event) {
            if (event.target.nodeName != 'LI') {
                $(".fb-designer ul>li").removeClass("selected");

                var formId = $(".fb-designer .title").prop("id");
                showFormProperty(formId);
            }
        });

        //save property
        $(document).on('click mousewheel keyup', '.fb-property ul>li>input', function (event) {
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();
            setProperty(propId);
        });

        //save while typing
        $(document).on('click mousewheel keyup', '.fb-property ul>li>.prop>div>input', function (event) {
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();
            setProperty(propId);
        });

        //property list removal
        $(document).on('click', '.fb-property ul>li>.prop>div>.op-remove', function (event) {
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();
            var $opItem = $(this).parent("div");
            var opId = $opItem.attr("name");
            $(".fb-designer").find("#" + propId).children(".option[name=" + opId + "]").remove();
            $opItem.remove();
            setProperty(propId);
        });

        //property list addition
        $(document).on('click', '.fb-property ul>li>.op-add', function (event) {
            var timestamp = new Date().getTime();
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();
            var $ctrl = $(".fb-designer").find("#" + propId);
            var ctrlId = $ctrl.prop("id");
            var ctrlType = $ctrl.attr("type");
            var opText = ctrlType;

            $ctrl.append("<div name='" + timestamp + "'class='option'><input type='" + ctrlType + "' name='" + ctrlType + '-' + ctrlId + "' /><span>" + ctrlType + "</span></div>");

            if ($ctrl.get(0).tagName == 'SELECT') { ctrlType = "radio"; opText = "Option"; }

            var $prop = $(".fb-property ul li").find(".prop");
            $prop.append("<div name='" + timestamp + "'><input type='" + ctrlType + "' name='prop-" + ctrlType + '-' + ctrlId + "' class='op-value' /><input type='text' class='op-text' value='" + opText + "'><span class='op-remove'> x</span></div>");

            setProperty(propId);
        });;

        //save changes
        $("#btn_save").click(function () {
            formBuilder.save();
            alert("You have save the changes.")
        });

        //clear content
        $("#btn_clear").click(function () {
            formBuilder.clear();
            alert("ALl contents are cleared.")
        });

        //render form design
        formBuilder.show = function (formData) {
            if (formData != null && formData != "") {
                var formJson = JSON.parse(formData);
                $(".fb-designer p").prop("id", formJson.id);

                var controls = formJson.contains;
                for (var i = 0; i < controls.length; i++) {

                    var tag = controls[i].tag;
                    var controlData = {
                        id: controls[i].id,
                        type: controls[i].type,
                        required: controls[i].required,
                        label: controls[i].label,
                        content: controls[i].content,
                        text: controls[i].text,
                        options: controls[i].options
                    };

                    var item = document.createElement('li');//control
                    var div = document.createElement('div');//control window
                    if (controlData.label != undefined) {
                        var lbl = controlData.required != undefined ? $(createLabel(controlData.label)).append("<span class='required'>*</span>") : createLabel(controlData.label);
                        $(div).append(lbl);
                    }
                    $(div).append(createTag(tag, controlData));
                    $(item).append(createItem(div));

                    $(".fb-designer ul").append(item);
                }
            }
        }

        //save design layouts
        formBuilder.save = function () {

            var $control, control, ctrlLabel;
            var contains = [];

            $(".fb-designer ul>li").each(function () {

                $control = $(this).find(":nth-child(2)");
                ctrlLabel = $control.attr('data-label');

                if (typeof ctrlLabel == 'undefined') {
                    $control = $(this).children().children().eq(0);
                }

                control = {};
                control.id = $control.prop("id");
                control.tag = $control[0].tagName;
                control.type = typeof $control.prop("type") == 'undefined' ? $control.attr("type") : $control.prop("type");
                control.required = $control.attr("required");
                control.label = ctrlLabel;
                control.content = $control.html();
                control.text = $control.text();
                control.options = $control.attr("data-options");
                contains.push(control);
            });

            var $form = $(".fb-designer p");//design objects
            var form = {};
            form.id = $form.prop("id");
            form.name = $form.prop("name");
            form.text = $form.text();
            form.contains = contains;

            var formData = JSON.stringify(form);
            // console.log(formData);

            return formData;
        }

        //clear form design
        formBuilder.clear = function () {
            $(".fb-designer ul>li").remove();
        }

        //selected form components
        function controlSelected(element) {
            $(".fb-designer ul>li").removeClass("selected");
            $(element).addClass("selected");

            var ctrlId;
            var ctrlLabel = $(element).find(':nth-child(2)').attr('data-label');

            if (typeof ctrlLabel == 'undefined') {
                ctrlId = $(element).children().children().eq(0).prop('id');
            }
            else {
                ctrlId = $(element).find(':nth-child(2)').prop('id');
            }

            showProperty(ctrlId);
        }


        function createControl(type) {

            var timestamp = new Date().getTime();
            var ctrlLabel, ctrlValue, inputType, ctrlGroup = false;

            var tag, ctrlData = {};

            switch (type) {
                /*single label*/
                case 'button': tag = "input"; ctrlData.type = type; ctrlData.value = "Button";
                    break;
                case 'checkbox': tag = "input"; ctrlData.type = type; ctrlData.label = "CheckBox";
                    break;
                case 'datetime-local': tag = "input"; ctrlData.type = type; ctrlData.label = "DateTime";
                    break;
                case 'color': tag = "input"; ctrlData.type = type; ctrlData.label = "Color";
                    break;
                case 'month': tag = "input"; ctrlData.type = type; ctrlData.label = "Month";
                    break;
                case 'week': tag = "input"; ctrlData.type = type; tag = "input"; ctrlData.label = "Week";
                    break;
                case 'time': tag = "input"; ctrlData.type = type; ctrlData.label = "Time";
                    break;
                case 'email': tag = "input"; ctrlData.type = type; ctrlData.label = "Email";
                    break;
                case 'tel': tag = "input"; ctrlData.type = type; ctrlData.label = "Tel";
                    break;
                case 'number': tag = "input"; ctrlData.type = type; ctrlData.label = "Number";
                    break;
                case 'file': tag = "input"; ctrlData.type = type; ctrlData.label = "FileUpload";
                    break;
                case 'hidden': tag = "input"; ctrlData.type = type;
                    break;
                case 'img': tag = type; //TODO
                    break;
                case 'radio': tag = "input"; ctrlData.type = type; ctrlData.label = "Radio";
                    break;
                case 'text': tag = "input"; ctrlData.type = type; ctrlData.label = "TextBox";
                    break;
                    /*two labels*/
                case 'a': tag = type; //TODO
                    break;
                case 'h': tag = type; ctrlData.content = "H";
                    break;
                case 'label': tag = type; //TODO
                    break;
                case 'checkboxgroup':
                tag = "checkboxgroup";
                ctrlData.type = "checkbox"; ctrlData.label = "CheckBoxGroup";
                    break;
                    //provide different colours for selection
               case 'ColourSelector':
               tag = "ColourSelector";
               ctrlData.type = "checkbox";
               ctrlData.label = "Options of colour";
               ctrlData.color = "hsl(120,100%, 50%)";
               break;
                case 'radiogroup': tag = "radiogroup";
                ctrlData.type = "radio";
                ctrlData.label = "RadioGroup";
               break;

                case 'select': tag = type; ctrlData.label = "Select";
                    break;

                case 'textarea': tag = type; ctrlData.label = "TextArea"; ctrlValue = "";
                    break;
                default:
                    break;
            }

            ctrlData.id = tag + '-' + timestamp;

            var div = document.createElement('div');//border

            if (ctrlData.label != undefined) {
                $(div).append(createLabel(ctrlData.label));
            }

            $(div).append(createTag(tag, ctrlData));
            var item = createItem(div);

            return item;
        }


        function createItem(div) {

            var ctrlBox = document.createElement('div');//control buttons
            var btnClose = document.createElement('span');//close button

            $(btnClose).html('X');
            $(btnClose).addClass('close');

            $(ctrlBox).append(btnClose);
            $(ctrlBox).addClass('controlbox');

            $(div).append(ctrlBox);
            $(div).addClass('controlItem');

            return div;
        }

        //tag
        function createTag(tag) {

            var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var element;

            if (tag.toUpperCase() == "CHECKBOXGROUP" || tag.toUpperCase() == "RADIOGROUP" || tag.toUpperCase() == "DIV") {
                tag = "input";
                element = createInputGroup(tag, attrs);
            }
            //Create labels for colours
            else if(tag.toUpperCase()=="COLOURSELECTOR"){
               tag = "input";
               element = createInputColourGroup(tag,attrs);
            }
            else if (tag.toUpperCase() == "SELECT") {
                element = createSelect(tag, attrs);
            }
            else {
                element = document.createElement(tag);

                for (var attr in attrs) {
                    if (attr == "label") {
                        $(element).attr("data-label", attrs[attr]);
                    }
                    else if (attr == "content") {
                        $(element).html(attrs[attr]);//innerText
                    }
                    else if (attrs.hasOwnProperty(attr) && typeof attrs[attr] != 'undefined') { //
                        $(element).attr(attr, attrs[attr]);
                    }
                    else { }
                }
            }

            return element;
        }

        function createInput(tag, ctrlData) {

            var timestamp = new Date().getTime();
            var element = document.createElement(tag);//control label

            element.id = tag + "-" + timestamp;
            //element.name = '';
            element.textContent = tag;
            //element.title = '';
            element.type = ctrlData.type;

            if (ctrlData.label != undefined) {
                $(element).attr("data-label", ctrlData.label);
            }

            if (ctrlData.value != undefined) {
                element.value = ctrlData.value;
            }

            return element;
        }

        //create color selector in control window
        function createInputColourGroup(tag, ctrlData) {

           var timestamp = new Date().getTime();
           var element = document.createElement("div");//label tag

           $(element).prop("id", ctrlData.id ? ctrlData.id : tag + "-" + timestamp);
           $(element).prop("name", element.id);
           $(element).addClass("control");
           $(element).attr("type", ctrlData.type);
           $(element).attr("required", ctrlData.required);

           if (typeof ctrlData.options == 'undefined') {//default
              ctrlData.options = "[{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 0\",\"checked\":false,\"value\":false,"+"\"color\":"+ctrlData.color
               + "},{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 1\",\"checked\":false,\"value\":false,\"color\":"+ctrlData.color
               + "},{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 2\",\"checked\":false,\"value\":false,\"color\":"+ctrlData.color
               + "}]";

           }
           console.log(ctrlData.options);
           var options = JSON.parse(ctrlData.options);
           var option;
           var lbl, ctrl;
           for (var i = 0; i < options.length; i++) {

              box = document.createElement("div");
              lbl = document.createElement("span");

              option = {};
              option.type = options[i].type;
              option.name = options[i].name;
              option.text = options[i].text;
              option.checked = options[i].checked;
              option.value = options[i].value;
              lbl.setAttribute("class","colorsquare");
              //set colour with option.text later
              lbl.innerHTML = option.text;
              // console.log(lbl);

              ctrl = document.createElement(tag);
              ctrl.type = ctrlData.type;
              ctrl.name = ctrlData.type + "-" + element.name;

              box.setAttribute("name", i);
              box.className = "option";
              box.appendChild(ctrl);

              box.appendChild(lbl);
              $(element).append(box);
           }

           var dataOptions = JSON.stringify(options);
           $(element).attr("data-options", dataOptions);

           if (ctrlData.label != undefined) {
              $(element).attr("data-label", ctrlData.label);
           }

           return element;
      }
        //create CheckBoxGroup/RadioGroup
        function createInputGroup(tag, ctrlData) {

            var timestamp = new Date().getTime();
            var element = document.createElement("div");//label tag

            $(element).prop("id", ctrlData.id ? ctrlData.id : tag + "-" + timestamp);
            $(element).prop("name", element.id);
            $(element).addClass("control");
            $(element).attr("type", ctrlData.type);
            $(element).attr("required", ctrlData.required);

            if (typeof ctrlData.options == 'undefined') {//default
                ctrlData.options = "[{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 0\",\"checked\":false,\"value\":false}"
                                + ",{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 1\",\"checked\":false,\"value\":false}"
                                + ",{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 2\",\"checked\":false,\"value\":false}]";
            }
            var options = JSON.parse(ctrlData.options);
            var option;
            var lbl, ctrl;
            for (var i = 0; i < options.length; i++) {

                box = document.createElement("div");
                lbl = document.createElement("span");

                option = {};
                option.type = options[i].type;
                option.name = options[i].name;
                option.text = options[i].text;
                option.checked = options[i].checked;
                option.value = options[i].value;

                lbl.innerHTML = option.text;

                ctrl = document.createElement(tag);
                ctrl.type = ctrlData.type;
                ctrl.name = ctrlData.type + "-" + element.name;

                box.setAttribute("name", i);
                //box.name = i;
                box.className = "option";
                box.appendChild(ctrl);
                box.appendChild(lbl);

                $(element).append(box);

                //options.push(option);
            }

            var dataOptions = JSON.stringify(options);
            $(element).attr("data-options", dataOptions);

            if (ctrlData.label != undefined) {
                $(element).attr("data-label", ctrlData.label);
            }

            return element;
        }

        function createSelect(tag, ctrlData) {
            var timestamp = new Date().getTime();
            var element = document.createElement(tag);

            //element.id = tag + "-" + timestamp;
            //element.name = '';
            //element.title = '';
            $(element).prop("id", ctrlData.id ? ctrlData.id : tag + "-" + timestamp);
            $(element).attr("required", ctrlData.required);

            if (typeof ctrlData.options == 'undefined') {//default
                ctrlData.options = "[{\"type\":\"radio\",\"name\":\"option-select-1495684000286\",\"text\":\"Option 0\",\"checked\":false,\"value\":0},{\"type\":\"radio\",\"name\":\"option-select-1495684000286\",\"text\":\"Option 1\",\"checked\":false,\"value\":1},{\"type\":\"radio\",\"name\":\"option-select-1495684000286\",\"text\":\"Option 2\",\"checked\":false,\"value\":2}]";
            }
            var options = JSON.parse(ctrlData.options);
            var op, option;//, options = [];
            for (var i = 0; i < options.length; i++) {

                option = {};
                option.type = options[i].type;
                option.name = options[i].name;
                option.text = options[i].text;
                option.checked = options[i].checked;
                option.value = options[i].value;

                op = new Option(option.text, option.value);
                op.className = "option";
                element.options.add(op);
                //options.push(option);
            }

            var dataOptions = JSON.stringify(options);
            $(element).attr("data-options", dataOptions);
            $(element).attr("data-label", ctrlData.label);

            return element;
        }
//create label in property
        function createLabel(text, forName) {

            var element = document.createElement('label');
            $(element).html(text);

            return element;
        }

        //show property of the form
        function showFormProperty(id) {
            $(".fb-property ul li").remove();

            //var eleName = $("#" + id).prop("name");
            var eleText = $("#" + id).text().Trim();

            $(".fb-property ul").append('<li><label>ID</label><input id="txt_prop_id" type="text" readonly="true" style="background-color:#ddd" value="' + id + '" /></li>');
            //$(".fb-property ul").append('<li><label>Name</label><input id="txt_prop_name" type="text" value="' + eleName + '" /></li>');
            $(".fb-property ul").append('<li><label>Text</label><input id="txt_prop_text" type="text" value="' + eleText + '" /></li>');
        }

        function showProperty(id) {

            $(".fb-property ul li").remove();

            var eleRequired = $("#" + id).attr("required");
            //var eleName = $("#" + id).prop("name");
            var eleLabel = $("#" + id).attr("data-label");
            var eleValue = $("#" + id).val();
            var eleText = $("#" + id).text();
            var eleOptions = $("#" + id).attr("data-options");

            //add id
            $(".fb-property ul").append('<li><label>ID</label><input id="txt_prop_id" type="text" readonly="true" style="background-color:#ddd" value="' + id + '" /></li>');
            //add checked status
            if (eleRequired) { eleRequired = "checked"; }
            $(".fb-property ul").append('<li><label>Required</label><input id="txt_prop_required" type="checkbox" ' + eleRequired + ' /></li>');
            //add label of section
            $(".fb-property ul").append('<li><label>Label</label><input id="txt_prop_label" type="text" value="' + eleLabel + '" /></li>');

            if (eleOptions != 'undefined' && eleOptions != null) {
                var dataProp = JSON.parse(eleOptions);
                // console.log(dataProp);
                var div = "<div class='prop'>";
                for (var i = 0; i < dataProp.length; i++) {
                    div += "<div name='" + i + "'>";
                    div += "<input type='" + dataProp[i].type + "' name='prop-" + dataProp[i].type + '-' + id + "' class='op-value' " + (dataProp[i].checked ? 'checked' : '') + " />";
                    div += "<input type='text' class='op-text' value='" + dataProp[i].text + "' />";
                    div += "<span class='op-remove'> x</span>";
                    div += "</div>";
                }
                div += "</div><span class='op-add'>+</span>";
                $(".fb-property ul").append('<li><label>Options</label>' + div + '</li>');
                console.log(div);
            }
            else {
                $(".fb-property ul").append('<li><label>Text</label><input id="txt_prop_text" type="text" value="' + eleText + '" /></li>');
                $(".fb-property ul").append('<li><label>Value</label><input id="txt_prop_value" type="text" value="' + eleValue + '" /></li>');
            }
        }

        //property setting
        function setProperty(id) {

            var eleModel = {};

            eleModel.required = $(".fb-property ul li").find("#txt_prop_required").prop("checked");
            //eleModel.name = $(".fb-property ul li").find("#txt_prop_name").val();
            eleModel.value = $(".fb-property ul li").find("#txt_prop_value").val();
            eleModel.text = $(".fb-property ul li").find("#txt_prop_text").val();
            eleModel.label = $(".fb-property ul li").find("#txt_prop_label").val();

            var option, options = [];
            $(".fb-property ul li").find(".prop>div").each(function (i) {

                var $v = $(this).find(".op-value");
                var $t = $(this).find(".op-text");

                option = {};
                option.type = $v.get(0).type;//tagName;
                option.name = "";
                option.text = $t.val();
                option.checked = $v.prop("checked");
                option.value = i;
                options.push(option);

                var op = $(".fb-designer").find("#" + id).children(".option").eq(i);
                op.find("input").prop("checked", option.checked);
                op.find("span").html(option.text);
            });

            if (options.length > 0) {
                eleModel.options = options;
                var dataOption = JSON.stringify(eleModel.options);
                $(".fb-designer").find("#" + id).attr("data-options", dataOption);
            }

            //$(".fb-designer").find("#" + id).prop("required", eleModel.required);
            $(".fb-designer").find("#" + id).attr("required", eleModel.required);
            //$(".fb-designer").find("#" + id).prop("name", eleModel.name);
            if (eleModel.value != "undifined" && options.length <= 0) { $(".fb-designer").find("#" + id).val(eleModel.value); }
            if (eleModel.text != "undifined" && options.length <= 0) { $(".fb-designer").find("#" + id).text(eleModel.text); }
            $(".fb-designer").find("#" + id).attr("data-label", eleModel.label);
            $(".fb-designer").find("#" + id).prev("label").text(eleModel.label);
            if (eleModel.required) { $(".fb-designer").find("#" + id).prev("label").append("<span class='required'>*</span>"); }
        }

        //transition cartoon
        function animates(obj, params, time, handler) {
            var node = typeof obj == "string" ? $(obj) : obj;
            var nodeStyle = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
            var handleFlag = true;
            for (var p in params) {
                (function () {
                    var n = p;
                    if (n == "left" || n == "top") {
                        var oldPosition = parseInt(nodeStyle[n]);
                        var newPosition = parseInt(params[n]);
                        var t = 10;
                        if (!isNaN(oldPosition)) {
                            var count = oldPosition;
                            var length = oldPosition <= newPosition ? (newPosition - oldPosition) : (oldPosition - newPosition);
                            var speed = length / time * t;
                            var flag = 0;
                            var anim = setInterval(function () {
                                node.style[n] = count + "px";
                                count = oldPosition <= newPosition ? count + speed : count - speed;
                                flag += t;
                                if (flag >= time) {
                                    node.style[n] = newPosition + "px";
                                    clearInterval(anim);
                                    if (handleFlag) {
                                        handler();
                                        handleFlag = false;
                                    }
                                }
                            },
                            t);
                        }
                    }
                })();
            }
        }

        return formBuilder;
    }

    $.fn.formBuilder = function (options) {
        options = options || {};

        return this.each(function () {
            var formBuilder = new FormBuilder(options, this);

            $(this).data('formBuilder', formBuilder);

            return formBuilder;
        });
    };
})(jQuery);
