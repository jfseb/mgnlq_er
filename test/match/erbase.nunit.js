/**
 * @file inputFilter
 * @copyright (c) 2016-2016 Gerd Forstmann
 */


/* eslint-disable */

var process = require('process');
var root = (process.env.FSD_COVERAGE) ? '../../js_cov' : '../../js';

var debuglog = require('debug')('erbase.nunit');

const Erbase = require(root + '/match/erbase.js');

const Sentence = require(root + '/match/sentence.js');


const utils = require('abot_utils');

//const inputFiterRules = require(root + '/match/inputFilterRules.js');

const InputFilter = require(root + '/match/inputFilter.js');

const Model = require('mgnlq_model').Model;
const MongoUtils = require('mgnlq_model').MongoUtils;


var getModel = require('mgnlq_testmodel_replay').getTestModel;

/*
var mongoose = require('mongoose_record_replay').instrumentMongoose(require('mongoose'),
  'node_modules/mgnlq_testmodel_replay/mgrecrep/',
  'REPLAY');


function getRules() {
  return Model.loadModelsOpeningConnection(mongoose).then(
    (model) => {
      return Promise.resolve([model.rules, model.mongoHandle.mongoose]);
    }
  )
}
*/

function getRules() {
  return getModel().then(
    (model) => {
      return Promise.resolve([model.rules, model]);
    }
  )
}


function releaseRules(theModel) {
  Model.releaseModel(theModel);
}


process.on('unhandledRejection', function onError(err) {
  console.log('erbase.nunit.js');
  console.log(err);
  console.log(err.stack);
  throw err;
});


//var ptheModelHandle = Model.loadModelHandleP();


//var theModelX = theModel; // Model.loadModels('testmodel',true);


var words = {};

function setMockDebug() {
  var obj = function (s) {
    //console.log(s);
  };
  obj.enabled = true;
  Erbase.mockDebug(obj);
}
if (!debuglog.enabled) {
  setMockDebug();
}


exports.testEvaluteRangeRulesToPosition = function (test) {
  var tokens = ["ABC", "def"];
  var fusable = [false, true, false];

  var innerRule = {
    type: 0,
    matchedString: "AbC DeF",
    lowercaseword: "abc def",
    category: 'uboat',
    _ranking: 777
  };

  var categorizedWords = [
    [],
    [{
      word: "DEF", category: "irrelevant",
      _ranking: 111,
      rule: {
        range: {
          low: -1, high: 0,
          rule: innerRule
        }
      }
    }
    ]
  ];
  Erbase.evaluateRangeRulesToPosition(tokens, fusable, categorizedWords);
  test.deepEqual(categorizedWords, [[
    {
      string: "ABC def",
      matchedString: "AbC DeF",
      category: "uboat",
      _ranking: 777,
      span: 2,
      rule: innerRule
    }]
    , []
  ], 'correct moved and cleansed res');
  test.done();
}

var r = [
  { "category": "category", "matchedString": "fiori intent", "bitindex": 4, "word": "intent", "type": 0, "lowercaseword": "intent", "_ranking": 0.95, "range": { "low": -1, "high": 0, "rule": { "category": "category", "matchedString": "fiori intent", "type": 0, "word": "fiori intents", "bitindex": 4, "_ranking": 0.95, "lowercaseword": "fiori intents" } } },
  { "category": "category", "matchedString": "fiori intent", "bitindex": 4, "word": "intent", "type": 0, "lowercaseword": "intent", "_ranking": 0.95, "range": { "low": -1, "high": 0, "rule": { "category": "category", "matchedString": "fiori intent", "type": 0, "word": "fiori intent", "lowercaseword": "fiori intent", "bitindex": 4, "_ranking": 0.95 } } }];


exports.testEvaluteRangeRulesToPositionSloppyMatch = function (test) {
  var tokens = ["ABC", "duf"];
  var fusable = [false, true, false];

  var innerRule = {
    type: 0,
    matchedString: "AbC DeF",
    lowercaseword: "abc def",
    category: 'uboat',
    _ranking: 777
  };

  var categorizedWords = [
    [],
    [{
      word: "DEF", category: "irrelevant",
      _ranking: 111,
      rule: {
        range: {
          low: -1, high: 0,
          rule: innerRule
        }
      }
    }
    ]
  ];
  Erbase.evaluateRangeRulesToPosition(tokens, fusable, categorizedWords);
  test.deepEqual(categorizedWords, [[{
    string: 'ABC duf',
    rule:
    {
      type: 0,
      matchedString: 'AbC DeF',
      lowercaseword: 'abc def',
      category: 'uboat',
      _ranking: 777
    },
    matchedString: 'AbC DeF',
    category: 'uboat',
    _ranking: 748.8333685768661,
    levenmatch: 0.9637495091079358,
    span: 2
  }],
  []]
    , 'correct moved and cleansed res');
  test.done();
}



