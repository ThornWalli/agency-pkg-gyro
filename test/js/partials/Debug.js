"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var observer = require('../../../src/observer');
module.exports = Controller.extend({
    modelConstructor: DomModel.extend(dataTypeDefinition, {}),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        this.directionEl = this.queryByHook('direction');
        this.valueEl = this.queryByHook('value');
        observer.register('test', onObserver.bind(this));
    }
});

function onObserver(observer) {
    this.directionEl.innerHTML = [
        'Direction Horizontal: ' + observer.horizontalDirection.key,
        (Math.ceil(observer.position.y * 100) / 100),
        'Direction Vertical: ' + observer.verticalDirection.key, (Math.ceil(observer.position.x * 100) / 100)
        // ,(Math.ceil(observer.position.z * 100) / 100)
    ].join('<br />');
}
