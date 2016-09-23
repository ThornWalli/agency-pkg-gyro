"use strict";

global.WebVRConfig = {
    // Flag to disabled the UI in VR Mode.
    CARDBOARD_UI_DISABLED: false, // Default: false

    // Forces availability of VR mode, even for non-mobile devices.
    FORCE_ENABLE_VR: false, // Default: false.

    // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
    K_FILTER: 0.98, // Default: 0.98.

    // Flag to disable the instructions to rotate your device.
    ROTATE_INSTRUCTIONS_DISABLED: false, // Default: false.

    // How far into the future to predict during fast motion (in seconds).
    PREDICTION_TIME_S: 0.040, // Default: 0.040.

    // Flag to disable touch panner. In case you have your own touch controls.
    TOUCH_PANNER_DISABLED: true, // Default: false.

    // Enable yaw panning only, disabling roll and pitch. This can be useful
    // for panoramas with nothing interesting above or below.
    YAW_ONLY: false, // Default: false.

    // To disable keyboard and mouse controls, if you want to use your own
    // implementation.
    MOUSE_KEYBOARD_CONTROLS_DISABLED: false, // Default: false.

    // Prevent the polyfill from initializing immediately. Requires the app
    // to call InitializeWebVRPolyfill() before it can be used.
    DEFER_INITIALIZATION: true, // Default: false.

    // Enable the deprecated version of the API (navigator.getVRDevices).
    ENABLE_DEPRECATED_API: true, // Default: false.

    // Scales the recommended buffer size reported by WebVR, which can improve
    // performance.
    BUFFER_SCALE: 0.5, // Default: 0.5.

    // Allow VRDisplay.submitFrame to change gl bindings, which is more
    // efficient if the application code will re-bind its resources on the
    // next frame anyway. This has been seen to cause rendering glitches with
    // THREE.js.
    // Dirty bindings include: gl.FRAMEBUFFER_BINDING, gl.CURRENT_PROGRAM,
    // gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING,
    // and gl.TEXTURE_BINDING_2D for texture unit 0.
    DIRTY_SUBMIT_FRAME_BINDINGS: true // Default: false.
};
require('webvr-polyfill/src/main');
var Vector = require('agency-pkg-base/Vector');
var VectorBuffer = require('agency-pkg-base/VectorBuffer');
var Buffer = require('agency-pkg-base/Buffer');
var Enum = require('enum');

var Observer = function(withSetup) {
    this.resetOffset = false;
    this.position = new Vector(0, 0, 0);
    this.offset = new Vector(0, 0, 0);
    this.horizontalDirectionBuffer = new VectorBuffer(4);
    this.verticalDirectionBuffer = new Buffer(4);
    gyroCheck(function(hasGyro) {
        this.hasGyro = hasGyro;
        if (hasGyro) {
            document.querySelector('html').classList.add('js-has-gyro');
        } else {
            document.querySelector('html').classList.add('js-has-not-gyro');
        }
    }.bind(this));
    if (withSetup) {
        this.setup();
    }
};

