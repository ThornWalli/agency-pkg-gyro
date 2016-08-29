"use strict";

var Indicator = require('../Indicator');
module.exports = Indicator.extend({
    modelConstructor: Indicator.prototype.modelConstructor.extend({}),

    initialize: function() {
        Indicator.prototype.initialize.apply(this, arguments);
    }

});
