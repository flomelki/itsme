export default class Network {
  static getAsyncRequest(url, callback) {
    var req = new XMLHttpRequest();

    req.open('GET', url, true);

    req.onreadystatechange = function (aEvt) {
      if (req.readyState === 4) {
        manageResponse(req, callback);
      }
    };
    req.send(null);
  }

  static putAsyncRequest(url, body, callback) {
    var req = new XMLHttpRequest();
    req.open('PUT', url, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    req.onreadystatechange = function (aEvt) {
      if (req.readyState === 4) {
        manageResponse(req, callback);
      }
    }
    req.send(body);
  }

  static postAsyncRequest(url, body, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    req.onreadystatechange = function (aEvt) {
      if (req.readyState === 4) {
        manageResponse(req, callback);
      }
    }
    req.send(body);
  }
} // end export

function manageResponse(req, callback) {
  switch (req.status) {
    case (200):
      if (callback) callback({ status: 'ok', rawResponse: req.response === 'OK' ? '' : JSON.parse(req.response) })
      break;
    case (204):
      if (callback) callback({ status: 'nok' });
      break;
    default:
      console.dir(req);
      break;
  }
}