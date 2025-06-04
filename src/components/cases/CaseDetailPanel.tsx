
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Save, X } from "lucide-react";
import { Case, CaseUpdate } from "@/types/case";
import { apiService } from "@/lib/api";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const categories = ["第一類", "第二類", "第三類", "第七類", "其他", "舊制無法對照"];

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
        <Button variant="outline" role="combobox" className="w-full justify-start">
          {value.length > 0 ? value.join(", ") : "選擇類別"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
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

interface CaseDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  case: Case | null;
  onUpdate: (updatedCase: Case) => void;
  onDelete: (caseId: number) => void;
}

const CaseDetailPanel: React.FC<CaseDetailPanelProps> = ({
  isOpen,
  onClose,
  case: caseData,
  onUpdate,
  onDelete
}) => {
  const [formData, setFormData] = useState<CaseUpdate>({
    name: "",
    birthdate: new Date(),
    gender: "male",
    types: [],
    caseDescription: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (caseData) {
      setFormData({
        name: caseData.name,
        birthdate: caseData.birthdate,
        gender: caseData.gender,
        types: caseData.types,
        caseDescription: caseData.caseDescription || "",
      });
    }
  }, [caseData]);

  if (!caseData) return null;

  const handleSave = async () => {
    try {
      const updatedCase = await apiService.cases.update(caseData.id.toString(), formData);
      onUpdate(updatedCase);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating case:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.cases.delete(caseData.id.toString());
      onDelete(caseData.id);
      onClose();
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const calculateAge = (birthdate: Date) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[540px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-xl font-bold">
            個案詳情 - {caseData.name}
          </SheetTitle>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  儲存
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-1" />
                  取消
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                編輯
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  刪除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>確認刪除個案</AlertDialogTitle>
                  <AlertDialogDescription>
                    您確定要刪除個案「{caseData.name}」嗎？此動作無法復原。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    確認刪除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{caseData.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate">出生日期</Label>
              {isEditing ? (
                <Input
                  id="birthdate"
                  type="date"
                  value={formatDate(formData.birthdate || caseData.birthdate)}
                  onChange={e => setFormData({ ...formData, birthdate: new Date(e.target.value) })}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {formatDate(caseData.birthdate)} ({calculateAge(caseData.birthdate)} 歲)
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>性別</Label>
            {isEditing ? (
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
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">
                {caseData.gender === "male" ? "男" : caseData.gender === "female" ? "女" : "其他"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>類別</Label>
            {isEditing ? (
              <MultiCategorySelect
                value={formData.types || []}
                onChange={(types) => setFormData({ ...formData, types })}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">
                {caseData.types.length > 0 ? caseData.types.join(", ") : "無"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseDescription">備註</Label>
            {isEditing ? (
              <Input
                id="caseDescription"
                value={formData.caseDescription}
                onChange={e => setFormData({ ...formData, caseDescription: e.target.value })}
                placeholder="請輸入備註內容"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md min-h-[40px]">
                {caseData.caseDescription || "無備註"}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-gray-500 space-y-1">
              <div>建立時間：{new Date(caseData.created_at).toLocaleString('zh-TW')}</div>
              <div>最後更新：{new Date(caseData.updated_at).toLocaleString('zh-TW')}</div>
              <div>個案編號：#{caseData.id}</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CaseDetailPanel;
