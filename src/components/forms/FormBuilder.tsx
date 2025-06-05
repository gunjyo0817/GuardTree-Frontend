import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import formData from "@/data/form.json";

type FieldType = 
  | 'text'
  | 'number'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'textarea'
  | 'date';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

// 轉換 json 結構成 FormBuilder sections
const mapFormJsonToSections = (formJson) => {
  return Object.entries(formJson).map(([key, items]) => ({
    id: key,
    title: key.replace("form_", "") + " 項",
    fields: items.map((item, idx) => ({
      id: `${key}-${idx}`,
      label: [item.activity, item.item, item.subitem].filter(Boolean).join(" - "),
      type: "checkbox", // 你要什麼型態自己決定
      required: false,
    })),
  }));
};

const sectionsFromJson = mapFormJsonToSections(formData);

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [sections, setSections] = useState<FormSection[]>(sectionsFromJson);
  const [activeTab, setActiveTab] = useState("design");
  
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: "section_" + Date.now(),
        title: `區段 ${sections.length + 1}`,
        fields: [],
      },
    ]);
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    );
  };

  const addField = (sectionId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: [
              ...section.fields,
              {
                id: generateId(),
                label: `欄位 ${section.fields.length + 1}`,
                type: "text",
                required: false,
              },
            ],
          };
        }
        return section;
      })
    );
  };

  const updateField = (
    sectionId: string,
    fieldId: string,
    updates: Partial<FormField>
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map((field) =>
              field.id === fieldId ? { ...field, ...updates } : field
            ),
          };
        }
        return section;
      })
    );
  };

  const removeField = (sectionId: string, fieldId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.filter((field) => field.id !== fieldId),
          };
        }
        return section;
      })
    );
  };

  const moveField = (
    sectionId: string,
    fieldId: string,
    direction: "up" | "down"
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const fieldIndex = section.fields.findIndex(
            (field) => field.id === fieldId
          );
          if (
            (direction === "up" && fieldIndex === 0) ||
            (direction === "down" && fieldIndex === section.fields.length - 1)
          ) {
            return section;
          }

          const newFields = [...section.fields];
          const newIndex = direction === "up" ? fieldIndex - 1 : fieldIndex + 1;
          const [movedField] = newFields.splice(fieldIndex, 1);
          newFields.splice(newIndex, 0, movedField);

          return {
            ...section,
            fields: newFields,
          };
        }
        return section;
      })
    );
  };

  const duplicateField = (sectionId: string, fieldId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const fieldToDuplicate = section.fields.find((f) => f.id === fieldId);
          if (!fieldToDuplicate) return section;

          const newField = {
            ...fieldToDuplicate,
            id: generateId(),
            label: `${fieldToDuplicate.label} (複製)`,
          };

          const fieldIndex = section.fields.findIndex(
            (field) => field.id === fieldId
          );
          const newFields = [...section.fields];
          newFields.splice(fieldIndex + 1, 0, newField);

          return {
            ...section,
            fields: newFields,
          };
        }
        return section;
      })
    );
  };

  const removeSection = (sectionId: string) => {
    if (sections.length === 1) {
      toast.error("表單至少需要一個區段");
      return;
    }
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const addOption = (sectionId: string, fieldId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map((field) => {
              if (field.id === fieldId) {
                const options = field.options || [];
                return {
                  ...field,
                  options: [...options, `選項 ${options.length + 1}`],
                };
              }
              return field;
            }),
          };
        }
        return section;
      })
    );
  };

  const updateOption = (
    sectionId: string,
    fieldId: string,
    optionIndex: number,
    value: string
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map((field) => {
              if (field.id === fieldId && field.options) {
                const newOptions = [...field.options];
                newOptions[optionIndex] = value;
                return { ...field, options: newOptions };
              }
              return field;
            }),
          };
        }
        return section;
      })
    );
  };

  const removeOption = (
    sectionId: string,
    fieldId: string,
    optionIndex: number
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map((field) => {
              if (field.id === fieldId && field.options) {
                const newOptions = [...field.options];
                newOptions.splice(optionIndex, 1);
                return { ...field, options: newOptions };
              }
              return field;
            }),
          };
        }
        return section;
      })
    );
  };

  const handleSubmit = () => {
    if (!formName.trim()) {
      toast.error("請輸入表單名稱");
      return;
    }

    // Check if sections have fields
    const emptySections = sections.filter(section => section.fields.length === 0);
    if (emptySections.length > 0) {
      toast.error(`區段「${emptySections[0].title}」沒有欄位，請新增至少一個欄位`);
      return;
    }

    // Validate fields have labels
    let hasError = false;
    sections.forEach(section => {
      section.fields.forEach(field => {
        if (!field.label.trim()) {
          toast.error(`請為所有欄位提供標籤名稱`);
          hasError = true;
        }
        if ((field.type === 'radio' || field.type === 'checkbox' || field.type === 'select') && 
            (!field.options || field.options.length === 0)) {
          toast.error(`欄位「${field.label}」需要至少一個選項`);
          hasError = true;
        }
      });
    });

    if (hasError) return;

    // Create the form JSON
    const formData = {
      id: generateId(),
      name: formName,
      description: formDescription,
      sections: sections,
      createdAt: new Date().toISOString(),
    };

    // In a real app, this would be sent to the API
    console.log("Form saved:", formData);
    toast.success("表單模板儲存成功");
    
    // Navigate back after saving
    setTimeout(() => {
      navigate("/forms/templates");
    }, 1500);
  };

  const renderFieldOptions = (
    sectionId: string,
    field: FormField,
    index: number
  ) => {
    if (
      field.type === "radio" ||
      field.type === "checkbox" ||
      field.type === "select"
    ) {
      return (
        <div className="mt-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">選項</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addOption(sectionId, field.id)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              新增選項
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {field.options?.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="flex items-center space-x-2"
              >
                <Input
                  value={option}
                  onChange={(e) =>
                    updateOption(
                      sectionId,
                      field.id,
                      optionIndex,
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeOption(sectionId, field.id, optionIndex)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {(!field.options || field.options.length === 0) && (
              <p className="text-sm text-gray-500 italic">
                請新增至少一個選項
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getPreviewField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <Input 
            placeholder={field.placeholder || `請輸入${field.label}`} 
            disabled 
          />
        );
      case "number":
        return (
          <Input 
            type="number" 
            placeholder={field.placeholder || `請輸入${field.label}`} 
            disabled 
          />
        );
      case "textarea":
        return (
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-24"
            placeholder={field.placeholder || `請輸入${field.label}`}
            disabled
          />
        );
      case "select":
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="請選擇" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  id={`radio-${field.id}-${i}`}
                  name={field.id}
                  value={option}
                  className="h-4 w-4 text-guardian-green border-gray-300"
                  disabled
                />
                <label
                  htmlFor={`radio-${field.id}-${i}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`checkbox-${field.id}-${i}`}
                  value={option}
                  className="h-4 w-4 text-guardian-green rounded border-gray-300"
                  disabled
                />
                <label
                  htmlFor={`checkbox-${field.id}-${i}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "date":
        return (
          <Input 
            type="date" 
            disabled 
          />
        );
      default:
        return <Input disabled />;
    }
  };

  return (
    <div className="container mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">建立表單模板</h1>
        </div>
        <Button onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          儲存表單
        </Button>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="form-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              表單名稱 *
            </label>
            <Input
              id="form-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="請輸入表單名稱"
              className="mb-4"
            />
          </div>
          <div>
            <label
              htmlFor="form-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              表單描述
            </label>
            <Input
              id="form-description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="請輸入表單描述"
            />
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="design"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="design">設計表單</TabsTrigger>
          <TabsTrigger value="preview">預覽表單</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <Card key={section.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        updateSectionTitle(section.id, e.target.value)
                      }
                      placeholder="區段標題"
                      className="font-semibold text-lg"
                    />
                  </div>
                  <div>
                    {sections.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(section.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {section.fields.length === 0 && (
                  <div className="bg-muted rounded-md p-8 text-center">
                    <p className="text-gray-500">
                      這個區段還沒有欄位，請點擊「新增欄位」來開始
                    </p>
                    <Button
                      className="mt-2"
                      onClick={() => addField(section.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      新增欄位
                    </Button>
                  </div>
                )}

                {section.fields.map((field, fieldIndex) => (
                  <div
                    key={field.id}
                    className="border rounded-md p-4 mt-4"
                  >
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex-1 min-w-[250px]">
                        <label className="block text-sm font-medium mb-1">
                          欄位標籤
                        </label>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            updateField(section.id, field.id, {
                              label: e.target.value,
                            })
                          }
                          placeholder="請輸入欄位標籤"
                        />
                      </div>

                      <div className="w-40">
                        <label className="block text-sm font-medium mb-1">
                          欄位類型
                        </label>
                        <Select
                          value={field.type}
                          onValueChange={(value) =>
                            updateField(section.id, field.id, {
                              type: value as FieldType,
                              options:
                                value === "radio" ||
                                value === "checkbox" ||
                                value === "select"
                                  ? field.options || ["選項 1"]
                                  : undefined,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇類型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">單行文字</SelectItem>
                            <SelectItem value="textarea">多行文字</SelectItem>
                            <SelectItem value="number">數字</SelectItem>
                            <SelectItem value="date">日期</SelectItem>
                            <SelectItem value="select">下拉選單</SelectItem>
                            <SelectItem value="radio">單選按鈕</SelectItem>
                            <SelectItem value="checkbox">核取方塊</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-40">
                        <label className="block text-sm font-medium mb-1">
                          必填欄位
                        </label>
                        <Select
                          value={field.required ? "true" : "false"}
                          onValueChange={(value) =>
                            updateField(section.id, field.id, {
                              required: value === "true",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">必填</SelectItem>
                            <SelectItem value="false">選填</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {field.type === "text" || field.type === "number" || field.type === "textarea" ? (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          預設文字
                        </label>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            updateField(section.id, field.id, {
                              placeholder: e.target.value,
                            })
                          }
                          placeholder="預設文字（選填）"
                        />
                      </div>
                    ) : null}

                    {renderFieldOptions(section.id, field, fieldIndex)}

                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          moveField(section.id, field.id, "up")
                        }
                        disabled={fieldIndex === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          moveField(section.id, field.id, "down")
                        }
                        disabled={fieldIndex === section.fields.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          duplicateField(section.id, field.id)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(section.id, field.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => addField(section.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新增欄位
                </Button>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button variant="outline" onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              新增區段
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">{formName || "未命名表單"}</h2>
              {formDescription && <p className="text-gray-500 mb-6">{formDescription}</p>}

              {sections.map((section) => (
                <div key={section.id} className="mb-8">
                  <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                    {section.title}
                  </h3>
                  <div className="space-y-6">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium mb-1">
                          {field.label}
                          {field.required && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </label>
                        {getPreviewField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <Button disabled>送出表單</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
