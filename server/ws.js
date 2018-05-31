const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8066 });
var sqlite3 = require('sqlite3').verbose();
const logger = require('./libs/logger.js');

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (/*client !== ws &&*/ client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});