import { Priority, AnalyzedFactors, KeywordData } from '@/models/types';
import { KEYWORDS, PRIORITY_WEIGHTS } from '@/models/constants';

const NORMALIZE_TEXT_REGEX = /[^\w\s-]/g;

const SCORE_DIVIDER = 13.0;
const HIGH_PRIORITY_THRESHOLD = 0.6;
const MEDIUM_PRIORITY_THRESHOLD = 0.25;

const PRIORITY_THRESHOLDS_MAP: { threshold: number; priority: Priority }[] = [
  { threshold: HIGH_PRIORITY_THRESHOLD, priority: 'high' },
  { threshold: MEDIUM_PRIORITY_THRESHOLD, priority: 'medium' },
];

const singleWordMap = new Map<string, KeywordData>();
const multiWordPhrases = new Map<string, KeywordData>();

(Object.keys(KEYWORDS) as Priority[]).forEach((priorityKey) => {
  const keywords = KEYWORDS[priorityKey];
  const weight = PRIORITY_WEIGHTS[priorityKey];

  keywords.forEach((keyword) => {
    const lowerKeyword = keyword.toLowerCase();

    if (lowerKeyword.includes(' ')) {
      multiWordPhrases.set(lowerKeyword, {
        priority: priorityKey,
        weight,
      });
    } else {
      singleWordMap.set(lowerKeyword, {
        priority: priorityKey,
        weight,
      });
    }
  });
});

export function analyzeMessage(message: string): AnalyzedFactors {
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage
    .replace(NORMALIZE_TEXT_REGEX, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const uniqueMessageWords = new Set(words);
  const foundKeywords: string[] = [];
  let totalPoints = 0;
  const processedPhraseWords = new Set<string>();

  // Check multi-word phrases
  for (const [phrase, { weight }] of multiWordPhrases) {
    if (lowerMessage.includes(phrase)) {
      foundKeywords.push(phrase);
      totalPoints += weight;
      phrase.split(' ').forEach((word) => processedPhraseWords.add(word));
    }
  }

  // Check single words
  for (const word of uniqueMessageWords) {
    if (!processedPhraseWords.has(word)) {
      const keywordData = singleWordMap.get(word);
      if (keywordData) {
        foundKeywords.push(word);
        totalPoints += keywordData.weight;
      }
    }
  }

  const priorityScore =
    totalPoints === 0
      ? 0
      : Math.min(Math.round((totalPoints / SCORE_DIVIDER) * 100) / 100, 1.0);

  let determinedPriority: Priority = 'low';
  for (const mapping of PRIORITY_THRESHOLDS_MAP) {
    if (priorityScore >= mapping.threshold) {
      determinedPriority = mapping.priority;
      break;
    }
  }

  return {
    keywords: foundKeywords,
    urgencyIndicators: foundKeywords.length,
    priorityScore,
    priority: determinedPriority,
  };
}
