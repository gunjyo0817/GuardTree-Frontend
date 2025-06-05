import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import { FormRecordResponse } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formDefinitions } from "@/components/forms/FormPermissions";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const supportLabel = {
  4: "4 - 完全肢體協助",
  3: "3 - 部分身體協助",
  2: "2 - 示範/口頭/手勢提示",
  1: "1 - 監督陪同",
  0: "0 - 不需協助",
  "-1": "N/A - 不適評估",
};

const supportColor = {
  4: "bg-red-200 text-red-800",
  3: "bg-orange-200 text-orange-800",
  2: "bg-yellow-200 text-yellow-800",
  1: "bg-blue-200 text-blue-800",
  0: "bg-green-200 text-green-800",
  "-1": "bg-gray-200 text-gray-700",
};

function groupContent(content: any[]) {
  // group by activity > item
  const grouped: Record<string, Record<string, any[]>> = {};
  content.forEach(q => {
    if (!grouped[q.activity]) grouped[q.activity] = {};
    if (!grouped[q.activity][q.item]) grouped[q.activity][q.item] = [];
    grouped[q.activity][q.item].push(q);
  });
  return grouped;
}

const FormRecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<FormRecordResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      apiService.form.getById(Number(id)).then(setRecord);
    }
  }, [id]);

  if (!record) return <div className="text-center py-10 text-gray-400">載入中...</div>;

  const grouped = groupContent(record.content);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          返回
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">刪除表單</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>確定要刪除這筆表單紀錄嗎？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作無法復原，確定要刪除？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>取消</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
                onClick={async (e) => {
                  e.preventDefault();
                  setDeleting(true);
                  try {
                    await apiService.form.delete(Number(id));
                    setOpen(false);
                    toast({ title: "刪除成功", description: "表單紀錄已刪除" });
                    navigate("/forms/records");
                  } catch (err) {
                    toast({ title: "刪除失敗", description: "請稍後再試", variant: "destructive" });
                  } finally {
                    setDeleting(false);
                  }
                }}
              >
                確定刪除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <h1 className="text-3xl font-bold tracking-tight">表單詳情</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">基本資料</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-base">
            <div className="text-gray-500">服務對象</div>
            <div>{record.case_name}</div>
            <div className="text-gray-500">填寫人員</div>
            <div>{record.user_name}</div>
            <div className="text-gray-500">建立時間</div>
            <div>{new Date(record.created_at).toLocaleString("zh-TW")}</div>
            <div className="text-gray-500">表單類型</div>
            <div>{formDefinitions.find(f => f.id === record.form_type)?.name || record.form_type}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">評估內容</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.entries(grouped).map(([activity, items]) => (
              <div key={activity} className="mb-8">
                <h3 className="font-semibold text-lg mb-4 text-guardian-green">{activity}</h3>
                <div className="space-y-6">
                  {Object.entries(items).map(([item, arr]) => (
                    arr.length > 1 ? (
                      <div key={item} className="mb-4">
                        <div className="font-medium mb-2">{item}</div>
                        <div className="space-y-2 ml-4">
                          {arr.map((q, idx) => (
                            <div key={idx} className="flex items-center gap-3 justify-between">
                              <span className="flex-1 font-normal">{q.subitem}</span>
                              <div className="flex gap-2 items-center justify-end">
                                <span className="text-xs text-gray-500">核心領域：{q.core_area}</span>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${supportColor[q.support_type] || "bg-gray-100 text-gray-700"}`}>
                                  {supportLabel[q.support_type]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div key={item} className="mb-4 flex items-center gap-3 ml-2 justify-between">
                        <span className="font-medium">{item}</span>
                        <div className="flex gap-2 items-center justify-end">
                          <span className="text-xs text-gray-500">核心領域：{arr[0].core_area}</span>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${supportColor[arr[0].support_type] || "bg-gray-100 text-gray-700"}`}>
                            {supportLabel[arr[0].support_type]}
                          </span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormRecordDetail;
