'use strict';

var microTween = {exports: {}};

var linear$1 = function(k) {
    return k;
};

var tweens = [];

var loop$1 = {
    add: function(tween) {
        tweens.push(tween);
    },

    remove: function(tween) {
        var i = tweens.indexOf(tween);
        if (i !== -1) {
            tweens.splice(i, 1);
        }
    },

    update: function(time) {
        if (tweens.length === 0) { return false; }

        time = time || Date.now();

        var i = 0;
        while (i < tweens.length) {
            if (tweens[i].update(time)) {
                i++;
            } else {
                tweens.splice(i, 1);
            }
        }

        return true;
    }
};

var linear = linear$1;
var loop = loop$1;

microTween.exports = function tween(base) {
    var api = {};
    var object = base;
    var valuesStart = {};
    var valuesStartRepeat = {};

    var valuesEnd = {};
    var duration = 1000;
    var repeat = 0;
    var delayTime = 0;
    var yoyo;
    var isPlaying;
    var startTime;
    var easingFunction = linear;
    var onStartCallback;
    var onStartCallbackFired;
    var onUpdateCallback;
    var onCompleteCallback;
    var onStopCallback;

    // Set all starting values present on the target base
    for (var field in base) {
        valuesStart[field] = parseFloat(base[field], 10);
    }

    api.to = function(properties, ms) {
        if (ms) { duration = ms; }
        valuesEnd = properties;
        return api;
    };

    api.start = function(time) {
        loop.add(api);

        isPlaying = true;

        onStartCallbackFired = false;

        startTime = time || Date.now();
        startTime += delayTime;

        for (var property in valuesEnd) {
            valuesStart[property] = object[property];
            valuesStartRepeat[property] = valuesStart[property] || 0;
        }

        return api;
    };

    api.stop = function() {
        if (!isPlaying) { return api; }

        loop.remove(api);
        isPlaying = false;

        if (onStopCallback) {
            onStopCallback(object);
        }

        return api;
    };

    api.duration = function(ms) {
        duration = ms;
        return api;
    };

    api.delay = function(amount) {
        delayTime = amount;
        return api;
    };

    api.repeat = function(times) {
        repeat = times;
        return api;
    };

    api.yoyo = function(bool) {
        yoyo = bool === undefined ? true : !!bool;
        return api;
    };

    api.ease = function(fn) {
        easingFunction = fn;
        return api;
    };

    api.onStart = function(callback) {
        onStartCallback = callback;
        return api;
    };

    api.onUpdate = function(callback) {
        onUpdateCallback = callback;
        return api;
    };

    api.onComplete = function(callback) {
        onCompleteCallback = callback;
        return api;
    };

    api.onStop = function(callback) {
        onStopCallback = callback;
        return api;
    };

    api.update = function(time) {
        if (time < startTime) { return true; }

        if (!onStartCallbackFired) {
            if (onStartCallback) {
                onStartCallback(object);
            }

            onStartCallbackFired = true;
        }

        var elapsed = (time - startTime) / duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        var value = easingFunction(elapsed);

        var property;
        for (property in valuesEnd) {
            var start = valuesStart[property] || 0;
            var end = valuesEnd[property];

            object[property] = start + (end - start) * value;
        }

        if (onUpdateCallback) {
            onUpdateCallback(object);
        }

        if (elapsed === 1) {
            if (repeat > 0) {
                if (isFinite(repeat)) { repeat--; }

                // Reassign starting values, restart by making startTime = now
                for (property in valuesStartRepeat) {
                    if (yoyo) {
                        var tmp = valuesStartRepeat[property];
                        valuesStartRepeat[property] = valuesEnd[property];
                        valuesEnd[property] = tmp;
                    }

                    valuesStart[property] = valuesStartRepeat[property];
                }
                startTime = time + delayTime;

                return true;
            } else {
                if (onCompleteCallback) {
                    onCompleteCallback(object);
                }

                return false;
            }
        }

        return true;
    };

    return api;
};

microTween.exports.update = loop.update;

//@ts-ignore
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
lights.map(function (light) {
    light.write(false);
});
analogWrite(D23, 1, { soft: true });
let valuesFrom = lights.map(() => Math.random());
const animate = () => {
    let valuesTo = lights.map(() => Math.random());
    microTween.exports(valuesFrom)
        .to(valuesTo)
        // .yoyo()
        // .repeat(10)
        .onStart(function () {
        // console.log('start');
    })
        .onUpdate(function (value) {
        lights.map((pin, key) => analogWrite(pin, value[key], null));
    })
        .onComplete(function () {
        // console.log('complete');
        valuesFrom = valuesTo;
        animate();
    })
        .start();
};
animate();
setInterval(() => microTween.exports.update(), 100);
