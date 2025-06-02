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
  const usedWords = new Set<string>(); // Track words used in multi-word phrases

  // Check multi-word phrases
  for (const [phrase, { weight }] of multiWordPhrases) {
    if (lowerMessage.includes(phrase)) {
      foundKeywords.push(phrase);
      totalPoints += weight;

      // Mark words from this phrase as used
      phrase.split(' ').forEach((word) => usedWords.add(word));
    }
  }

  // Check single words (skip if already used in multi-word phrase)
  for (const word of wordSet) {
    if (!usedWords.has(word)) {
      const keywordData = singleWordMap.get(word);
      if (keywordData) {
        foundKeywords.push(word);
        totalPoints += keywordData.weight;
      }
    }
  }

  // Calculate priorityScore
  const priorityScore =
    totalPoints === 0
      ? 0
      : Math.min(Math.round((totalPoints / 13.0) * 100) / 100, 1.0);

  let priority: Priority = 'low';
  if (priorityScore >= 0.6) {
    priority = 'high';
  } else if (priorityScore >= 0.25) {
    priority = 'medium';
  }

  return {
    keywords: foundKeywords,
    urgencyIndicators: foundKeywords.length,
    priorityScore,
    priority,
  };
}
