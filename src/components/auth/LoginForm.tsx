import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
// Change from Google to a valid icon that can represent Google
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// 導入 API 服務
import apiService from "@/lib/api";

// Define form schema with Zod
const formSchema = z.object({
  username: z.string().min(1, {
    message: "請輸入使用者名稱"
  }),
  password: z.string().min(1, {
    message: "請輸入密碼"
  })
});
const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // 使用 API 服務進行登錄請求
      const response = await apiService.auth.login(values.username, values.password);
      
      // 存儲返回的令牌
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        toast.success("登入成功");
        navigate("/cases");
      } else {
        toast.error("登入失敗，請檢查您的使用者名稱和密碼");
      }
      
      // 保留模擬功能作為後備
      if (process.env.NODE_ENV === 'development' && !response.token) {
        // 模擬功能僅在開發環境中使用
        if (values.username === "admin" && values.password === "admin") {
          toast.success("開發模式: 登入成功");
          navigate("/cases");
        } else if (values.username === "caregiver" && values.password === "caregiver") {
          toast.success("開發模式: 登入成功");
          navigate("/cases");
        } else {
          toast.error("使用者名稱或密碼不正確");
        }
      }
    } catch (error) {
      toast.error("登入失敗，請稍後再試");
      console.error("Login error:", error);
      
      // 在開發環境中允許使用模擬登錄
      if (process.env.NODE_ENV === 'development') {
        if (values.username === "admin" && values.password === "admin") {
          toast.success("開發模式: 登入成功");
          navigate("/cases");
        } else if (values.username === "caregiver" && values.password === "caregiver") {
          toast.success("開發模式: 登入成功");
          navigate("/cases");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // 這裡可以實現 Google OAuth 登錄
      // 目前保留模擬功能
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Google 登入成功");
      navigate("/cases");
    } catch (error) {
      toast.error("Google 登入失敗");
      console.error("Google login error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };
  return <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">守護樹</h1>
        <p className="text-gray-600 mt-2">個案資料整合與洞察系統</p>
      </div>
      
      <Button variant="outline" type="button" disabled={isGoogleLoading} onClick={handleGoogleLogin} className="w-full mb-6">
        {isGoogleLoading ? <span className="flex items-center justify-center">
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            登入中...
          </span> : <span className="flex items-center justify-center">
            {/* Use the replacement icon */}
            <span className="bg-white rounded-full flex items-center justify-center mr-2 text-red-500">G</span>
            使用 Google 登入
          </span>}
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            或使用系統帳號
          </span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="username" render={({
          field
        }) => <FormItem>
                <FormLabel>使用者名稱</FormLabel>
                <FormControl>
                  <Input placeholder="請輸入使用者名稱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <FormField control={form.control} name="password" render={({
          field
        }) => <FormItem>
                <FormLabel>密碼</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="請輸入密碼" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-4 w-4 text-guardian-green focus:ring-guardian-green border-gray-300 rounded" />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                記住我
              </label>
            </div>
            <a href="#" className="text-sm text-guardian-green hover:text-guardian-light-green">
              忘記密碼?
            </a>
          </div>
          
          <Button type="submit" className="w-full bg-guardian-green hover:bg-guardian-light-green" disabled={isLoading}>
            {isLoading ? "登入中..." : "登入"}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>測試帳號:</p>
            <p>管理員: admin / admin</p>
            <p>教保員: caregiver / caregiver</p>
          </div>
        </form>
      </Form>
    </div>;
};
export default LoginForm;
