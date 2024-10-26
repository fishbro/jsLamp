import tween, {update} from './modules/tween-light';

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

    new tween(valuesFrom)
        .to(valuesTo)
        // .yoyo()
        // .repeat(10)
        .onStart(() => {
            // console.log('start');
        })
        .onUpdate((values: Record<string, any>) =>  {
            lights.map((pin, key) => analogWrite(pin, values[key], null))
        })
        .onComplete(() =>  {
            // console.log('complete');
            valuesFrom = valuesTo;
            animate();
        })
        .start();
}

animate();

setInterval(() => update(),100);
