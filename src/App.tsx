import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import TodoPage from "./pages/TodoPage";
import FlowEditor from "./pages/FlowEditor";
import DevTool from "./pages/DevTool";
import NotFound from "./pages/NotFound";
import CommunityPage from "./pages/CommunityPage";
import AuthPage from "./pages/AuthPage";
// Keep AuthCallback for the OAuth flow; it will be mounted under /auth/callback
import AuthCallback from "./pages/AuthCallback";

import AppSidebar from "./components/AppSidebar";

const queryClient = new QueryClient();

const AppContent = () => (
  <Routes>
    {/* Authentication */}
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/auth/callback" element={<AuthCallback />} />

    {/* Main dashboard */}
    <Route
      path="/"
      element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <Index />
            </SidebarInset>
          </div>
        </SidebarProvider>
      }
    />
    <Route
      path="/todos"
      element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <TodoPage />
            </SidebarInset>
          </div>
        </SidebarProvider>
      }
    />
    <Route
      path="/flow-editor"
      element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <FlowEditor />
            </SidebarInset>
          </div>
        </SidebarProvider>
      }
    />
    <Route
      path="/dev"
      element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <DevTool />
            </SidebarInset>
          </div>
        </SidebarProvider>
      }
    />
    <Route
      path="/community"
      element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <CommunityPage />
            </SidebarInset>
          </div>
        </SidebarProvider>
      }
    />

    {/* Placeholder pages */}
    <Route
      path="/analytics"
      element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Analytics - Coming Soon</h1>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      }
    />
    <Route
      path="/studio"
      element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Studio - Coming Soon</h1>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
