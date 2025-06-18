import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CheckSquare, 
  Workflow, 
  BarChart3, 
  Users, 
  Megaphone,
  Settings,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/auth/AuthDialog';
import UserProfile from '@/components/auth/UserProfile';

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "To-Do Flow",
    url: "/todos",
    icon: CheckSquare,
  },
  {
    title: "Flow Editor",
    url: "/flow-editor",
    icon: Workflow,
  },
  {
    title: "Charts",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Community",
    url: "/community",
    icon: Users,
  },
  {
    title: "Studio",
    url: "/studio",
    icon: Megaphone,
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthDialogOpen(true);
  };

  if (loading) {
    return (
      <Sidebar className="bg-white border-r border-black">
        <SidebarHeader className="bg-white">
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="w-8 h-8 bg-purple-accent rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">VisualFlow</span>
          </div>
        </SidebarHeader>
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-gray-600">Loading...</div>
        </div>
      </Sidebar>
    );
  }

  return (
    <>
      <Sidebar className="bg-white border-r border-black">
        <SidebarHeader className="bg-white">
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="w-8 h-8 bg-purple-accent rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">VisualFlow</span>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel className="text-black">Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      className={`text-black hover:bg-purple-accent hover:text-white transition-colors ${
                        location.pathname === item.url ? 'bg-black text-white' : ''
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel className="text-black">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/dev'}
                    className={`text-black hover:bg-purple-accent hover:text-white transition-colors ${
                      location.pathname === '/dev' ? 'bg-black text-white' : ''
                    }`}
                  >
                    <Link to="/dev">
                      <Settings className="w-5 h-5" />
                      <span>DevTool</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="bg-white border-t border-black">
          {user ? (
            <div className="px-4 py-3">
              <UserProfile />
            </div>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <Button
                onClick={() => handleAuthClick('signin')}
                className="w-full neo-brutal-purple bg-purple-accent"
                size="sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button
                onClick={() => handleAuthClick('signup')}
                variant="outline"
                className="w-full neo-brutal"
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </div>
          )}
          <div className="px-4 py-2 text-xs text-gray-600 border-t border-gray-200">
            © 2024 VisualFlow WebApp
          </div>
        </SidebarFooter>
      </Sidebar>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default AppSidebar;
