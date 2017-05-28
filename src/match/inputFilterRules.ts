

import * as xinputFilter from './inputFilter';
import * as IMatch from './iferbase';

import { IFModel as IFModel } from 'mgnlq_model';
import { Model } from 'mgnlq_model';


export const oKeyOrder: Array<String> = ["systemObjectCategory", "systemId", "systemObjectId"];

var mUnitTestURLMap = {};

var aregex = /\/([^/]*).qunit.html/;


var mRuleArray: Array<IFModel.mRule>;

export function compareMRuleFull(a: IFModel.mRule, b: IFModel.mRule) {
  var r = a.category.localeCompare(b.category);
  if (r) {
    return r;
  }
  r = a.type - b.type;
  if (r) {
    return r;
  }
  if (a.matchedString && b.matchedString) {
    r = a.matchedString.localeCompare(b.matchedString);
    if (r) {
      return r;
    }
  }
  if (a.word && b.word) {
    var r = a.word.localeCompare(b.word);
    if(r) {
      return r;
    }
  }
  r = (a._ranking || 1.0) - (b._ranking || 1.0);
  if(r) {
    return r;
  }
  if(a.exactOnly && !b.exactOnly) {
    return -1;
  }
  if(b.exactOnly && !a.exactOnly) {
    return +1;
  }
  return 0;
}

export function cmpMRule(a: IFModel.mRule, b: IFModel.mRule) {
  var r = a.category.localeCompare(b.category);
  if (r) {
    return r;
  }
  r = a.type - b.type;
  if (r) {
    return r;
  }
  if (a.matchedString && b.matchedString) {
    r = a.matchedString.localeCompare(b.matchedString);
    if (r) {
      return r;
    }
  }
  if (a.word && b.word) {
    return a.word.localeCompare(b.word);
    /*
    if(r) {
      return r;
    }*/
  }
  r = (a._ranking || 1.0) - (b._ranking || 1.0);
  if(r) {
    return r;
  }
  return 0;
  /*
  if(a.exactOnly && !b.exactOnly) {
    return -1;
  }
  if(b.exactOnly && !a.exactOnly) {
    return +1;
  }*/

}

export function getIntMRulesSample(): Array<IFModel.mRule> {
  var mRules = [] as Array<IFModel.mRule>;
  mRules = mRules.concat([
    // a generic rule for any id
    {
      type: IFModel.EnumRuleType.REGEXP,
      category: "systemObjectId",
      regexp: /^\S+$/i,
      bitindex : 0x01,
      bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.5
    },
    {
      type: IFModel.EnumRuleType.REGEXP,
      category: "fiori catalog",
      regexp: /^[A-Z0-9a-z_\/]+$/i,
      bitindex : 0x01,
         bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.5
    },
    {
      type: IFModel.EnumRuleType.REGEXP,
      category: "client",
      regexp: /^\d{3,3}$/i,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.8
    },
    {
      type: IFModel.EnumRuleType.REGEXP,
      category: "systemId",
      regexp: /^[A-Z][A-Z0-9][A-Z0-9]$/i,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.7
    },
    {
      type: IFModel.EnumRuleType.WORD,
      category: "systemId",
      word: "UV2",
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      matchedString: "UV2"
    },
    {
      type: IFModel.EnumRuleType.REGEXP,
      category: "transaction",
      regexp: /^[A-Z][A-Z0-9_]{3,3}$/i,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.7
    },
    {
      type: IFModel.EnumRuleType.REGEXP,
      category: "fiori catalog",
      regexp: /^SAP_BC[A-Z][A-Z0-9_]*$/,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.85
    },
    {
      type: IFModel.EnumRuleType.REGEXP,
      category: "fiori catalog",
      regexp: /^SAP_TC[A-Z][A-Z0-9_]*$/,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.85
    },
    // a few unit tests
    {
      category: "unit test",
      matchedString: "NavTargetResolution",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "NavTargetResolution"
    },
    {
      category: "unit test",
      matchedString: "NavTargetResolutionAdapter",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "NavTargetResolutionAdapter"
    },
    // a few unit tests
    {
      category: "wiki",
      matchedString: "UI2 Integration",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "UI2 Integration"
    },
    {
      category: "wiki",
      matchedString: "UI2 Support pages",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "UI2 Support pages"
    },
    // categories of this model
    {
      category: "category",
      matchedString: "wiki",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "wiki",
    },
    {
      category: "category",
      matchedString: "unit test",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "unit test",
    },
    {
      category: "category",
      matchedString: "url",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "url",
    },
    {
      category: "category",
      matchedString: "transaction",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "transaction",
    },
    {
      category: "category",
      matchedString: "transaction",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "ta",
    },
    {
      category: "category",
      matchedString: "fiori catalog",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "fiori catalog",
    },
    {
      category: "category",
      matchedString: "fiori catalog",
      type: 0,
      _ranking: 0.8,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "catalog",
    },
    {
      category: "category",
      matchedString: "systemId",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "system",
    },
    {
      category: "category",
      matchedString: "client",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "client",
    },
    // tools of the sample model
    {
      category: "tool",
      matchedString: "FLPD",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "flpd",
    },
    {
      category: "operator",
      matchedString: "starts with",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "starting with",
    },
    {
      category: "tool",
      matchedString: "FLP",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "flp",
    },
    {
      category: "tool",
      matchedString: "FLP",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "Fiori Launchpad",
    },
    {
      category: "tool",
      matchedString: "wiki",
      type: 0,
      bitindex : 0x01,   bitSentenceAnd : 0x01,
      wordType : "F",
      word: "wiki",
    },

    // fillers
    // tools of the sample model
    {
      category: "filler",
      type: 1,
      regexp: /^((start)|(show)|(from)|(in))$/i,
      matchedString: "filler",
      bitindex : 0x02,   bitSentenceAnd : 0x01,
      wordType : "F",
      _ranking: 0.9
    },
  ]
  );
  var mRules = assureLowerCaseWord(mRules);
  return mRules.sort(cmpMRule);
}


export function getMRulesSample(): IMatch.SplitRules {
  return Model.splitRules(getIntMRulesSample());
}


export function assureLowerCaseWord(mRules: Array<IFModel.mRule>) {
  return mRules.map(function (oRule) {
    if (oRule.type === IFModel.EnumRuleType.WORD) {
      oRule.lowercaseword = oRule.word.toLowerCase();
    }
    return oRule;
  });
}

export function getUnitTestUrl(string: string) {
  return mUnitTestURLMap[string];
}

export function getWikiUrl(string: string) {
  // TODO
  return mUnitTestURLMap[string];
}


export function getMRulesFull(): IMatch.SplitRules {
  var mRules = getIntMRulesSample();
  mRules = assureLowerCaseWord(mRules);
  return Model.splitRules(mRules.sort(cmpMRule));
}
