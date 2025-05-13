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

// SEO Optimization Functions

// Extract headings from HTML-like text
export const extractHeadings = (text: string): { level: number; text: string }[] => {
  const headingRegex = /<h([1-6])>(.*?)<\/h\1>/gi;
  const headings: { level: number; text: string }[] = [];
  
  let match;
  while ((match = headingRegex.exec(text)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].trim()
    });
  }
  
  return headings;
};

// Check heading structure for SEO
export const checkHeadingStructure = (text: string): { 
  issues: string[];
  headings: { level: number; text: string }[];
  score: number;
} => {
  const headings = extractHeadings(text);
  const issues: string[] = [];
  let score = 100;
  
  // Check if H1 exists
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    issues.push("Missing H1 heading - main topic should have an H1 tag");
    score -= 20;
  } else if (h1Count > 1) {
    issues.push(`Too many H1 headings (${h1Count}) - page should have only one H1`);
    score -= 10 * (h1Count - 1);
  }
  
  // Check heading hierarchy
  let previousLevel = 0;
  headings.forEach(heading => {
    if (heading.level > previousLevel + 1 && previousLevel !== 0) {
      issues.push(`Heading structure skip: H${previousLevel} to H${heading.level}`);
      score -= 5;
    }
    previousLevel = heading.level;
  });
  
  // Check heading length
  headings.forEach(heading => {
    if (heading.text.length > 60) {
      issues.push(`H${heading.level} heading too long: "${heading.text.substring(0, 30)}..."`);
      score -= 5;
    }
  });
  
  return {
    issues,
    headings,
    score: Math.max(0, score)
  };
};

// Calculate SEO score based on various factors
export const calculateSeoScore = (
  text: string, 
  targetKeyword: string = ''
): { 
  score: number;
  issues: string[];
  suggestions: string[];
} => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  
  // Check text length
  const wordCount = countWords(text);
  if (wordCount < 300) {
    issues.push("Content is too short (<300 words)");
    score -= 20;
  } else if (wordCount >= 300 && wordCount < 600) {
    suggestions.push("Consider expanding content to at least 600 words for better ranking");
    score -= 5;
  }
  
  // Check target keyword usage if provided
  if (targetKeyword && targetKeyword.trim() !== '') {
    const keywordRegex = new RegExp(`\\b${targetKeyword.toLowerCase()}\\b`, 'gi');
    const keywordMatches = text.toLowerCase().match(keywordRegex);
    const keywordCount = keywordMatches ? keywordMatches.length : 0;
    const keywordDensity = keywordCount / wordCount * 100;
    
    if (keywordCount === 0) {
      issues.push(`Target keyword "${targetKeyword}" not found in text`);
      score -= 20;
    } else if (keywordDensity < 0.5) {
      suggestions.push(`Target keyword "${targetKeyword}" density is low (${keywordDensity.toFixed(1)}%)`);
      score -= 5;
    } else if (keywordDensity > 3) {
      issues.push(`Keyword stuffing detected: "${targetKeyword}" appears too frequently (${keywordDensity.toFixed(1)}%)`);
      score -= 15;
    }
    
    // Check if keyword is in the first paragraph
    const firstParagraph = text.split('\n')[0].toLowerCase();
    if (!firstParagraph.includes(targetKeyword.toLowerCase())) {
      suggestions.push(`Consider including target keyword "${targetKeyword}" in the first paragraph`);
      score -= 5;
    }
  }
  
  // Check paragraph length
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100).length;
  if (longParagraphs > 0) {
    suggestions.push(`${longParagraphs} paragraphs are too long (>100 words); consider breaking them up`);
    score -= 5 * Math.min(3, longParagraphs);
  }
  
  // Check sentence length
  const sentences = text.split(/[.!?]+(?:\s|\n|$)/).filter(s => s.trim().length > 0);
  const longSentences = sentences.filter(s => s.split(/\s+/).filter(Boolean).length > 30).length;
  if (longSentences > 0) {
    suggestions.push(`${longSentences} sentences are too long (>30 words); consider shortening for readability`);
    score -= 3 * Math.min(5, longSentences);
  }
  
  // Check heading structure
  const headingCheck = checkHeadingStructure(text);
  headingCheck.issues.forEach(issue => {
    issues.push(issue);
  });
  score = Math.min(score, headingCheck.score);
  
  // Finalize score
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    issues,
    suggestions
  };
};

// Generate title and meta description suggestions
export const generateSeoSuggestions = (
  text: string
): {
  titleSuggestions: string[];
  descriptionSuggestions: string[];
} => {
  // Find potential key phrases
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Get top keywords
  const topKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
  
  // Extract first sentence as a base for title
  const firstSentence = text.split(/[.!?]+/)[0].trim();
  const shortIntro = firstSentence.length > 60 ? firstSentence.substring(0, 60) + '...' : firstSentence;
  
  // Get first paragraph for description
  const firstParagraph = text.split(/\n+/).filter(p => p.trim().length > 0)[0] || '';
  const shortParagraph = firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph;
  
  // Generate title suggestions
  const titleSuggestions = [
    // Use first heading if available
    ...extractHeadings(text)
      .filter(h => h.level === 1 || h.level === 2)
      .slice(0, 1)
      .map(h => h.text),
    
    // Other variations
    shortIntro,
    `${topKeywords[0] || ''} ${topKeywords[1] || ''} - Key Guide`,
    `Everything You Need to Know About ${topKeywords[0] || 'This Topic'}`,
    `The Ultimate Guide to ${topKeywords.slice(0, 2).join(' & ')}`,
  ].filter(Boolean).filter(title => title.length > 10 && title.length < 70);
  
  // Generate description suggestions
  const descriptionSuggestions = [
    shortParagraph,
    `Learn about ${topKeywords.slice(0, 3).join(', ')} and discover how to improve your content with our comprehensive guide.`,
    `Discover essential tips on ${topKeywords.slice(0, 2).join(' and ')}. This guide provides detailed information to help you succeed.`,
    `Looking for information on ${topKeywords[0]}? This article covers everything from ${topKeywords[1] || 'basics'} to ${topKeywords[2] || 'advanced techniques'}.`
  ].filter(desc => desc.length > 50 && desc.length < 160);
  
  return {
    titleSuggestions: [...new Set(titleSuggestions)], // Remove duplicates
    descriptionSuggestions: [...new Set(descriptionSuggestions)] // Remove duplicates
  };
};
