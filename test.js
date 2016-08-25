"use strict";

var glob = require('glob');
var upath = require('upath');
require('colors');

[
    'test/tmpl/partials/**/*.hbs',
    'node_modules/*-pkg-*/**/*.hbs',
    // 'node_modules/agency-pkg-elements/**/*.hbs'
].forEach(function(filepath) {


    glob(filepath, {
        ignore: []
    }, function(er, files) {
        var mappedPartials = getMappedPartials(files);
        console.log('Map'.green.bold, mappedPartials);
    });


});


function getMappedPartials(files) {
    var partials = [],
        partial;
    files.forEach(function(path) {
        partial = {
            name: null,
            url: null,
            path: null,
            base: null,
            partials: []
        };
        partial.name = upath.basename(path).replace(upath.extname(path), '');
        partial.path = path.replace(upath.extname(path), '');
        partial.url = path;
        if (/node_modules/.test(path)) {
            // package
            partial.path = path.replace(/node_modules\//, '').replace(/\/index\.hbs/, '');
            partial.url = partial.url.replace(/node_modules\//, '');
        } else {
            // local
            partial.path = partial.path.replace(/test\/tmpl\/partials\//, '');
            partial.url = partial.url.replace(/test\/tmpl\//, '');
        }
        partial.base = upath.dirname(partial.path);
        partials.push(partial);
    });
    for (var i = 0; i < partials.length; i++) {
        partial = partials[i];
        if (partial.base !== '.') {

            var parentPartial = null;
            for (var j = 0; j < partials.length; j++) {
                if (partials[j].path === partial.base && partial.base !== '.') {
                    parentPartial = partials[j];
                }
            }
            if (!parentPartial) {
                parentPartial = {
                    name: upath.basename(upath.dirname(partial.path)),
                    url: null,
                    path: partial.base,
                    base: upath.dirname(partial.base),
                    partials: []
                };
                partials.push(parentPartial);
            }
            parentPartial.partials.push(partial);
        }
    }
    return partials.filter(function(partial) {
        if (partial.base === '.') {
            return true;
        }
    });
}
