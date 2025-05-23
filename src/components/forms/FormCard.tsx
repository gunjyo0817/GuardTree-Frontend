
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Eye, 
  Edit, 
  ChevronRight,
  Copy,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCardProps {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status?: "draft" | "published" | "archived";
  updatedAt: string;
  type: "template" | "record";
  onClick?: () => void;
}

const FormCard: React.FC<FormCardProps> = ({
  id,
  title,
  description,
  category,
  status = "published",
  updatedAt,
  type,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="overflow-hidden h-full transition-all hover:border-guardian-green">
      <CardContent className="p-0">
        <div className={cn(
          "p-1 text-white flex items-center justify-center",
          type === "template" 
            ? "bg-guardian-blue" 
            : "bg-guardian-green"
        )}>
          <span className="text-xs font-medium">
            {type === "template" ? "表單模板" : "填寫紀錄"}
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-guardian-soft-gray rounded-full p-2">
                <FileText className={cn(
                  "h-5 w-5",
                  type === "template" ? "text-guardian-blue" : "text-guardian-green"
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
              </div>
            </div>
            {status && (
              <Badge 
                className={cn(
                  status === "published" && "bg-green-500", 
                  status === "draft" && "bg-amber-500",
                  status === "archived" && "bg-gray-500" 
                )}
              >
                {status === "published" ? "已發布" : status === "draft" ? "草稿" : "已封存"}
              </Badge>
            )}
          </div>

          {description && (
            <p className="text-gray-500 mt-3 line-clamp-2">{description}</p>
          )}

          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>更新於：{formatDate(updatedAt)}</span>
          </div>

          {category && (
            <Badge variant="outline" className="mt-3">
              {category}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t">
        {type === "template" ? (
          <>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4 mr-1" /> 複製
            </Button>
            <div className="space-x-1">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" /> 預覽
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-1" /> 編輯
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={onClick}>
              <Eye className="h-4 w-4 mr-1" /> 查看
            </Button>
            <Button variant="ghost" size="sm" onClick={onClick}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default FormCard;
