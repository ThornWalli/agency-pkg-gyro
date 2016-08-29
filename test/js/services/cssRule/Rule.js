"use strict";

var AmpersandModel = require('ampersand-model');


module.exports = AmpersandModel.extend({

    props: {
        selector: {
            type: 'string',
            required: true,
            setOnce: true
        },
        style: {
            type: 'string',
            required: true,
            allowNull: true,
            default: function() {
                return null;
            }
        }
    },

    initialize: function() {
        AmpersandModel.prototype.initialize.apply(this, arguments);
    },

    serialize: function() {
        return {
            selector: this.name,
            style: this.style
        };
    },

    getStyleProperty: function(key) {
        return this.style[getPrefix(key)];
    },

    setStyle: function(key, value) {
        this.style[getPrefix(key)] = value;
    },
    style: function(style) {

        for (var key in style) {
            if (style.hasOwnProperty(key)) {
                this.style[getPrefix(key)] = style[key];
            }
        }
    }
});
