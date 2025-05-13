
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { checkBasicGrammar } from '@/utils/textAnalysis';

interface GrammarSuggestionsProps {
  text: string;
  className?: string;
}

const GrammarSuggestions: React.FC<GrammarSuggestionsProps> = ({ text, className }) => {
  const suggestions = checkBasicGrammar(text);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Grammar Suggestions</CardTitle>
        <CardDescription>
          Basic grammar and spelling checks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {text.trim() === '' ? (
              'Start typing to get grammar suggestions'
            ) : (
              'No basic issues detected in your text'
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((issue, index) => (
              <div 
                key={index} 
                className="flex gap-3 items-start p-3 rounded-md bg-muted/40"
              >
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">
                    {issue.type === 'grammar' ? 'Grammar Check' : 'Formatting'}
                  </p>
                  <p className="text-muted-foreground text-sm">{issue.suggestion}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">
              Note: This is a simple demonstration. A real grammar checker would be more sophisticated.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrammarSuggestions;
