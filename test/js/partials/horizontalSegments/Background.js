"use strict";

var Background = require('../Background');
module.exports = Background.extend({

    initialize: function() {
        Background.prototype.initialize.apply(this, arguments);
        if (this.targetModel) {
            this.targetModel.on('change:viewWidth', onChangeTargetViewWidth.bind(this));
            onChangeTargetViewWidth.bind(this)(this.targetModel, this.targetModel.viewWidth);
        } else {
            console.error('Background need target!');
        }
    },
    renderBackground: function() {
        var viewWidth = this.targetModel.viewWidth;
        var backgroundWidth = this.width * (viewWidth);
        this.context.rect(0, 0, backgroundWidth, this.height);
        this.context.fillStyle = 'rgba(0,0,255,.1)';
        this.context.fill();
        this.image = this.canvas.toDataURL();
        this.onRenderBackgroundComplete();
    }
});

function onChangeTargetViewWidth(model, viewWidth) {
    this.refreshSize();
    this.renderBackground(viewWidth);
}
