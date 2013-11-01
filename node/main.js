var holla = require('holla');

function setup(options, imports, register) {
    var logger = imports.logger.namespace("videochat");
    var rtc = holla.createServer(imports.server.http);
    logger.log("Webrtc server is running");

    // Register
    register(null, {});
}

// Exports
module.exports = setup;
