
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  countWords,
  countCharacters,
  countSentences,
  countParagraphs,
  averageSentenceLength,
  findLongestSentence,
  estimateReadingTime,
  estimateSpeakingTime,
  calculatePages,
  estimateReadingLevel
} from '@/utils/textAnalysis';

interface TextStatisticsProps {
  text: string;
  goalWords?: number;
  className?: string;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const TextStatistics: React.FC<TextStatisticsProps> = ({ 
  text, 
  goalWords = 500,
  className 
}) => {
  // Calculate all statistics
  const wordCount = countWords(text);
  const chars = countCharacters(text);
  const sentenceCount = countSentences(text);
  const paragraphCount = countParagraphs(text);
  const avgSentenceLength = averageSentenceLength(text);
  const longestSentence = findLongestSentence(text);
  const readingTime = estimateReadingTime(text);
  const speakingTime = estimateSpeakingTime(text);
  const pageCount = calculatePages(text);
  const readingLevel = estimateReadingLevel(text);
  
  // Calculate goal progress
  const progress = Math.min(100, Math.round((wordCount / goalWords) * 100));
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Text Statistics</CardTitle>
        <CardDescription>Analysis of your writing</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Word Count Goal */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Goal: {wordCount}/{goalWords} words</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-4">
          {/* Basic Counts */}
          <div>
            <h3 className="text-sm font-medium mb-1">Basic Counts</h3>
            <div className="bg-muted/40 rounded-md p-3">
              <StatItem label="Words" value={wordCount} />
              <StatItem label="Characters (no spaces)" value={chars.withoutSpaces} />
              <StatItem label="Characters (with spaces)" value={chars.withSpaces} />
              <StatItem label="Sentences" value={sentenceCount} />
              <StatItem label="Paragraphs" value={paragraphCount} />
            </div>
          </div>
          
          <Separator />
          
          {/* Reading Metrics */}
          <div>
            <h3 className="text-sm font-medium mb-1">Reading Metrics</h3>
            <div className="bg-muted/40 rounded-md p-3">
              <StatItem 
                label="Reading Level" 
                value={readingLevel} 
              />
              <StatItem 
                label="Avg. Sentence Length" 
                value={`${avgSentenceLength} words`} 
              />
              <StatItem 
                label="Reading Time" 
                value={`${readingTime} min`} 
              />
              <StatItem 
                label="Speaking Time" 
                value={`${speakingTime} min`} 
              />
              <StatItem 
                label="Pages (approx)" 
                value={pageCount} 
              />
            </div>
          </div>
          
          {/* Longest Sentence */}
          {longestSentence.words > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-1">
                  Longest Sentence ({longestSentence.words} words)
                </h3>
                <div className="bg-muted/40 rounded-md p-3">
                  <p className="text-sm italic">"{longestSentence.text}"</p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextStatistics;
