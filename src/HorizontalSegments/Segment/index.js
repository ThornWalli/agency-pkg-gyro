"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var Bounds = require('agency-pkg-base/Bounds');
var observer = require('../../observer');

module.exports = Controller.extend({
    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {
            index: {
                type: 'number',
                required: true,
                default: -1
            },
            width: {
                type: 'number',
                required: true,
                default: 0
            },
            bounds: {
                type: 'Bounds',
                required: true,
                default: function() {
                    return new Bounds();
                }
            },
            offset: {
                type: 'number',
                required: true,
                default: 0.50
            }
        }
    }),

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);
        this.model.on('change:width', onChangeWidth.bind(this));
        observer.setup();
        observer.register(this.cid, onObserver.bind(this));

    },

    onActive: function() {},
    onInactive: function() {}
});

function onObserver(observer) {
    var progress = (((observer.position.z - this.model.index * this.model.width) / this.model.width));
    if (this.model.index === 0 && observer.position.z > 1 - this.model.width) {
        progress -= 1 / this.model.width;
    }
    if (progress > -1 && progress < 1) {
        this.onActive(progress);
    } else {
        this.onInactive(progress);
    }
}

function onChangeWidth(model, width) {
    var index = model.index;
    model.bounds.min.x = (index * width);
    model.bounds.max.x = ((index * width) + width);
}