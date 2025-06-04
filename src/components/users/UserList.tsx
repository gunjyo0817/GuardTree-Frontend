import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import apiService, { ROLE_MAPPING } from "@/lib/api";
import type { UserData } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

// 編輯用戶表單的驗證 schema
const editUserSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.string().email("請輸入有效的電子郵件"),
  role: z.enum(["CEO", "DIRECTOR", "VICE_DIRECTOR", "TEAM_LEADER", "SUPERVISOR", "SOCIAL_WORKER"]),
  isAdmin: z.boolean(),
  activate: z.boolean(),
  password: z.string().optional(),
  confirmPassword: z.string().optional()
}).refine((data) => {
  // 如果有輸入密碼，則確認密碼必須匹配
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "密碼不匹配",
  path: ["confirmPassword"],
});

type EditUserFormData = z.infer<typeof editUserSchema>;

export interface UserListRef {
  refreshUsers: () => void;
}

export const UserList = forwardRef<UserListRef>((props, ref) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "SOCIAL_WORKER",
      isAdmin: false,
      activate: true,
    },
  });

  const fetchUsers = async () => {
    try {
      const data = await apiService.users.getAll();
      // 根據 created_at 時間排序，早到晚
      const sortedData = data.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setUsers(sortedData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("獲取用戶列表失敗");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshUsers: fetchUsers
  }));

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        isAdmin: editingUser.isAdmin,
        activate: editingUser.activate,
        password: "",
        confirmPassword: "",
      });
    }
  }, [editingUser, form]);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("確定要刪除此用戶嗎？")) return;

    try {
      await apiService.users.delete(userId);
      toast.success("用戶已刪除");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("刪除用戶失敗");
    }
  };

  const handleSubmit = async (data: EditUserFormData) => {
    if (!editingUser) return;

    try {
      // 更新基本信息
      await apiService.users.updateRole(editingUser.id, {
        role: data.role
      });

      await apiService.users.updateAdmin(editingUser.id, {
        isAdmin: data.isAdmin
      });

      await apiService.users.updateActivate(editingUser.id, {
        activate: data.activate
      });

      // 如果有輸入新密碼，則更新密碼
      if (data.password) {
        await apiService.users.adminUpdatePassword(editingUser.id, {
          new_password: data.password
        });
      }

      toast.success("用戶資料已更新");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("更新用戶資料失敗");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">載入中...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>電子郵件</TableHead>
              <TableHead className="!ml-2">角色</TableHead>
              <TableHead >狀態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{ROLE_MAPPING[user.role]}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-transparent"
                  >
                    {user.activate ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ): (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="">
                      {user.activate ? "啟用" : "停用"}
                    </span>
                  </Button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>編輯用戶</DialogTitle>
            <DialogDescription>
              修改用戶資料。如需更改密碼，請填寫密碼欄位。
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="CEO">執行長</option>
                        <option value="DIRECTOR">主任</option>
                        <option value="VICE_DIRECTOR">副主任</option>
                        <option value="TEAM_LEADER">組長</option>
                        <option value="SUPERVISOR">督導 / 班導</option>
                        <option value="SOCIAL_WORKER">社工 / 教保</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">管理員權限</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        賦予用戶管理系統的權限
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">啟用狀態</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        控制用戶是否可以登入系統
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator className="my-4" />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">修改密碼</h4>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新密碼</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="輸入新密碼"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>確認密碼</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="再次輸入新密碼"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">確認修改</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}); 