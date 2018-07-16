const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8066 });
const logger = require('./libs/logger.js');
const http = require('http');

let msgOptions = {
  hostname: 'localhost',
  port: 8069,
  path: '/messages',
  method: 'PUT',
};

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  
  // data : {userId, content, msgdt}
  ws.on('message', function incoming(data) {
  
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        let parsedData = JSON.parse(data);

        // storage on db
        let putData = JSON.stringify({ message: parsedData.content, userId: parsedData.userId, timestamp: parsedData.msgdt });
        msgOptions.headers =
          {
            'Content-Type': 'application/json;charset=UTF-8',
            'Content-Length': Buffer.byteLength(putData),
          }
        var req = http.request(msgOptions);

        req.on('error', (e) => {
          logger.error(`Problem with request: ${e.message}`);
        });

        req.write(putData);
        req.end();

        client.send(data);
      }
    });
  });
});