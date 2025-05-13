
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { countWords } from '@/utils/textAnalysis';

interface GoalTrackerProps {
  text: string;
  className?: string;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ text, className }) => {
  // Try to load goal from localStorage
  const [wordGoal, setWordGoal] = useState<number>(
    () => Number(localStorage.getItem('wordGoal')) || 500
  );
  const [inputGoal, setInputGoal] = useState<string>(wordGoal.toString());
  
  const wordCount = countWords(text);
  const progress = Math.min(100, Math.round((wordCount / wordGoal) * 100));
  
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputGoal(e.target.value);
  };
  
  const updateGoal = () => {
    const newGoal = Math.max(1, parseInt(inputGoal) || 500);
    setWordGoal(newGoal);
    localStorage.setItem('wordGoal', newGoal.toString());
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Word Count Goal</CardTitle>
        <CardDescription>Track your writing progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="1"
              value={inputGoal}
              onChange={handleGoalChange}
              className="w-24"
            />
            <span>words</span>
            <Button size="sm" onClick={updateGoal} className="ml-auto">
              Set Goal
            </Button>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{wordCount}/{wordGoal} words ({progress}%)</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="mt-4 text-center">
              {progress < 100 ? (
                <p className="text-sm text-muted-foreground">
                  {wordGoal - wordCount} more words to reach your goal
                </p>
              ) : (
                <p className="text-sm font-medium text-editor-success">
                  Goal achieved! 🎉
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTracker;
