
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  userName: string;
  userRole: "admin" | "caregiver";
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  userName,
  userRole
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // On mobile, sidebar is collapsed by default
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarNav 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        userRole={userRole}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
