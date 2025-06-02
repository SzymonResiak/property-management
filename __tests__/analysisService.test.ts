import { analyzeMessage } from '../src/services/analysisService';

describe('Priority Analysis - Main Use Case', () => {
  test('should classify emergency water leak as high priority', () => {
    const message = 'Bathroom pipe burst, water everywhere!';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('high');
    expect(result.keywords).toContain('burst');
    expect(result.urgencyIndicators).toBeGreaterThan(0);
    expect(result.priorityScore).toBeGreaterThan(0);
  });

  test('should classify electrical issue as medium priority', () => {
    const message = 'Power outage in entire building, no electricity';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('medium');
    expect(result.keywords).toEqual(expect.arrayContaining(['power outage']));
  });

  test('should classify broken appliance as medium priority', () => {
    const message = 'Dishwasher is making loud noisy sounds';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('medium');
    expect(result.keywords).toEqual(
      expect.arrayContaining(['dishwasher', 'loud', 'noisy'])
    );
  });

  test('should classify cosmetic issue as low priority', () => {
    const message = 'Paint touch-up needed in living room';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('low');
    expect(result.keywords).toEqual(
      expect.arrayContaining(['paint', 'touch-up'])
    );
  });

  test('should handle message with no keywords', () => {
    const message = 'Hello, just checking in';
    const result = analyzeMessage(message);

    expect(result.priority).toBe('low');
    expect(result.keywords).toHaveLength(0);
    expect(result.urgencyIndicators).toBe(0);
  });
});
