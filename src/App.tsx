
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import TodoPage from "./pages/TodoPage";
import FlowEditor from "./pages/FlowEditor";
import DevTool from "./pages/DevTool";
import NotFound from "./pages/NotFound";
import CommunityPage from "./pages/CommunityPage";
import AuthPage from "./pages/AuthPage";
import AppSidebar from "./components/AppSidebar";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg neo-card p-8">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg neo-card p-8">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <Index />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="/todos" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <TodoPage />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="/flow-editor" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <FlowEditor />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="/dev" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <DevTool />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="/community" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <CommunityPage />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <div className="p-8"><h1 className="text-2xl font-bold">Analytics - Coming Soon</h1></div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="/studio" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <div className="p-8"><h1 className="text-2xl font-bold">Studio - Coming Soon</h1></div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

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
