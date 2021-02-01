/*-------------- Function Cards Start ----------------*/
var loaded = false;
var counter = 0;
var testCheck = [];
var fnCards = function () {   

    var locationCards = "https://10.51.237.90:8443/pubsub/serlayer/getMessagesForSubscriberOfTopic?userID=" + username;

    $.post(locationCards, function (data) {
        //console.log(data);
        $.each(data, function (i, objValue) {
            //console.log(i);            
            counter++;
            /*if ($.inArray(i, testCheck) == -1) {                
                //counter++;
                console.log('inside if... .. ..');
            } */           
            
            //Buttons
            var buttons = "";            
            $.each(objValue.buttons, function (i, btnValue) {
                //console.log(btnValue);            
                     buttons += '<a href="' + btnValue.href + '" id="' + btnValue.id + '" class="btn-card" target="_blank">' + btnValue.label + '</a>'
                    // alert(buttons)
            });

            //Paragraph
            var para = "";
            $.each(objValue.message, function (i, msgValue) {
                para += '<p>' + msgValue + '</p>'
            });
           
            //console.log(counter);
            if (counter > 2) {
                //console.log(testCheck);
                console.log($.inArray(i, testCheck));
                if ($.inArray(i, testCheck) == -1) {                    
                    console.log('element creation... .. ..');
                    //testCheck.push(i);

                    var dateObject = objValue.ExpireOn;
                    console.log(dateObject);
                    // subscribeCheck = objValue.subscribed;
                    var first = dateObject;
                    var second = new Date();

                    if ((new Date(first).getTime() > new Date(second).getTime())) {                          

                        var locationCard_1 = '<li id="" class="card-1 animated zoomIn"><h2 class="card-page-title">' + objValue.title + '</h2><div class="card-content"><div class="thumbnail-holder"><img src="' + objValue.media.image + '" width="" /></div><div class="right-content"><h3>' + objValue.subTitle + '</h3><p class="description">' + objValue.desc + '</p></div><p class="clearfix"></p><div class="message-content">' + para + '</div><div class="card-button-holder">' + buttons + '</div></div></li>'

                        $("#utterance").append(locationCard_1).fadeIn(600);
                        testCheck.push(i);
                    }
                    
                } else {
                    return;
                }
            } 
            else {
                var dateObject = objValue.ExpireOn;
                console.log(dateObject);
                // subscribeCheck = objValue.subscribed;
                var first = dateObject;
                var second = new Date();

                if ((new Date(first).getTime() > new Date(second).getTime())) {                    

                    var locationCard_1 = '<li id="" class="card-1 animated zoomIn"><h2 class="card-page-title">' + objValue.title + '</h2><div class="card-content"><div class="thumbnail-holder"><img src="' + objValue.media.image + '" width="" /></div><div class="right-content"><h3>' + objValue.subTitle + '</h3><p class="description">' + objValue.desc + '</p></div><p class="clearfix"></p><div class="message-content">' + para + '</div><div class="card-button-holder">' + buttons + '</div></div></li>'

                    $("#utterance").append(locationCard_1).fadeIn(600);
                    testCheck.push(i);
                }
            }
            
            $("#scroll-wrap").mCustomScrollbar("scrollTo", "bottom", {
                scrollEasing: "easeOut"
            });

            $('#utterance').animate({
                scrollTop: $('#utterance .card-1:last-child').position().bottom
            }, 'slow');            

        });

    });
}

window.setInterval(function () {
  //  fnCards();
}, 10000);

/*-------------- Function Cards End ----------------*/

var isUnsubscribe;
var isSubscribe;

