<<<<<<< b36d95859bcd8bd6e4b9738561cd736e54a5af9c
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


0.0.4 -> single result in checkOneRule

