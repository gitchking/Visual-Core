
import React from 'react';
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
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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
      
      <SidebarFooter className="bg-white border-t border-black p-4">
        {user ? (
          <div className="space-y-2">
            <div className="text-xs text-gray-600 truncate">
              {user.email}
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="w-full text-xs neo-brutal"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              Guest Mode
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs neo-brutal"
            >
              <Link to="/auth">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        )}
        <div className="text-xs text-gray-600 mt-2">
          © 2024 VisualFlow WebApp
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
