define([
    "less!stylesheets/dialog.less",
    "chat"
], function(chat) {
    var DialogView = require("views/dialogs/base");
    var box = require("core/box");

    var VideoChatDialog = DialogView.extend({
        className: "addon-videochat-dialog modal fade",
        templateLoader: "addon.videochat.templates",
        template: "dialog.html",
        events: _.extend({}, DialogView.prototype.events,{
            
        }),

        // Template Context
        templateContext: function() {
            return {
                
            };
        }
    });

    return VideoChatDialog;
});