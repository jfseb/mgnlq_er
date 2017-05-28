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
var debuglog = debug('erbase');
var debuglogV = debug('erbase');
var perflog = debug('perf');
var AnyObject = Object;
//import { IFModel as IFModel} from 'fdevsta_monmove';
var IMatch = require("./iferbase");
function makeError_NO_KNOWN_WORD(index, tokens) {
    if (index < 0 || index >= tokens.length) {
        throw Error("invalid index in Error construction " + index + "tokens.lenth=" + tokens.length);
    }
    return {
        err_code: IMatch.ERR_NO_KNOWN_WORD,
        text: "I do not understand \"" + tokens[index] + "\".",
        context: {
            tokens: tokens,
            token: tokens[index],
            index: index
        }
    };
}
exports.makeError_NO_KNOWN_WORD = makeError_NO_KNOWN_WORD;
function makeError_EMPTY_INPUT() {
    return {
        err_code: IMatch.ERR_EMPTY_INPUT,
        text: "I did not get an input.",
    };
}
exports.makeError_EMPTY_INPUT = makeError_EMPTY_INPUT;
function explainError(errors) {
    if (errors.length) {
        return "\n" + errors.map(function (err) { return err.text; }).join("\n");
    }
    return;
}
exports.explainError = explainError;

//# sourceMappingURL=ererror.js.map
