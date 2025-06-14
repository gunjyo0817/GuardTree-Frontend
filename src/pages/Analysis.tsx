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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState<boolean>(false);
  const [years, setYears] = useState<string[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const formOptions = [
    { value: "A", label: "A - 居家活動" },
    { value: "B", label: "B - 社區生活活動" },
    { value: "C", label: "C - 終身學習" },
    { value: "D", label: "D - 作業活動" },
    { value: "E", label: "E - 健康與安全活動" },
    { value: "F", label: "F - 社交活動" },
    { value: "G", label: "G - 保護與倡議活動" },
  ];

  useEffect(() => {
    const fetchCasesAndForms = async () => {
      const data = await apiService.cases.getAll();
      setCases(data);

      const formRecords = await apiService.form.getAll();
      setForms(formRecords);
      const yearList = Array.from(new Set(formRecords.map(r => r.year)))
        .sort((a, b) => b - a)
        .map(String);
      setYears(yearList);
    };
    fetchCasesAndForms();
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
      let message = "發生未知錯誤";
      if (e.response) {
        message = e.response.data.detail || "伺服器錯誤";
        if (message == "Form not found") {
          message = "找不到指定的表單";
        }
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const availableFormTypes = React.useMemo(() => {
    if (!pendingCase) return [];
    const types = forms
      .filter(f => String(f.case_id) === pendingCase)
      .map(f => f.form_type);
    return Array.from(new Set(types));
  }, [forms, pendingCase]);

  const filteredFormOptions = formOptions.filter(opt => availableFormTypes.includes(opt.value));

  const availableYears = React.useMemo(() => {
    if (!pendingCase || !pendingForm) return [];
    const years = forms
      .filter(f => String(f.case_id) === pendingCase && f.form_type === pendingForm)
      .map(f => f.year);
    return Array.from(new Set(years)).sort((a, b) => b - a).map(String);
  }, [forms, pendingCase, pendingForm]);

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
                {filteredFormOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="date" className="text-sm font-medium text-gray-700 block mb-1">
              選擇年度
            </label>
            <Select value={pendingDate} onValueChange={setPendingDate}>
              <SelectTrigger id="date">
                <SelectValue placeholder="選擇年度" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
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
          {isLoading ? "分析中..." : "查看分析結果"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
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
                    <CardTitle>{cases.find((c) => c.id.toString() === selectedCase)?.name || selectedCase} - 日常生活功能支持型態評量分析</CardTitle>
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
              <p>請選擇服務對象、表單和年度，然後點擊「生成分析」開始 AI 智慧分析</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Analysis;
