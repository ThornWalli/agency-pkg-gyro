"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var observer = require('../../../src/observer');
module.exports = Controller.extend({

    context: null,
    image: null,
    backgroundEl: null,
    width: null,

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {}
    }),


    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        this.targetModel.on('change:viewWidth', onChangeTargetViewWidth.bind(this));

        this.canvas = document.createElement('canvas');
        this.backgroundEl = this.queryByHook('background');
        observer.register(this.cid, onObserver.bind(this));

        onChangeTargetViewWidth.bind(this)(this.targetModel, this.targetModel.viewWidth);

        var scope = this;
        window.addEventListener('resize', global.animationFrame.throttle('agency-pkg-gyro-resize', function() {
            refreshSize(scope);
        }, function() {
            generateBackground(scope, scope.targetModel.viewWidth);
            scope.backgroundEl.style.background = 'url("' + scope.image + '") ' + observer.position.y * scope.width + 'px 0';
        }));

    }
});

function onObserver(observer) {
    this.backgroundEl.style.background = 'url("' + this.image + '") ' + observer.position.y * this.width + 'px 0';
}

function refreshSize(scope) {
    scope.width = scope.el.offsetWidth;
    scope.height = scope.el.offsetHeight;
    scope.canvas.width = scope.width;
    scope.canvas.height = scope.height;
}

function generateBackground(scope, viewWidth) {

    var canvas = scope.canvas;
    var context = canvas.getContext('2d');


    var backgroundWidth = scope.width * (viewWidth);
    // context.clearRect(0, 0, backgroundWidth.width, scope.height);
    context.rect(0, 0, backgroundWidth, scope.height);
      context.fillStyle = 'rgba(0,0,255,.1)';
      context.fill();
    scope.image = canvas.toDataURL();

}

function onChangeTargetViewWidth(model, viewWidth) {
    refreshSize(this);
    generateBackground(this, viewWidth);
}
