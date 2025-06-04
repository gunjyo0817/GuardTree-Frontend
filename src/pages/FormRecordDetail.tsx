import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import { FormRecordResponse } from "@/types/form";
import { Button } from "@/components/ui/button";

const supportLabel = {
  4: "4 - 完全肢體協助",
  3: "3 - 部分身體協助",
  2: "2 - 示範/口頭/手勢提示",
  1: "1 - 監督陪同",
  0: "0 - 不需協助",
  "-1": "N/A - 不適評估",
};

const FormRecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<FormRecordResponse | null>(null);

  useEffect(() => {
    if (id) {
      apiService.form.getById(Number(id)).then(setRecord);
    }
  }, [id]);

  if (!record) return <div>載入中...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)}>返回</Button>
      <h1 className="text-2xl font-bold">表單詳情</h1>
      <div className="space-y-2">
        <div>服務對象：{record.case_name}</div>
        <div>填寫人員：{record.user_name}</div>
        <div>建立時間：{new Date(record.created_at).toLocaleString("zh-TW")}</div>
        <div>表單類型：{record.form_type}</div>
      </div>
      <div className="space-y-4">
        {record.content.map((item, idx) => (
          <div key={idx} className="border rounded p-3">
            <div className="font-medium">
              {item.activity} / {item.item} {item.subitem ? `/ ${item.subitem}` : ""}
            </div>
            <div>核心領域：{item.core_area}</div>
            <div>評分：{supportLabel[item.support_type]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormRecordDetail;
