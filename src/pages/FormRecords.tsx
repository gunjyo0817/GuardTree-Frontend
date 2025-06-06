import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import FormCard from "@/components/forms/FormCard";
import { useNavigate, useLocation } from "react-router-dom";
import { formDefinitions } from "@/components/forms/FormPermissions";
import { apiService } from "@/lib/api";
import { FormMetadata } from "@/types/form";

const FormRecords: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [records, setRecords] = React.useState<FormMetadata[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState(""); // 先設為空
  const [year, setYear] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState("all");

  React.useEffect(() => {
    apiService.form.getAll().then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  // only run once
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialSearch = params.get("search") || "";
    if (initialSearch) {
      setSearch(initialSearch);
      params.delete("search");
      navigate({
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : ""
      }, { replace: true });
    }
  }, []);

  // get all years
  const years = React.useMemo(() => {
    const y = Array.from(new Set(records.map(r => r.year))).sort((a, b) => b - a);
    return y.map(String);
  }, [records]);

  // filter records
  const filteredRecords = records.filter(r => {
    const matchCase = r.case_name?.includes(search);
    const matchYear = year ? String(r.year) === year : true;
    return matchCase && matchYear;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">表單紀錄</h1>
          <p className="text-muted-foreground">
            查看與管理所有已填寫的表單
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/forms/fill")}
            className="bg-guardian-green hover:bg-guardian-light-green"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            填寫新表單
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋服務對象..."
            className="pl-8 w-full sm:w-[300px]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={year}
            onChange={e => setYear(e.target.value)}
          >
            <option value=""> 全部年份 </option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">載入中...</div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">所有表單</TabsTrigger>
            {formDefinitions.map((form) => (
              <TabsTrigger key={form.id} value={form.id}>
                {form.name.slice(13)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecords.map((record) => (
                <FormCard
                  key={record.id}
                  id={record.id.toString()}
                  title={`${record.case_name || ""}`}
                  description={`${formDefinitions.find(f => f.id === record.form_type)?.name}`}
                  createdAt={record.created_at}
                  year={record.year}
                  type="record"
                  onClick={() => navigate(`/forms/records/${record.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {formDefinitions.map((form) => (
            <TabsContent key={form.id} value={form.id} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRecords
                  .filter((record) => record.form_type === form.id)
                  .map((record) => (
                    <FormCard
                      key={record.id}
                      id={record.id.toString()}
                      title={`${record.case_name || ""}`}
                      description={`${formDefinitions.find(f => f.id === record.form_type)?.name}`}
                      createdAt={record.created_at}
                      year={record.year}
                      type="record"
                      onClick={() => navigate(`/forms/records/${record.id}`)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default FormRecords;