/*--------------- Function Subscribe List Start----------------*/
var subscribeList = function () {
        var locationSubscribeList = "https://10.51.237.90:8443/pubsub/serlayer/broadcastTopics?userID=" + username;
        //console.log(locationSubscribeList);
        /*--------------- Function Brodcast Topic Start----------------*/
        function brodCastTopics() {
            isUnsubscribe = 0;
            isSubscribe = 0;

            $.post(locationSubscribeList, function (data) {
                
                console.log(data.topics.length == 0);
                // if (!data) {
                if (data.topics.length == 0) {
                    subscribeHtml = '<div class="row no-subscribe-list">NO SUBSCRIBE LIST</div>'
                    $("#subscribeList").html(subscribeHtml);
                    return;
                }
                // console.log(data);
                var subscribeHtml = "";

                $.each(data.topics, function (i, objValue) {
                    console.log(objValue);
                    var dateObject = objValue.ExpireOn;
                   // alert(dateObject);
                    // subscribeCheck = objValue.subscribed;
                    var first = dateObject;
                    var second = new Date();

                    if ((new Date(first).getTime() > new Date(second).getTime())) {
                        //  console.log('inside get time...');
                    }

                    if (objValue.subscribed == "true") {
                        isSubscribe++;
                    }
                    if (objValue.subscribed == "false") {
                        isUnsubscribe++;
                    }

                    var isSubscribed = "";
                    if (objValue.subscribed == "true") {
                        isSubscribed = "(Already Subscribed)"
                    } else {
                        isSubscribed = "";
                    }
                    subscribeHtml += '<div class="checkbox"><label><input type="checkbox" class="subscribeCheck ' + objValue.subscribed + '" value="' + objValue.topicName + '">' + objValue.topicName + '</label> <span class="is-subscribed">' + isSubscribed + '</span></div>';
                });

                totalCount = isSubscribe + isUnsubscribe;

                $('#btn-unSubscribe').prop('disabled', true);
                $('#btn-subscribe').prop('disabled', true);

                $("#subscribeList").html(subscribeHtml);
            });
        }
        /*--------------- Function Brodcast Topic End----------------*/
        $(document).on('click', '.popup-gallery-2', function (e) {
            e.preventDefault();
            brodCastTopics();
            //alert(checkIsSubscribedNull);
        });

        /*--------------- Subscribe Button Click Start----------------*/
        var subscribeChkValue;
        $("#btn-subscribe").click(
            function (e) {
                e.preventDefault();
                subscribeChkValue = "";
                var data = [];
                $(".subscribeCheck:checked").each(function () {
                    data.push($(this).val());
                });
                subscribeChkValue = data.join(',');

                var locationSubscribe = "https://10.51.237.90:8443/pubsub/serlayer/subscribeMessage?topic=" + subscribeChkValue + "&userID=" + username;

                console.log(locationSubscribe)
                $.post(locationSubscribe, function (data) {
                    console.log(data);
                    $.magnificPopup.close();
                });
            });
        /*--------------- Subscribe Button Click End----------------*/

        /*--------------- UnSubscribe Button Click Start----------------*/
        $("#btn-unSubscribe").click(
            function (e) {
                e.preventDefault();

                unSubscribeChkValue = "";
                var data = [];
                $(".subscribeCheck:checked").each(function () {
                    data.push($(this).val());
                });
                unSubscribeChkValue = data.join(',');

                var locationUnSubscribe = "https://10.51.237.90:8443/pubsub/serlayer/unsubscribeMessage?topic=" + unSubscribeChkValue + "&userID=" + username;

                console.log(locationUnSubscribe)
                $.post(locationUnSubscribe, function (data) {
                    console.log(data);
                    $.magnificPopup.close();
                });

            });
        /*--------------- UnSubscribe Button Click End----------------*/
        
    }
/*--------------- Cancel Subscribe Button Click Start----------------*/
        $(document).on('click', '.cancel-subscribe', function (e) {
            e.preventDefault();
            $.magnificPopup.close();
        });
        /*--------------- Cancel Subscribe Button Click End----------------*/
    /*--------------- Function Subscribe List End------------------*/

/*--------------- Subscribe Check checkbox Click Start----------------*/
$(document).on('change', '.subscribeCheck', function () {
    if ($(this).prop('checked')) {
        if ($(this).hasClass("true")) {
            $('#btn-unSubscribe').prop('disabled', false);
        } else if ($(this).hasClass("false")) {
            $('#btn-subscribe').prop('disabled', false);
        }
    } else {
        $('#btn-subscribe').prop('disabled', true);
        $('#btn-unSubscribe').prop('disabled', true);
    }
});
/*--------------- Subscribe Check checkbox Click End----------------*/

//});