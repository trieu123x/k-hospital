"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { EditField } from "@/components/ui/EditField";
import { AvatarPicker } from "@/components/ui/ImagePicker";
import { Button } from "@/components/ui/Button";
import { userApi } from "@/routers/profile/profileRouter";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/utils/supabase";

export default function Detail() {
  const { user, isDoctor, isAdmin } = useAuthStore();
  const userId = user?.id;

  const [fullName, setFullName] = useState("");
  const [hometown, setHometown] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("");
  const [currentCropData, setCurrentCropData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await userApi.getUserById(userId);

        if (res && res.success) {
          const profile = res.data?.profile || res.data || {};

          setFullName(profile.fullName || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setHometown(profile.address || "");
          let avatarToSet = profile.avatarUrl || "";
          if (avatarToSet && !avatarToSet.startsWith("http")) {
            avatarToSet = supabase.storage
              .from("avatars")
              .getPublicUrl(avatarToSet).data.publicUrl;
          }
          setCurrentAvatarUrl(avatarToSet);

          let cropToSet = profile.avatarCropData || null;
          if (typeof cropToSet === 'string') {
            try { cropToSet = JSON.parse(cropToSet); } catch (e) { }
          }
          setCurrentCropData(cropToSet);

          setInitialData({
            fullName: profile.fullName || "",
            address: profile.address || "",
            phone: profile.phone || "",
            avatarUrl: profile.avatarUrl || "",
          });
        } else {
          console.error("Lỗi từ server:", res?.message);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const hasChanges = () => {
    if (!initialData) return false;
    if (avatarFile !== null || currentCropData !== null) return true;
    return (
      fullName !== initialData.fullName ||
      hometown !== initialData.address ||
      phone !== initialData.phone
    );
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      const payload = new FormData();
      if (fullName) payload.append("fullName", fullName);
      if (hometown) payload.append("address", hometown);
      if (phone) payload.append("phone", phone);

      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }
      if (currentCropData) {
        payload.append("avatarCropData", JSON.stringify(currentCropData));
      }

      // Các trường thông tin khác
      const res = await userApi.updateUser(userId, payload);

      if (res && res.success) {
        alert("Cập nhật thông tin thành công!");
        setInitialData({
          fullName,
          address: hometown,
          phone,
        });
        setAvatarFile(null);
      } else {
        alert("Lỗi: " + (res?.message || "Không thể cập nhật"));
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi hệ thống";
      alert(`Đã xảy ra lỗi: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (file, backendCropData) => {
    if (!file) return;
    setAvatarFile(file);
    setCurrentCropData(backendCropData);
    const previewUrl = URL.createObjectURL(file);
    setCurrentAvatarUrl(previewUrl);
  };

  if (loading) {
    return (
      <div className="grow flex items-center justify-center bg-gray-50 min-h-[500px]">
        <p className="text-gray-500 italic">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="grow flex items-center justify-center bg-gray-50 min-h-[500px]">
        <p className="text-gray-500 font-medium">
          Vui lòng đăng nhập để xem và chỉnh sửa thông tin cá nhân.
        </p>
      </div>
    );
  }

  if (isDoctor || isAdmin) {
    return (
      <div className="grow flex flex-col items-center justify-center bg-gray-50 min-h-[500px] rasa-font">
        <p className="text-red-500 font-bold text-2xl mb-2">
          Truy cập bị từ chối!
        </p>
        <p className="text-gray-600 text-lg">
          Trang hồ sơ này chỉ dành riêng cho Bệnh nhân.
        </p>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col rasa-font bg-gray-50">
      <div className="relative grow flex px-10 py-8 justify-between gap-35">
        <div className="w-200 flex flex-col flex-none">
          <InputForm
            label={"Họ và tên"}
            placeholder={"Nhập tên của bạn"}
            value={fullName}
            setValue={setFullName}
          />
          <InputForm
            label={"Quê quán"}
            placeholder={"Nhập quê quán của bạn"}
            value={hometown}
            setValue={setHometown}
          />
          <InputForm
            label={"Email"}
            placeholder={"Nhập email của bạn"}
            value={email}
            setValue={setEmail}
            isReadOnly={true}
          />
          <InputForm
            label={"Số điện thoại"}
            placeholder={"Nhập số điện thoại"}
            value={phone}
            setValue={setPhone}
          />
          {hasChanges() && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className={`w-fit px-8 mt-3
            bg-[#070575] hover:bg-[#08069b] py-1.5 text-white transition-opacity
            ${saving ? "opacity-70 cursor-not-allowed" : ""}
          `}
            >
              {saving ? "Đang lưu..." : "Lưu lại thay đổi"}
            </Button>
          )}
        </div>

        <div className="w-full">
          <AvatarPicker
            label="Họ và tên"
            onChange={handleAvatarChange}
            defaultImage={currentAvatarUrl}
            defaultCropData={currentCropData}
            cropMode={true}
          />
        </div>
      </div>
    </div>
  );
}

function InputForm({
  label,
  placeholder,
  value,
  setValue = (value) => { },
  mode = "normal",
  options = [],
  isReadOnly = false,
}) {
  return (
    <div className="w-full flex justify-between gap-3">
      <EditField
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        className="w-full"
        mode={mode}
        options={options}
        readOnly={isReadOnly}
      />
      {isReadOnly ? (
        <div className="mt-11 size-6" />
      ) : (
        <Pencil className="mt-11 size-6 opacity-60" />
      )}
    </div>
  );
}
