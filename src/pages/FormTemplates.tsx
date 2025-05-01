
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import FormCard from "@/components/forms/FormCard";
import { useNavigate } from "react-router-dom";

const FormTemplates: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock templates data
  const templates = [
    {
      id: "temp1",
      title: "生活功能支持評量",
      description: "評估個案在日常生活中的功能表現與支持需求",
      category: "功能評估",
      status: "published" as const,
      updatedAt: "2025-04-15T10:30:00",
    },
    {
      id: "temp2",
      title: "基本能力檢核表",
      description: "檢核個案的基本生活自理能力、社交能力及學習能力",
      category: "能力檢核",
      status: "published" as const,
      updatedAt: "2025-04-10T14:20:00",
    },
    {
      id: "temp3",
      title: "行為觀察紀錄",
      description: "記錄個案的行為表現、頻率及前後刺激",
      category: "行為觀察",
      status: "published" as const,
      updatedAt: "2025-04-05T09:15:00",
    },
    {
      id: "temp4",
      title: "季度發展評估",
      description: "評估個案在過去三個月的發展進度與變化",
      category: "發展評估",
      status: "published" as const,
      updatedAt: "2025-03-30T16:45:00",
    },
    {
      id: "temp5",
      title: "家長回饋問卷",
      description: "收集家長對於個案在家中表現的回饋與建議",
      category: "問卷調查",
      status: "draft" as const,
      updatedAt: "2025-04-28T11:20:00",
    },
    {
      id: "temp6",
      title: "情緒狀態追蹤",
      description: "追蹤記錄個案的情緒狀態變化及影響因素",
      category: "情緒管理",
      status: "archived" as const,
      updatedAt: "2025-02-15T13:10:00",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">表單模板</h1>
          <p className="text-muted-foreground">
            管理與設計各類評估表單模板
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => navigate("/forms/new")}
            className="bg-guardian-green hover:bg-guardian-light-green"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            建立模板
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜尋模板..." className="pl-8 w-full sm:w-[300px]" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1.5" />
          篩選
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all">所有模板</TabsTrigger>
          <TabsTrigger value="published">已發布</TabsTrigger>
          <TabsTrigger value="draft">草稿</TabsTrigger>
          <TabsTrigger value="archived">已封存</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <FormCard
                key={template.id}
                id={template.id}
                title={template.title}
                description={template.description}
                category={template.category}
                status={template.status}
                updatedAt={template.updatedAt}
                type="template"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter((template) => template.status === "published")
              .map((template) => (
                <FormCard
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  description={template.description}
                  category={template.category}
                  status={template.status}
                  updatedAt={template.updatedAt}
                  type="template"
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter((template) => template.status === "draft")
              .map((template) => (
                <FormCard
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  description={template.description}
                  category={template.category}
                  status={template.status}
                  updatedAt={template.updatedAt}
                  type="template"
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter((template) => template.status === "archived")
              .map((template) => (
                <FormCard
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  description={template.description}
                  category={template.category}
                  status={template.status}
                  updatedAt={template.updatedAt}
                  type="template"
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormTemplates;
