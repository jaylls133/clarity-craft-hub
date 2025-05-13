
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [darkMode, setDarkMode] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  React.useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { name: 'Editor', path: '/' },
    { name: 'Grammar Tips', path: '/grammar-tips' },
    { name: 'Settings', path: '/settings' }
  ];
  
  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `px-4 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-primary">TextAnalyzer</h1>
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {navItems.map(item => (
                <NavLink key={item.path} to={item.path} className={getNavClass} end>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {isMobile && mobileMenuOpen && (
        <nav className="container py-2 bg-card border-b">
          <div className="flex flex-col space-y-1">
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={getNavClass} 
                end
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      <main className="flex-1 container py-6">
        {children || <Outlet />}
      </main>
      
      <footer className="border-t py-4 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>TextAnalyzer — Your writing companion. © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
