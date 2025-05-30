import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import CaseManagement from "./pages/CaseManagement";
import FormRecords from "./pages/FormRecords";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import FormFill from "./pages/FormFill";
import UserProfile from "./pages/UserProfile";

// Layouts
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

// 受保護的路由組件
const ProtectedRoutes = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout 
      userName={user.name} 
      userRole={user.isAdmin ? "admin" : "caregiver"}
    >
      <Routes>
        <Route path="cases" element={<CaseManagement />} />
        <Route path="forms/records" element={<FormRecords />} />
        <Route path="forms/fill" element={<FormFill />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<UserProfile />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/index" element={<Navigate to="/cases" replace />} />
              <Route path="/*" element={<ProtectedRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
