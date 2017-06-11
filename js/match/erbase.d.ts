export declare function mockDebug(o: any): void;
import { IFModel as IMatch } from 'mgnlq_model';
import { IFModel as IFModel } from 'mgnlq_model';
export interface ITokenizedString {
    tokens: string[];
    categorizedWords: IMatch.ICategorizedStringRanged[][];
    fusable: boolean[];
}
/**
 * Given a  string, break it down into components,
 * [['A', 'B'], ['A B']]
 *
 * then categorizeWords
 * returning
 *
 * [ [[ { category: 'systemId', word : 'A'},
 *      { category: 'otherthing', word : 'A'}
 *    ],
 *    // result of B
 *    [ { category: 'systemId', word : 'B'},
 *      { category: 'otherthing', word : 'A'}
 *      { category: 'anothertryp', word : 'B'}
 *    ]
 *   ],
 * ]]]
 *
 *
 *
 */
export declare function tokenizeString(sString: string, rules: IMatch.SplitRules, words: {
    [key: string]: Array<IMatch.ICategorizedString>;
}): ITokenizedString;
export declare function isSameRes(present: IMatch.ICategorizedStringRanged, res: IMatch.ICategorizedStringRanged): number;
export declare function mergeIgnoreOrAppend(result: IMatch.ICategorizedStringRanged[], res: IMatch.ICategorizedStringRanged): void;
export declare function evaluateRangeRulesToPosition(tokens: string[], fusable: boolean[], categorizedWords: IMatch.ICategorizedStringRanged[][]): void;
export declare function isSpanVec(vec: Array<any>, index: number): boolean;
/**
 * expand an array [[a1,a2], [b1,b2],[c]]
 * into all combinations
 *
 *  if a1 has a span of three, the variations of the lower layer are skipped
 *
 * with the special property
 */
export declare function expandTokenMatchesToSentences(tokens: string[], tokenMatches: Array<Array<any>>): IMatch.IProcessedSentences;
export declare function makeAnyWord(token: string): {
    string: string;
    matchedString: string;
    category: string;
    rule: {
        category: string;
        type: number;
        word: string;
        lowercaseword: string;
        matchedString: string;
        exactOnly: boolean;
        bitindex: number;
        bitSentenceAnd: number;
        wordType: string;
        _ranking: number;
    };
    _ranking: number;
};
export declare function isSuccessorOperator(res: any, tokenIndex: number): boolean;
/**
 * expand an array [[a1,a2], [b1,b2],[c]]
 * into all combinations
 *
 *  if a1 has a span of three, the variations of the lower layer are skipped
 *
 * with the special property
 */
export declare function expandTokenMatchesToSentences2(tokens: string[], tokenMatches: Array<Array<any>>): IMatch.IProcessedSentences;
export declare function processString(query: string, rules: IFModel.SplitRules, words: {
    [key: string]: Array<IMatch.ICategorizedString>;
}): IMatch.IProcessedSentences;
/**
 * Return true if the identical word is interpreted
 * (within the same domain and the same wordtype)
 * as a differnent  (e.g. element numb is one interpreted as 'CAT' element name, once as CAT 'element number' in
 * same domain IUPAC elements )
 * @param sentence
 */
export declare function isDistinctInterpretationForSame(sentence: IMatch.ISentence): boolean;
export declare function filterNonSameInterpretations(aSentences: IMatch.IProcessedSentences): IMatch.IProcessedSentences;
export declare function processString2(query: string, rules: IFModel.SplitRules, words: {
    [key: string]: Array<IMatch.ICategorizedString>;
}): IMatch.IProcessedSentences;
export declare function simplifySentence(res: any): any;
