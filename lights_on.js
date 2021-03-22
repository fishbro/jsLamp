const wifi = require("Wifi");
const animations = require('@amperka/animation');

//init lights
const lights = [D5,D18,D19,D21,D22];
let lightsState = [];
lights.map(function(light, index){
  light.write(false);
  lightsState[index] = 0;
});

//init wifi
const ssid = 'hello_my_dear_stranger';
const password = '46554655';
const port = 80;
const index = require("Storage").read('index.html');

function processRequest (req, res) {
  let data = url.parse(req.url, true);
  console.log(data);
  
  if(data.query && data.query.on){
    lights[0].write(data.query.on === "true");
    res.writeHead(200);
    res.end('ok');
  }else{
    res.writeHead(200);
    res.end(index);
  }
}

wifi.startAP(ssid, {password: password}, function() {
    const http = require('http');
    http.createServer(processRequest).listen(port);

    console.log(`Web server running at http://${wifi.getAPIP().ip}:${port}`);
});

//available memory fn's
let memInterval = null;
function top(){
  memInterval = setInterval(function(){
    let mem = process.memory();
    console.log(
      `Free: ${mem.free*16/1024}Kb`, 
      `Usage: ${mem.usage*16/1024}Kb ( ${Math.round(mem.usage/((mem.free+mem.usage)/100))}% )`
    );
  }, 1000);
}
function q(){
 clearInterval(memInterval);
}

const timer = 1000;
let is_animate = true;

function transition(target, from, to, interval, callback){
  let anim = animations.create({
    from: from,
    to: to,
    duration: interval/1000,
    updateInterval: 0.1
  });
  
  anim.on('update', function(val) {
    analogWrite(target, val);
  });
  
  anim.play();
  
  setTimeout(function(){
    anim.stop();
    anim = undefined;
    
    if(callback === undefined) callback = function(){};
    callback(to);
  }, interval);
}

let promises = [];
let cycleAnim = () => {
  lights.map(function(light, index){
    promises[index] = new Promise((resolve, reject) => {
      transition(light, lightsState[index], Math.random()/2, timer, function(lastState){
        lightsState[index] = lastState;
        resolve(true);
      });
    });
  });
  
  Promise.all(promises).then(values => {
    if(is_animate){
      cycleAnim();
    }
  });
};

/*
let cycleAnim = () => {
  let promises = [];
  lights.map(function(light, index){
    promises[index] = () => {
      new Promise((resolve, reject) => {
        transition(light, lightsState[index], (Math.random()/2).toFixed(1), timer, function(lastState){
          lightsState[index] = lastState;
          resolve(true);
        });
      }).then(val => {
        if(is_animate){
          promises[index]();
        }
      });
    };
    promises[index]();
  });
};
*/

//top();
cycleAnim();
