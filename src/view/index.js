"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var Bounds = require('agency-pkg-base/Bounds');
var Vector = require('agency-pkg-base/Vector');
var observer = require('../observer');

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

        this.infoEl = this.queryByHook('info');
        this.barLeftEl = this.queryByHook('barLeft');
        this.barRightEl = this.queryByHook('barRight');
        observer.register(this.cid, onObserver.bind(this));

    },

    onActive: function(progress) {
        this.barLeftEl.style.width = (1 - Math.abs(progress)) * 50 + '%';
        this.barRightEl.style.width = (1 - Math.abs(progress)) * 50 + '%';

        if (progress >= -this.model.offset && progress <= this.model.offset) {
            this.barLeftEl.style.backgroundColor = 'green';
            this.barRightEl.style.backgroundColor = 'green';
        } else {
            this.barLeftEl.style.backgroundColor = 'red';
            this.barRightEl.style.backgroundColor = 'red';
        }

        var log = [];
        log.push('Index: ' + this.model.index);
        log.push(progress);
        log.push(Math.abs(progress));
        this.infoEl.innerHTML = log.join('<br />');
    },
    onInactive: function() {
        this.barLeftEl.style.width = '0%';
        this.barRightEl.style.width = '0%';
    }
});

function onObserver(observer) {

    var currentRange = observer.position.z;
    currentRange = (currentRange) % 1;

    var progress = (((observer.position.z - this.model.index * this.model.width) / this.model.width));
    if (this.model.index === 0 && observer.position.z > 1 - this.model.width) {
        progress -= 1 / this.model.width;
    }

    if (progress > -1 && progress < 1) {
        this.onActive(progress);
    } else {
        this.onInactive(progress);
    }


    // log.push(this.model.bounds.toString());
    // log.push(x);
    // log.push(observer.position.z - this.model.index * this.model.width);
    // log.push(this.model.bounds.min.x);
    //

    // this.barLeftEl

    // if (observer.position.z > this.model.bounds.max.x) {
    //
    //     // this.progress = (observer.position.z - this.model.bounds.max.x) / this.model.width;
    //
    // }
}

function onChangeWidth(model, width) {
    var index = model.index;
    this.el.style.width = width * 100 + '%';
    model.bounds.min.x = (index * width);
    model.bounds.max.x = ((index * width) + width);
}
