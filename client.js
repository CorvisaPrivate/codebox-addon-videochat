define(["chat"], function(chat) {
    var commands = require("core/commands");
    var app = require("core/app");
    var dialogs = require("utils/dialogs");
    var settings = require("utils/settings");
    var search = require("core/search");
    var collaborators = require("core/collaborators");
    var user = require("core/user");

    // Add settings page
    settings.add({
        'namespace': "videochat",
        'section': "main",
        'title': "Video Chat",
        'defaults': {
            'state': "online",
            'psoition': "right-bottom",
            'size': "normal"
        },
        'fields': {
            'state': {
                'label': "State",
                'type': "select",
                'help': "If offline, collaborators will not be able to call you.",
                'options': {
                    'online': 'Online',
                    'offline': 'Offline'
                }
            },
            'position': {
                'label': "Position",
                'type': "select",
                'help': "Position for the videos during a call.",
                'options': {
                    'right-bottom': 'Right Bottom',
                    'right-top': 'Right Top',
                    'left-bottom': 'Left Bottom',
                    'left-top': 'Left Top'
                }
            },
            'size': {
                'label': "Size",
                'type': "select",
                'help': "Size of videos on screen.",
                'options': {
                    'small': 'Small',
                    'normal': 'Normal',
                    'large': 'Large'
                }
            }
        }
    });
    
    search.handler({
        'id': "videochat",
        'title': "Video chat with"
    }, function(query) {
        query = query.toLowerCase();
        
        return _.map(collaborators.filter(function(cuser) {
            return (cuser.get("name").toLowerCase().search(query) >= 0
            && user.get("userId") != cuser.get("userId"));
        }), function(user) {
            return {
                'text': user.get("name"),
                'image': user.avatar({size: 48}),
                'callback': function() {
                    dialogs.confirm("Do you want to call <b>"+_.escape(user.get("name"))+"</b>?").then(function() {
                        chat.call(user.get("userId"));
                    });
                }
            }
        });
    });
});