import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formDefinitions } from "@/components/forms/FormPermissions";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/lib/api";
import formData from "@/data/form.json";

function makeKey(q: any) {
  return [q.activity, q.item, q.subitem].join("|");
}

const supportOptions = [
  { value: 4, label: "4 - 完全肢體協助" },
  { value: 3, label: "3 - 部分身體協助" },
  { value: 2, label: "2 - 示範/口頭/手勢提示" },
  { value: 1, label: "1 - 監督陪同" },
  { value: 0, label: "0 - 不需協助" },
  { value: -1, label: "N/A - 不適評估" },
];

const FormFill: React.FC = () => {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [step, setStep] = useState<"select" | "fill">("select");
  const [cases, setCases] = useState<{ id: number, name: string }[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      const data = await apiService.cases.getAll();
      setCases(data.map(c => ({ id: c.id, name: c.name })));
      setLoadingCases(false);
    };
    fetchCases();
  }, []);

  useEffect(() => {
    apiService.users.getCurrentUser().then(user => setCurrentUser(user));
  }, []);

  const handleStartForm = () => {
    if (!selectedForm || !selectedCase) {
      toast({
        title: "請選擇必要項目",
        description: "請選擇服務對象和表單類型",
        variant: "destructive",
      });
      return;
    }

    setStep("fill");
  };

  const handleSubmitForm = async () => {
    const questions = formData[selectedForm] || [];
    const missing = questions
      .map(q => makeKey(q))
      .filter(key => answers[key] == null);
    if (missing.length > 0) {
      setShowErrors(true);
      toast({
        title: "有尚未填寫的欄位",
        description: "請完成所有題目",
        variant: "destructive",
      });
      setTouched(t => {
        const newTouched = { ...t };
        missing.forEach(q => { newTouched[q] = true; });
        return newTouched;
      });
      return;
    }
    setShowErrors(false);

    const year = new Date().getFullYear();
    const existingForms = await apiService.form.getByCaseId(selectedCase);
    const existing = existingForms.find(f => new Date(f.created_at).getFullYear() === year);

    // 你選的那一張表的 key
    const formKey = `${selectedForm}`;
    // 你選的那一張表的題目
    const newItems = formData[selectedForm].map(q => ({
      activity: q.activity,
      item: q.item,
      subitem: q.subitem,
      core_area: q.core_area,
      support_type: answers[makeKey(q)],
    }));

    let payload;
    if (!currentUser) {
      toast({ title: "請先登入" });
      return;
    }
    payload = {
      case_id: Number(selectedCase),
      user_id: currentUser.id,
      year,
      form_type: formKey,
      content: newItems,
    };
    await apiService.form.create(payload);

    try {
      toast({
        title: "表單已提交",
        description: "表單已成功提交並儲存",
      });
      setTimeout(() => {
        navigate("/forms/records");
      }, 1500);
    } catch (err: any) {
      toast({ title: "送出失敗", description: err?.response?.data?.detail || "請稍後再試", variant: "destructive" });
    }
  };

  // Render form selection step
  const renderFormSelection = () => (
    <>
      <Card>
        <CardHeader>
          <CardTitle>選擇填寫項目</CardTitle>
          <CardDescription>請選擇需要填寫的服務對象與表單類型</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                選擇服務對象
              </label>
              <Select
                value={selectedCase}
                onValueChange={setSelectedCase}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇服務對象" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCases
                    ? <div className="p-2 text-gray-400">載入中...</div>
                    : cases.map((caseItem) => (
                        <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                          {caseItem.name}
                        </SelectItem>
                      ))
                  }
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
                  {formDefinitions.map((form) => (
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
                    2. 如有項目無法評估，請標記為「N/A - 不適評估」而非給予低分。
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">填寫後續流程</h3>
                  <p className="text-sm text-gray-700">
                    1. 表單完成後，可至智慧分析頁面產生報告。
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
    </>
  );

  // Render form filling step for the selected form
  const renderFormFilling = () => {
    const selectedFormData = formDefinitions.find(form => form.id === selectedForm);
    const selectedCaseData = cases.find(c => c.id.toString() === selectedCase);

    if (!selectedFormData || !selectedCaseData) return null;

    // 這裡載入對應的題目
    const questions = formData[selectedForm] || [];
    const missing = questions
      .map(q => makeKey(q))
      .filter(key => answers[key] == null);

    // group by activity > item
    const grouped = questions.reduce((acc, q) => {
      if (!acc[q.activity]) acc[q.activity] = {};
      if (q.subitem) {
        if (!acc[q.activity][q.item]) acc[q.activity][q.item] = [];
        acc[q.activity][q.item].push(q);
      } else {
        acc[q.activity][q.item] = q;
      }
      return acc;
    }, {} as Record<string, Record<string, any>>);

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStep("select")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-medium">
            填寫表單：{selectedFormData.name} - {selectedCaseData.name}
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>基本資料</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  填表日期
                </label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  填表人員
                </label>
                <Input defaultValue={currentUser?.name || ""} readOnly />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                評估備註
              </label>
              <Textarea
                placeholder="請輸入本次評估的特殊狀況或其他備註事項..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>評估項目</CardTitle>
            <CardDescription>請依照觀察情形填寫各項目的評估結果</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.entries(grouped).map(([activity, items]) => (
              <div key={activity} className="mb-10 border rounded-lg p-6 bg-gray-50">
                <h3 className="font-semibold text-lg mb-4">{activity}</h3>
                <div>
                  {Object.entries(items).map(([item, value]) => {
                    if (Array.isArray(value)) {
                      // 有 subitem
                      return (
                        <div key={item} className="mb-6">
                          <div className="font-medium mb-3 mt-4">{item}</div>
                          <div>
                            {value.map((q, idx) => (
                              <FormItem
                                key={idx}
                                question={makeKey(q)}
                                label={q.subitem}
                                className="mb-5"
                                error={showErrors && answers[makeKey(q)] == null}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      // 沒 subitem
                      const q = value;
                      return (
                        <div key={item} className="mb-6">
                          <FormItem
                            question={makeKey(q)}
                            label={q.item}
                            className="mb-5"
                            error={showErrors && answers[makeKey(q)] == null}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))}

            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setStep("select")}>
                返回
              </Button>
              <Button onClick={handleSubmitForm}>
                提交表單
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const FormItem = ({ question, label, className = "", error }) => (
    <div className={`space-y-2 ${className}`}>
      <p className="font-medium">{label}</p>
      <div className={`grid grid-cols-2 sm:grid-cols-6 gap-4 ${error ? "border border-red-500 rounded" : ""}`}>
        {supportOptions.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer text-xs">
            <input
              type="radio"
              name={`q-${question}`}
              value={option.value}
              checked={answers[question] === option.value}
              onChange={() => {
                setAnswers(a => ({ ...a, [question]: option.value }));
                setTouched(t => ({ ...t, [question]: true }));
              }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">填寫新表單</h1>
        <p className="text-muted-foreground">選擇表單類型並填寫相關評估資料</p>
      </div>

      {step === "select" ? renderFormSelection() : renderFormFilling()}
    </div>
  );
};

export default FormFill;
