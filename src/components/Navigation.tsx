
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Workflow, 
  Settings, 
  Zap,
  CheckSquare,
  Megaphone
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-purple">VisualFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/todos" 
              className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                location.pathname === '/todos' ? 'text-purple-600' : ''
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              To-Do Flow
            </Link>
            <Link 
              to="/flow-editor" 
              className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                location.pathname === '/flow-editor' ? 'text-purple-600' : ''
              }`}
            >
              <Workflow className="w-4 h-4" />
              Flow Editor
            </Link>
            <Link 
              to="/analytics" 
              className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                location.pathname === '/analytics' ? 'text-purple-600' : ''
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                location.pathname === '/community' ? 'text-purple-600' : ''
              }`}
            >
              <Users className="w-4 h-4" />
              Community
            </Link>
            <Link 
              to="/studio" 
              className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                location.pathname === '/studio' ? 'text-purple-600' : ''
              }`}
            >
              <Megaphone className="w-4 h-4" />
              Studio
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/dev">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4 mr-2" />
                DevTool
              </Button>
            </Link>
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
