const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8066 });
const logger = require('./libs/logger.js');
const http = require('http');

let putMsgOptions = {
  hostname: 'localhost',
  port: 8069,
  path: '/messages',
  method: 'PUT',
};

let getUserOptions =
{
  hostname: 'localhost',
  port: 8067,
  method: 'GET',
}

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

    logger.trace(`Incoming data : ${data}`)
    data = JSON.parse(data);

    // storage on db
    let putData = JSON.stringify({ message: data.message, userId: data.userid, timestamp: data.timestamp });
    putMsgOptions.headers =
      {
        'Content-Type': 'application/json;charset=UTF-8',
        'Content-Length': Buffer.byteLength(putData),
      }
    var putReq = http.request(putMsgOptions);

    putReq.on('error', (e) => {
      logger.error(`Problem with request: ${e.message}`);
    });

    putReq.write(putData);
    putReq.end();

    // user data retrieval
    getUserOptions.path = `/users/${data.userid}`;
    var getReq = http.request(getUserOptions, function (res) {
      res.setEncoding('utf8');
      res.on('data', chunk => {
        data.username = JSON.parse(chunk).username;
        logger.trace(data);

        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      })
    });

    getReq.on('error', (e) => {
      logger.error(`Problem with request: ${e.message}`);
    });

    getReq.end();


  });
});