import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import TodoPage from "./pages/TodoPage";
import FlowEditor from "./pages/FlowEditor";
import DevTool from "./pages/DevTool";
import NotFound from "./pages/NotFound";
import CommunityPage from "./pages/CommunityPage";
import AuthCallback from "./pages/AuthCallback";
import AppSidebar from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <SidebarInset>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/todos" element={<TodoPage />} />
                    <Route path="/flow-editor" element={<FlowEditor />} />
                    <Route path="/dev" element={<DevTool />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics - Coming Soon</h1></div>} />
                    <Route path="/studio" element={<div className="p-8"><h1 className="text-2xl font-bold">Studio - Coming Soon</h1></div>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