exports.testEvaluteRangeRulesToPositionVerySloppyMatch = function (test) {
  var tokens = ["XXX", "def"];
  var fusable = [false, true, false];

  var innerRule = {
    type: 0,
    matchedString: "AbC DeF",
    lowercaseword: "abc def",
    category: 'uboat',
    _ranking: 777
  };

  var categorizedWords = [
    [],
    [{
      word: "DEF", category: "irrelevant",
      _ranking: 111,
      rule: {
        range: {
          low: -1, high: 0,
          rule: innerRule
        }
      }
    }
    ]
  ];
  Erbase.evaluateRangeRulesToPosition(tokens, fusable, categorizedWords);
  test.deepEqual(categorizedWords, [[], []]);
  test.done();
}

//export function evaluateRangeRulesToPosition(tokens: string[], fusable : boolean[], categorizedWords : IMatch.ICategorizedStringRanged[][]) {


function simplifyStrings(res) {
  return res.map(function (r) {
    return r.map(word => { return word.string + '=>' + word.matchedString + '/' + word.category + (word.span ? '/' + word.span : '') })
  });
}

function simplifyStringsWithBitIndex(res) {
  return res.map(function (r) {
    return Sentence.simplifyStringsWithBitIndex(r);
    //  return r.map(word =>  { return word.string + '=>' +  word.matchedString + '/' + word.category + (word.span? '/' + word.span : '') + ` ${word.rule.wordType}${word.rule.bitindex}`})
  });
}

function simplifySentence(res) {
  return res.map(function (r) {
    return r.map(word => { return word.string + '=>' + word.matchedString + '/' + word.category + (word.span ? '/' + word.span : '') })
  });
}



var getRules2 = getRules;
var getRulesX = getRules;

var theModel = undefined;


/*

exports.group = {
  setup: function(callback) {
    Model.loadModelHandleP().then(
      (modelHandle) => {
        aModelHandle = modelHandle;
        theModel = aModelHandle.model;
        if(typeof callback === 'function') {
          callback();
        }
      }
    )
  },
  teardown : function(callback) {
    theModel = undefined;
    MongoUtils.disconnect(aModelHandle.mongoose);
  },
  */

