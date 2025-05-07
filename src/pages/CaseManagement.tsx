
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { SearchIcon, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CaseCard from "@/components/dashboard/CaseCard";

const CaseManagement: React.FC = () => {
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">個案管理</h1>
          <p className="text-muted-foreground">管理所有個案資料</p>
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
            {cases.map(caseItem => (
              <CaseCard 
                key={caseItem.id} 
                id={caseItem.id} 
                name={caseItem.name} 
                age={caseItem.age} 
                gender={caseItem.gender} 
                category={caseItem.category} 
                formsCount={caseItem.formsCount} 
                lastUpdated={caseItem.lastUpdated} 
                status={caseItem.status} 
                onClick={() => console.log(`查看個案：${caseItem.name}`)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cases
              .filter(caseItem => caseItem.status === "active")
              .map(caseItem => (
                <CaseCard 
                  key={caseItem.id} 
                  id={caseItem.id} 
                  name={caseItem.name} 
                  age={caseItem.age} 
                  gender={caseItem.gender} 
                  category={caseItem.category} 
                  formsCount={caseItem.formsCount} 
                  lastUpdated={caseItem.lastUpdated} 
                  status={caseItem.status} 
                  onClick={() => console.log(`查看個案：${caseItem.name}`)}
                />
              ))
            }
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...cases]
              .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
              .map(caseItem => (
                <CaseCard 
                  key={caseItem.id} 
                  id={caseItem.id} 
                  name={caseItem.name} 
                  age={caseItem.age} 
                  gender={caseItem.gender} 
                  category={caseItem.category} 
                  formsCount={caseItem.formsCount} 
                  lastUpdated={caseItem.lastUpdated} 
                  status={caseItem.status}
                  onClick={() => console.log(`查看個案：${caseItem.name}`)}
                />
              ))
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseManagement;
