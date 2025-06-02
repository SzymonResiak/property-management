import { analyzeMessage } from '../src/services/analysisService';

describe('POST /analyze endpoint functionality', () => {
  test('should return correct analysis structure for valid message', () => {
    const message = 'Kitchen sink is leaking badly!';
    const result = analyzeMessage(message);

    expect(result).toHaveProperty('keywords');
    expect(result).toHaveProperty('urgencyIndicators');
    expect(result).toHaveProperty('priorityScore');
    expect(result).toHaveProperty('priority');

    expect(Array.isArray(result.keywords)).toBe(true);
    expect(typeof result.urgencyIndicators).toBe('number');
    expect(typeof result.priorityScore).toBe('number');
    expect(['high', 'medium', 'low']).toContain(result.priority);

    expect(result.priority).toBe('low');
    expect(result.keywords).toContain('leaking');
  });

  test('should handle emergency message correctly', () => {
    const message = 'Gas leak emergency!';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('high');
    expect(result.keywords).toEqual(
      expect.arrayContaining(['gas leak', 'emergency'])
    );
    expect(result.urgencyIndicators).toBeGreaterThan(0);
  });

  test('should handle cosmetic issue correctly', () => {
    const message = 'Need paint touch-up in hallway';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('low');
    expect(result.keywords).toEqual(
      expect.arrayContaining(['paint', 'touch-up'])
    );
  });

  test('should handle empty or no keywords gracefully', () => {
    const message = 'Thank you for your service';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('low');
    expect(result.keywords).toHaveLength(0);
    expect(result.urgencyIndicators).toBe(0);
    expect(result.priorityScore).toBe(0);
  });
});
