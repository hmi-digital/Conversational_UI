$(document).ready(function () {
    //location1 = $('#ip').val() + "/hmi/bot";
     location1 = "https://192.168.0.101:8080/hmi";
    //console.log(location1);
    /*-------------------------- Current Time Function Start --------------------------*/
    var msg;
    chatDate = new Date();

    currentTime = function () {
        var date = new Date();
        var hours = date.getHours();
        if (hours < 12) {
            if ($("#selectLanguage_new").val() == 'hi') {
                msg = "शुभ प्रभात";
            } else if ($("#selectLanguage_new").val() == 'mr') {
                msg = "शुभ प्रभात";
            } else {
                msg = "Good Morning";
            }
        } else if (hours < 18) {
            if ($("#selectLanguage_new").val() == 'hi') {
                msg = "शुभ दोपहर";                 
            } else if ($("#selectLanguage_new").val() == 'mr') {
                msg = "शुभ दुपार";
            } else {
                msg = "Good Afternoon"                 
            }
        } else {
            if ($("#selectLanguage_new").val() == 'hi') {
                msg = "शुभ संध्या";                
            } else if ($("#selectLanguage_new").val() == 'mr') {
                msg = "शुभ संध्या";
            } else {
                msg = "Good Evening";                
            }
        }
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    currentTime();

    /*-------------------------- Current Time Function End --------------------------*/

    /*------------------ Login Start -------------------*/

    $(".chat-wrapper").hide();
    $('.ip-adress').hide();
    $('.toggle').click(function () {
        $('.ip-adress').slideToggle();
    });

    /*-------- Login Input focus start ------------------*/
    $(".input").focusin(function () {
        $(this).find("span").animate({
            "opacity": "0"
        }, 200);
    });

    $(".input").focusout(function () {
        $(this).find("span").animate({
            "opacity": "1"
        }, 300);
    });
    /*-------- Login Input focus End ------------------*/

    /*----- Global variable-----*/
    var password, passwordValid, ipAddress, isUserNameExistInDb, locationAauthenticateUser, locationUpdateUser, checkAuthenticUser;
    /*-------- Login Button Function Start ------------------*/

    $("#UpdatePasswordForm, #welcome-wrapper, #home-wrapper").hide();

    /*----------- Btn Login click Start ---------------*/
    $("#login").click(function (e) {
        validateLoginForm();
    });
    $('#password').keydown(function (e) {
        if (e.keyCode == 13) {
            //login.click();
            validateLoginForm();
        }
    });
    /*----------- Btn Login click End ---------------*/

    $(".validate").keyup(function (e) {
        $(this).parent().parent().removeClass('login-error');
    });

    /*----------- Btn Update click Start ---------------*/
    $("#btnUpdate").click(function (e) {
        validateUpdatePassword();
    });
    $('#confirmPassword').keydown(function (e) {
        if (e.keyCode == 13) {
            //login.click();
            validateUpdatePassword();
        }
    });
    /*----------- Btn Update click End ---------------*/

    /*----------- Function Validate Login Form Start-------------*/
    /*function validateLoginForm(e) {
        username = $("#username").val();
        password = $("#password").val();
        ipAddress = $('#ip').val() + "/hmi";
        location1 = ipAddress;
        if (username == "John" && password == "John123") {
            credentialPass();
        } else {
            locationAauthenticateUser = location1 + "/authenticateUser?userID=" + username + "&password=" + password + "&role=user";
            var posting = $.post(locationAauthenticateUser);

            // Put the results once done
            posting.done(function (data) {
                console.log(data);
                if (data === undefined) {
                    showMessage('Authentication url failed ', 'error');
                    return true;
                }
                checkAuthenticUser = data.response;
                //passWordMatchOld = "rohitk"
                // e.preventDefault();
                if (username == "") {
                    showMessage('User Name is required', 'error');
                    $("#username").parent().parent().addClass('login-error');
                    $('#username').focus();
                    return false;
                } else if (password == "") {
                    showMessage('Password is required', 'error');
                    $('#password').parent().parent().addClass('login-error');
                    $('#password').focus();
                    return false;
                } else if (checkAuthenticUser == "true"  && password == "We1com3") {
                    $('form, #changeIp').animate({
                        height: "toggle",
                        opacity: "toggle"
                    }, "slow");
                    $('#password, #username').val('');
                    return false;
                } else if (username != '' && password != '' && checkAuthenticUser == "true"  ) {
                    credentialPass();
                    return false;
                } else {
                    showMessage('Please provide valid username and password', 'error');
                    $('#username').focus();
                    $('#username, #password').val('');
                }
            }).fail(function (xhr, status, error) {
                // error handling
                showMessage('Authentication Service Unavailable', 'error');
            });;

         
        } */ 



        /*------------ Function Validation pass start ----------------- */

       /* function credentialPass() {
            $("#login-wrapper").hide();
            $(".chat-wrapper").show();
            $("#welcome-wrapper").fadeIn("fast");
            $(".welcome-content h3").html("Hello, " + msg);
            $(".user-name").html(username);


            $(".startChat").click(function (e) {
                $(this).closest("#welcome-wrapper").fadeOut("fast");
                $("#home-wrapper").fadeIn("fast");
                $('#loading').show();
                initialCall();
                // currentTime();

                //}

            });
        }*/
        /*------------ Function Validation pass End ----------------- */

        /*-------------------------- Initial Post Call Function Start ---------------------*/
    //taken outside due to lang selection dropdown
    $(".chat-wrapper").show();
    $("#home-wrapper").fadeIn("fast");    
    //show lang selection dropdown on load
    $('#langSelectionModel').modal('show');    
    //function initial load start
        function initialCall() {
             
            //console.log(location1);
              /*$(".chat-wrapper").show();
            $("#home-wrapper").fadeIn("fast");*/
            $.post(location1 + "/bot", {
                    user: "John"
                }, function (data, textStatus, jqXHR) {
                    console.log(data);
                    currentTime();
                    systemUtteranceContent = '<li class="mar-btm systemUtterance"> <div class="media-body pad-hor"> <div class="speech"> <p id="systemUtterance">' + msg + ', ' + data.result.reply + '</p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p> </div></div></li>';
                    $('#loading').hide();
                
                    // $("#utterance").html('');
                    
                   // $("#utterance").html(systemUtteranceContent);
                    $("#utterance").append(systemUtteranceContent).fadeIn(600);
                    if (!data.iCard == 0) {
                       fn_icard(data);
                     }
                    $("#utterance li:hidden:first")
                        .fadeIn(600);

                    locationInt = jqXHR.getResponseHeader("location");
                    //console.log(locationInt);
                    getCurrentTask();

                    if (cardsFlag == true) {
                        subscribeList();
                    }
                    //languageChangeHandler();
                })
                .fail(function (xhRequest, status, thrownError) {
                    showError("Initialisation failed.", true);
                    alert(thrownError);
                });
        }
    
    $(document).on('click', '#btnSelectLang', function(){
       $('#langSelectionModel').modal('hide');
        initialCall();
    });
    
        /*-------------------------- Initial Post Call Function End --------------------------*/

    //}
    /*----------- Function validate Login Form End ---------------*/

    /*-------------- Function validate updatePassword Form Start--------------------*/

    function validateUpdatePassword() {
        var oldPassword = $("#oldPassword").val();
        var updatePassword = $("#updatePassword").val();
        var confirmPassword = $("#confirmPassword").val();
        var passwordRegX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/;

        locationUpdateUser = location1 + "/updateUser?userID=" + username + "&password=" + updatePassword + "&role=user";

        if (oldPassword == '') {
            showMessage('Old password is required', 'error');
            $("#oldPassword").parent().parent().addClass('login-error');
            $('#oldPassword').focus();
            return false;
        } else if (oldPassword !== "We1com3") {
            showMessage('Old password is incorrect', 'error');
            $("#oldPassword").parent().parent().addClass('login-error');
            $('#oldPassword').focus();
            return false;
        } else if (updatePassword == '') {
            showMessage('New password is required', 'error');
            $("#updatePassword").parent().parent().addClass('login-error');
            $('#updatePassword').focus();
            return false;
        } else if (!passwordRegX.test(updatePassword)) {

            showMessage("Minimum 3 characters at least 1 Alphabet, 1 Number is required");
            $('#updatePassword').focus();
            return false;
        } else if (confirmPassword == '') {
            alert('inside confirm password condition');
            showMessage('Confirm new password is required', 'error');
            $("#confirmPassword").parent().parent().addClass('login-error');
            $('#confirmPassword').focus();
            return false;
        } else if (updatePassword !== confirmPassword) {
            showMessage('Entered password is not matching', '');
            $("#updatePassword").parent().parent().addClass('login-error');
            $('#updatePassword').focus();
            $('#updatePassword, #confirmPassword').val('');
            return false;
        } else {
            showMessage('Password Updated Successfully', 'success');
            $('form, #changeIp').animate({
                height: "toggle",
                opacity: "toggle"
            }, "slow");
            $("#updatePassword, #confirmPassword, #oldPassword").val('');
        }
        $.post(locationUpdateUser)
    }
    /*-------------- Function validate updatePassword Form End--------------------*/
    $('.alert-msg').hide();

    function showMessage(msg, status) {
        $('.alert-msg').animate({
            height: "toggle",
            opacity: "toggle"
        }, "slow").delay(3500).animate({
            height: "toggle",
            opacity: "toggle"
        }, "slow");
        if (status == 'success') {
            $('.alert-msg').addClass('alert-success');
            $('.alert-msg').removeClass('alert-danger');
            $('.alert-msg').text(msg);
            return false;
        } else {
            $('.alert-msg').addClass('alert-danger');
            $('.alert-msg').removeClass('alert-success');
            $('.alert-msg').text(msg);
            return false;
        }

    }
    /*-------- Login Button Function End ------------------*/

    /*-------------- Get Current task Start-----------------*/
    getCurrentTask = function () {
        //alert('get current task..');
        $('#current-task-detail').empty();
        $.post(locationInt + '/tasks',
            function (data) {
                //console.log(data);
                var CardHtmlData = '';
                var taskHtml = '';
                var navTab = '';
                var tabContent = '';
                $.each(data.tasks, function (i, objValue) {
                    var itos = '';
                    $.each(objValue.entities, function (key, value) {
                        var taskLabel;
                        if (value.label === '') {
                            taskLabel = value.name;
                        } else {
                            taskLabel = value.label;
                        }
                        itos += '<div class="col-xs-4"><label>' + taskLabel + ': <span>' + value.value + '</span></label></div>';
                    });

                    var tabTitle;
                    if (objValue.label === '') {
                        tabTitle = objValue.name;
                    } else {
                        tabTitle = objValue.label;
                    }

                    navTab += '<li><a data-toggle="tab" href="#' + i + '">' + tabTitle + '</a></li>';
                    tabContent += '<div id="' + i + '" class="tab-pane fade">' + itos + '</div>';
                    taskHtml = '<ul class="nav nav-tabs">' + navTab + '</ul><div class="tab-content col-xs-12 marginTop">' + tabContent + '</div>'
                });
                $('#task-wrapper').html(taskHtml);
            }

        ).done(function () {
            $('#task-wrapper .nav-tabs li:first-child').addClass('active');
            $('#task-wrapper .tab-content .tab-pane:first-child').addClass('active in');
        });

    }
    /*-------------- Get Current task End-----------------*/

    /*--------- Cards animation start ---------------*/

    $(document).on('click', 'div.card', function () {
        $(this).fadeOut(400, 'swing', function () {
            return $(this).appendTo('.card-container').hide();
        }).fadeIn(400, 'swing');
    });

    /*--------- Cards animation end ---------------*/


    /*------------------------ Custom scroll start --------------------*/
    (function ($) {
        $(window).on("load", function () {
            $("#scroll-wrap").mCustomScrollbar({
                autoHideScrollbar: true,
                //theme:"rounded"
                theme: "minimal-dark"
            });
        });
    })(jQuery);
    /*------------------------ Custom scroll End --------------------*/

});