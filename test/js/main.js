"use strict";

var js = require('agency-pkg-services/parser/js')(require('./packages'));


var Vector = require('agency-pkg-base/Vector');
var VectorBuffer = require('agency-pkg-base/VectorBuffer');

(function(){
    $(function() {
        js.parse();

        // vector buffer must be filled by rad values (-Math.PI - +Math.PI)
        var buffer = new VectorBuffer(4);

        buffer.add(new Vector().resetByAngle(-150));
        buffer.add(new Vector().resetByAngle(-160));
        buffer.add(new Vector().resetByAngle(-170));
        buffer.add(new Vector().resetByAngle(-180));
        var average1 = buffer.getAverage();
        console.log('Average from Buffer[-150,-160,-170,-180] should be -165', average1.angle());

        buffer.add(new Vector().resetByAngle(170));
        buffer.add(new Vector().resetByAngle(160));
        var average2 = buffer.getAverage();
        console.log('Average from Buffer[-170,-180,170,160] should be 175', average2.angle());

        console.log('TEST', average2.angleRelativeTo(average1));

        // get direction of rotation - comparing rads
        var v1 = new Vector();
        var v2 = new Vector();
        console.log('angle 0 -> 90 should be 90', v1.resetByRad(Math.PI/2).angleRelativeTo(v2.resetByRad(0)));
        console.log('angle 90 -> 0 should be -90', v1.resetByRad(0).angleRelativeTo(v2.resetByRad(Math.PI/2)));
        console.log('angle 340 -> 20 should be 40', v1.resetByAngle(20).angleRelativeTo(v2.resetByAngle(340)), v2.angle());
        console.log('angle 200 -> 160 should be -40', v1.resetByAngle(160).angleRelativeTo(v2.resetByAngle(200)));

    });
})();
