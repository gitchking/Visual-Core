import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-blue-600"
      />
      <Moon className="h-4 w-4 text-blue-500" />
    </div>
  );
};

export default ThemeToggle; 