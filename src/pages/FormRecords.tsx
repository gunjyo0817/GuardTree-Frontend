
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import FormCard from "@/components/forms/FormCard";
import { useNavigate } from "react-router-dom";
import { formDefinitions } from "@/components/forms/FormPermissions";

const FormRecords: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock form records data
  const formRecords = [
    {
      id: "record1",
      title: "王小明 - 生活功能支持評量",
      description: "2025年第一季度評估結果",
      category: "日常生活功能支持型態評量 – B 版",
      updatedAt: "2025-04-28T10:30:00",
    },
    {
      id: "record2",
      title: "李小花 - 基本能力檢核表",
      description: "入班評估",
      category: "基本能力檢核表",
      updatedAt: "2025-04-24T14:20:00",
    },
    {
      id: "record3",
      title: "張小華 - 三級預防支持檢核",
      description: "季度評估",
      category: "三級預防支持需求分級檢核表",
      updatedAt: "2025-04-20T09:15:00",
    },
    {
      id: "record4",
      title: "陳小玉 - 老化現象評估",
      description: "2025年第一季度評估",
      category: "老化現象評估表",
      updatedAt: "2025-04-18T16:45:00",
    },
    {
      id: "record5",
      title: "王小明 - 吞嚥障礙評估",
      description: "進食觀察",
      category: "吞嚥障礙評估表",
      updatedAt: "2025-04-15T11:20:00",
    },
    {
      id: "record6",
      title: "李小花 - 基本能力檢核表",
      description: "複評結果",
      category: "基本能力檢核表",
      updatedAt: "2025-04-10T13:10:00",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">表單紀錄</h1>
          <p className="text-muted-foreground">
            查看與管理所有已填寫的表單
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => navigate("/forms/fill")}
            className="bg-guardian-green hover:bg-guardian-light-green"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            填寫新表單
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜尋表單..." className="pl-8 w-full sm:w-[300px]" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1.5" />
          篩選
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all">所有表單</TabsTrigger>
          {formDefinitions.map((form) => (
            <TabsTrigger key={form.id} value={form.id}>
              {form.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formRecords.map((record) => (
              <FormCard
                key={record.id}
                id={record.id}
                title={record.title}
                description={record.description}
                category={record.category}
                updatedAt={record.updatedAt}
                type="record"
              />
            ))}
          </div>
        </TabsContent>
        
        {formDefinitions.map((form) => (
          <TabsContent key={form.id} value={form.id} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formRecords
                .filter((record) => record.category === form.name)
                .map((record) => (
                  <FormCard
                    key={record.id}
                    id={record.id}
                    title={record.title}
                    description={record.description}
                    category={record.category}
                    updatedAt={record.updatedAt}
                    type="record"
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FormRecords;
