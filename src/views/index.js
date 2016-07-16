"use strict";

var HorizontalSegments = require('../HorizontalSegments');
var observer = require('../observer');

module.exports = HorizontalSegments.extend({

    modelConstructor: HorizontalSegments.prototype.modelConstructor.extend({
        session: {
            selector: {
                type: 'string',
                required: true,
                default: '> .list > *'
            }
        }
    }),

    events: {
        'click .reset' : onClick
    },

    initialize: function() {
        HorizontalSegments.prototype.initialize.apply(this, arguments);
    }

});

function onClick(e) {
    e.preventDefault();
    observer.reset();
}
