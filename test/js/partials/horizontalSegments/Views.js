"use strict";

var HorizontalSegments = require('../../../../src/base/HorizontalSegments');
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

    initialize: function() {
        HorizontalSegments.prototype.initialize.apply(this, arguments);
    }

});
