//@ts-ignore
const tween = require('/node_modules/micro-tween/index');

//init lights
const lights: Pin[] = [
    D5,
    D18,
    D19,
    D21,
    D22,
    // D23
];

//ligts off
lights.map(function(light){
    light.write(false);
});
analogWrite(D23, 1, {soft:true});

let valuesFrom: number[] = lights.map(() => Math.random()/2);

const animate = () => {
    let valuesTo: number[] = lights.map(() => Math.random()/2);

    tween(valuesFrom)
        .to(valuesTo)
        // .yoyo()
        // .repeat(10)
        .onStart(function() {
            // console.log('start');
        })
        .onUpdate(function(value: number[]) {
            lights.map((pin, key) => analogWrite(pin, value[key], null))
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