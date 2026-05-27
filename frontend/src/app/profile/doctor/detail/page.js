"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { EditField } from "@/components/ui/EditField";
import { AvatarPicker } from "@/components/ui/ImagePicker";
import { Button } from "@/components/ui/Button";
import { userApi } from "@/routers/profile/profileRouter";
import { doctorApi } from "@/routers/doctor/doctorRouter";
import { getSpecialties } from "@/routers/specialty-api";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/utils/supabase";

export default function Detail() {
  const { user, isDoctor } = useAuthStore();
  const userId = user?.id;

  // Thông tin cá nhân
  const [fullName, setFullName] = useState("");
  const [hometown, setHometown] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentCropData, setCurrentCropData] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // Thông tin chuyên môn (chỉ cho bác sĩ)
  const [specialtyId, setSpecialtyId] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [achievements, setAchievements] = useState("");
  const [specialties, setSpecialties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1. Tải danh sách chuyên khoa (không phụ thuộc userId)
        try {
          const specialtiesRes = await getSpecialties({ limit: 100 });
          if (specialtiesRes?.success) {
            setSpecialties(specialtiesRes.data || []);
          }
        } catch (err) {
          console.error("Lỗi tải danh sách chuyên khoa:", err);
        }

        // 2. Tải thông tin Profile (bắt buộc)
        try {
          const userRes = await userApi.getUserById(userId);
          if (userRes && userRes.success) {
            const profile = userRes.data?.profile || userRes.data || {};
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
          }
        } catch (err) {
          console.error("Lỗi tải Profile:", err);
        }

        // 3. Tải thông tin Doctor (có thể 404 nếu là bác sĩ mới)
        try {
          const doctorRes = await doctorApi.getDoctorById(userId);
          if (doctorRes?.success) {
            const doc = doctorRes.data;
            setSpecialtyId(doc.specialtyId || "");
            setExperience(doc.experience || "");
            setEducation(doc.education || "");
            setAchievements(doc.achievements || "");
          }
        } catch (err) {
          if (err.response?.status === 404) {
            console.log(
              "Bác sĩ chưa có hồ sơ chuyên môn, sẽ được tạo khi lưu lần đầu.",
            );
          } else {
            console.error("Lỗi tải hồ sơ bác sĩ:", err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const hasChanges = () => {
    if (!initialData) return false;
    if (avatarFile !== null || currentCropData !== null) return true;
    return (
      fullName !== initialData.fullName ||
      hometown !== initialData.address ||
      phone !== initialData.phone
      // Note: we can add checking for doctor data as well if we saved initial doctor data, but let's keep it simple for now.
    );
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      const profilePayload = new FormData();
      profilePayload.append("fullName", fullName);
      profilePayload.append("address", hometown);
      profilePayload.append("phone", phone);

      if (avatarFile) {
        profilePayload.append("avatar", avatarFile);
      }
      if (currentCropData) {
        profilePayload.append("avatarCropData", JSON.stringify(currentCropData));
      }

      const doctorPayload = {
        specialtyId: specialtyId || null,
        experience: experience || "",
        education: education || "",
        achievements: achievements || "",
      };

      // Gọi đồng thời cả 2 API update
      const [resProfile, resDoctor] = await Promise.all([
        userApi.updateUser(userId, profilePayload),
        doctorApi.updateDoctorInfo(userId, doctorPayload),
      ]);

      if (resProfile.success && resDoctor.success) {
        alert("Cập nhật thông tin thành công!");
        setInitialData({
          fullName,
          address: hometown,
          phone,
        });
        setAvatarFile(null);
      } else {
        alert("Có lỗi xảy ra khi cập nhật một số thông tin.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      alert(`Đã xảy ra lỗi: ${error.response?.data?.message || error.message}`);
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

  if (!isDoctor) {
    return (
      <div className="grow flex flex-col items-center justify-center bg-gray-50 min-h-[500px]">
        <p className="text-red-500 font-bold text-xl mb-2">
          Truy cập bị từ chối!
        </p>
        <p className="text-gray-500">Trang hồ sơ này chỉ dành cho Bác sĩ.</p>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col rasa-font bg-gray-50">
      <div className="relative grow flex px-10 py-8 justify-between gap-35">
        {/* Cột trái: Thông tin cá nhân & Chuyên môn */}
        <div className="w-200 flex flex-col flex-none space-y-4">
          <div className="space-y-1">
            <p className="text-[14px] font-bold text-gray-400 uppercase mb-2">
              Thông tin cá nhân
            </p>
            <InputForm
              label="Họ và tên"
              placeholder="Nhập tên"
              value={fullName}
              setValue={setFullName}
            />
            <InputForm
              label="Quê quán"
              placeholder="Nhập quê quán"
              value={hometown}
              setValue={setHometown}
            />
            <InputForm
              label="Email"
              placeholder="Nhập email"
              value={email}
              setValue={setEmail}
            />
            <InputForm
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={phone}
              setValue={setPhone}
            />
          </div>

          <div className="pt-6 space-y-1">
            <p className="text-[14px] font-bold text-gray-400 uppercase mb-2">
              Thông tin chuyên môn
            </p>

            {/* Chuyên khoa */}
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label className="block text-[14px] font-medium text-gray-700 mb-1">
                  Chuyên khoa
                </label>
                <select
                  value={specialtyId}
                  onChange={(e) => setSpecialtyId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-[14px] bg-white outline-none focus:border-blue-500"
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <Pencil className="mt-8 size-6 opacity-60 flex-none" />
            </div>

            <InputForm
              label="Kinh nghiệm"
              placeholder="Số năm kinh nghiệm..."
              value={experience}
              setValue={setExperience}
              mode="textarea"
            />
            <InputForm
              label="Học vấn / Bằng cấp"
              placeholder="Bằng cấp của bạn..."
              value={education}
              setValue={setEducation}
              mode="textarea"
            />
            <InputForm
              label="Thành tựu"
              placeholder="Các giải thưởng, thành tựu..."
              value={achievements}
              setValue={setAchievements}
              mode="textarea"
            />
          </div>

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

        {/* Cột phải: Avatar */}
        <div className="w-full flex justify-center">
          <AvatarPicker
            label="Ảnh đại diện"
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
  setValue = () => { },
  mode = "normal",
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
      />
      <Pencil className="mt-11 size-6 opacity-60 flex-none" />
    </div>
  );
}
