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
import { useUser } from "@/contexts/UserContext";

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
  const { setUser } = useUser();

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
      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);

        // 獲取用戶資料並更新 context
        try {
          const userData = await apiService.users.getCurrentUser();
          setUser(userData);
          toast.success("登入成功");
          navigate("/cases", { replace: true });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast.error("登入成功但無法獲取用戶資料");
          localStorage.removeItem('authToken');
        }
      } else {
        toast.error("登入失敗，請檢查您的使用者名稱和密碼");
        console.error("Login error:", response);
      }
    } catch (error) {
      toast.error("登入失敗，請檢查您的使用者名稱和密碼");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-800">守護樹</h1>
      <p className="text-gray-600 mt-2">服務對象資料整合與洞察系統</p>
    </div>

    <div className="relative mb-6">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-muted-foreground">
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
      </form>
    </Form>
  </div>;
};
export default LoginForm;
