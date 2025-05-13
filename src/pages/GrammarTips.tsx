
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TipCard from '@/components/TipCard';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Define grammar tips
const tips = [
  {
    id: 1,
    title: 'Their, There, or They\'re?',
    description: 'Common homophones that are often confused',
    category: 'Grammar',
    content: (
      <div className="space-y-2">
        <p><strong>Their</strong> - possessive form of they (Their books are on the table)</p>
        <p><strong>There</strong> - refers to a place or introduces a sentence (There is a book on the table)</p>
        <p><strong>They're</strong> - contraction of "they are" (They're going to the library)</p>
      </div>
    ),
    example: "They're bringing their books over there."
  },
  {
    id: 2,
    title: 'Active vs. Passive Voice',
    description: 'Writing with active voice is generally clearer and more direct',
    category: 'Style',
    content: (
      <div className="space-y-2">
        <p><strong>Passive Voice:</strong> The ball was thrown by John.</p>
        <p><strong>Active Voice:</strong> John threw the ball.</p>
        <p>Active voice is typically more direct and engaging for the reader.</p>
      </div>
    ),
    example: "The team completed the project ahead of schedule. This result impressed the client greatly."
  },
  {
    id: 3,
    title: 'Commonly Misspelled Words',
    description: 'Words that frequently cause spelling errors',
    category: 'Spelling',
    content: (
      <div className="space-y-1">
        <p>✓ Accommodate (not acommodate)</p>
        <p>✓ Definitely (not definately)</p>
        <p>✓ Separate (not seperate)</p>
        <p>✓ Occurrence (not occurence)</p>
        <p>✓ Necessary (not neccessary)</p>
      </div>
    ),
    example: "It is definitely necessary to accommodate everyone separately at the occurrence."
  },
  {
    id: 4,
    title: 'Comma Usage',
    description: 'Common rules for using commas correctly',
    category: 'Punctuation',
    content: (
      <div className="space-y-2">
        <p><strong>Lists:</strong> Use commas to separate items in a list (apples, oranges, and bananas)</p>
        <p><strong>Joining clauses:</strong> Use commas with coordinating conjunctions (I went to the store, and I bought milk)</p>
        <p><strong>Introductory phrases:</strong> Use commas after introductory phrases (After the party, we went home)</p>
      </div>
    ),
    example: "After finishing work, I went to the store, bought some milk, and headed home."
  },
  {
    id: 5,
    title: 'Sentence Fragments',
    description: 'How to avoid incomplete sentences in your writing',
    category: 'Grammar',
    content: (
      <div className="space-y-2">
        <p><strong>Fragment:</strong> Because I was late.</p>
        <p><strong>Complete:</strong> I missed the bus because I was late.</p>
        <p>A complete sentence needs a subject and a verb, and must express a complete thought.</p>
      </div>
    ),
    example: "I missed the deadline. Because I forgot to set my alarm. This was a problem for the whole team."
  },
  {
    id: 6,
    title: 'Transition Words',
    description: 'Words that help connect ideas and improve flow',
    category: 'Style',
    content: (
      <div className="space-y-2">
        <p><strong>To add information:</strong> Additionally, furthermore, moreover</p>
        <p><strong>To contrast:</strong> However, nevertheless, on the other hand</p>
        <p><strong>To show cause/effect:</strong> Therefore, consequently, as a result</p>
        <p><strong>To conclude:</strong> Finally, in conclusion, in summary</p>
      </div>
    ),
    example: "The project was challenging. However, the team persevered. As a result, we completed it on time. In conclusion, good teamwork leads to success."
  },
];

const GrammarTips = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const handleTryExample = (example: string) => {
    localStorage.setItem('textEditor', example);
    toast({
      title: "Example loaded",
      description: "The example text has been loaded into the editor",
    });
    navigate('/');
  };
  
  // Filter tips based on search query and active category
  const filteredTips = tips.filter(tip => {
    const matchesSearch = 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'all' || tip.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Grammar Tips & Writing Advice</h1>
          <p className="text-muted-foreground">
            Learn how to improve your writing with these helpful tips and examples
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-2/3">
            <Input
              placeholder="Search for writing tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Grammar">Grammar</TabsTrigger>
                <TabsTrigger value="Style">Style</TabsTrigger>
                <TabsTrigger value="Spelling">Spelling</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTips.length > 0 ? (
            filteredTips.map(tip => (
              <TipCard
                key={tip.id}
                title={tip.title}
                description={tip.description}
                category={tip.category}
                content={tip.content}
                example={tip.example}
                onTryExample={handleTryExample}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No tips found matching your search criteria</p>
              <Button 
                variant="link" 
                onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GrammarTips;
