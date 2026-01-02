import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole } from "@/services/api/usersService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { UserAvatarUpload } from "./avatar-upload";
import AppButton from "@/components/atoms/app-button";
import { useTranslation } from "react-i18next";
import { uploadService } from "@/services/api/uploadService";

interface UserEditFormProps {
  user: User;
  onSave: (
    id: number,
    data: {
      name: string;
      role: UserRole;
      dateOfBirth: string;
      avtUrl: string;
    }
  ) => Promise<void>;
  readOnly?: boolean;
}

export function UserEditForm({
  user,
  onSave,
  readOnly = false,
}: UserEditFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || "");
  const [avtUrl, setAvtUrl] = useState(user.avtUrl || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user.name);
    setRole(user.role);
    setDateOfBirth(user.dateOfBirth || "");
    setAvtUrl(user.avtUrl || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    try {
      setLoading(true);
      let finalAvtUrl = avtUrl;

      if (avatarFile) {
        try {
          const folder = user.id ? `avatars/${user.id}` : "avatars";
          const result = await uploadService.uploadToMinio(avatarFile, folder);
          finalAvtUrl = result.public_id; // Store key/public_id in DB
        } catch (error) {
          console.error("Failed to upload avatar", error);
          toast.error("Tải ảnh thất bại. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      await onSave(user.id, { name, role, dateOfBirth, avtUrl: finalAvtUrl });

      // Update state to reflect saved data
      setAvtUrl(finalAvtUrl);
      setAvatarFile(null);

      toast.success(t("usersAdmin.toast.updateSuccess"));
    } catch (error) {
      console.error("Failed to update user", error);
      toast.error(t("usersAdmin.toast.updateError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <UserAvatarUpload
            value={avtUrl}
            onChange={setAvtUrl}
            onFileSelect={setAvatarFile}
            disabled={readOnly}
            userId={user.id}
          />
        </div>

        <div className="flex-1 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">{t("usersAdmin.form.emailLabel")}</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-muted opacity-80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">{t("usersAdmin.form.nameLabel")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("usersAdmin.form.namePlaceholder")}
              required
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t("usersAdmin.form.roleLabel")}</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={readOnly}
            >
              <SelectTrigger className="h-10">
                <SelectValue
                  placeholder={t("usersAdmin.form.rolePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.USER}>
                  {t("usersAdmin.form.roles.user")}
                </SelectItem>
                <SelectItem value={UserRole.MANAGER}>
                  {t("usersAdmin.form.roles.manager")}
                </SelectItem>
                <SelectItem value={UserRole.ADMIN}>
                  {t("usersAdmin.form.roles.admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t("usersAdmin.form.dobLabel")}</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>
      {!readOnly && (
        <div className="flex justify-end gap-3">
          <AppButton
            htmlType="submit"
            disabled={loading}
            label={
              loading ? t("usersAdmin.form.saving") : t("usersAdmin.form.save")
            }
            leftSection={
              loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            }
            showArrow={false}
          />
        </div>
      )}
    </form>
  );
}