exports.testTokenizeStringElNames = function (test) {
  getRules().then((args) => {
    var [rules, mongoose] = args;
    // debuglog(JSON.stringify(ifr, undefined, 2))
    //console.log(theModel.mRules);
    var res = Erbase.tokenizeString('elament names b', rules, words);
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.categorizedWords), [
      [],
      ['names=>element name/category C8',
        'names=>element name/category F16',
        'names=>element name/category C32'],
      ['b=>B/element symbol F8']
    ], ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};

exports.testTokenizeStringElNamesAlpha = function (test) {


  getRules().then((args) => {
    var [rules, mongoose] = args;

    // debuglog(JSON.stringify(ifr, undefined, 2))
    //console.log(theModel.mRules);
    var res = Erbase.tokenizeString('Alpha Cantauri B', rules, words);
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    //console.log(JSON.stringify(res));
    test.deepEqual(simplifyStrings(res.categorizedWords),
      [[], [], ['B=>B/element symbol']]
      , ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};


exports.testTokenizeTCodeGRM3 = function (test) {
  getRules().then((args) => {
    var [rules, mongoose] = args;
    // debuglog(JSON.stringify(ifr, undefined, 2))
    //console.log(theModel.mRules);
    var res = Erbase.tokenizeString(' Application Component, fiori intent, Backendcatalog for GRM3.', rules, words);
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    //console.log(JSON.stringify(res));
    test.deepEqual(simplifyStringsWithBitIndex(res.categorizedWords),
[ [ 'Application Component=>ApplicationComponent/category/2 C2',
    'Application Component=>ApplicationComponent/category/2 C4',
    'Application Component=>ApplicationComponent/category/2 F16' ],
  [ 'Component=>ApplicationComponent/category F16',
    'Component=>ApplicationComponent/category C2',
    'Component=>ApplicationComponent/category C4' ],
  [ 'fiori intent=>fiori intent/category/2 C2',
    'fiori intent=>fiori intent/category/2 C4',
    'fiori intent=>fiori intent/category/2 F16' ],
  [ 'intent=>fiori intent/category C2',
    'intent=>fiori intent/category C4',
    'intent=>fiori intent/category F16' ],
  [ 'Backendcatalog=>BackendCatalogId/category C4',
    'Backendcatalog=>BackendCatalogId/category F16' ],
  [ 'for=>for/filler I256' ],
  [ 'GRM3=>GRM3/appId F2',
    'GRM3=>GRM3/TransactionCode F2',
    'GRM3=>GRM3/TransactionCode F4' ] ]
      , ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};


exports.testTokenizeCategoriesIn = function (test) {
  getRules().then((args) => {
    var [rules, mongoose] = args;
    // debuglog(JSON.stringify(ifr, undefined, 2))
    //console.log(theModel.mRules);
    var res = Erbase.tokenizeString('categories in Fiori BOM', rules, words);
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    //console.log(JSON.stringify(res));
    test.deepEqual(simplifyStringsWithBitIndex(res.categorizedWords),
      [['categories=>category/category C16',
        'categories=>category/category F16',
        'categories=>category/category C128'],
      ['in=>In/element symbol F8', 'in=>in/filler I256'],
      ['Fiori BOM=>FioriBOM/domain/2 D2',
        'Fiori BOM=>FioriBOM/domain/2 F16'],
      []]
      , ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};

exports.testProcessStringCatDomainSynonym = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);

  getRules().then((args) => {
    var [rules, mongoose] = args;

    var s = 'categories in Fiori BOM';
    var res = Erbase.processString(s, rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
[ [ 'categories=>category/category C16',
    'in=>in/filler I256',
    'Fiori BOM=>FioriBOM/domain/2 F16' ],
  [ 'categories=>category/category F16',
    'in=>in/filler I256',
    'Fiori BOM=>FioriBOM/domain/2 F16' ] ],
      ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringAmbigQuery = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);

  getRules().then((args) => {
    var [rules, mongoose] = args;
    var s = 'ApplicationComponent, devclass, BackEndCatalogId for TransactionCode S_ALR_87012394 ';

    // debuglog(JSON.stringify(ifr, undefined, 2))
    //console.log(theModel.mRules);
    var restok = Erbase.tokenizeString(s, rules, words);
    debuglog('res > ' + JSON.stringify(restok, undefined, 2));
    //console.log(JSON.stringify(res));
    test.deepEqual(simplifyStringsWithBitIndex(restok.categorizedWords),
     [ [ 'ApplicationComponent=>ApplicationComponent/category C2',
    'ApplicationComponent=>ApplicationComponent/category C4',
    'ApplicationComponent=>ApplicationComponent/category F16' ],
  [ 'devclass=>devclass/category C4',
    'devclass=>devclass/category F16',
    'devclass=>devclass/category C64' ],
  [ 'BackEndCatalogId=>BackendCatalogId/category C4',
    'BackEndCatalogId=>BackendCatalogId/category F16' ],
  [ 'for=>for/filler I256' ],
  [ 'TransactionCode=>TransactionCode/category C2',
    'TransactionCode=>TransactionCode/category C4',
    'TransactionCode=>TransactionCode/category F16' ],
  [ 'S_ALR_87012394=>S_ALR_87012394/appId F2',
    'S_ALR_87012394=>S_ALR_87012394/TransactionCode F2',
    'S_ALR_87012394=>S_ALR_87012394/TransactionCode F4' ] ]
      , ' correct result ');


    var res = Erbase.processString(s, rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
    [ [ 'ApplicationComponent=>ApplicationComponent/category C4',
    'devclass=>devclass/category C4',
    'BackEndCatalogId=>BackendCatalogId/category C4',
    'for=>for/filler I256',
    'TransactionCode=>TransactionCode/category C4',
    'S_ALR_87012394=>S_ALR_87012394/TransactionCode F4' ] ],
      ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringAmbigQuery = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);

  getRules().then((args) => {
    var [rules, mongoose] = args;
    var s = 'ApplicationComponent, devclass, BackEndCatalogId for TransactionCode S_ALR_87012394 ';

    var res = Erbase.processString(s, rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
     Sentence.dumpNiceArr(res.sentences);
// test a number of Sentence
    res.sentences.forEach(s => {
      Sentence.dumpNice(s);
      Sentence.dumpNiceRuled(s);
      Sentence.dumpNiceBitIndexed(s);
      Sentence.simplifyStringsWithBitIndex(s);
    });

    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
    [ [ 'ApplicationComponent=>ApplicationComponent/category C4',
    'devclass=>devclass/category C4',
    'BackEndCatalogId=>BackendCatalogId/category C4',
    'for=>for/filler I256',
    'TransactionCode=>TransactionCode/category C4',
    'S_ALR_87012394=>S_ALR_87012394/TransactionCode F4' ] ],
      ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};

exports.testProcessStringelementNames = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);


  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('elaement names nickel ', rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));

    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
      [  /* [ 'elaement names=>element name/category/2 C64',
    'nickel=>nickel/element name C32' ], */
        ['elaement names=>element name/category/2 C8',
          'nickel=>nickel/element name F8']
      ]
      , ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringCatQuery1 = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);

  getRules().then((args) => {
    var [rules, mongoose] = args;

    var s = 'ApplicationComponent with ApplicaitonComponent W0052';
    var res = Erbase.processString(s, rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
      [['ApplicationComponent=>ApplicationComponent/category C2',
        'with=>with/filler I256',
        'ApplicaitonComponent=>ApplicationComponent/category C2',
        'W0052=>W0052/appId F2']],
      ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringCatQuery = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);

  getRules().then((args) => {
    var [rules, mongoose] = args;

    var s = 'SemanticObject, SemanticAction, BSPName, ApplicationComponent with ApplicaitonComponent CO-FIO,  appId W0052,SAP_TC_FIN_CO_COMMON';
    var res = Erbase.processString(s, rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
      [['SemanticObject=>SemanticObject/category C2',
        'SemanticAction=>SemanticAction/category C2',
        'BSPName=>BSPName/category C2',
        'ApplicationComponent=>ApplicationComponent/category C2',
        'with=>with/filler I256',
        'ApplicaitonComponent=>ApplicationComponent/category C2',
        'CO-FIO=>CO-FIO/ApplicationComponent F2',
        'appId=>appId/category C2',
        'W0052=>W0052/appId F2',
        'SAP_TC_FIN_CO_COMMON=>SAP_TC_FIN_CO_COMMON/TechnicalCatalog F2']],
      ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};


exports.testTokenizeStringStartingWith = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);


  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.tokenizeString('SemanticObject, SemanticAction with SemanticObject starting with Sup', rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));

    test.deepEqual(res.categorizedWords[4],
      [{
        string: 'starting with',
        matchedString: 'starting with',
        category: 'operator',
        rule:
        {
          category: 'operator',
          word: 'starting with',
          lowercaseword: 'starting with',
          type: 0,
          matchedString: 'starting with',
          bitindex: 256,
          bitSentenceAnd: 255,
          wordType: 'O',
          _ranking: 0.9
        },
        _ranking: 0.9,
        span: 2
      }]
      , ' correct result ');

    test.done();
    releaseRules(mongoose);
  });
};


exports.testProcessStringStartingWith = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);
  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('SemanticObject, SemanticAction with SemanticObject starting with Sup', rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));


    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
      [['SemanticObject=>SemanticObject/category C2',
        'SemanticAction=>SemanticAction/category C2',
        'with=>with/filler I256',
        'SemanticObject=>SemanticObject/category C2',
        'starting with=>starting with/operator/2 O256',
        'Sup=>Sup/any A4096'],
      ['SemanticObject=>SemanticObject/category C4',
        'SemanticAction=>SemanticAction/category C4',
        'with=>with/filler I256',
        'SemanticObject=>SemanticObject/category C4',
        'starting with=>starting with/operator/2 O256',
        'Sup=>Sup/any A4096'],
      ['SemanticObject=>SemanticObject/category F16',
        'SemanticAction=>SemanticAction/category F16',
        'with=>with/filler I256',
        'SemanticObject=>SemanticObject/category F16',
        'starting with=>starting with/operator/2 O256',
        'Sup=>Sup/any A4096']]
      , ' correct result ');
    test.deepEqual(res.sentences[0][5],
      {
        string: 'Sup',
        matchedString: 'Sup',
        category: 'any',
        rule:
        {
          category: 'any',
          word: 'Sup',
          lowercaseword: 'sup',
          type: 0,
          matchedString: 'Sup',
          exactOnly: true,
          bitindex: 4096,
          bitSentenceAnd: 4095,
          wordType: 'A',
          _ranking: 0.9
        },
        _ranking: 0.9
      }
      , ' correct result ');


    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringSameDistinct = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);


  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('element name with element name starting with ABC', rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));

    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
      [['element name=>element name/category/2 C8',
        'with=>with/filler I256',
        'element name=>element name/category/2 C8',
        'starting with=>starting with/operator/2 O256',
        'ABC=>ABC/any A4096'],
      ['element name=>element name/category/2 F16',
        'with=>with/filler I256',
        'element name=>element name/category/2 F16',
        'starting with=>starting with/operator/2 O256',
        'ABC=>ABC/any A4096'],
      ['element name=>element name/category/2 C32',
        'with=>with/filler I256',
        'element name=>element name/category/2 C32',
        'starting with=>starting with/operator/2 O256',
        'ABC=>ABC/any A4096'],
      ['element name=>element number/category/2 C8',
        'with=>with/filler I256',
        'element name=>element number/category/2 C8',
        'starting with=>starting with/operator/2 O256',
        'ABC=>ABC/any A4096'],
      ['element name=>element number/category/2 F16',
        'with=>with/filler I256',
        'element name=>element number/category/2 F16',
        'starting with=>starting with/operator/2 O256',
        'ABC=>ABC/any A4096']]
      , ' correct distinct result ');

    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringAsymmetric = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);


  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('element name, element number, element weight with element name starting with ABC', rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
    [ [ 'element name=>element name/category/2 C8',
    'element number=>element number/category/2 C8',
    'element weight=>atomic weight/category/2 C8',
    'with=>with/filler I256',
    'element name=>element name/category/2 C8',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ],
  [ 'element name=>element name/category/2 F16',
    'element number=>element number/category/2 F16',
    'element weight=>atomic weight/category/2 F16',
    'with=>with/filler I256',
    'element name=>element name/category/2 F16',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ],
  [ 'element name=>element number/category/2 C8',
    'element number=>element name/category/2 C8',
    'element weight=>atomic weight/category/2 C8',
    'with=>with/filler I256',
    'element name=>element number/category/2 C8',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ],
  [ 'element name=>element number/category/2 F16',
    'element number=>element name/category/2 F16',
    'element weight=>atomic weight/category/2 F16',
    'with=>with/filler I256',
    'element name=>element number/category/2 F16',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ] ]
      , ' correct distinct result ');

    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringAlmostSameWordDistinct = function (test) {
 /* test that "element names" and "element name" are suitably close to allow to eliminate distinct interpretations */

  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('element names, element number, element weight, \"element name\" with element name starting with \"ABC\"', rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
    [ [ 'element names=>element name/category/2 C8',
    'element number=>element number/category/2 C8',
    'element weight=>atomic weight/category/2 C8',
    'element name=>element name/category C8',
    'with=>with/filler I256',
    'element name=>element name/category/2 C8',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ],
  [ 'element names=>element name/category/2 F16',
    'element number=>element number/category/2 F16',
    'element weight=>atomic weight/category/2 F16',
    'element name=>element name/category F16',
    'with=>with/filler I256',
    'element name=>element name/category/2 F16',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ] ]

    , ' correct distinct result ');

    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringAlmostSameWordDistinctReverse = function (test) {
  /* test that "element names" and "element name" are suitably close to allow to eliminate distinct interpretations */

   getRules().then((args) => {
     var [rules, mongoose] = args;

     var res = Erbase.processString('element names, element number, element weight, element name with element name starting with \"ABC\"', rules, words);
     debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
     test.deepEqual(simplifyStringsWithBitIndex(res.sentences),

     [ [ 'element names=>element name/category/2 C8',
    'element number=>element number/category/2 C8',
    'element weight=>atomic weight/category/2 C8',
    'element name=>element name/category/2 C8',
    'with=>with/filler I256',
    'element name=>element name/category/2 C8',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ],
  [ 'element names=>element name/category/2 F16',
    'element number=>element number/category/2 F16',
    'element weight=>atomic weight/category/2 F16',
    'element name=>element name/category/2 F16',
    'with=>with/filler I256',
    'element name=>element name/category/2 F16',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ],
  [ 'element names=>element number/category/2 C8',
    'element number=>element name/category/2 C8',        // TODO: eliminate this here or later ( after querying?) as an alternative is present which is equivalent
    'element weight=>atomic weight/category/2 C8',
    'element name=>element number/category/2 C8',
    'with=>with/filler I256',
    'element name=>element number/category/2 C8',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ],
  [ 'element names=>element number/category/2 F16',
    'element number=>element name/category/2 F16',
    'element weight=>atomic weight/category/2 F16',
    'element name=>element number/category/2 F16',
    'with=>with/filler I256',
    'element name=>element number/category/2 F16',
    'starting with=>starting with/operator/2 O256',
    'ABC=>ABC/any A4096' ] ]
  , ' correct distinct result ');

    test.done();
    releaseRules(mongoose);
  });
};




exports.testProcessStringDistinctSourceWordsOK = function (test) {
  /* test that "aliases" are not removed if they are the *best* choice */

   getRules().then((args) => {
     var [rules, mongoose] = args;

     var res = Erbase.processString('element weight, atomic weight with element weight starting with \"ABC\"', rules, words);
     debuglog('\nres > ' + JSON.stringify(res, undefined, 2));
     test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
     [ [ 'element weight=>atomic weight/category/2 C8',
     'atomic weight=>atomic weight/category/2 C8',
     'with=>with/filler I256',
     'element weight=>atomic weight/category/2 C8',
     'starting with=>starting with/operator/2 O256',
     'ABC=>ABC/any A4096' ],
   [ 'element weight=>atomic weight/category/2 F16',
     'atomic weight=>atomic weight/category/2 F16',
     'with=>with/filler I256',
     'element weight=>atomic weight/category/2 F16',
     'starting with=>starting with/operator/2 O256',
     'ABC=>ABC/any A4096' ] ]
  , ' correct distinct result ');

    test.done();
    releaseRules(mongoose);
  });
};



exports.testProcessStringelementNamesSep = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);


  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('elaement,  names nickel ', rules, words);
    debuglog('\nres > ' + JSON.stringify(res, undefined, 2));

    test.deepEqual(simplifySentence(res.sentences),
      []
      , ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};




exports.testExpandEmtpy = function (test) {
  test.ok(1);
  var src = [
    [{ string: 'a', a: 1 },
    { string: 'b', a: 1 }],
    [],
    [{ string: '3', a: 1 }]
  ];
  var res = Erbase.expandTokenMatchesToSentences(['a', 'b', 'c'], src);
  test.deepEqual(res.sentences, []);
  test.done();
};

exports.testExpandNoBits = function (test) {
  test.ok(1);
  var src = [
    [{ string: 'a', a: 1 },
    { string: 'b', a: 1 }],
    [{ string: '3', a: 1 }, { string: 'c', a: 1 }]
  ];
  var res = Erbase.expandTokenMatchesToSentences(['a', 'b', 'c'], src);
  test.deepEqual(res.sentences, [[{ string: 'a', a: 1 }, { string: '3', a: 1 }],
  [{ string: 'b', a: 1 }, { string: '3', a: 1 }],
  [{ string: 'a', a: 1 }, { string: 'c', a: 1 }],
  [{ string: 'b', a: 1 }, { string: 'c', a: 1 }]]);
  test.done();
};

exports.testExpandWithBits = function (test) {
  test.ok(1);
  var src = [
    [{ string: 'a', a: 1, rule: { bitSentenceAnd: 0x02 } },
    { string: 'b', a: 1, rule: { bitSentenceAnd: 0x01 } }],
    [{ string: '3', a: 1, rule: { bitSentenceAnd: 0x02 } }, { string: 'c', a: 1, rule: { bitSentenceAnd: 0x01 } }]
  ];
  var res = Erbase.expandTokenMatchesToSentences2(['a', 'b', 'c'], src);
  test.deepEqual(res.sentences, [
    [{ string: 'a', a: 1, rule: { bitSentenceAnd: 2 } },
    { string: '3', a: 1, rule: { bitSentenceAnd: 2 } }],
    [{ string: 'b', a: 1, rule: { bitSentenceAnd: 1 } },
    { string: 'c', a: 1, rule: { bitSentenceAnd: 1 } }]]);
  test.done();
};



exports.testExpandSpan = function (test) {
  test.ok(1);
  var src = [
    [{ string: 'a', a: 1 },
    { string: 'a b', a: 1, span: 2 }],
    [],
    [{ string: '3', a: 1 }]
  ];
  var res = Erbase.expandTokenMatchesToSentences([], src);
  test.deepEqual(res.sentences, [
    [{ string: 'a b', a: 1, span: 2 }, { string: '3', a: 1 }]]);
  test.done();
};

exports.testExpandEmtpyErrors = function (test) {
  test.ok(1);
  var src = [
    [{ string: 'a', a: 1 },
    { string: 'xx', a: 1 }],
    [],
    [{ string: '3', a: 1 }]
  ];
  var res = Erbase.expandTokenMatchesToSentences(['a', 'b', 'c', 'd'], src);
  test.deepEqual(res.sentences, []);
  test.deepEqual(res.errors.length, 1);
  //console.log(JSON.stringify(res.errors,undefined,2));
  test.deepEqual(res.errors[0].context.token, 'b');
  test.done();
};


exports.testExpandEmtpy2Errors = function (test) {
  test.ok(1);
  var src = [
    [{ string: 'a', a: 1 },
    { string: 'b', a: 1 }],
    [],
    [],
    [{ string: '3', a: 1 }]
  ];
  var res = Erbase.expandTokenMatchesToSentences(['a', 'b', 'c', 'd', 'e'], src);
  test.deepEqual(res.sentences, []);
  test.deepEqual(res.errors.length, 2);
  test.deepEqual(res.errors[0].context.token, 'b');
  test.deepEqual(res.errors[1].context.token, 'c');
  test.done();
};


exports.testExpand0 = function (test) {
  test.ok(1);
  var src = [
    [{ string: 'a', a: 1 },
    { string: 'b', a: 1 }],
    [{ string: '1', a: 1 },
    { string: '2', a: 1 },
    { string: '3', a: 1 }]
  ];
  var res = Erbase.expandTokenMatchesToSentences([], src);
  test.deepEqual(res.sentences, [[{ string: 'a', a: 1 }, { string: '1', a: 1 }],
  [{ string: 'b', a: 1 }, { string: '1', a: 1 }],
  [{ string: 'a', a: 1 }, { string: '2', a: 1 }],
  [{ string: 'b', a: 1 }, { string: '2', a: 1 }],
  [{ string: 'a', a: 1 }, { string: '3', a: 1 }],
  [{ string: 'b', a: 1 }, { string: '3', a: 1 }]], 'correct result');
  test.done();
};


exports.testTokenizeStringOrbitBitFiltered = function (test) {

  getRules().then((args) => {
    var [rules, mongoose] = args;
    // debuglog(JSON.stringify(ifr, undefined, 2))
    //console.log(theModel.mRules);
    //console.log(theModel.rules.wordMap["of"]);
    //var augmentedRules = ErIndex.augmentedRules(theModel.rules);
    var res = Erbase.processString2('orbit of the earth', rules, {});
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    //console.log('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStrings(res.sentences), [
      ['orbit=>orbits/category',
        'of=>of/filler',
        'the=>the/filler',
        'earth=>earth/object name']], ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};





exports.testTokenizeStringOrbitEbase = function (test) {


  getRules().then((args) => {
    var [rules, mongoose] = args;

    // debuglog(JSON.stringify(ifr, undefined, 2))
    //console.log(theModel.mRules);
    var res = Erbase.processString('orbit of the earth', rules, words);
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    //console.log('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStrings(res.sentences), [

      /*  [ 'orbit=>orbits/category',
        'of=>of/filler',
        'the=>the/filler',
        'earth=>earth/element name' ], */
      ['orbit=>orbits/category',
        'of=>of/filler',
        'the=>the/filler',
        'earth=>earth/object name']], ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};

//var theModel2 = Model.loadModels('testmodel2',true);


exports.testCategorizeWordOffsetIntents = function (test) {


  getRules().then((args) => {
    var [rules, mongoose] = args;

    var token = "intents";
    var seenIt = InputFilter.categorizeAWordWithOffsets(token, rules, "intents 10", {}, {});
    debuglog(JSON.stringify(seenIt, undefined, 2));
    var filter = seenIt.filter(word => word.rule && word.rule.range && (word.rule.range.low === -1) && word.rule.range.high === 0);
    var filter2 = seenIt.filter(word => word.rule && !word.rule.range);
    //console.log(JSON.stringify(filter,undefined,2));
    test.equal(filter.length, 6, 'got four with range');
    test.equal(filter2.length, 3, ' got one plain');
    test.done();
    releaseRules(mongoose);
  });
}

exports.testCategorizeWordOffsetIntentsSloppy = function (test) {
  getRules().then((args) => {
    var [rules, mongoose] = args;


    var token = "intentss";
    var seenIt = InputFilter.categorizeAWordWithOffsets(token, rules, "intents 10", {}, {});
    debuglog(JSON.stringify(seenIt, undefined, 2));
    var filter = seenIt.filter(word => word.rule && word.rule.range && (word.rule.range.low === -1) && word.rule.range.high === 0);
    var filter2 = seenIt.filter(word => word.rule && !word.rule.range);
    //console.log(JSON.stringify(filter,undefined,2));
    test.equal(filter.length, 12, 'got eight with range');
    test.equal(filter2.length, 6, 'got two without');
    test.done();
    releaseRules(mongoose);
  });
}


exports.testCategorizeWordOffsetSemantic = function (test) {


  getRules2().then((args) => {
    var [rules, mongoose] = args;

    var token = "semantic";
    var seenIt = InputFilter.categorizeAWordWithOffsets(token, rules, "semantic objects", {}, {});
    debuglog(JSON.stringify(seenIt, undefined, 2));
    var filter = seenIt.filter(word => word.rule && word.rule.range);
    var filter2 = seenIt.filter(word => word.rule && !word.rule.range);
    //console.log(JSON.stringify(filter,undefined,2));
    test.equal(filter.length, 4, 'got two with range');
    test.equal(filter2.length, 0, 'got two without range');
    test.done();
    releaseRules(mongoose);
  });
}

exports.testProcessStringSemantic = function (test) {

  getRules2().then((args) => {
    var [rules, mongoose] = args;

    var token = "Semantic OBjects";
    // console.log("all" + JSON.stringify(rx, undefined,2));
    // console.log("wordmap: " + JSON.stringify(theModel2.rules.wordMap["element"]));
    var res = Erbase.processString('Semantic OBjects', rules, {});
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    //console.log('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
      [['Semantic OBjects=>SemanticObject/category/2 C2'],
      ['Semantic OBjects=>SemanticObject/category/2 F16']
      ], ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};

exports.testProcessStringOData = function (test) {
  // console.log("all" + JSON.stringify(rx, undefined,2));
  // console.log("wordmap: " + JSON.stringify(theModel2.rules.wordMap["element"]));
  /*
  var filtered = theModel2.rules.allRules.filter(rule => rule.type === 0 && rule.word.indexOf('services') === 0
  && rule.range);
  console.log(' filtered ' + JSON.stringify(filtered));
  console.log('wordmap' + JSON.stringify(theModel2.rules.wordMap['services']));

  */

  getRules2().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('OData Services for UI2SHellService', rules, {});
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    debuglog('res > ' + JSON.stringify(res.errors, undefined, 2));
    test.deepEqual(res.errors[0].text, 'I do not understand "UI2SHellService".', 'correct error message');
    //console.log('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStrings(res.sentences), [], ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};


exports.testProcessStringODataOK = function (test) {
  // console.log("all" + JSON.stringify(rx, undefined,2));
  // console.log("wordmap: " + JSON.stringify(theModel2.rules.wordMap["element"]));
  /*
  var filtered = theModel2.rules.allRules.filter(rule => rule.type === 0 && rule.word.indexOf('services') === 0
  && rule.range && rule.range.rule.matchedString.toLowerCase().indexOf('odata')>= 0);
  //console.log(' filtered ' + JSON.stringify(filtered));
  console.log('wordmap intent' + JSON.stringify(theModel2.rules.wordMap['intent']));
  var filtered2 = theModel2.rules.wordMap['intent'].rules.filter(rule => rule.type === 0 && rule.word.indexOf('intent') === 0
  && rule.range && rule.range.rule.matchedString.toLowerCase().indexOf('fiori')>= 0);
  console.log("filtered wordmap \n" + filtered2.map( (r,index) => '' + index + " " +  JSON.stringify(r)).join("\n"));
  */

  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('OData Services for fiori intent', rules, {});
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    debuglog('res > ' + JSON.stringify(res.errors, undefined, 2));

    //console.log('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStringsWithBitIndex(res.sentences),
      [['OData Services=>PrimaryODataServiceName/category/2 C2',
        'for=>for/filler I256',
        'fiori intent=>fiori intent/category/2 C2'],
      ['OData Services=>PrimaryODataServiceName/category/2 F16',
        'for=>for/filler I256',
        'fiori intent=>fiori intent/category/2 F16']
      ]
      , ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};



exports.testCategorizeWordOffset = function (test) {
  var token = "element";


  getRules().then((args) => {
    var [rules, mongoose] = args;

    var seenIt = InputFilter.categorizeAWordWithOffsets(token, rules, "element number 10", {}, {});
    debuglog(JSON.stringify(seenIt, undefined, 2));
    var filter = seenIt.filter(word => word.rule && (word.rule.range.low === 0) && word.rule.range.high === 1);
    //console.log(JSON.stringify(filter,undefined,2));
    test.equal(filter.length > 0, true);
    test.done();
    releaseRules(mongoose);
  });
}

exports.testprocessStringModel2 = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);


  getRules2().then((args) => {
    var [rules, mongoose] = args;

    var words = {};
    var rx = rules.allRules.filter(function (r) {
      return r.lowercaseword === "element";
    });
    // console.log("all" + JSON.stringify(rx, undefined,2));
    // console.log("wordmap: " + JSON.stringify(theModel2.rules.wordMap["element"]));
    var res = Erbase.processString('element number 10', rules, {});
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    //console.log('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStrings(res.sentences), [['element number=>element number/category/2',
      '10=>10/element number'],
    ['element number=>element name/category/2',
      '10=>10/element number']], ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};



exports.testTokenizeStringOrbitWhatis = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);

  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('orbit of the earth', rules, words);
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStrings(res.sentences),

      [ /*[ 'orbit=>orbits/category',
    'of=>of/filler',
    'the=>the/filler',
    'earth=>earth/element name' ], */
        ['orbit=>orbits/category',
          'of=>of/filler',
          'the=>the/filler',
          'earth=>earth/object name']]


      //  [ 'orbit of=>orbital period/category',
      //    'the=>the/filler',
      //    'earth=>earth/object name' ]

      //  [ 'orbit of the=>orbits/category', 'earth=>earth/element name' ],
      //  [ 'orbit of the=>orbits/category', 'earth=>earth/object name' ]
      , ' correct result ');
    test.done();
    releaseRules(mongoose);
  });
};

/*
exports.testProcessStringGovernmentType = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules);
  var res = Whatis.processString('"Communist state"', theModel2.rules, {});
  console.log("OBject.keys " + Object.keys(theModel2.rules));
  console.log("allrues " + JSON.stringify(theModel2.rules.allRules.filter(function(o) {
    return o.lowercaseword === "communist state";
  })));
  console.log(" here rule wormap exact: " + theModel2.rules.wordMap["communist state"]);
  debuglog('res > ' + JSON.stringify(res, undefined, 2));
  test.deepEqual(simplifyStrings(res.sentences),
  [ 'orbit of=>orbital period/category/2',
    'the=>the/filler',
    'earth=>earth/element name' ], ' correct exact match');
    test.done();
};
*/


exports.testTokenizeStringOrbitCompletelyNothingEbase = function (test) {
  // debuglog(JSON.stringify(ifr, undefined, 2))
  //console.log(theModel.mRules)

  getRules().then((args) => {
    var [rules, mongoose] = args;

    var res = Erbase.processString('orbit of Nomacthforthis the earth', rules, words);
    debuglog('res > ' + JSON.stringify(res, undefined, 2));
    test.deepEqual(simplifyStrings(res.sentences), []);
    test.deepEqual(res.errors[0].err_code, "NO_KNOWN_WORD");
    test.deepEqual(res.errors[0].text, "I do not understand \"Nomacthforthis\".");
    test.done();
    releaseRules(mongoose);
  });
};
