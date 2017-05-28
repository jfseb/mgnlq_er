/**
 * @file
 * @module word.nunit
 * @copyright (c) 2016 Gerd Forstmann
 */

var process = require('process');
var root = (process.env.FSD_COVERAGE) ? '../../js_cov' : '../../js';

//var debuglog = require('debug')('word.nunit');

const OpsWord = require(root + '/match/word.js');
const Word = OpsWord.Word;
//const Category = OpsWord.Category;

exports.testWordisCategory= function (test) {
  // prepare
  // act
  // check
  test.deepEqual(Word.isCategory({ category : 'category'}), true, ' first correct');
  test.deepEqual(Word.isCategory({ category : 'wiki'}), false, 'wiki is ');
  test.deepEqual(Word.isCategory({}), false, 'empty correct');
  test.done();
};

//const Category = OpsWord.Category;

exports.testWordisDomain= function (test) {
  // prepare
  // act
  // check
  test.deepEqual(Word.isDomain({ category : 'category'}), false, ' first correct');
  test.deepEqual(Word.isDomain({ category : 'domain'}), true, 'wiki is ');
  test.deepEqual(Word.isDomain({}), false, 'empty correct');
  test.done();
};

exports.testWordisFiller = function (test) {
  // prepare
  // act
  // check
  test.deepEqual(Word.isFiller({ category : 'category'}), false, 'category');
  test.deepEqual(Word.isFiller({ category : 'wiki'}), false, 'wiki');
  test.deepEqual(Word.isFiller({ category : 'filler'}), true, 'fillerrect');
  test.deepEqual(Word.isFiller({}), true, ' uncategorized is filler !');
  test.done();
};
