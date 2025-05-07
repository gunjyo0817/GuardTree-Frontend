
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "姓名至少需要 2 個字元",
  }),
  email: z.string().email({
    message: "請輸入有效的電子郵件",
  }),
  phone: z.string().min(8, {
    message: "電話號碼至少需要 8 個字元",
  }),
  jobTitle: z.string().min(2, {
    message: "請選擇職務",
  }),
  department: z.string().min(1, {
    message: "請選擇部門",
  }),
});

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - would be fetched from API in a real app
  const userData = {
    id: "user123",
    name: "陳主任",
    email: "chen@guardian.org.tw",
    phone: "0912345678",
    jobTitle: "主任",
    department: "管理部",
    role: "admin",
    joinDate: "2022-01-15",
    avatar: "", // Placeholder for user avatar
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      jobTitle: userData.jobTitle,
      department: userData.department,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would send data to an API
    console.log(values);
    
    // Show success message
    toast({
      title: "個人資料已更新",
      description: "您的個人資料已成功更新。",
    });
    
    setIsEditing(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">個人資料</h1>
          <p className="text-muted-foreground">查看與編輯您的個人資料</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "取消" : "編輯資料"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>個人資料</CardTitle>
            <CardDescription>
              {isEditing ? "編輯您的個人資料" : "您的個人基本資料"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>姓名</FormLabel>
                        <FormControl>
                          <Input placeholder="姓名" {...field} readOnly={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>電子郵件</FormLabel>
                        <FormControl>
                          <Input placeholder="電子郵件" {...field} readOnly={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>電話號碼</FormLabel>
                        <FormControl>
                          <Input placeholder="電話號碼" {...field} readOnly={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>職務</FormLabel>
                        {isEditing ? (
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇職務" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="主任">主任</SelectItem>
                              <SelectItem value="社工">社工</SelectItem>
                              <SelectItem value="教保員">教保員</SelectItem>
                              <SelectItem value="評估人員">評估人員</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl>
                            <Input placeholder="職務" value={field.value} readOnly />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>部門</FormLabel>
                        {isEditing ? (
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="選擇部門" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="管理部">管理部</SelectItem>
                              <SelectItem value="社工部">社工部</SelectItem>
                              <SelectItem value="教保部">教保部</SelectItem>
                              <SelectItem value="評估部">評估部</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl>
                            <Input placeholder="部門" value={field.value} readOnly />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <Button type="submit">儲存變更</Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>帳號資訊</CardTitle>
            <CardDescription>您的帳號詳細資訊</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="text-2xl">{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm">
                  更新照片
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">角色</p>
                <p className="text-base">{userData.role === "admin" ? "系統管理員" : "一般使用者"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">加入日期</p>
                <p className="text-base">{new Date(userData.joinDate).toLocaleDateString("zh-TW")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">帳號 ID</p>
                <p className="text-base">{userData.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
