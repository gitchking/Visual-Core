
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Workflow, 
  Settings, 
  Zap 
} from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-purple">VisualFlow</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#todo" className="text-sm font-medium hover:text-purple-600 transition-colors">
              To-Do Flow
            </a>
            <a href="#charts" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Analytics
            </a>
            <a href="#community" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Community
            </a>
            <a href="#studio" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Studio
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
