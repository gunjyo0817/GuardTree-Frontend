
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CaseCard from "@/components/dashboard/CaseCard";

const CaseManagement: React.FC = () => {
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  
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
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the new case data
    setShowNewCaseForm(false);
  };
  
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
          <Button onClick={() => setShowNewCaseForm(true)}>
            <UserPlus className="h-4 w-4 mr-1.5" />
            新增個案
          </Button>
        </div>
      </div>

      {showNewCaseForm ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>新增個案</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowNewCaseForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input id="name" placeholder="請輸入姓名" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">年齡</Label>
                  <Input id="age" type="number" placeholder="請輸入年齡" min="0" max="120" required />
                </div>
                <div className="space-y-2">
                  <Label>性別</Label>
                  <RadioGroup defaultValue="male" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">男</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">女</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">類別</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="選擇類別" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="自閉症">自閉症</SelectItem>
                      <SelectItem value="發展遲緩">發展遲緩</SelectItem>
                      <SelectItem value="學習障礙">學習障礙</SelectItem>
                      <SelectItem value="注意力不足">注意力不足</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">緊急聯絡人</Label>
                  <Input id="contactPerson" placeholder="請輸入緊急聯絡人" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">聯絡電話</Label>
                  <Input id="contactNumber" placeholder="請輸入聯絡電話" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">備註</Label>
                <textarea
                  id="notes"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="請輸入備註事項"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setShowNewCaseForm(false)}>
                  取消
                </Button>
                <Button type="submit">儲存</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">所有個案</TabsTrigger>
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
      )}
    </div>
  );
};

export default CaseManagement;
