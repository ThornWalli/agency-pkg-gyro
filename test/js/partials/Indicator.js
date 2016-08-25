"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var observer = require('../../../src/observer');
module.exports = Controller.extend({
    modelConstructor: DomModel.extend(dataTypeDefinition, {}),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        this.bars = this.queryAllByHook('bar');
        if (this.targetModel) {
            this.targetModel.on('change:value', onTargetValueChange.bind(this));
        } else {
            observer.setup();
            observer.register('indicator-' + this.cid, function(observer) {
                this.render(observer.position.z);
            }.bind(this));
        }
    },

    render: function(width) {
        this.bars.forEach(function(bar) {
            bar.style.width = width * 100 + '%';
        });
    }

});

function onTargetValueChange(model, value) {
    this.render(value);
}
