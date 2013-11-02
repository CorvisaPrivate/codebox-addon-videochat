define([
    "chat",
    "less!stylesheets/dialog.less"
], function(chat) {
    var $ = require("jQuery");
    var DialogView = require("views/dialogs/base");
    var box = require("core/box");

    var VideoChatDialog = DialogView.extend({
        className: "addon-videochat-dialog modal fade",
        templateLoader: "addon.videochat.templates",
        template: "dialog.html",
        events: _.extend({}, DialogView.prototype.events,{
            "click a[data-collaborator]": "callCollaborator"
        }),

        // Template Context
        templateContext: function() {
            return {
                
            };
        },

        // Start a call
        callCollaborator: function(e) {
            e.preventDefault();
            var userId = $(e.currentTarget).data("collaborator");
            chat.call(userId);
            this.close();
        }
    });

    return VideoChatDialog;
});