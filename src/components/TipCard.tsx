
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TipCardProps {
  title: string;
  description: string;
  category: string;
  content: React.ReactNode;
  example?: string;
  onTryExample?: (example: string) => void;
}

const TipCard: React.FC<TipCardProps> = ({
  title,
  description,
  category,
  content,
  example,
  onTryExample,
}) => {
  const categoryColors: Record<string, string> = {
    'Grammar': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Style': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Spelling': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    'Punctuation': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  const categoryColor = categoryColors[category] || '';

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={categoryColor}>{category}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
      {example && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => onTryExample?.(example)}
            className="w-full"
          >
            Try in Editor
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TipCard;
