
/**
 * Utility functions for analyzing text
 */

// Count words in text
export const countWords = (text: string): number => {
  // Remove extra whitespace and split by spaces
  const trimmedText = text.trim();
  if (trimmedText === '') return 0;
  return trimmedText.split(/\s+/).length;
};

// Count characters (with and without spaces)
export const countCharacters = (text: string): { withSpaces: number; withoutSpaces: number } => {
  return {
    withSpaces: text.length,
    withoutSpaces: text.replace(/\s/g, '').length
  };
};

// Count sentences
export const countSentences = (text: string): number => {
  if (text.trim() === '') return 0;
  // Match sentence-ending punctuation followed by space or end of string
  const sentences = text.split(/[.!?]+(?:\s|\n|$)/);
  // Filter out empty entries
  return sentences.filter(s => s.trim().length > 0).length;
};

// Count paragraphs
export const countParagraphs = (text: string): number => {
  if (text.trim() === '') return 0;
  // Split by one or more newlines and filter empty paragraphs
  const paragraphs = text.split(/\n+/);
  return paragraphs.filter(p => p.trim().length > 0).length;
};

// Calculate average sentence length (in words)
export const averageSentenceLength = (text: string): number => {
  const sentences = text.split(/[.!?]+(?:\s|\n|$)/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  
  const totalWords = sentences.reduce((total, sentence) => {
    return total + sentence.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  
  return Math.round((totalWords / sentences.length) * 10) / 10; // Round to 1 decimal
};

// Find longest sentence
export const findLongestSentence = (text: string): { words: number; text: string } => {
  if (text.trim() === '') return { words: 0, text: '' };
  
  const sentences = text
    .split(/[.!?]+(?:\s|\n|$)/)
    .filter(s => s.trim().length > 0)
    .map(s => s.trim());
  
  if (sentences.length === 0) return { words: 0, text: '' };
  
  let longest = { words: 0, text: '' };
  
  sentences.forEach(sentence => {
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount > longest.words) {
      longest = { 
        words: wordCount, 
        text: sentence.length > 100 ? sentence.substring(0, 97) + '...' : sentence
      };
    }
  });
  
  return longest;
};

// Estimate reading time in minutes
export const estimateReadingTime = (text: string, wordsPerMinute = 200): number => {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Estimate speaking time in minutes
export const estimateSpeakingTime = (text: string, wordsPerMinute = 130): number => {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Calculate pages (standard page = 250 words)
export const calculatePages = (text: string, wordsPerPage = 250): number => {
  const words = countWords(text);
  return Math.max(0.1, Math.round((words / wordsPerPage) * 10) / 10); // Round to 1 decimal
};

// Analyze keyword density
export const analyzeKeywordDensity = (text: string, minLength = 3): { word: string; count: number; percentage: number }[] => {
  if (text.trim() === '') return [];
  
  // Convert to lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words
  const words = cleanText.split(/\s+/).filter(Boolean);
  
  // Count occurrences
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    if (word.length >= minLength) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Calculate percentages and sort by count
  const totalWords = words.length;
  const result = Object.entries(wordCounts)
    .map(([word, count]) => ({
      word,
      count,
      percentage: Math.round((count / totalWords) * 1000) / 10
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 keywords
  
  return result;
};

// Estimate the reading level (simplified Flesch-Kincaid)
export const estimateReadingLevel = (text: string): string => {
  if (text.trim() === '') return 'N/A';
  
  const words = countWords(text);
  const sentences = countSentences(text);
  const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
  
  if (avgWordsPerSentence <= 10) return 'Elementary';
  if (avgWordsPerSentence <= 14) return 'Middle School';
  if (avgWordsPerSentence <= 17) return 'High School';
  if (avgWordsPerSentence <= 21) return 'College';
  if (avgWordsPerSentence <= 25) return 'College Graduate';
  return 'Post-graduate';
};

// Check for very basic grammar issues
export const checkBasicGrammar = (text: string): { type: string; suggestion: string; position: number }[] => {
  const issues: { type: string; suggestion: string; position: number }[] = [];
  
  // This is extremely simplified and would be replaced by a proper grammar API
  // Just adding a few common patterns for demonstration
  
  // Check for double spaces
  const doubleSpaces = [...text.matchAll(/\s{2,}/g)];
  doubleSpaces.forEach(match => {
    if (match.index !== undefined) {
      issues.push({
        type: 'spacing',
        suggestion: 'Remove extra space',
        position: match.index
      });
    }
  });
  
  // Check for common typos (very simplified)
  const commonTypos: [RegExp, string][] = [
    [/\b(its|it's)\b/g, "Check 'its' vs 'it's' usage"],
    [/\b(there|their|they're)\b/g, "Verify 'there', 'their', or 'they're' usage"],
    [/\b(your|you're)\b/g, "Check 'your' vs 'you're' usage"],
    [/\b(to|too|two)\b/g, "Verify 'to', 'too', or 'two' usage"],
  ];
  
  commonTypos.forEach(([pattern, suggestion]) => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      if (match.index !== undefined) {
        issues.push({
          type: 'grammar',
          suggestion,
          position: match.index
        });
      }
    });
  });
  
  return issues;
};
