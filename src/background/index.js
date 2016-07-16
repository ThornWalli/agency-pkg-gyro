"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var observer = require('../observer');
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

        this.backgroundEl = this.queryByHook('background');
        observer.register(this.cid, onObserver.bind(this));

        onChangeTargetViewWidth.bind(this)(this.targetModel, this.targetModel.viewWidth);
    }
});

function onObserver(observer) {
    this.backgroundEl.style.background = 'url("' + this.image + '") ' + observer.position.z * this.width + 'px 0';
}

function generateBackground(scope, viewWidth) {

    var width = scope.width = scope.el.offsetWidth;
    var height = scope.height = scope.el.offsetHeight;

    scope.canvas = document.createElement('canvas');
    scope.context = scope.canvas.getContext('2d');
    // scope.backgroundEl.appendChild(scope.canvas);


    scope.canvas.width = width;
    scope.canvas.height = height;
    var context = scope.context;
    var backgroundWidth = width * (viewWidth) - 2;
    // backgroundWidth -= scope.targetModel.offset;
    context.rect(1, 1, backgroundWidth, height - 2);
    context.stroke();

    scope.image = scope.canvas.toDataURL();

}

function onChangeTargetViewWidth(model, viewWidth) {
    generateBackground(this, viewWidth);
}
