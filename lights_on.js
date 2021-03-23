//libs
const wifi = require("Wifi");
const animations = require('@amperka/animation');

//init lights
const lights = [
  D5,
  D18,
  D19,
  D21,
  D22
];

//ligts off
lights.map(function(light, index){
  light.write(false);
});

//init wifi --------
const ssid = 'hello_my_dear_stranger';
const password = '12345678';
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
//init wifi --------

//available memory fn's --------
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
//available memory fn's --------

//infinit random animation --------
function anim_queue (animFn, start){ //generate anim queue
  for(i=0; i < queue; i++){
    animFn.queue({
      to: (start != undefined)? start : Math.random()/1.5,
      duration: timer/1000,
    });
  }
}

function add_queue(anim) { //add new iteration
  anim._phase = anim._queue[queue].to;
  anim._queue = [{
    from: anim._queue[queue].to,
    to: Math.random()/1.5,
    duration: timer/1000,
    updateInterval: 0.1
  }];
  anim_queue(anim);
  anim.play();
}

const timer = 1000;
const queue = 1;
let is_animate = true;

const animations_queue = lights.map(light => { //create animation objects
  let anim = animations.create({
    from: 0,
    to: 1,
    duration: timer/1000,
    updateInterval: 0.3
  });
  
  anim.on('update', function(val) {
    analogWrite(light, val);
    if(anim._phase == 0){ //if animation ends generate new queue
      add_queue(anim);
    }
  });
  
  return anim;
});

animations_queue.map(anim => { //start animation
  anim_queue(anim);
  anim.play();
});
//infinit random animation --------