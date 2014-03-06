define(["chat"], function(chat) {
    var commands = codebox.require("core/commands/toolbar");
    var app = codebox.require("core/app");
    var dialogs = codebox.require("utils/dialogs");
    var settings = codebox.require("core/settings");
    var search = codebox.require("core/search");
    var collaborators = codebox.require("core/collaborators");
    var user = codebox.require("core/user");

    // Add settings page
    settings.add({
        'namespace': "videochat",
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
                'position': 0,
                'title': user.get("name"),
                'icons': {
                    'search': "video-camera"
                },
                'action': function() {
                    dialogs.confirm("Do you want to call <b>"+_.escape(user.get("name"))+"</b>?").then(function() {
                        chat.call(user.get("userId"));
                    });
                }
            }
        });
    });
});