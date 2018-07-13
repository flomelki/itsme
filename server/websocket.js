#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('itsme.db');
const logger = require('./libs/logger.js');

var server = http.createServer(function (request, response) {
    logger.warn((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8066, function () {
    logger.warn((new Date()) + ' webSocket is listening on port 8066');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

/* Checks in database if user is allowed. 
	If not but already in database, asks to wait for permission
	If not and not in database, asks a username
	*/
function originIsAllowed(origin) {
    if (wsServer.autoAcceptConnections) return true;
    return origin === 'http://localhost:3000';
}

/*
   Step 1 : login
   Step 2 : returns user details
   Step 3 : returns last n messages
   Step 4 :
       Usercase 1 : loop to send any new message from other users
       Usercase  2 : record message from this user
*/
wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        logger.warn((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('itsme-protocol', request.origin);
    logger.trace((new Date()) + ' Connection accepted.');

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            let msg = JSON.parse(message.utf8Data);
            logger.debug(msg);
            connection.sendUTF(JSON.stringify({
                userId: msg.userId,
                content: msg.content,
                msgdt: msg.msgdt,
                // username: message.username,
            }));
        }
    });
    connection.on('close', function (reasonCode, description) {
        logger.trace((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});