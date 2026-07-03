"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { EditField } from "@/components/ui/EditField";
import { AvatarPicker } from "@/components/ui/ImagePicker";
import { Button } from "@/components/ui/Button";
import { userApi } from "@/routers/profile/profileRouter";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/utils/supabase";
import { useGlobalLoading } from "@/stores/globalLoading";

export default function AdminDetail() {
  const { user, isDoctor, isAdmin } = useAuthStore();
  const userId = user?.id;

  const [fullName, setFullName] = useState("");
  const [hometown, setHometown] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 1. STATE CHO DỮ LIỆU GỐC (Chỉ nạp 1 lần từ server, truyền vào default props)
  const [serverAvatarUrl, setServerAvatarUrl] = useState(null);
  const [serverCropData, setServerCropData] = useState(null);

  // 2. STATE ĐỂ LƯU THAY ĐỔI MỚI (Dùng cho hàm handleSave)
  const [avatarFile, setAvatarFile] = useState(null);
  const [newCropData, setNewCropData] = useState(null);

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
          // Nạp vào state Gốc
          setServerAvatarUrl(avatarToSet);

          let cropToSet = profile.avatarCropData || null;
          if (typeof cropToSet === 'string') {
            try { cropToSet = JSON.parse(cropToSet); } catch (e) { }
          }
          // Nạp vào state Gốc
          setServerCropData(cropToSet);

          setInitialData({
            fullName: profile.fullName || "",
            address: profile.address || "",
            phone: profile.phone || "",
            avatarUrl: profile.avatarUrl || "",
          });
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
    // Kiểm tra xem có ảnh/crop mới không
    if (avatarFile !== null || newCropData !== null) return true;
    return (
      fullName !== initialData.fullName ||
      hometown !== initialData.address ||
      phone !== initialData.phone
    );
  };

  const { showLoading, hideLoading } = useGlobalLoading();

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    showLoading("Đang xử lý yêu cầu...");

    try {
      const payload = new FormData();
      if (fullName) payload.append("fullName", fullName);
      if (hometown) payload.append("address", hometown);
      if (phone) payload.append("phone", phone);

      // Nếu có ảnh mới thì gửi lên
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      // Nếu người dùng có cắt lại ảnh (newCropData) thì gửi cái mới, 
      // không thì không cần gửi (vì DB đã có sẵn cái cũ)
      if (newCropData) {
        payload.append("avatarCropData", JSON.stringify(newCropData));
      }

      const res = await userApi.updateUser(userId, payload);

      if (res && res.success) {
        alert("Cập nhật thông tin thành công!");
        setInitialData({
          fullName,
          address: hometown,
          phone,
        });
        // Reset state mới sau khi save xong
        setAvatarFile(null);
        setNewCropData(null);
      } else {
        alert("Lỗi: " + (res?.message || "Không thể cập nhật"));
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      alert(`Đã xảy ra lỗi hệ thống`);
    } finally {
      setSaving(false);
      hideLoading();
    }
  };

  const handleAvatarChange = (file, backendCropData) => {
    // CHỈ lưu vào state mới, tuyệt đối không đụng vào serverCropData
    setAvatarFile(file);
    setNewCropData(backendCropData);
  };

  if (loading) return <div className="grow flex items-center justify-center bg-gray-50 min-h-[500px]">Đang tải...</div>;
  if (!userId) return <div className="grow flex items-center justify-center bg-gray-50 min-h-[500px]">Vui lòng đăng nhập...</div>;
  if (!isAdmin) return <div className="grow flex flex-col items-center justify-center bg-gray-50 min-h-[500px]">Truy cập bị từ chối!</div>;

  return (
    <div className="grow flex flex-col rasa-font bg-gray-50 transition-colors duration-200">
      <div className="relative grow flex px-10 py-8 justify-between gap-35">
        <div className="w-200 flex flex-col flex-none">
          <InputForm label={"Họ và tên"} placeholder={"Nhập tên của bạn"} value={fullName} setValue={setFullName} />
          <InputForm label={"Quê quán"} placeholder={"Nhập quê quán của bạn"} value={hometown} setValue={setHometown} />
          <InputForm label={"Email"} placeholder={"Nhập email của bạn"} value={email} setValue={setEmail} isReadOnly={true} />
          <InputForm label={"Số điện thoại"} placeholder={"Nhập số điện thoại"} value={phone} setValue={setPhone} />

          {hasChanges() && (
            <Button onClick={handleSave} disabled={saving} className={`w-fit px-8 mt-3 bg-[#070575] dark:bg-blue-600 text-white ${saving ? "opacity-70" : ""}`}>
              {saving ? "Đang lưu..." : "Lưu lại thay đổi"}
            </Button>
          )}
        </div>

        <div className="w-full">
          <AvatarPicker
            label="Ảnh đại diện"
            onChange={handleAvatarChange}
            // Truyền cứng dữ liệu từ server vào, không thay đổi khi crop
            defaultImage={serverAvatarUrl}
            defaultCropData={serverCropData}
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
        className="w-full animate-none"
        mode={mode}
        options={options}
        readOnly={isReadOnly}
      />
      {isReadOnly ? (
        <div className="mt-11 size-6" />
      ) : (
        <Pencil className="mt-11 size-6 opacity-60 text-gray-800 dark:text-white" />
      )}
    </div>
  );
}
