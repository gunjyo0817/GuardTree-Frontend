
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-center mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium ml-2 px-1.5 py-0.5 rounded",
                    trend.isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="bg-guardian-soft-green p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
