
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { analyzeKeywordDensity } from '@/utils/textAnalysis';

interface KeywordDensityProps {
  text: string;
  className?: string;
}

const KeywordDensity: React.FC<KeywordDensityProps> = ({ text, className }) => {
  const keywords = analyzeKeywordDensity(text);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Keyword Density</CardTitle>
        <CardDescription>Top used words in your text</CardDescription>
      </CardHeader>
      <CardContent>
        {keywords.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Add more text to analyze keyword density
          </p>
        ) : (
          <div className="space-y-3">
            {keywords.map((keyword, index) => (
              <div key={keyword.word} className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium">
                  {keyword.percentage}%
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-muted overflow-hidden rounded">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, keyword.percentage * 4)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-sm">
                  {keyword.word}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordDensity;
