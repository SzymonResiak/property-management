import { Priority } from '../models/types';
import { KEYWORDS, PRIORITY_WEIGHTS } from '../models/constants';

interface AnalysisResult {
  keywords: string[];
  urgencyIndicators: number;
  priorityScore: number;
  priority: Priority;
}

// Map for fast keyword lookup
const createKeywordMap = () => {
  const map = new Map<
    string,
    { priority: keyof typeof KEYWORDS; weight: number }
  >();

  Object.entries(KEYWORDS).forEach(([priority, keywords]) => {
    const priorityKey = priority as keyof typeof KEYWORDS;
    keywords.forEach((keyword) => {
      map.set(keyword.toLowerCase(), {
        priority: priorityKey,
        weight: PRIORITY_WEIGHTS[priorityKey],
      });
    });
  });

  return map;
};

const KEYWORD_MAP = createKeywordMap();

// Tokenize to avoid "leak" vs "leaking" conflicts
export function analyzeMessage(message: string): AnalysisResult {
  const lowerMessage = message.toLowerCase();
  const foundKeywords: string[] = [];
  const priorityCounts = { high: 0, medium: 0, low: 0 };
  let urgencyIndicators = 0;

  const words = lowerMessage
    .replace(/[^\w\s-]/g, ' ') // some words have dashes "touch-up"
    .split(/\s+/)
    .filter((word) => word.length > 0);

  for (const [keyword, data] of KEYWORD_MAP) {
    if (keyword.includes(' ')) {
      if (lowerMessage.includes(keyword)) {
        foundKeywords.push(keyword);
        priorityCounts[data.priority]++;
        urgencyIndicators += data.weight;
      }
    } else {
      if (words.includes(keyword)) {
        foundKeywords.push(keyword);
        priorityCounts[data.priority]++;
        urgencyIndicators += data.weight;
      }
    }
  }

  const maxScore = Object.entries(KEYWORDS).reduce(
    (total, [priority, keywords]) => {
      const priorityKey = priority as keyof typeof KEYWORDS;
      return total + keywords.length * PRIORITY_WEIGHTS[priorityKey];
    },
    0
  );

  const priorityScore = Math.min(1, urgencyIndicators / maxScore);

  let priority: Priority = 'low';
  if (priorityCounts.high > 0) {
    priority = 'high';
  } else if (priorityCounts.medium > 0) {
    priority = 'medium';
  }

  return {
    keywords: foundKeywords,
    urgencyIndicators,
    priorityScore,
    priority,
  };
}
