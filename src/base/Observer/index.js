"use strict";

global.WebVRConfig = {
    DEFER_INITIALIZATION: true
};
require('webvr-polyfill/src/main');
var Vector = require('agency-pkg-base/Vector');
var Buffer = require('../Buffer');
var Enum = require('enum');

var Observer = function() {

    this.resetOffset = false;
    this.position = new Vector(0, 0, 0);
    this.offset = new Vector(0, 0, 0);
    this.horizontalDirectionBuffer = new Buffer(4);
    gyroCheck(function (hasGyro) {
        this.hasGyro = hasGyro;
        if (hasGyro) {
            document.querySelector('html').classList.add('js-has-gyro');
        } else {
            document.querySelector('html').classList.add('js-has-not-gyro');
        }
    }.bind(this));
};
Observer.prototype.DIRECTION_TYPES = new Enum(['NONE', 'LEFT', 'RIGHT']);
Observer.prototype.position = null;
Observer.prototype.horizontalDirectionBuffer = null;
Observer.prototype.horizontalDirection = null;
Observer.prototype.locked = false;
Observer.prototype.ready = false;
Observer.prototype.hasGyro = false;
Observer.prototype.callbacks = [];
Observer.prototype.offset = null;
Observer.prototype.setup = function() {
    if (!this.ready) {
        global.InitializeWebVRPolyfill();
        if (global.navigator.getVRDisplays) {
            global.navigator.getVRDisplays().then(function(displays) {
                if (!displays.length) {
                    //   VRSamplesUtil.addInfo("WebVR supported, but no VRDisplays found.");
                    return;
                }
                var scope = this;

                var trigger_ = function() {
                    if (!scope.locked) {
                        var orientation = this.getPose().orientation;
                        var z = orientation[1];
                        if (z > scope.horizontalDirectionBuffer.getAverage()) {
                            scope.horizontalDirection = scope.DIRECTION_TYPES.RIGHT;
                        } else if (!(z === scope.horizontalDirectionBuffer.getAverage() && scope.horizontalDirection === scope.DIRECTION_TYPES.RIGHT)) {
                            scope.horizontalDirection = scope.DIRECTION_TYPES.LEFT;
                        }
                        scope.position.setX(0).setY(0).setZ(z);
                        if (scope.resetOffset) {
                            scope.offset.reset(scope.position);
                            scope.resetOffset = false;
                        }
                        scope.position.subtractLocal(scope.offset);
                        scope.position.setX((1 + scope.position.x) % 1);
                        scope.position.setY((1 + scope.position.y) % 1);
                        scope.position.setZ((1 + scope.position.z) % 1);

                        trigger(scope);
                    }
                };
                for (var i = 0; i < displays.length; ++i) {
                    global.animationFrame.addLoopListener('agency-pkg-gyro/Observer', trigger_.bind(displays[i]));
                }
            }.bind(this));
        }

        this.ready = true;
    }
};
Observer.prototype.reset = function() {
    this.resetOffset = true;
};
Observer.prototype.register = function(name, callback) {
    this.callbacks.push({
        name: name,
        cb: callback
    });
};

function trigger(scope) {
    scope.callbacks.forEach(function(callback) {
        callback.cb(scope);
    });
}

function gyroCheck(callback) {
    function handler(event) {
        var hasGyro = typeof event.alpha === 'number' &&
            typeof event.beta === 'number' &&
            typeof event.gamma === 'number';
        window.removeEventListener('deviceorientation', handler, false);
        callback(hasGyro);
    }
    window.addEventListener('deviceorientation', handler, false);
}

module.exports = Observer;
