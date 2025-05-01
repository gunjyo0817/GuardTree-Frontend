
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "sonner";

// Define form schema with Zod
const formSchema = z.object({
  username: z.string().min(1, { message: "請輸入使用者名稱" }),
  password: z.string().min(1, { message: "請輸入密碼" }),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock authentication (in a real app, this would be an API call)
      if (values.username === "admin" && values.password === "admin") {
        toast.success("登入成功");
        navigate("/dashboard");
      } else if (values.username === "caregiver" && values.password === "caregiver") {
        toast.success("登入成功");
        navigate("/dashboard");
      } else {
        toast.error("使用者名稱或密碼不正確");
      }
    } catch (error) {
      toast.error("登入失敗，請稍後再試");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">守護樹</h1>
        <p className="text-gray-600 mt-2">偏鄉照護數位助手</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>使用者名稱</FormLabel>
                <FormControl>
                  <Input placeholder="請輸入使用者名稱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密碼</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="請輸入密碼" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-guardian-green focus:ring-guardian-green border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                記住我
              </label>
            </div>
            <a href="#" className="text-sm text-guardian-green hover:text-guardian-light-green">
              忘記密碼?
            </a>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-guardian-green hover:bg-guardian-light-green"
            disabled={isLoading}
          >
            {isLoading ? "登入中..." : "登入"}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>測試帳號:</p>
            <p>管理員: admin / admin</p>
            <p>教保員: caregiver / caregiver</p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
