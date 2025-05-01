
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

type UserRole = "admin" | "caregiver" | "social_worker" | "specialist";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLogin: string | null;
}

const roleLabels: Record<UserRole, string> = {
  admin: "管理員",
  caregiver: "教保員",
  social_worker: "社工",
  specialist: "專業評估人員",
};

const Users: React.FC = () => {
  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "陳主任",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2025-05-01T09:30:00",
    },
    {
      id: "2",
      name: "王教師",
      email: "teacher1@example.com",
      role: "caregiver",
      status: "active",
      lastLogin: "2025-04-28T14:45:00",
    },
    {
      id: "3",
      name: "李社工",
      email: "social1@example.com",
      role: "social_worker",
      status: "active",
      lastLogin: "2025-04-30T11:20:00",
    },
    {
      id: "4",
      name: "張專員",
      email: "specialist1@example.com",
      role: "specialist",
      status: "inactive",
      lastLogin: null,
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "caregiver" as UserRole,
    password: "",
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  const handleAddUser = () => {
    // In a real app, this would be an API call
    const newUserWithId: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      lastLogin: null,
    };

    setUsers([...users, newUserWithId]);
    setShowAddDialog(false);
    setNewUser({ name: "", email: "", role: "caregiver", password: "" });
    toast.success("已成功新增使用者");
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(
      users.map((user) =>
        user.id === editingUser.id ? { ...editingUser } : user
      )
    );
    setShowEditDialog(false);
    setEditingUser(null);
    toast.success("已成功更新使用者資料");
  };

  const handleDeleteUser = (user: User) => {
    setUsers(users.filter((u) => u.id !== user.id));
    setDeleteConfirmUser(null);
    toast.success("已成功刪除使用者");
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const statusText = newStatus === "active" ? "啟用" : "停用";

    setUsers(
      users.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    toast.success(`已${statusText}使用者 ${user.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">人員管理</h1>
          <p className="text-muted-foreground">管理系統使用者帳號與權限</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              新增使用者
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增使用者</DialogTitle>
              <DialogDescription>
                請填寫新使用者的資訊。建立後，系統將發送啟用信件給使用者。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="請輸入姓名"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="請輸入電子郵件"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">角色</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="caregiver">教保員</option>
                  <option value="social_worker">社工</option>
                  <option value="specialist">專業評估人員</option>
                  <option value="admin">管理員</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">初始密碼</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="請設定初始密碼"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                取消
              </Button>
              <Button onClick={handleAddUser}>新增</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>系統使用者列表</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>電子郵件</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>最後登入</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{roleLabels[user.role]}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status === "active" ? "啟用" : "停用"}
                  </span>
                </TableCell>
                <TableCell>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "尚未登入"}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingUser(user);
                      setShowEditDialog(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">編輯</span>
                  </Button>
                  <Button
                    variant={user.status === "active" ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === "active" ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {user.status === "active" ? "停用" : "啟用"}
                    </span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteConfirmUser(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">刪除</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯使用者</DialogTitle>
            <DialogDescription>
              更新使用者資訊與權限設定。
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">姓名</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">電子郵件</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">角色</Label>
                <select
                  id="edit-role"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="caregiver">教保員</option>
                  <option value="social_worker">社工</option>
                  <option value="specialist">專業評估人員</option>
                  <option value="admin">管理員</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">狀態</Label>
                <select
                  id="edit-status"
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">啟用</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reset-password">重設密碼</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.success(`已發送密碼重設信件給 ${editingUser.name}`);
                    }}
                  >
                    發送重設密碼信件
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateUser}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmUser}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
            <DialogDescription>
              您確定要刪除使用者 {deleteConfirmUser?.name} 嗎？此操作無法恢復。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmUser(null)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmUser && handleDeleteUser(deleteConfirmUser)}
            >
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
