"use strict";

var Background = require('../Background');
module.exports = Background.extend({

    position: null,

    modelConstructor: Background.prototype.modelConstructor.extend({
        session: {
            offsetY: {
                type: 'number',
                required: true,
                default: function() {
                    return 0;
                }
            }
        }
    }),
    initialize: function() {
        Background.prototype.initialize.apply(this, arguments);
        this.refreshSize();
    },
    refreshSize: function() {
        this.width = this.el.offsetWidth;
        this.height = this.el.offsetHeight;

        switch (this.model.axis) {
            case this.AXIS.Y.key:
                this.canvas.width = this.width * 4;
                this.canvas.height = this.height;
                this.model.offsetY = (this.width / 2) / (this.canvas.width);
                break;
            case this.AXIS.X.key:
                this.canvas.width = this.width;
                this.canvas.height = this.height * 4;
                this.model.offsetX = (this.height / 2) / (this.canvas.height);
                break;
        }

        console.log(this);
        this.clear();
        this.renderBackground();

    },
    renderBackground: function() {

        // var height = this.height * 2;
        var canvas = this.canvas;
        var context = canvas.getContext('2d');

        // var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var i;
        var strokeStyle = '#00ff00';
        var fillStyle = '#00ff00';
        switch (this.model.axis) {
            case this.AXIS.Y.key:

                context.beginPath();
                context.moveTo(0, centerY);
                context.lineTo(canvas.width, centerY);
                context.strokeStyle = strokeStyle;
                context.stroke();

                for (i = 0; i < 100; i++) {

                    if (i % 5 === 0) {
                        var x = ((i) / 100) * canvas.width;
                        context.beginPath();
                        context.moveTo(x, centerY);
                        context.lineTo(x, centerY + 10);
                        context.strokeStyle = strokeStyle;
                        context.stroke();
                        context.font = '30pt Calibri';
                        context.textAlign = 'center';
                        context.fillStyle = fillStyle;
                        context.fillText(i / 100 || ' ', x, centerY-10);
                        // context.fillText(i || ' ', canvas.width / 2 - x, centerY);

                    }
                }
                break;
            case this.AXIS.X.key:
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(0, canvas.height);
                context.strokeStyle = strokeStyle;
                context.stroke();
                for (i = 0; i < 100; i++) {
                    if (i % 5 === 0) {
                        var y = ((i) / 100) * canvas.height;
                        context.beginPath();
                        context.moveTo(0, y);
                        context.lineTo(0 + 64, y);
                        context.strokeStyle = strokeStyle;
                        context.stroke();
                        context.font = '30pt Calibri';
                        context.textAlign = 'left';
                        context.fillStyle = fillStyle;
                        context.fillText((100 - i) / 100 || ' ', 10, y - 10);

                    }
                }
                break;
        }



        this.image = canvas.toDataURL();
        this.onRenderBackgroundComplete();
    }

});
