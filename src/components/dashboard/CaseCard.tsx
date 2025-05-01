
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseCardProps {
  id: string;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  category?: string;
  formsCount: number;
  lastUpdated: string;
  avatarUrl?: string;
  status?: "active" | "inactive" | "critical";
  onClick?: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({
  id,
  name,
  age,
  gender,
  category,
  formsCount,
  lastUpdated,
  avatarUrl,
  status = "active",
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

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card 
      className="overflow-hidden h-full transition-all hover:border-guardian-green cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="bg-guardian-soft-green text-guardian-green">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span 
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                  getStatusColor(status)
                )} 
              />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                {age && <span className="mr-2">{age} 歲</span>}
                {gender && (
                  <span className="mr-2">
                    {gender === "male" ? "男" : gender === "female" ? "女" : "其他"}
                  </span>
                )}
                {category && (
                  <Badge variant="outline" className="ml-1">
                    {category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-guardian-blue mr-1" />
            <span className="text-gray-600">{formsCount} 份表單記錄</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>更新於：{formatDate(lastUpdated)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-0 border-t">
        <Button variant="ghost" size="sm">
          查看詳情 <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseCard;
