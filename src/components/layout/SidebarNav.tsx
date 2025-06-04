import React from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Users, 
  LogOut,
  BarChart,
  FileText,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/UserContext";

interface SidebarNavProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userRole: "admin" | "caregiver";
}

const SidebarNav: React.FC<SidebarNavProps> = ({ 
  collapsed, 
  setCollapsed,
  userRole
}) => {
  const isMobile = useIsMobile();
  const { logout } = useUser();
  
  // Admin sees all menu items, caregivers only see some
  const navItems = [
    {
      name: "個案管理",
      href: "/cases",
      icon: Users,
    },
    {
      name: "表單紀錄",
      href: "/forms/records",
      icon: FileText,
    },
    {
      name: "智慧分析",
      href: "/analysis",
      icon: BarChart,
    },
    // Only show Users management for admin role
    ...(userRole === "admin" 
      ? [{
          name: "人員管理",
          href: "/users",
          icon: Settings,
        }]
      : [])
  ];

  return (
    <nav 
      className={cn(
        "bg-sidebar h-screen flex flex-col py-4 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 mb-6">
        {!collapsed && (
          <Link to="/" className="text-white text-xl font-bold">
            守護樹
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-sidebar-accent rounded-full"
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <div className="flex-1">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className="flex items-center justify-center h-10 w-10 mx-auto rounded-md hover:bg-sidebar-accent text-white"
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent text-white"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </div>

      <div className="px-4 mt-auto">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full mx-auto hover:bg-sidebar-accent text-white"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">登出</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-sidebar-accent text-white"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>登出</span>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default SidebarNav;
