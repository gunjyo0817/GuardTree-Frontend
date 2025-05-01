import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, RefreshCcw } from "lucide-react";
const Analysis: React.FC = () => {
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">智慧分析</h1>
          <p className="text-muted-foreground">AI 輔助分析個案評估數據與趨勢</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1 grid gap-4 sm:grid-cols-2">
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
            <label htmlFor="period" className="text-sm font-medium text-gray-700 block mb-1">
              分析時間範圍
            </label>
            <Select defaultValue="quarter">
              <SelectTrigger id="period">
                <SelectValue placeholder="選擇時間範圍" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">近一個月</SelectItem>
                <SelectItem value="quarter">近三個月</SelectItem>
                <SelectItem value="half">近半年</SelectItem>
                <SelectItem value="year">近一年</SelectItem>
                <SelectItem value="all">所有資料</SelectItem>
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
          <TabsTrigger value="trends">趨勢變化</TabsTrigger>
          <TabsTrigger value="recommendations">建議策略</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>王小明 - 能力發展摘要</CardTitle>
                  <CardDescription>根據近三個月的評估資料分析</CardDescription>
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
                  王小明在過去三個月的評估數據顯示，他的社交互動能力有顯著提升（+25%），尤其是在小組活動中願意主動參與討論。生活自理能力保持穩定，但在時間管理方面仍需要協助提醒。學習專注力較前次評估有所下降（-10%），可能與近期環境變化相關。整體情緒表現較為穩定，但在面對挫折時的調節能力仍有提升空間。
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

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>能力領域比較</CardTitle>
                <CardDescription>各領域發展狀況</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-guardian-soft-gray">
                  <p className="text-muted-foreground">能力雷達圖將在這裡顯示</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>表現波動分析</CardTitle>
                <CardDescription>跨情境表現穩定性</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-guardian-soft-gray">
                  <p className="text-muted-foreground">表現波動圖將在這裡顯示</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>三個月趨勢分析</CardTitle>
              <CardDescription>各項能力發展變化軌跡</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-guardian-soft-gray">
                <p className="text-muted-foreground">趨勢分析圖表將在這裡顯示</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-medium mb-4 flex items-center">
              <Sparkles className="h-4 w-4 mr-1.5 text-guardian-purple" />
              AI 趨勢解讀
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-guardian-blue mb-2">社交能力</h4>
                <p className="text-gray-700">
                  社交能力呈現持續上升趨勢，特別是在3月中旬後有明顯躍升，這可能與新實施的小組活動策略有關。在不同社交情境中的表現差異正在縮小，顯示社交技能的泛化能力正在增強。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-guardian-green mb-2">自理能力</h4>
                <p className="text-gray-700">
                  自理能力整體穩定，但在時間管理方面呈現波動。數據顯示在有明確視覺提示的日子，表現明顯較佳，建議持續使用視覺化的時間表和提醒工具。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-guardian-purple mb-2">學習專注力</h4>
                <p className="text-gray-700">
                  學習專注力從2月開始呈現下降趨勢，值得注意的是這與家庭環境變動的時間點一致。近期評估顯示，在安靜環境中的專注表現仍然保持良好，環境刺激是影響其表現的關鍵因素。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-blue-500 mb-2">情緒調節</h4>
                <p className="text-gray-700">
                  情緒調節能力波動較大，但整體趨勢是緩步上升。資料顯示，當有成人協助識別情緒並提供調節策略時，王小明能較快恢復平靜。這表明情緒識別是當前可優先發展的目標。
                </p>
              </div>
            </div>
          </div>
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
    </div>;
};
export default Analysis;