Observer.prototype.AXIS = new Enum(['X', 'Y', 'Z', 'XY', 'XYZ']);
Observer.prototype.DIRECTION_TYPES = new Enum(['NONE', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM']);
Observer.prototype.position = null;
Observer.prototype.horizontalDirectionBuffer = null;
Observer.prototype.horizontalDirection = null;
Observer.prototype.verticalDirectionBuffer = null;
Observer.prototype.verticalDirection = null;
Observer.prototype.locked = false;
Observer.prototype.ready = false;
Observer.prototype.hasGyro = false;
Observer.prototype.callbacks = [];
Observer.prototype.offset = null;
Observer.prototype.lastPosition = {
    x: 0,
    y: 0
};

var directionVector = new Vector();
var directionVector2 = new Vector();
var lastYVal = null;


Observer.prototype.setup = function() {
    global.test = this;

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

                        var euler = quatToEuler({
                            x: orientation[0],
                            y: orientation[1],
                            z: orientation[2],
                            w: orientation[3]
                        });


                        // X
                        var x = euler.x;
                        x += Math.PI / 2;
                        x = (x / Math.PI);

                        // Y
                        var y = euler.y;
                        if (y < 0) {
                            y = 2 * Math.PI + y;
                        }
                        y = 1 - (y / Math.PI) / 2;

                        // Z
                        var z = euler.z;
                        z += Math.PI / 2;
                        z = (z / Math.PI);

                        scope.position.setX(x).setY(y).setZ(z);
                        if (scope.resetOffset) {
                            scope.offset.reset(0, 0, 0);
                            switch (scope.resetOffset) {
                                case scope.AXIS.X:
                                    scope.offset.setX(x);
                                    break;
                                case scope.AXIS.Y:
                                    scope.offset.setY(y);
                                    break;
                                case scope.AXIS.Z:
                                    scope.offset.setX(z);
                                    break;
                                case scope.AXIS.XY:
                                    scope.offset.setX(x);
                                    scope.offset.setY(y);
                                    break;
                                default:
                                    // XYZ
                                    scope.offset.reset(scope.position);
                                    break;

                            }
                            scope.resetOffset = false;
                        }
                        scope.position.subtractLocal(scope.offset);

                        scope.position.setX(scope.position.x % 1);
                        scope.position.setY((1 + scope.position.y) % 1);
                        scope.position.setZ(scope.position.z % 1);

                        scope.verticalDirectionBuffer.add(scope.position.x);
                        if (scope.position.x > scope.verticalDirectionBuffer.getAverage()) {
                            scope.verticalDirection = scope.DIRECTION_TYPES.BOTTOM;
                        } else if (scope.position.x < scope.verticalDirectionBuffer.getAverage()) {
                            scope.verticalDirection = scope.DIRECTION_TYPES.TOP;
                        } else {
                            scope.verticalDirection = scope.DIRECTION_TYPES.NONE;
                        }


                        // scope.horizontalDirectionBuffer.add(scope.position.y);
                        // if (scope.position.y > scope.horizontalDirectionBuffer.getAverage()) {
                        //     scope.horizontalDirection = scope.DIRECTION_TYPES.RIGHT;
                        // } else if (scope.position.y < scope.horizontalDirectionBuffer.getAverage()) {
                        //     scope.horizontalDirection = scope.DIRECTION_TYPES.LEFT;
                        // } else {
                        scope.horizontalDirection = scope.DIRECTION_TYPES.LEFT;
                        // }

                        //     console.log(euler.y , lastValY);
                        // if (euler.y !== lastValY) {
                        //     scope.horizontalDirectionBuffer.add(euler.y);
                        //     lastValY = euler.y;
                        // }
                        var direction = scope.horizontalDirectionBuffer.getAverage().angleRelativeTo(directionVector2.resetByRad(euler.y));
                        scope.horizontalDirectionBuffer.add(new Vector().resetByRad(euler.y));

                            scope.horizontalDirection = scope.DIRECTION_TYPES.NONE;
                        if (direction < 0) {
                            scope.horizontalDirection = scope.DIRECTION_TYPES.LEFT;
                        } else if (direction > 0) {
                            scope.horizontalDirection = scope.DIRECTION_TYPES.RIGHT;
                        }
                        // if (scope.horizontalDirectionBuffer.getAverage().angle() !== 0) {
                        // console.log('BAAAAm', euler.y, scope.horizontalDirectionBuffer.getAverage().angle());
                        // }


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
Observer.prototype.reset = function(axis) {

    this.resetOffset = axis || true;
};
Observer.prototype.register = function(name, callback) {
    this.callbacks.push({
        name: name,
        cb: callback
    });
};


function quatToEuler(q1) {
    var pitchYawRoll = {};
    var sqw = q1.w * q1.w;
    var sqx = q1.x * q1.x;
    var sqy = q1.y * q1.y;
    var sqz = q1.z * q1.z;
    var unit = sqx + sqy + sqz + sqw;
    var test = q1.x * q1.y + q1.z * q1.w;
    var heading, attitude, bank;
    if (test > 0.499 * unit) {
        heading = 2 * Math.atan2(q1.x, q1.w);
        attitude = Math.PI / 2;
        bank = 0;
        return;
    }
    if (test < -0.499 * unit) {
        heading = -2 * Math.atan2(q1.x, q1.w);
        attitude = -Math.PI / 2;
        bank = 0;
        return;
    } else {
        heading = Math.atan2(2 * q1.y * q1.w - 2 * q1.x * q1.z, sqx - sqy - sqz + sqw);
        attitude = Math.asin(2 * test / unit);
        bank = Math.atan2(2 * q1.x * q1.w - 2 * q1.y * q1.z, -sqx + sqy - sqz + sqw);
    }
    pitchYawRoll.z = Math.floor(attitude * 1000) / 1000;
    pitchYawRoll.y = Math.floor(heading * 1000) / 1000;
    pitchYawRoll.x = Math.floor(bank * 1000) / 1000;
    return pitchYawRoll;
}

function trigger(scope) {
    scope.lastPosition.x = scope.position.x;
    scope.lastPosition.y = scope.position.y;
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
