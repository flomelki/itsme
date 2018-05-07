export default class Network
{
  static getAsyncRequest(url, callback)
  {
    var req = new XMLHttpRequest();

    req.open('GET', url, true);
    // req.setRequestHeader("Accept-Encoding", "gzip, deflate");

    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
       if(req.status == 200){
        if (callback)
        {
          callback(req.response);
        }
      }
      else{
        console.dir(req);
        console.dir(`erreur pendant le chargement de la page ${url}`);

      }
    }
  };
  req.send(null);
}

static putAsyncRequest(url, body, callback)
{
 var req = new XMLHttpRequest();
 req.open('PUT', url, true);
 req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

 req.onreadystatechange = function (aEvt) {
  if (req.readyState == 4) {
   if(req.status == 200){
    if (callback)
    {
      callback(req.response);
    }
  }
  else{
    console.dir(req);
    console.dir(`erreur pendant le chargement de la page ${url}`);
  }
}
};
req.send(body);   
}
}
