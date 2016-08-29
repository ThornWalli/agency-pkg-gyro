"use strict";

var modernizr = require('modernizr');
var filter = require('lodash/filter');

var CSSRules = function() {
    generateStyleTag(this);
    generatePrefixes(this);
};
CSSRules.prototype.prefixes = {};
CSSRules.prototype.rules = [];
CSSRules.prototype.addRule = function addRule(selector) {
    var rule = generateRule(selector);
    if (this.stylesheet.addRule) {
        this.stylesheet.addRule(rule.selector, null, 0);
    } else {
        this.stylesheet.insertRule(rule.selector + ' { }', 0);
    }
    rule.style = this.getCssRule(rule.selector).style;
    this.rules.push(rule);
    return rule;
};
/**
 * @param string prefix
 * @return string
 */
CSSRules.prototype.getPrefix = function(prefix) {
    return this.prefixes[prefix];
};
/**
 * @param string selector
 * @return object
 */
CSSRules.prototype.getRule = function(selector) {
    return this.rules.find(function(rule) {
        if (rule.selector === selector) {
            return true;
        }
    });
};
/**
 * Get CSSStyleDeclaration for defined selector.
 * @param string selector
 * @return CSSStyleDeclaration
 */
CSSRules.prototype.getCssRule = function(selector) {
    var rules = this.stylesheet.rules || this.stylesheet.cssRules;
    return filter(rules, function(cssRule) {
        if (cssRule.type !== 5 && getSelector(cssRule) === selector) {
            return cssRule;
        }
    })[0];
};
/**
 * @param string selector
 * @return object
 */
function generateRule(selector) {
    return {
        selector: selector,
        style: null
    };
}
/**
 * @param CSSRules scope
 */
function generateStyleTag(scope) {
    var styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    document.querySelector('head').appendChild(styleTag);
    scope.stylesheet = styleTag.styleSheet || styleTag.sheet;
}
/**
 * @param CSSRules scope
 */
function generatePrefixes(scope) {
    var selector = '#generate-prefixes';
    if (scope.stylesheet.addRule) {
        scope.stylesheet.addRule(selector, null, 0);
    } else {
        scope.stylesheet.insertRule(selector + ' { }', 0);
    }
    var style = scope.getCssRule(selector).style;
    for (var key in style) {
        if (typeof style[key] !== 'function') {
            scope.prefixes[key] = modernizr.prefixed(key);
        }
    }
}
/**
 * @param CSSStyleDeclaration rule
 * @return string
 */
function getSelector(rule) {
    var selector = rule.selectorText || rule.name;
    return selector.replace(/\'/g, '"').toLowerCase();
}

module.exports = new CSSRules();
