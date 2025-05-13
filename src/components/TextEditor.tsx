
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Undo, Redo, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, setText, className }) => {
  const { toast } = useToast();
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Initialize history when component mounts
  useEffect(() => {
    // Try to restore from localStorage
    const savedText = localStorage.getItem('textEditor');
    if (savedText) {
      setText(savedText);
      setHistory([savedText]);
      setHistoryIndex(0);
    }
    
    // Set initial history if there's initial text
    if (text && history.length === 0) {
      setHistory([text]);
      setHistoryIndex(0);
    }
  }, []);
  
  // Handle text changes with debouncing for history
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Save to localStorage
    localStorage.setItem('textEditor', newText);
    
    // Debounce history updates to avoid too many entries
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      // Only add to history if it's different from the last entry
      if (history[historyIndex] !== newText) {
        // Remove any forward history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, newText]);
        setHistoryIndex(newHistory.length);
      }
    }, 1000) as unknown as number;
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text copied",
      description: "Text copied to clipboard successfully!",
      duration: 2000,
    });
  };
  
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded",
      description: "Text file downloaded successfully!",
      duration: 2000,
    });
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-0">
        <div className="bg-muted/50 p-2 border-b flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            aria-label="Undo"
          >
            <Undo className="h-4 w-4 mr-1" /> Undo
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            aria-label="Redo"
          >
            <Redo className="h-4 w-4 mr-1" /> Redo
          </Button>
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              aria-label="Download as text file"
            >
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>
        <Textarea 
          ref={textareaRef}
          value={text} 
          onChange={handleTextChange}
          placeholder="Start typing or paste your text here..."
          className="text-editor border-none rounded-none min-h-[400px] lg:min-h-[500px] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </CardContent>
    </Card>
  );
};

export default TextEditor;
