/*
var  on = false;
setInterval(function() {
  on = !on;
  D5.write(on);
}, 500);
*/

D5.write(false);
var wifi = require("Wifi");
var ssid = 'hello_my_dear_stranger';
var password = '46554655';
var port = 80;
var index = require("Storage").read('index.html');

function processRequest (req, res) {
  var data = url.parse(req.url, true);
  console.log(data);
  
  if(data.query && data.query.on){
    D5.write(data.query.on === "true");
    res.writeHead(200);
    res.end('ok');
  }else{
    res.writeHead(200);
    res.end(index);
  }
}

wifi.startAP(ssid, {password: password}, function() {

    var http = require('http');
    http.createServer(processRequest).listen(port);

    console.log(`Web server running at http://${wifi.getAPIP().ip}:${port}`);
});

setInterval(
  function(){
    var mem = process.memory();
    console.log(`Free: ${mem.free*16/1024}Kb`, `Usage: ${mem.usage*16/1024}Kb ( ${Math.round(mem.usage/(mem.free/100))}% )`);
  }, 1000
);