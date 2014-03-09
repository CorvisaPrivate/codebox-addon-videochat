define([
    "holla",
    "less!stylesheets/chat.less"
], function(holla) {
    if (!holla.supported) {
        throw new Error("Video chat is not supported in this browser");
    }

    var $ = codebox.require("jQuery");
    var user = codebox.require("core/user");
    var dialogs = codebox.require("utils/dialogs");

    // Settings
    var settings = user.settings("videochat");

    // Create holla client
    var rtc = holla.createClient();

    // Create chat element
    var $chat = $("<div>", {
        "class": "addon-videochat"
    }).appendTo($("body"));
    var $videoMe = $("<video>", {
        'class': 'video-me',
        'autoplay': true,
        'muted': true
    }).appendTo($chat);
    var $videoThem = $("<video>", {
        'class': 'video-them',
        'autoplay': true
    }).appendTo($chat);
    var $hangup = $("<a>", {
        "class": "btn btn-hangup",
        "text": "Hang up",
        "click": function(e) {
            e.preventDefault();
        }
    }).appendTo($chat);

    // Change user settings
    var applySettings = function() {
        $chat.attr("class", "addon-videochat size-"+settings.get("size", "normal")+" position-"+settings.get("position", "right-bottom"));
    };
    settings.change(applySettings);
    applySettings();


    var showVideos = function() {
        $chat.show();
    };

    var hideVideos = function() {
        $chat.hide();
    };

    var bindCall = function(call) {
        call.ready(function(themstream) {
            holla.pipe(themstream, $videoThem);
        });
        call.on("hangup", function() {
            $videoThem.attr('src', '');
            hideVideos();
            call.releaseStream();
        });
        $hangup.click(function(){
            call.end();
        });
    };

    // Call an other user by its id
    var callUser = function(userId) {
        showVideos();

        holla.createFullStream(function(err, stream) {
            holla.pipe(stream, $videoMe);

            var call = rtc.call(userId);
            call.addStream(stream);

            bindCall(call);
            
            call.on("answered", function() {
                console.log("Remote user answered the call");
            });
            call.on("rejected", function() {
                call.end();
            });

            console.log("Calling ", call.user);
        });
    };

    rtc.register(user.get("userId"), function(worked) {
        rtc.on("call", function(call) {
            if (settings.get("state", "online") == "offline") {
                return call.decline();
            }
            
            dialogs.confirm("Inbound call from "+call.user+", accept ?").then(function() {
                showVideos();

                holla.createFullStream(function(err, stream) {
                    call.addStream(stream);
                    call.answer();
                    holla.pipe(stream, $videoMe);

                    bindCall(call);
                });
            }, function() {
                call.decline();
            });
        });
    });

    hideVideos();

    return {
        'call': callUser
    };
});