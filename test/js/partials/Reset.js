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
        'click': onClick
    },

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

    }

});

function onClick() {
    observer.reset(observer.AXIS.XY);
}
