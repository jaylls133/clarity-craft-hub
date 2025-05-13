
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChartBar, 
  Heading, 
  FileText
} from 'lucide-react';
import { 
  calculateSeoScore, 
  checkHeadingStructure,
  generateSeoSuggestions
} from '@/utils/textAnalysis';
import { useToast } from '@/hooks/use-toast';

interface SeoToolsProps {
  text: string;
  className?: string;
}

const SeoTools: React.FC<SeoToolsProps> = ({ text, className }) => {
  const { toast } = useToast();
  const [targetKeyword, setTargetKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('score');
  const [seoScore, setSeoScore] = useState<ReturnType<typeof calculateSeoScore> | null>(null);
  const [headingAnalysis, setHeadingAnalysis] = useState<ReturnType<typeof checkHeadingStructure> | null>(null);
  const [seoSuggestions, setSeoSuggestions] = useState<ReturnType<typeof generateSeoSuggestions> | null>(null);

  const analyzeSeo = () => {
    const score = calculateSeoScore(text, targetKeyword);
    const headings = checkHeadingStructure(text);
    setSeoScore(score);
    setHeadingAnalysis(headings);
  };

  const generateSuggestions = () => {
    const suggestions = generateSeoSuggestions(text);
    setSeoSuggestions(suggestions);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
      duration: 2000,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          SEO Tools
        </CardTitle>
        <CardDescription>
          Analyze and optimize your content for search engines
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue="score" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="score">SEO Score</TabsTrigger>
            <TabsTrigger value="headings">Headings</TabsTrigger>
            <TabsTrigger value="generator">Title & Meta</TabsTrigger>
          </TabsList>
          
          {/* SEO Score Tab */}
          <TabsContent value="score" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-keyword">Target Keyword (optional)</Label>
              <div className="flex space-x-2">
                <Input 
                  id="target-keyword"
                  placeholder="e.g., content marketing" 
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                />
                <Button onClick={analyzeSeo}>Analyze</Button>
              </div>
            </div>
            
            {seoScore && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>SEO Score</Label>
                    <span className="font-medium">{seoScore.score}/100</span>
                  </div>
                  <Progress 
                    value={seoScore.score} 
                    className="h-2" 
                    indicatorClassName={
                      seoScore.score >= 70 
                        ? "bg-green-500" 
                        : seoScore.score >= 40 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                    }
                  />
                </div>
                
                {seoScore.issues.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-red-500">Issues to Fix</Label>
                    <ul className="space-y-1 text-sm">
                      {seoScore.issues.map((issue, index) => (
                        <li key={index} className="text-red-500">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {seoScore.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-yellow-500">Suggestions</Label>
                    <ul className="space-y-1 text-sm">
                      {seoScore.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-yellow-500">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Heading Structure Tab */}
          <TabsContent value="headings" className="space-y-4">
            <Button onClick={() => setHeadingAnalysis(checkHeadingStructure(text))}>
              Check Headings
            </Button>
            
            {headingAnalysis && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Heading Structure Score</Label>
                    <span className="font-medium">{headingAnalysis.score}/100</span>
                  </div>
                  <Progress 
                    value={headingAnalysis.score} 
                    className="h-2"
                    indicatorClassName={
                      headingAnalysis.score >= 70 
                        ? "bg-green-500" 
                        : headingAnalysis.score >= 40 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                    }
                  />
                </div>
                
                {headingAnalysis.issues.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-red-500">Issues</Label>
                    <ul className="space-y-1 text-sm">
                      {headingAnalysis.issues.map((issue, index) => (
                        <li key={index} className="text-red-500">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {headingAnalysis.headings.length > 0 ? (
                  <div className="space-y-2">
                    <Label>Headings Found</Label>
                    <div className="space-y-1 border rounded-md p-3 bg-muted/20">
                      {headingAnalysis.headings.map((heading, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-2"
                          style={{ marginLeft: `${(heading.level - 1) * 12}px` }}
                        >
                          <span className="bg-primary/20 text-xs rounded px-1">
                            H{heading.level}
                          </span>
                          <span className="text-sm">{heading.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Heading className="h-12 w-12 mx-auto opacity-20 mb-2" />
                    <p>No headings found in your text</p>
                    <p className="text-sm mt-1">
                      Use &lt;h1&gt;Main Title&lt;/h1&gt;, &lt;h2&gt;Subheading&lt;/h2&gt; etc. for proper structure
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Title & Meta Generator Tab */}
          <TabsContent value="generator" className="space-y-4">
            <Button onClick={generateSuggestions}>
              Generate Suggestions
            </Button>
            
            {seoSuggestions && (
              <div className="space-y-6 pt-2">
                {seoSuggestions.titleSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <Label>Title Suggestions</Label>
                    <div className="space-y-2">
                      {seoSuggestions.titleSuggestions.map((title, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded-md bg-muted/20">
                          <span className="text-sm pr-2">{title}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(title)}
                          >
                            Copy
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ideal title length: 50-60 characters
                    </div>
                  </div>
                )}
                
                {seoSuggestions.descriptionSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <Label>Meta Description Suggestions</Label>
                    <div className="space-y-2">
                      {seoSuggestions.descriptionSuggestions.map((description, index) => (
                        <div key={index} className="p-2 border rounded-md bg-muted/20">
                          <div className="text-sm mb-2">{description}</div>
                          <div className="flex justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(description)}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ideal description length: 140-160 characters
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Generated based on your content</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground">
        For best results, include proper headings and targeted keywords in your text.
      </CardFooter>
    </Card>
  );
};

export default SeoTools;
