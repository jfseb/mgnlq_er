"use strict";
/**
 * @file word
 * @module jfseb.fdevstart.sentence
 * @copyright (c) Gerd Forstmann
 *
 * Word specific qualifications,
 *
 * These functions expose parf the underlying model,
 * e.g.
 * Match a tool record on a sentence,
 *
 * This will unify matching required and optional category words
 * with the requirements of the tool.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mgnlq_model_1 = require("mgnlq_model");
exports.Category = {
    CAT_CATEGORY: "category",
    CAT_DOMAIN: "domain",
    CAT_OPERATOR: "operator",
    CAT_FILLER: "filler",
    CAT_NUMBER: "number",
    CAT_TOOL: "tool",
    _aCatFillers: ["filler"],
    isDomain: function (sCategory) {
        return sCategory === exports.Category.CAT_DOMAIN;
    },
    isCategory: function (sCategory) {
        return sCategory === exports.Category.CAT_CATEGORY;
    },
    isFiller: function (sCategory) {
        return exports.Category._aCatFillers.indexOf(sCategory) >= 0;
    }
};
exports.Word = {
    isFiller: function (word) {
        return word.category === undefined || exports.Category.isFiller(word.category);
    },
    isCategory: function (word) {
        return exports.Category.isCategory(word.category);
    },
    isDomain: function (word) {
        if (word.rule && word.rule.wordType) {
            return word.rule.wordType === 'D' /* WORDTYPE_D */;
        }
        return exports.Category.isDomain(word.category);
    }
};
exports.WordType = {
    CAT_CATEGORY: "category",
    CAT_DOMAIN: "domain",
    CAT_FILLER: "filler",
    CAT_OPERATOR: "operator",
    CAT_TOOL: "tool",
    _aCatFillers: ["filler"],
    isDomain: function (sCategory) {
        return sCategory === exports.Category.CAT_DOMAIN;
    },
    isCategory: function (sCategory) {
        return sCategory === exports.Category.CAT_CATEGORY;
    },
    isFiller: function (sCategory) {
        return exports.Category._aCatFillers.indexOf(sCategory) >= 0;
    },
    fromCategoryString: function (sCategory) {
        if (sCategory == exports.Category.CAT_CATEGORY)
            return mgnlq_model_1.IFModel.WORDTYPE.CATEGORY;
        if (sCategory == exports.Category.CAT_OPERATOR)
            return mgnlq_model_1.IFModel.WORDTYPE.OPERATOR;
        if (sCategory == exports.Category.CAT_FILLER)
            return mgnlq_model_1.IFModel.WORDTYPE.FILLER;
        if (sCategory == exports.Category.CAT_NUMBER) {
            console.log("This is N? " + mgnlq_model_1.IFModel.WORDTYPE.NUMERICARG);
            return "N";
        }
        if (sCategory == exports.Category.CAT_DOMAIN)
            return mgnlq_model_1.IFModel.WORDTYPE.DOMAIN;
        if (sCategory == exports.Category.CAT_TOOL)
            return mgnlq_model_1.IFModel.WORDTYPE.TOOL;
        return undefined;
    }
};

//# sourceMappingURL=word.js.map
