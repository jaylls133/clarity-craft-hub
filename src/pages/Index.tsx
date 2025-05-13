
import React, { useState } from 'react';
import TextEditor from '@/components/TextEditor';
import TextStatistics from '@/components/TextStatistics';
import KeywordDensity from '@/components/KeywordDensity';
import GrammarSuggestions from '@/components/GrammarSuggestions';
import GoalTracker from '@/components/GoalTracker';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [text, setText] = useState<string>('');
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile layout with tabs for analysis panels
    return (
      <Layout>
        <div className="space-y-4">
          <TextEditor text={text} setText={setText} />
          
          <Tabs defaultValue="stats">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="grammar">Grammar</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-2 space-y-4">
              <TextStatistics text={text} />
              <GoalTracker text={text} />
            </TabsContent>
            <TabsContent value="keywords" className="mt-2">
              <KeywordDensity text={text} />
            </TabsContent>
            <TabsContent value="grammar" className="mt-2">
              <GrammarSuggestions text={text} />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    );
  }

  // Desktop layout with side-by-side panels
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TextEditor text={text} setText={setText} />
        </div>
        <div className="space-y-4">
          <TextStatistics text={text} />
          <KeywordDensity text={text} />
          <GrammarSuggestions text={text} />
          <GoalTracker text={text} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
