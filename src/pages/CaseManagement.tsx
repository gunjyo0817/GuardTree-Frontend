import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CaseCard from "@/components/dashboard/CaseCard";
import CaseDetailPanel from "@/components/cases/CaseDetailPanel";
import { useNavigate } from "react-router-dom";

import { Case } from "@/types/case";
import { apiService } from "@/lib/api";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { CaseCreate } from "@/types/case";

const categories = ["第一類", "第二類", "第三類", "第七類", "其他", "舊制無法對照"]

function MultiCategorySelect({ value, onChange }: { value: string[]; onChange: (newValue: string[]) => void; }) {
  const toggleCategory = (category: string) => {
    onChange(
      value.includes(category)
        ? value.filter(c => c !== category)
        : [...value, category]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[200px] justify-start">
          {value.length > 0 ? value.join(", ") : "選擇類別"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        {categories.map(category => (
          <div key={category} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={category}
              checked={value.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            />
            <label htmlFor={category} className="text-sm">
              {category}
            </label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function finalizeDate(formData) {
  const newData = { ...formData };
  newData.birthdate = new Date(newData.birthdate);
  return newData
}

function CaseForm({ setCases, setShowNewCaseForm }: { setCases: React.Dispatch<React.SetStateAction<unknown[]>>; setShowNewCaseForm: (v: boolean) => void; }) {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: new Date().toISOString().split("T")[0],
    gender: "male",
    types: [],
    caseDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = await apiService.cases.create(finalizeDate(formData));
    setCases(prev => [...prev, newCase]);
    setShowNewCaseForm(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">姓名</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="請輸入姓名"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthdate">出生日期</Label>
          <Input
            id="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={e => setFormData({ ...formData, birthdate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>性別</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={value => setFormData({ ...formData, gender: value })}
            className="flex space-x-4"
          >
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
          <Label>類別</Label>
          <br />
          <MultiCategorySelect
            value={formData.types}
            onChange={(types) => setFormData({ ...formData, types })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caseDescription">備註</Label>
        <Input
          id="caseDescription"
          value={formData.caseDescription}
          onChange={e => setFormData({ ...formData, caseDescription: e.target.value })}
          placeholder="請輸入備註內容"
        />
      </div>

      <div className="pt-4">
        <Button type="submit">新增服務對象</Button>
      </div>
    </form>
  );
}

const CaseManagement: React.FC = () => {
  const [cases, setCases] = useState<(Case & { formCnt: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      const data = await apiService.cases.getAll();
      console.log(data[0].updated_at);
      setCases(data);
      setLoading(false);
    };
    fetchCases();
  }, []);

  const handleCaseClick = (caseItem: Case) => {
    // 跳轉到表單紀錄頁，並帶上搜尋關鍵字
    navigate(`/forms/records?search=${encodeURIComponent(caseItem.name)}`);
  };

  const handleCaseUpdate = (updatedCase: (Case & { formCnt: number })) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleCaseDelete = (caseId: number) => {
    setCases(prev => prev.filter(c => c.id !== caseId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredCases = cases.filter((caseItem) =>
    caseItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">服務對象管理</h1>
          <p className="text-muted-foreground">管理所有服務對象資料</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜尋服務對象..."
              className="w-full sm:w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowNewCaseForm(true)}>
            <UserPlus className="h-4 w-4 mr-1.5" />
            新增服務對象
          </Button>
        </div>
      </div>

      {showNewCaseForm ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>新增服務對象</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowNewCaseForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <CaseForm setCases={setCases} setShowNewCaseForm={setShowNewCaseForm} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">所有服務對象</TabsTrigger>
              <TabsTrigger value="recent">最近更新</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredCases.length === 0 ? (
              <p className="text-muted-foreground px-2">查無符合的服務對象</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredCases.map(caseItem => (
                  <CaseCard
                    key={caseItem.id}
                    id={caseItem.id}
                    name={caseItem.name}
                    birthdate={caseItem.birthdate}
                    caseDescription={caseItem.caseDescription}
                    gender={caseItem.gender}
                    types={caseItem.types}
                    formsCount={caseItem.formCnt}
                    updated_at={caseItem.updated_at}
                    onClick={() => handleCaseClick(caseItem)}
                    onDetailClick={() => {
                      setSelectedCase(caseItem);
                      setIsDetailPanelOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {filteredCases.length === 0 ? (
              <p className="text-muted-foreground px-2">查無符合的服務對象</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {
                  [...filteredCases]
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                    .map(caseItem => (
                      <CaseCard
                        key={caseItem.id}
                        id={caseItem.id}
                        name={caseItem.name}
                        birthdate={caseItem.birthdate}
                        caseDescription={caseItem.caseDescription}
                        gender={caseItem.gender}
                        types={caseItem.types}
                        formsCount={caseItem.formCnt}
                        updated_at={caseItem.updated_at}
                        onClick={() => handleCaseClick(caseItem)}
                        onDetailClick={() => {
                          setSelectedCase(caseItem);
                          setIsDetailPanelOpen(true);
                        }}
                      />
                    ))
                }
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <CaseDetailPanel
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        case={selectedCase}
        onUpdate={handleCaseUpdate}
        onDelete={handleCaseDelete}
      />
    </div>
  );
};

export default CaseManagement;
