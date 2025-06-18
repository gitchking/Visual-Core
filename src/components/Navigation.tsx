
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
  Megaphone,
  Menu
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gradient-purple">VisualFlow</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/todos" 
              className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                location.pathname === '/todos' ? 'text-purple-600' : ''
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden lg:inline">To-Do Flow</span>
              <span className="lg:hidden">Todos</span>
            </Link>
            <Link 
              to="/flow-editor" 
              className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                location.pathname === '/flow-editor' ? 'text-purple-600' : ''
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span className="hidden lg:inline">Flow Editor</span>
              <span className="lg:hidden">Flow</span>
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

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link to="/dev">
              <Button variant="outline" size="sm" className="hidden lg:flex">
                <Settings className="w-4 h-4 mr-2" />
                DevTool
              </Button>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="sm" className="bg-purple-accent hover:bg-purple-accent/90 text-white neo-brutal-purple">
              <span className="hidden lg:inline">Get Started</span>
              <span className="lg:hidden">Start</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              <Link 
                to="/todos" 
                className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                  location.pathname === '/todos' ? 'text-purple-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <CheckSquare className="w-4 h-4" />
                To-Do Flow
              </Link>
              <Link 
                to="/flow-editor" 
                className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                  location.pathname === '/flow-editor' ? 'text-purple-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Workflow className="w-4 h-4" />
                Flow Editor
              </Link>
              <Link 
                to="/analytics" 
                className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                  location.pathname === '/analytics' ? 'text-purple-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
              <Link 
                to="/community" 
                className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                  location.pathname === '/community' ? 'text-purple-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                Community
              </Link>
              <Link 
                to="/studio" 
                className={`text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2 ${
                  location.pathname === '/studio' ? 'text-purple-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Megaphone className="w-4 h-4" />
                Studio
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/dev" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    DevTool
                  </Button>
                </Link>
                <Button size="sm" className="bg-purple-accent hover:bg-purple-accent/90 text-white neo-brutal-purple w-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
