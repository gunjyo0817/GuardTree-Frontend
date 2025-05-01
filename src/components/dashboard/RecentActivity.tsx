
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  type: "form_created" | "form_submitted" | "case_updated" | "system";
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    role: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分鐘前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}小時前`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}天前`;
    } else {
      return new Intl.DateTimeFormat("zh-TW", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      }).format(date);
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "form_created":
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          </div>
        );
      case "form_submitted":
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </div>
        );
      case "case_updated":
        return (
          <div className="bg-amber-100 p-2 rounded-full">
            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
          </div>
        );
      case "system":
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>最近活動</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mr-4">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <time className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </time>
                </div>
                <p className="text-sm text-gray-500">{activity.description}</p>
                {activity.user && (
                  <p className="text-xs text-gray-400">
                    由 {activity.user.name} ({activity.user.role}) 執行
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
