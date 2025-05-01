import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, FileText, Users, BarChart3, Clock, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CaseCard from "@/components/dashboard/CaseCard";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
const Dashboard: React.FC = () => {
  // Mock data for cases
  const cases = [{
    id: "case1",
    name: "王小明",
    age: 12,
    gender: "male" as const,
    category: "自閉症",
    formsCount: 8,
    lastUpdated: "2025-04-23T10:30:00",
    status: "active" as const
  }, {
    id: "case2",
    name: "李小花",
    age: 9,
    gender: "female" as const,
    category: "發展遲緩",
    formsCount: 5,
    lastUpdated: "2025-04-21T15:45:00",
    status: "critical" as const
  }, {
    id: "case3",
    name: "張小華",
    age: 15,
    gender: "male" as const,
    category: "學習障礙",
    formsCount: 12,
    lastUpdated: "2025-04-18T09:00:00",
    status: "active" as const
  }, {
    id: "case4",
    name: "陳小玉",
    age: 7,
    gender: "female" as const,
    category: "注意力不足",
    formsCount: 4,
    lastUpdated: "2025-04-15T13:20:00",
    status: "inactive" as const
  }];

  // Mock data for activities
  const activities = [{
    id: "act1",
    type: "form_submitted" as const,
    title: "已提交季度評估表單",
    description: "為「王小明」完成季度發展評估表單",
    timestamp: "2025-04-30T14:30:00",
    user: {
      name: "林教師",
      role: "教保員"
    }
  }, {
    id: "act2",
    type: "case_updated" as const,
    title: "更新個案資料",
    description: "更新「李小花」的個人資料與聯絡方式",
    timestamp: "2025-04-29T11:25:00",
    user: {
      name: "陳主任",
      role: "管理員"
    }
  }, {
    id: "act3",
    type: "form_created" as const,
    title: "新增表單模板",
    description: "建立新的「行為觀察紀錄」表單模板",
    timestamp: "2025-04-28T09:15:00",
    user: {
      name: "陳主任",
      role: "管理員"
    }
  }, {
    id: "act4",
    type: "system" as const,
    title: "系統維護公告",
    description: "系統將於本週日凌晨2-4點進行維護更新",
    timestamp: "2025-04-27T16:00:00"
  }];
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">儀表板</h1>
          <p className="text-muted-foreground">歡迎使用守護樹，您的個案資料整合與洞察系統</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="搜尋個案..." className="w-full sm:w-[200px] pl-8" />
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-1.5" />
            新增個案
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="活躍個案數" value="24" description="本月新增 3 位個案" icon={<Users className="h-5 w-5 text-guardian-green" />} trend={{
        value: 14,
        isPositive: true
      }} />
        <StatCard title="待填寫表單" value="7" description="本週到期" icon={<FileText className="h-5 w-5 text-guardian-blue" />} />
        <StatCard title="完成評估" value="68" description="本月累計" icon={<BarChart3 className="h-5 w-5 text-guardian-purple" />} trend={{
        value: 5,
        isPositive: true
      }} />
        <StatCard title="平均填寫時間" value="12分鐘" description="較上月減少2分鐘" icon={<Clock className="h-5 w-5 text-guardian-green" />} trend={{
        value: 14,
        isPositive: true
      }} />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">所有個案</TabsTrigger>
            <TabsTrigger value="active">活躍個案</TabsTrigger>
            <TabsTrigger value="recent">最近更新</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cases.map(caseItem => <CaseCard key={caseItem.id} id={caseItem.id} name={caseItem.name} age={caseItem.age} gender={caseItem.gender} category={caseItem.category} formsCount={caseItem.formsCount} lastUpdated={caseItem.lastUpdated} status={caseItem.status} onClick={() => console.log(`查看個案：${caseItem.name}`)} />)}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cases.filter(caseItem => caseItem.status === "active").map(caseItem => <CaseCard key={caseItem.id} id={caseItem.id} name={caseItem.name} age={caseItem.age} gender={caseItem.gender} category={caseItem.category} formsCount={caseItem.formsCount} lastUpdated={caseItem.lastUpdated} status={caseItem.status} onClick={() => console.log(`查看個案：${caseItem.name}`)} />)}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...cases].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).map(caseItem => <CaseCard key={caseItem.id} id={caseItem.id} name={caseItem.name} age={caseItem.age} gender={caseItem.gender} category={caseItem.category} formsCount={caseItem.formsCount} lastUpdated={caseItem.lastUpdated} status={caseItem.status} onClick={() => console.log(`查看個案：${caseItem.name}`)} />)}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>表單提交進度</CardTitle>
              <CardDescription>本月表單填寫情況</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] flex items-center justify-center bg-guardian-soft-gray">
                <p className="text-muted-foreground">表單填寫分析圖表將在這裡顯示</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>;
};
export default Dashboard;