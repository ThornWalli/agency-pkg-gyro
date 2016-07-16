"use strict";

require('webvr-polyfill/src/main');
var Vector = require('agency-pkg-base/Vector');
var Buffer = require('../Buffer');

var Observer = function() {

    this.directionBuffer = new Buffer(4);

    if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(function(displays) {
            if (!displays.length) {
                //   VRSamplesUtil.addInfo("WebVR supported, but no VRDisplays found.");
                return;
            }
            var scope = this;

            var trigger_ = function() {
                var orientation = this.getPose().orientation;
                z = orientation[1];
                var value = z;

                value += 1;
                value /= 2;
                value -= 0.5;
                if (orientation[3] < 0) {
                    value = 1 - value;
                }
                if (orientation[3] > 0 && orientation[1] < 0 && value < 0) {
                    value = 1 + value;
                }
                if (value !== 0) {
                    value = 1 - value % 1;
                }
                var z = parseInt(value * 100) / 100;

                scope.directionBuffer.add(z);

                if (z > scope.directionBuffer.getAverage()) {
                    scope.direction = 'left';
                } else if (!(z === scope.directionBuffer.getAverage() && scope.direction === 'left')) {
                    scope.direction = 'right';
                }

                scope.position.setX(0).setY(0).setZ(z);
                trigger(scope);
            };
            for (var i = 0; i < displays.length; ++i) {
                global.animationFrame.addLoopListener('agency-pkg-gyro/Observer', trigger_.bind(displays[i]));
            }
        }.bind(this));
    } else {
        this.ready = false;
    }

};
Observer.prototype.position = new Vector(0, 0, 0);
Observer.prototype.directionBuffer = null;
Observer.prototype.direction = null;
Observer.prototype.ready = false;
Observer.prototype.callbacks = [];


Observer.prototype.test = function(callback) {
    callback(this.ready);
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

module.exports = Observer;
