import FuzzySet from 'fuzzyset.js';
import { sinhalaSinglishSwearWords, sinhalaUnicodeSwearWords } from '../constants/words';
import FuzzySet from 'fuzzyset.js';

export function checkScore(word) {
  const allSwearWords = [...sinhalaSinglishSwearWords, ...sinhalaUnicodeSwearWords];
  let fs = FuzzySet(allSwearWords, false);
  const matched = fs.get(word);

  // return { ...word, ...matched[0] };
  return matched;
}
