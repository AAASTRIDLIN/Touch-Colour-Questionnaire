$(document).ready(function ($) {

    var fbOptions = {
        dataType: 'json'
    };

    var formBuilder = $('.build-wrap').formBuilder(fbOptions);



    $("#btn_view").click(function () {

        var formData = formBuilder.data('formBuilder').save();
        var frOptions = {
            dataType: 'json',
            formData: formData,
            showTitle: true
        };

        $('.render-wrap').empty();
        $('.render-wrap').formRender(frOptions);

        var w = $('.build-wrap').find(".fb-designer").width(),
            h = $('.build-wrap').find(".fb-designer").height(),
            p = $('.build-wrap').find(".fb-designer").position();

        $('.render-wrap').find(".form-render").css({ "position": "absolute", "top": p.top, "left": p.left, "height": h });
    });
});
