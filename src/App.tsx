
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import FormTemplates from "./pages/FormTemplates";
import FormBuilder from "./components/forms/FormBuilder";
import FormRecords from "./pages/FormRecords";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";

// Layouts
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => {
  // In a real app, this would come from authentication/context
  const [mockUserState] = useState({
    name: "陳主任",
    role: "admin" as "admin" | "caregiver",
    isLoggedIn: false, // Set to false initially, would be true after login
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes would normally be protected with auth middleware */}
            <Route
              path="/"
              element={
                <MainLayout
                  userName={mockUserState.name}
                  userRole={mockUserState.role}
                />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forms/templates" element={<FormTemplates />} />
              <Route path="/forms/new" element={<FormBuilder />} />
              <Route path="/forms/records" element={<FormRecords />} />
              <Route path="/analysis" element={<Analysis />} />
              {/* Add more routes as needed */}
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
