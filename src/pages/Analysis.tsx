import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, RefreshCcw, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { AnalysisResult } from '@/types/llm';
import { apiService } from "@/lib/api";

const Analysis: React.FC = () => {
  const [selectedDates] = useState([
    "2023",
    "2024",
    "2025",
    "2026",
  ]);
  const [cases, setCases] = useState<{ id: number; name: string | null }[]>([]);
  const [pendingCase, setPendingCase] = useState<string>("");
  const [pendingForm, setPendingForm] = useState<string>("");
  const [pendingDate, setPendingDate] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState<boolean>(false);
  const formOptions = [
    { value: "form_A", label: "居家活動" },
    { value: "form_B", label: "社區生活活動" },
    { value: "form_C", label: "終身學習" },
    { value: "form_D", label: "作業活動" },
    { value: "form_E", label: "健康與安全活動" },
    { value: "form_F", label: "社交活動" },
    { value: "form_G", label: "保護與倡議活動" },
  ];
  

  // const handleGenerateAnalysis = async () => {
  //   const res = await fetch("/api/analysis", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       case_id: selectedCase,
  //       form_type: selectedForm,
  //       filled_date: selectedDate,
  //     }),
  //   });
  //   const data = await res.json();
  //   setAnalysisResult(data);
  // };

  useEffect(() => {
    const fetchCases = async () => {
      const data = await apiService.cases.getAll();
      console.log("data: ", data);
      setCases(data);
    };
    fetchCases();
  }, []);

  const handleGenerateAnalysis = async () => {
    setSelectedCase(pendingCase);
    setSelectedForm(pendingForm);
    setSelectedDate(pendingDate);
    setIsLoading(true);
    setError("");
    setAnalysisResult(null);
    try {
      const res = await apiService.llm.analyze_form_data(
        pendingCase,
        pendingDate,
        pendingForm
      );
      console.log("res: ", res);
      // if (!res.ok) {
      //   const err = await res.json();
      //   throw new Error(err.detail || "分析失敗");
      // }
      // const data = await res.json();
      const data = res;
      setAnalysisResult(data);
      setHasExistingAnalysis(true);
    } catch (e: any) {
      setError(typeof e === "string" ? e : e?.message || "分析失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">智慧分析</h1>
          <p className="text-muted-foreground">AI 輔助分析服務對象評估數據與趨勢</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="case" className="text-sm font-medium text-gray-700 block mb-1">
              選擇服務對象
            </label>
            <Select value={pendingCase} onValueChange={setPendingCase}>
              <SelectTrigger id="case">
                <SelectValue placeholder="選擇服務對象" />
              </SelectTrigger>
              <SelectContent> {/* get cases from db */}
                {cases.map((caseItem) => (
                  <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                    {caseItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="form" className="text-sm font-medium text-gray-700 block mb-1">
              選擇表單
            </label>
            <Select value={pendingForm} onValueChange={setPendingForm}>
              <SelectTrigger id="form">
                <SelectValue placeholder="選擇表單" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="date" className="text-sm font-medium text-gray-700 block mb-1">
              填寫日期
            </label>
            <Select value={pendingDate} onValueChange={setPendingDate}>
              <SelectTrigger id="date">
                <SelectValue placeholder="選擇年分" />
              </SelectTrigger>
              <SelectContent>
                {selectedDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          onClick={handleGenerateAnalysis} 
          className="bg-guardian-green hover:bg-guardian-light-green whitespace-nowrap h-10 mt-4 sm:mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-1.5" />
          )}
          {isLoading ? "分析中..." : hasExistingAnalysis ? "重新分析" : "生成分析"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">摘要分析</TabsTrigger>
            <TabsTrigger value="recommendations">建議策略</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{ cases.find((c) => c.id.toString() === selectedCase)?.name || selectedCase} - 日常生活功能支持型態評量分析</CardTitle>
                    <CardDescription>根據{selectedDate}年{formOptions.find((f) => f.value === selectedForm)?.label || selectedForm}表單的評估資料分析</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-guardian-soft-purple p-4 rounded-md mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1.5 text-guardian-purple" />
                    AI 智能摘要
                  </h3>
                  <p className="text-gray-700">
                    {analysisResult.summary.summary}
                  </p>
                </div>
                
                <div className="grid gap-6">
                  <div>
                    <h3 className="font-medium mb-3">主要優勢</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                      {analysisResult.summary.strengths}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">需要關注</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                      {analysisResult.summary.concerns}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">優先改善項目</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                      {analysisResult.summary.priority_item}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>智慧化教學與支持建議</CardTitle>
                <CardDescription>基於AI分析的個別化支持策略</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {analysisResult.suggestions.strategy
                    .split('\n')
                    .map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!analysisResult && !isLoading && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>請選擇個案、表單和日期，然後點擊「生成分析」開始 AI 智慧分析</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Analysis;
