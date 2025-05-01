
import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          歡迎回來，{userName}
        </h1>
        <p className="text-sm text-gray-500">
          {userRole === "admin" ? "管理員" : "教保員"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-guardian-green text-white">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>通知</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="cursor-pointer p-4">
                <div>
                  <div className="font-medium">個案表單提醒</div>
                  <div className="text-sm text-gray-500">
                    陳小明的季度評估表單需於5天內填寫完成
                  </div>
                  <div className="text-xs text-gray-400 mt-1">今天 14:30</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-4">
                <div>
                  <div className="font-medium">系統公告</div>
                  <div className="text-sm text-gray-500">
                    系統將於本週日凌晨2-4點進行維護更新
                  </div>
                  <div className="text-xs text-gray-400 mt-1">昨天 09:15</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-4">
                <div>
                  <div className="font-medium">新增表單模板</div>
                  <div className="text-sm text-gray-500">
                    管理員已新增「行為觀察紀錄」表單模板，現已可使用
                  </div>
                  <div className="text-xs text-gray-400 mt-1">2天前</div>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center font-medium text-guardian-green">
              查看所有通知
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>我的帳號</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>個人資料</DropdownMenuItem>
            <DropdownMenuItem>修改密碼</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>登出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
