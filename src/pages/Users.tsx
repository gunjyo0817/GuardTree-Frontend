import React, { useState, useRef } from "react";
import { UserList, UserListRef } from "@/components/users/UserList";
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
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import apiService, { ROLE_MAPPING } from "@/lib/api";

interface NewUserData {
  password: string;
  name: string;
  email: string;
  role: keyof typeof ROLE_MAPPING;
  activate: boolean;
  isAdmin: boolean;
}

const Users: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const userListRef = useRef<UserListRef>(null);
  const [newUser, setNewUser] = useState<NewUserData>({
    password: "",
    name: "",
    email: "",
    role: "SOCIAL_WORKER",
    activate: true,
    isAdmin: false,
  });

  const handleAddUser = async () => {
    try {
      await apiService.users.create(newUser);
      toast.success("已成功新增使用者");
      setShowAddDialog(false);
      setNewUser({
        password: "",
        name: "",
        email: "",
        role: "SOCIAL_WORKER",
        activate: true,
        isAdmin: false,
      });
      userListRef.current?.refreshUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("新增使用者失敗");
    }
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
                      role: e.target.value as keyof typeof ROLE_MAPPING,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="CEO">執行長</option>
                  <option value="DIRECTOR">主任</option>
                  <option value="VICE_DIRECTOR">副主任</option>
                  <option value="TEAM_LEADER">組長</option>
                  <option value="SUPERVISOR">督導 / 班導</option>
                  <option value="SOCIAL_WORKER">社工 / 教保</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="請設定密碼"
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

      <UserList ref={userListRef} />
    </div>
  );
};

export default Users;
