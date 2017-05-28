"use strict";
/**
 *
 * @module jfseb.fdevstart.analyze
 * @file erbase
 * @copyright (c) 2016 Gerd Forstmann
 *
 * Basic domain based entity recognition
 */
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var debuglog = debug('erindex');
var perflog = debug('perf');
var AnyObject = Object;
function mockDebug(o) {
    debuglog = o;
    perflog = o;
}
exports.mockDebug = mockDebug;

//# sourceMappingURL=erindex.js.map
