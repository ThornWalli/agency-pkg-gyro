"use strict";

var Segment = require('../base/HorizontalSegments/Segment');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');

module.exports = Segment.extend({
    modelConstructor: Segment.prototype.modelConstructor.extend(dataTypeDefinition, {
        session: {
            indicator: {
                type: 'object',
                default: null
            },
            offset: {
                type: 'number',
                required: true,
                default: 0.5
            }
        }
    }),

    initialize: function() {
        Segment.prototype.initialize.apply(this, arguments);
        this.model.on('change:width', onChangeWidth.bind(this));

        this.infoEl = this.queryByHook('info');
        this.barLeftEl = this.queryByHook('barLeft');
        this.barRightEl = this.queryByHook('barRight');

    },

    onActive: function(progress) {
        this.barLeftEl.style.width = (1 - Math.abs(progress)) * 50 + '%';
        this.barRightEl.style.width = (1 - Math.abs(progress)) * 50 + '%';

        if (progress >= -this.model.offset && progress <= this.model.offset) {
            this.el.classList.remove('out');
            this.el.classList.add('in');
        } else {
            this.el.classList.remove('in');
            this.el.classList.add('out');
        }

        var log = [];
        log.push('Index: ' + this.model.index);
        log.push(parseInt(progress*100)/100);
        this.infoEl.innerHTML = log.join('<br />');
    },
    onInactive: function() {
        this.barLeftEl.style.width = '0%';
        this.barRightEl.style.width = '0%';
    }
});

function onChangeWidth(model, width) {
    this.el.style.width = width * 100 + '%';
}
