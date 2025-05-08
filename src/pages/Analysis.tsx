import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analysis: React.FC = () => {
  const [selectedDates] = useState([
    "2023-05-15",
    "2023-06-22", 
    "2023-08-10", 
    "2023-09-05", 
    "2023-11-17", 
    "2024-01-23", 
    "2024-03-08", 
    "2024-04-12"
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">智慧分析</h1>
          <p className="text-muted-foreground">AI 輔助分析個案評估數據與趨勢</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="case" className="text-sm font-medium text-gray-700 block mb-1">
              選擇個案
            </label>
            <Select defaultValue="case1">
              <SelectTrigger id="case">
                <SelectValue placeholder="選擇個案" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="case1">王小明</SelectItem>
                <SelectItem value="case2">李小花</SelectItem>
                <SelectItem value="case3">張小華</SelectItem>
                <SelectItem value="case4">陳小玉</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="form" className="text-sm font-medium text-gray-700 block mb-1">
              選擇表單
            </label>
            <Select defaultValue="form1">
              <SelectTrigger id="form">
                <SelectValue placeholder="選擇表單" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form1">基本能力檢核表</SelectItem>
                <SelectItem value="form2">日常生活功能支持型態評量 – B 版</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="date" className="text-sm font-medium text-gray-700 block mb-1">
              填寫日期
            </label>
            <Select defaultValue={selectedDates[selectedDates.length - 1]}>
              <SelectTrigger id="date">
                <SelectValue placeholder="選擇日期" />
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
        <Button className="bg-guardian-green hover:bg-guardian-light-green whitespace-nowrap h-10 mt-4 sm:mt-6">
          <Sparkles className="h-4 w-4 mr-1.5" />
          生成分析
        </Button>
      </div>

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
                  <CardTitle>王小明 - 基本能力檢核表分析</CardTitle>
                  <CardDescription>根據最近一次評估資料分析</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                    更新
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    匯出
                  </Button>
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
                  王小明的基本能力檢核表顯示，他在社交互動能力有顯著表現（85分），生活自理能力居中（65分），但在時間管理與任務規劃方面較弱（40分）。他對結構化活動的參與度高，但在面對開放式任務時需要更多支持。建議加強時間管理訓練並提供視覺提示以增強任務完成度。
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-3">主要優勢</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                    <li>社交互動意願增強，主動性提高</li>
                    <li>口語表達能力有明顯進步</li>
                    <li>日常生活基本自理能力穩定</li>
                    <li>對結構化活動的參與度高</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">需要關注</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                    <li>專注力維持時間較短，尤其在較嘈雜環境</li>
                    <li>情緒調節策略仍需建立</li>
                    <li>面對新任務時的適應彈性不足</li>
                    <li>時間管理能力需要持續提升</li>
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
              <div className="bg-guardian-soft-green p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5 text-guardian-green" />
                  策略摘要
                </h3>
                <p className="text-gray-700">
                  綜合分析王小明的能力表現與趨勢變化，建議重點發展「情緒識別與自我調節」能力，同時維持社交互動的正向發展，並透過環境調整來提升學習專注力。以下策略採用漸進式、多感官及跨情境的教學原則，旨在提升技能泛化與自主應用能力。
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-guardian-green">情緒識別與調節策略</h3>
                  <div className="space-y-3 pl-4">
                    <div>
                      <h4 className="font-medium">1. 情緒識別卡片與日記</h4>
                      <p className="text-gray-700">
                        使用視覺化的情緒卡片，每日引導識別並命名當前情緒。建立情緒日記，記錄一天中的情緒變化和可能的觸發因素。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">2. 身體感覺覺察練習</h4>
                      <p className="text-gray-700">
                        教導連結情緒與身體感覺（如緊張時心跳加速），透過覺察身體訊號及早識別情緒變化，提前採取調節策略。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">3. 情緒調節工具箱</h4>
                      <p className="text-gray-700">
                        建立個人化的「情緒工具箱」，包含深呼吸卡片、安靜角落標示、喜愛的感官工具等，並指導如何根據不同情緒強度選擇適當工具。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-guardian-blue">專注力提升策略</h3>
                  <div className="space-y-3 pl-4">
                    <div>
                      <h4 className="font-medium">1. 環境調整</h4>
                      <p className="text-gray-700">
                        減少視覺和聽覺干擾，提供安靜的學習空間。可使用隔板或耳罩，根據需要調整環境刺激量。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">2. 時間結構化</h4>
                      <p className="text-gray-700">
                        使用視覺化時間表與計時器，將學習活動分為20-25分鐘小段，中間安排5分鐘感官或動作休息。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">3. 任務分解與獎勵系統</h4>
                      <p className="text-gray-700">
                        將複雜任務分解為小步驟，每完成一步驟給予即時正向反饋。建立累積獎勵系統，鼓勵持續專注。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-guardian-purple">社交互動維持與提升策略</h3>
                  <div className="space-y-3 pl-4">
                    <div>
                      <h4 className="font-medium">1. 結構化社交情境</h4>
                      <p className="text-gray-700">
                        持續提供有明確角色與規則的小組活動，逐步增加互動複雜度和持續時間。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">2. 社交腳本練習</h4>
                      <p className="text-gray-700">
                        針對不同社交情境預先練習互動腳本，提供適當回應的選項與示範，並在真實情境中引導應用。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">3. 同儕支持系統</h4>
                      <p className="text-gray-700">
                        安排與特定同儕的結對活動，培養自然的友誼關係，逐步擴展社交圈。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-blue-500">家庭協作策略</h3>
                  <div className="space-y-3 pl-4">
                    <div>
                      <h4 className="font-medium">1. 家庭-機構一致性策略</h4>
                      <p className="text-gray-700">
                        與家長分享機構中有效的視覺提示、情緒調節工具和獎勵系統，確保環境之間的一致性。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">2. 家長指導課程</h4>
                      <p className="text-gray-700">
                        每月與家長舉行策略分享會議，示範技巧應用並解答問題，共同調整支持策略。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">3. 雙向反饋機制</h4>
                      <p className="text-gray-700">
                        建立家庭-機構的日常溝通管道，即時分享表現變化與有效策略，確保支持的連續性。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;
