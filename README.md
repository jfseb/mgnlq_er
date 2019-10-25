# mgnlq_er[![Build Status](https://travis-ci.org/jfseb/mgnlq_er.svg?branch=master)](https://travis-ci.org/jfseb/mgnlq_er) [![Coverage Status](https://coveralls.io/repos/github/jfseb/mgnlq_er/badge.svg)](https://coveralls.io/github/jfseb/mgnlq_er)
Entity recognition for mongo nlq

entity recognition based on word categorization

the word categorization contains a bitmap filter to retain only sencences
which are homogeneous in one domain

entity recognition based on word categorization

Words are categorized according to an index
(see [mgnlq-model](https://github.com/jfseb/mgnlq_model))

into
- "Facts",
- "Categories",
- "Domain",
- "Operators",
- "Fillers",
- "Any"  (generic verbatim strings)

The word categorization contains a bitmap filter to retain only sencences
which are homogeneous in one domain.

The word index is built by mgnlq_model

usage:
```javascript
  var erbase = require('mgnlq_er');
  var words = {}; // a cache!
  var res = Erbase.processString('orbit of the earth', theModel.rules, words);
```

result structure is a set of
sentences and associated errors

sentences are further pruned by removing: sentences containing Words containing identical strings which are mapped onto distinct entities,
                                          sentences containing Words containing distinct strings which are mapped on the same entity ( if a better match exists )


0.0.4 -> single result in checkOneRule


entity recognition  mgnlq_er
parsing             mgnlq_parser1
querying