"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var observer = require('../../../src/observer');
var cssRules = require('../services/cssRules');
var Enum = require('enum');

module.exports = Controller.extend({

    ruleName: null,
    cssRule: null,

    context: null,
    image: null,
    backgroundEl: null,
    width: null,

    AXIS: new Enum(['NONE', 'X', 'Y']),

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            axis: {
                type: 'string',
                required: true,
                default: function() {
                    return 'NONE';
                }
            },
            inverse: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            },
            debug: {
                type: 'boolean',
                required: true,
                default: function() {
                    return false;
                }
            },
            offsetX: {
                type: 'number',
                required: true,
                default: function() {
                    return 0;
                }
            },
            offsetY: {
                type: 'number',
                required: true,
                default: function() {
                    return 0;
                }
            }
        }
    }),


    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        if (this.AXIS.NONE.key !== this.model.axis) {

            this.ruleName = 'background-' + this.cid;
            this.cssRule = cssRules.addRule('.' + this.ruleName + ' > .background');
            this.el.classList.add(this.ruleName);

            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.debugEl = this.queryByHook('debug');
            this.backgroundEl = this.queryByHook('background');
            observer.register(this.cid, onObserver.bind(this));

            var scope = this;
            window.addEventListener('resize', global.animationFrame.throttle('agency-pkg-gyro-resize', function() {
                scope.refreshSize();
            }, function() {
                scope.renderBackground();
                onObserver.bind(scope)(observer);
            }));

        } else {
            console.error('Background need axis!');
        }

    },

    renderBackground: function() {
        this.onRenderBackgroundComplete();
    },

    refreshSize: function() {
        this.width = this.el.offsetWidth;
        this.height = this.el.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    clear: function() {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    onRenderBackgroundComplete:function (){
        this.cssRule.style.backgroundImage = 'url("' + this.image + '")';
    }

});

function onObserver(observer) {
    if (this.image) {

        var x = observer.position.x;
        if (this.model.offsetX !== 0) {
            x = this.model.offsetX + x;
        }
        var y = observer.position.y;
        if (this.model.offsetY !== 0) {
            y = this.model.offsetY + y;
        }
        x = this.model.inverse ? -x : x;
        y = this.model.inverse ? -y : y;


        switch (this.model.axis) {
            case this.AXIS.X.key:
                // this.cssRule.style.backgroundPosition = '0 ' + x * (this.canvas.height - this.height) + 'px';
                this.backgroundEl.style.cssText = 'background-position: 0 ' + x * (this.canvas.height) + 'px;';
                break;
            case this.AXIS.Y.key:
                // this.cssRule.style.backgroundPosition = (y * this.canvas.width) + 'px 0';
                this.backgroundEl.style.cssText = 'background-position: ' + (y * this.canvas.width) + 'px 0;';
                break;
        }
        if (this.debugEl) {
            this.debugEl.src = this.image;
        }


    }
}
