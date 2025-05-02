
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Network, Bell, Shield, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const handleSaveSettings = (section: string) => {
    toast.success(`${section}設定已保存`);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">系統設定</h1>
          <p className="text-muted-foreground">
            設定系統參數、通知和安全性
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="general">基本設定</TabsTrigger>
          <TabsTrigger value="notifications">通知設定</TabsTrigger>
          <TabsTrigger value="security">安全設定</TabsTrigger>
          <TabsTrigger value="backup">資料備份</TabsTrigger>
          <TabsTrigger value="network">網路設定</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                基本設定
              </CardTitle>
              <CardDescription>
                設定系統的基本參數
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">系統名稱</Label>
                  <Input id="system-name" defaultValue="守護樹系統" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">管理員電子郵件</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@example.com" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">深色模式</Label>
                  <Switch id="dark-mode" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="session-timeout">自動登出時間 (分鐘)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    defaultValue="30" 
                    className="w-20 text-right" 
                  />
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings("基本")}>保存設定</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知設定
              </CardTitle>
              <CardDescription>
                設定系統通知偏好
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">電子郵件通知</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="browser-notifications">瀏覽器通知</Label>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">通知頻率</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="real-time" name="notification-frequency" value="real-time" defaultChecked />
                    <Label htmlFor="real-time">即時通知</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="daily-digest" name="notification-frequency" value="daily-digest" />
                    <Label htmlFor="daily-digest">每日摘要</Label>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings("通知")}>保存設定</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                安全設定
              </CardTitle>
              <CardDescription>
                設定系統安全性參數
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">雙重驗證</Label>
                  <Switch id="two-factor" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-expiry">密碼過期時間 (天)</Label>
                  <Input 
                    id="password-expiry" 
                    type="number" 
                    defaultValue="90" 
                    className="w-20 text-right" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min-password-length">最小密碼長度</Label>
                <Input 
                  id="min-password-length" 
                  type="number" 
                  defaultValue="8" 
                  className="w-full" 
                />
              </div>
              
              <Button onClick={() => handleSaveSettings("安全性")}>保存設定</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                資料備份
              </CardTitle>
              <CardDescription>
                設定系統資料備份策略
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">自動備份</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">備份頻率</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="daily" name="backup-frequency" value="daily" defaultChecked />
                    <Label htmlFor="daily">每日</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="weekly" name="backup-frequency" value="weekly" />
                    <Label htmlFor="weekly">每週</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="monthly" name="backup-frequency" value="monthly" />
                    <Label htmlFor="monthly">每月</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retention-period">保留期間 (天)</Label>
                <Input 
                  id="retention-period" 
                  type="number" 
                  defaultValue="30" 
                  className="w-full" 
                />
              </div>
              
              <Button onClick={() => handleSaveSettings("備份")}>保存設定</Button>
              <Button variant="outline" className="ml-2">立即備份</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                網路設定
              </CardTitle>
              <CardDescription>
                設定系統網路參數
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API 網址</Label>
                <Input id="api-url" defaultValue="https://api.example.com" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-cors">允許 CORS</Label>
                  <Switch id="allow-cors" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeout">連線超時時間 (秒)</Label>
                <Input 
                  id="timeout" 
                  type="number" 
                  defaultValue="30" 
                  className="w-full" 
                />
              </div>
              
              <Button onClick={() => handleSaveSettings("網路")}>保存設定</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
