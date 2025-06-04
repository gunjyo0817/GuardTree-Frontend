import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import apiService from "@/lib/api";

// 合併表單驗證
const profileFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  new_password_confirmation: z.string().optional(),
}).refine((data) => {
  // 如果要更改密碼，確保確認密碼相同
  if (data.new_password || data.new_password_confirmation) {
    return data.new_password === data.new_password_confirmation;
  }
  return true;
}, {
  message: "兩次輸入的密碼不相同",
  path: ["new_password_confirmation"],
}).refine((data) => {
  // 如果輸入新密碼，必須輸入當前密碼
  if (data.new_password) {
    return !!data.current_password;
  }
  return true;
}, {
  message: "請輸入目前密碼",
  path: ["current_password"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  // 獲取用戶資料
  const fetchUserProfile = async () => {
    try {
      const userData = await apiService.users.getCurrentUser();
      form.reset({
        name: userData.name,
        email: userData.email,
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("獲取用戶資料失敗");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 提交表單
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // 如果有更改基本資料
      if (values.name || values.email) {
        await apiService.users.updateMe({
            name: values.name || form.getValues("name"),
            email: values.email || form.getValues("email"),
        })
      }

      // 如果有更改密碼
      if (values.new_password) {
        await apiService.users.updatePassword({
          old_password: values.current_password,
          new_password: values.new_password,
        });
      }

      toast.success("資料已更新");
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("更新資料失敗");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">載入中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">個人資料</h1>
          <p className="text-muted-foreground">查看與編輯您的個人資料</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>個人資料</CardTitle>
            <CardDescription>
              管理您的個人資料與密碼
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                form.reset({
                  ...form.getValues(),
                  current_password: "",
                  new_password: "",
                  new_password_confirmation: "",
                });
              }
            }}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? "取消" : "編輯"}
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
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
                        <Input {...field} type="email" readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isEditing && (
                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium">更改密碼</h3>
                  <p className="text-sm text-muted-foreground">
                    如需更改密碼，請填寫以下欄位
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>目前密碼</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="hidden md:block" />
                    <FormField
                      control={form.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>新密碼</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="hidden md:block" />
                    <FormField
                      control={form.control}
                      name="new_password_confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>確認新密碼</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end">
                  <Button type="submit">儲存變更</Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
