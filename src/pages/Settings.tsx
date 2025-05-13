
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Default settings
const defaultSettings = {
  darkMode: false,
  autoSave: true,
  distractionFreeMode: false,
  fontSize: 16,
  fontFamily: 'mono',
  editorWidth: 100,
  readingSpeed: 200,
  speakingSpeed: 130,
  customWordGoal: 500,
};

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(defaultSettings);
  
  // Load settings from localStorage when component mounts
  useEffect(() => {
    const savedSettings = localStorage.getItem('textAnalyzerSettings');
    if (savedSettings) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(savedSettings)
        });
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
    
    // Also check for dark mode setting
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setSettings(prev => ({...prev, darkMode: isDarkMode}));
    
    // Check for word goal
    const savedGoal = localStorage.getItem('wordGoal');
    if (savedGoal) {
      setSettings(prev => ({...prev, customWordGoal: parseInt(savedGoal)}));
    }
  }, []);
  
  // Handle setting changes and save to localStorage
  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings(prev => {
      const newSettings = {...prev, [key]: value};
      localStorage.setItem('textAnalyzerSettings', JSON.stringify(newSettings));
      
      // Handle special cases
      if (key === 'darkMode') {
        localStorage.setItem('darkMode', String(value));
        if (value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      if (key === 'customWordGoal') {
        localStorage.setItem('wordGoal', String(value));
      }
      
      return newSettings;
    });
  };
  
  const handleReset = () => {
    localStorage.removeItem('textAnalyzerSettings');
    setSettings(defaultSettings);
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values"
    });
  };

  const handleClearEditor = () => {
    localStorage.removeItem('textEditor');
    toast({
      title: "Editor cleared",
      description: "All saved text has been cleared from the editor"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your text analysis experience
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch 
                  id="dark-mode" 
                  checked={settings.darkMode} 
                  onCheckedChange={(checked) => updateSetting('darkMode', checked)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
                <Slider 
                  id="font-size"
                  min={12} 
                  max={24} 
                  step={1}
                  value={[settings.fontSize]} 
                  onValueChange={(value) => updateSetting('fontSize', value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select 
                  value={settings.fontFamily}
                  onValueChange={(value) => updateSetting('fontFamily', value)}
                >
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mono">Monospace</SelectItem>
                    <SelectItem value="sans">Sans-serif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editor-width">Editor Width: {settings.editorWidth}%</Label>
                <Slider 
                  id="editor-width"
                  min={50} 
                  max={100} 
                  step={5}
                  value={[settings.editorWidth]} 
                  onValueChange={(value) => updateSetting('editorWidth', value[0])} 
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Behavior Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Behavior</CardTitle>
              <CardDescription>Change how the application works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto Save</Label>
                <Switch 
                  id="auto-save" 
                  checked={settings.autoSave} 
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="distraction-free">Distraction Free Mode on Startup</Label>
                <Switch 
                  id="distraction-free" 
                  checked={settings.distractionFreeMode} 
                  onCheckedChange={(checked) => updateSetting('distractionFreeMode', checked)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reading-speed">Reading Speed: {settings.readingSpeed} WPM</Label>
                <Slider 
                  id="reading-speed"
                  min={100} 
                  max={500} 
                  step={10}
                  value={[settings.readingSpeed]} 
                  onValueChange={(value) => updateSetting('readingSpeed', value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="speaking-speed">Speaking Speed: {settings.speakingSpeed} WPM</Label>
                <Slider 
                  id="speaking-speed"
                  min={80} 
                  max={200} 
                  step={5}
                  value={[settings.speakingSpeed]} 
                  onValueChange={(value) => updateSetting('speakingSpeed', value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="word-goal">Default Word Count Goal</Label>
                <Select 
                  value={String(settings.customWordGoal)}
                  onValueChange={(value) => updateSetting('customWordGoal', parseInt(value))}
                >
                  <SelectTrigger id="word-goal">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 words (quick note)</SelectItem>
                    <SelectItem value="250">250 words (paragraph)</SelectItem>
                    <SelectItem value="500">500 words (short article)</SelectItem>
                    <SelectItem value="1000">1,000 words (article)</SelectItem>
                    <SelectItem value="1667">1,667 words (NaNoWriMo daily)</SelectItem>
                    <SelectItem value="5000">5,000 words (chapter)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Data Management */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your data and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Clear Editor Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Remove all saved text from your browser
                  </p>
                </div>
                <Button variant="outline" onClick={handleClearEditor}>Clear</Button>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Reset Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Restore all settings to their default values
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>Reset</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
