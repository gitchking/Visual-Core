
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TodoPage from "./pages/TodoPage";
import FlowEditor from "./pages/FlowEditor";
import DevTool from "./pages/DevTool";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/todos" element={<TodoPage />} />
            <Route path="/flow-editor" element={<FlowEditor />} />
            <Route path="/dev" element={<DevTool />} />
            {/* Placeholder routes for upcoming features */}
            <Route path="/analytics" element={<div className="pt-20 p-8"><h1 className="text-2xl">Analytics - Coming Soon</h1></div>} />
            <Route path="/community" element={<div className="pt-20 p-8"><h1 className="text-2xl">Community - Coming Soon</h1></div>} />
            <Route path="/studio" element={<div className="pt-20 p-8"><h1 className="text-2xl">Studio - Coming Soon</h1></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
