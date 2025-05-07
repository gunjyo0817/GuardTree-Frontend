
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formDefinitions, useFormPermissions } from "@/components/forms/FormPermissions";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FormFill: React.FC = () => {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  
  // In a real app, this would come from authentication/context
  const mockUserState = {
    name: "陳主任",
    role: "admin" as "admin" | "caregiver",
    jobTitle: "主任",
  };
  
  // Get forms this user can access
  const accessibleForms = useFormPermissions(mockUserState.role, mockUserState.jobTitle);
  
  // Mock cases data
  const cases = [
    { id: "case1", name: "王小明" },
    { id: "case2", name: "李小花" },
    { id: "case3", name: "張小華" },
    { id: "case4", name: "陳小玉" },
  ];
  
  const handleStartForm = () => {
    if (!selectedForm || !selectedCase) {
      toast({
        title: "請選擇必要項目",
        description: "請選擇個案和表單類型",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would navigate to a specific form filling interface
    console.log(`Starting form: ${selectedForm} for case: ${selectedCase}`);
    toast({
      title: "開始填寫表單",
      description: `正在準備表單...`,
    });
    
    // For now, we'll just redirect back to the records page after a delay
    setTimeout(() => {
      navigate("/forms/records");
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">填寫新表單</h1>
        <p className="text-muted-foreground">選擇表單類型並填寫相關評估資料</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>選擇填寫項目</CardTitle>
          <CardDescription>請選擇需要填寫的個案與表單類型</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                選擇個案
              </label>
              <Select
                value={selectedCase}
                onValueChange={setSelectedCase}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇個案" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map((caseItem) => (
                    <SelectItem key={caseItem.id} value={caseItem.id}>
                      {caseItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                選擇表單類型
              </label>
              <Select
                value={selectedForm}
                onValueChange={setSelectedForm}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇表單類型" />
                </SelectTrigger>
                <SelectContent>
                  {accessibleForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              className="bg-guardian-green hover:bg-guardian-light-green"
              onClick={handleStartForm}
            >
              開始填寫
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {selectedForm && (
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">表單說明</TabsTrigger>
            <TabsTrigger value="instructions">填寫指引</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>
                  {formDefinitions.find(form => form.id === selectedForm)?.name || "表單資訊"}
                </CardTitle>
                <CardDescription>表單用途與重要資訊</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {formDefinitions.find(form => form.id === selectedForm)?.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  本表單適用於評估服務對象的能力現況與支持需求，請依實際觀察情形填寫。填寫完成後將自動產生分析報告供團隊討論使用。
                </p>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-blue-700">填寫權限</p>
                  <p className="text-sm text-blue-600">
                    {formDefinitions.find(form => form.id === selectedForm)?.allowedJobTitles.join('、')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="instructions">
            <Card>
              <CardHeader>
                <CardTitle>填寫指引</CardTitle>
                <CardDescription>如何正確填寫此表單</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">填寫前準備</h3>
                  <p className="text-sm text-gray-700">
                    1. 確認您已有足夠時間觀察服務對象的行為表現。
                  </p>
                  <p className="text-sm text-gray-700">
                    2. 準備相關的觀察紀錄或先前評估資料以供參考。
                  </p>
                  <p className="text-sm text-gray-700">
                    3. 與團隊成員討論，確保評估視角的一致性。
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">填寫注意事項</h3>
                  <p className="text-sm text-gray-700">
                    1. 請依照實際觀察到的行為表現評分，避免主觀推測。
                  </p>
                  <p className="text-sm text-gray-700">
                    2. 如有項目無法評估，請標記為「不適用」而非給予低分。
                  </p>
                  <p className="text-sm text-gray-700">
                    3. 系統會自動儲存您的填寫進度，可隨時暫停並稍後繼續。
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">填寫後續流程</h3>
                  <p className="text-sm text-gray-700">
                    1. 表單完成後，系統將自動分析並產生報告。
                  </p>
                  <p className="text-sm text-gray-700">
                    2. 與團隊討論評估結果並制定支持計畫。
                  </p>
                  <p className="text-sm text-gray-700">
                    3. 評估資料將存檔並可用於後續追蹤比較。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FormFill;
