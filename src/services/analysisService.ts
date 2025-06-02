import { Priority, AnalyzedFactors, KeywordData } from '../models/types';
import { KEYWORDS, PRIORITY_WEIGHTS } from '../models/constants';

/**
 * Analyzes maintenance messages to determine priority using keyword matching.
 *
 * Single words get O(1) Map lookup, multi-word phrases are checked against the full message text.
 *
 * O(words + phrases×message_length)
 */

// Build lookup structures for keyword matching
const singleWordMap = new Map<string, KeywordData>();
const multiWordPhrases = new Map<string, KeywordData>();

Object.entries(KEYWORDS).forEach(([priority, keywords]) => {
  const priorityKey = priority as Priority;
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
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const wordSet = new Set(words);
  const foundKeywords: string[] = [];
  let totalPoints = 0;

  // Check single words
  for (const word of wordSet) {
    const keywordData = singleWordMap.get(word);
    if (keywordData) {
      foundKeywords.push(word);
      totalPoints += keywordData.weight;
    }
  }

  // Check multi-word phrases
  for (const [phrase, { weight }] of multiWordPhrases) {
    if (lowerMessage.includes(phrase)) {
      foundKeywords.push(phrase);
      totalPoints += weight;
    }
  }

  // Calculate priorityScore
  const priorityScore =
    totalPoints === 0 ? 0 : Math.round((totalPoints / 20.0) * 100) / 100;

  let priority: Priority = 'low';
  if (priorityScore >= 0.6) {
    priority = 'high';
  } else if (priorityScore >= 0.3) {
    priority = 'medium';
  }

  return {
    keywords: foundKeywords,
    urgencyIndicators: totalPoints,
    priorityScore,
    priority,
  };
}
