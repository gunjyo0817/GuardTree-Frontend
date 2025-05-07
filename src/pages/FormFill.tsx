
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const FormFill: React.FC = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    caseId: "",
    caseName: "",
    assessmentDate: "",
    assessmentType: "daily",
    behaviors: "",
    communication: "",
    social: "",
    cognitive: "",
    physical: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("表單已成功提交");
    // In a real app, this would submit the form data to an API
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">填寫新表單</h1>
        <p className="text-muted-foreground">填寫個案評估或日常觀察表單</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>個案評估表單</CardTitle>
          <CardDescription>
            請填寫以下資訊以完成個案評估。所有帶 * 的欄位為必填。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="basic">基本資料</TabsTrigger>
                <TabsTrigger value="assessment">評估內容</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caseId">個案編號 *</Label>
                    <Input
                      id="caseId"
                      value={formData.caseId}
                      onChange={(e) => handleInputChange("caseId", e.target.value)}
                      placeholder="請輸入個案編號"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="caseName">個案姓名 *</Label>
                    <Input
                      id="caseName"
                      value={formData.caseName}
                      onChange={(e) => handleInputChange("caseName", e.target.value)}
                      placeholder="請輸入個案姓名"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessmentDate">評估日期 *</Label>
                    <Input
                      id="assessmentDate"
                      type="date"
                      value={formData.assessmentDate}
                      onChange={(e) => handleInputChange("assessmentDate", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assessmentType">評估類型 *</Label>
                    <Select 
                      value={formData.assessmentType} 
                      onValueChange={(value) => handleInputChange("assessmentType", value)}
                    >
                      <SelectTrigger id="assessmentType">
                        <SelectValue placeholder="選擇評估類型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">日常觀察</SelectItem>
                        <SelectItem value="monthly">月評估</SelectItem>
                        <SelectItem value="quarterly">季評估</SelectItem>
                        <SelectItem value="yearly">年度評估</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("assessment")}
                  >
                    下一步
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="assessment" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="behaviors">行為表現</Label>
                    <Textarea
                      id="behaviors"
                      value={formData.behaviors}
                      onChange={(e) => handleInputChange("behaviors", e.target.value)}
                      placeholder="請描述個案的行為表現"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="communication">溝通能力</Label>
                    <Textarea
                      id="communication"
                      value={formData.communication}
                      onChange={(e) => handleInputChange("communication", e.target.value)}
                      placeholder="請描述個案的溝通能力"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="social">社交互動</Label>
                    <Textarea
                      id="social"
                      value={formData.social}
                      onChange={(e) => handleInputChange("social", e.target.value)}
                      placeholder="請描述個案的社交互動"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cognitive">認知能力</Label>
                    <Textarea
                      id="cognitive"
                      value={formData.cognitive}
                      onChange={(e) => handleInputChange("cognitive", e.target.value)}
                      placeholder="請描述個案的認知能力"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="physical">生理狀況</Label>
                    <Textarea
                      id="physical"
                      value={formData.physical}
                      onChange={(e) => handleInputChange("physical", e.target.value)}
                      placeholder="請描述個案的生理狀況"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">其他備註</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="請填寫其他備註事項"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("basic")}
                  >
                    上一步
                  </Button>
                  <Button type="submit">提交表單</Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormFill;
