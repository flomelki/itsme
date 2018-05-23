#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('itsme.db');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8066, function() {
    console.log((new Date()) + ' Server is listening on port 8066');
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
  return true;
}
 
 /*
	Step 1 : login
	Step 2 : returns user details
	Step 3 : returns last n messages
	Step 4 :
		Usercase 1 : loop to send any new message from other users
		Usercase  2 : record message from this user
 */
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        setInterval(function()
        {
            let r = Math.floor(Math.random() * 3 + 1);
            // console.log(r);
            connection.sendUTF(JSON.stringify({
                userId : r,
                msg : r,
                msgdt : Date.now(),
                username : 'johndoe'
                 }));
        }, 1000);

        // if (message.type === 'utf8') {
        //     console.log('Received Message: ' + message.utf8Data);
        //     connection.sendUTF(message.utf8Data);
        // }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

// wsServer.on('close', function()
// {
// 	db.close();
// })