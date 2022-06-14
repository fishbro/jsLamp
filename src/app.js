//libs
//const wifi = require("Wifi");
import tween from 'micro-tween';

//init lights
const lights = [
    D5,
    D18,
    D19,
    D21,
    D22,
    // D23
];

//ligts off
lights.map(function(light, index){
    light.write(false);
});


let valuesFrom = lights.map(() => Math.random());

const animate = () => {
    let valuesTo = lights.map(() => Math.random());

    tween(valuesFrom)
        .to(valuesTo)
        // .yoyo()
        // .repeat(10)
        .onStart(function() {
            // console.log('start');
        })
        .onUpdate(function(value) {
            lights.map((pin, key) => analogWrite(pin, value[key]))
        })
        .onComplete(function() {
            // console.log('complete');
            valuesFrom = valuesTo;
            animate();
        })
        .start();
}

animate();

setInterval(() => tween.update(),100);