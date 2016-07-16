"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var observer = require('../observer');
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
    this.directionEl.innerHTML = [observer.direction, observer.position.z].join('<br />');
        // this.valueEl.innerHTML =  observer.position.z,observer.directionBuffer.getAverage();
}
