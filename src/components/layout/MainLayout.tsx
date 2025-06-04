import React, { useState } from "react";
import Header from "./Header";
import SidebarNav from "./SidebarNav";

interface MainLayoutProps {
  userName: string;
  userRole: "admin" | "caregiver";
  children: React.ReactNode;
}

const MainLayout = ({ userName, userRole, children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

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
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
