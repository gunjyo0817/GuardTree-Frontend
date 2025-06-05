import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Case } from "@/types/case";

interface CaseCardProps extends Omit<Case, 'created_at'> {
  formsCount: number;
  avatarUrl?: string;
  onClick?: () => void;
  onDetailClick?: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({
  id,
  name,
  gender,
  types,
  formsCount = 99,
  updated_at,
  avatarUrl,
  birthdate,
  onClick,
  onDetailClick,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0]
  };

  // calc age
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
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
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="mr-2">{age} 歲</span>
                {gender && (
                  <span className="mr-2">
                    {gender === "male" ? "男" : gender === "female" ? "女" : "其他"}
                  </span>
                )}
                {types?.map((type) => (
                  <Badge key={type} variant="outline" className="ml-1">
                    {type}
                  </Badge>
                ))}
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
            <span>更新於：{formatDate(updated_at)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-0 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation();
            if (onDetailClick) {
              onDetailClick();
            }
          }}
        >
          查看詳情 <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseCard;
