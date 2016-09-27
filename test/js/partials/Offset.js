"use strict";

var Controller = require('agency-pkg-base/Controller');
var DomModel = require('agency-pkg-base/DomModel');
var dataTypeDefinition = require('agency-pkg-base/dataTypeDefinition');
var observer = require('../../../src/observer');

module.exports = Controller.extend({

    modelConstructor: DomModel.extend(dataTypeDefinition, {
        session: {

        }
    }),

    events: {
        'click [type="button"]': onClick
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

    }

});

function onClick(e) {
    if (e.target.dataset.value) {
    observer.offset(0, parseFloat(e.target.dataset.value), 0);

    } else {
        observer.offset(0, parseFloat(this.queryByHook('offset').value), 0);
    }
}
