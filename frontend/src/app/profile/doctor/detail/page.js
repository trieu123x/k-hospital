"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { EditField } from "@/components/ui/EditField";
import { AvatarPicker } from "@/components/ui/ImagePicker";
import { Button } from "@/components/ui/Button";
import { userApi } from "@/routers/profile/profileRouter";
import { doctorApi } from "@/routers/doctor/doctorRouter";
import { getSpecialties } from "@/routers/specialty-api";
import { getAllDegrees } from "@/routers/degree-api";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/utils/supabase";
import { useGlobalLoading } from "@/stores/globalLoading";

export default function Detail() {
  const { user, isDoctor } = useAuthStore();
  const userId = user?.id;

  // 1. STATE THÔNG TIN CÁ NHÂN
  const [fullName, setFullName] = useState("");
  const [hometown, setHometown] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // -- TÁCH STATE CHO AVATAR (Giống trang Patient) --
  const [serverAvatarUrl, setServerAvatarUrl] = useState(null); // Chỉ nhận từ Server
  const [serverCropData, setServerCropData] = useState(null);   // Chỉ nhận từ Server
  const [avatarFile, setAvatarFile] = useState(null);           // Hứng file mới
  const [newCropData, setNewCropData] = useState(null);         // Hứng tọa độ mới

  // 2. STATE THÔNG TIN CHUYÊN MÔN
  const [specialtyName, setSpecialtyName] = useState("");
  const [degreeName, setDegreeName] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [achievements, setAchievements] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [degrees, setDegrees] = useState([]);

  // 3. STATE THEO DÕI THAY ĐỔI
  const [initialData, setInitialData] = useState(null);
  const [initialDoctorData, setInitialDoctorData] = useState(null); // Thêm state này để tracking Doctor
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
        // 1. Tải danh sách chuyên khoa & bằng cấp
        try {
          const [specialtiesRes, degreesRes] = await Promise.all([
            getSpecialties({ limit: 100 }),
            getAllDegrees()
          ]);
          if (specialtiesRes?.success) {
            setSpecialties(specialtiesRes.data || []);
          }
          if (degreesRes?.success || degreesRes?.data) {
            setDegrees(degreesRes.data || []);
          }
        } catch (err) {
          console.error("Lỗi tải danh mục:", err);
        }

        // 2. Tải thông tin Profile
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
            setServerAvatarUrl(avatarToSet); // Lưu vào biến Server

            let cropToSet = profile.avatarCropData || null;
            if (typeof cropToSet === 'string') {
              try { cropToSet = JSON.parse(cropToSet); } catch (e) { }
            }
            setServerCropData(cropToSet); // Lưu vào biến Server

            setInitialData({
              fullName: profile.fullName || "",
              address: profile.address || "",
              phone: profile.phone || "",
            });
          }
        } catch (err) {
          console.error("Lỗi tải Profile:", err);
        }

        // 3. Tải thông tin Doctor
        try {
          const doctorRes = await doctorApi.getDoctorById(userId);
          if (doctorRes?.success) {
            const doc = doctorRes.data;
            setSpecialtyName(doc.specialty?.name || "");
            setDegreeName(doc.degree?.name || "");
            setExperience(doc.experience || "");
            setEducation(doc.education || "");
            setAchievements(doc.achievements || "");

            // Lưu lại data gốc của bác sĩ
            setInitialDoctorData({
              specialtyName: doc.specialty?.name || "",
              degreeName: doc.degree?.name || "",
              experience: doc.experience || "",
              education: doc.education || "",
              achievements: doc.achievements || "",
            });
          } else {
            // Trường hợp bác sĩ chưa có data (tài khoản mới)
            setInitialDoctorData({
              specialtyName: "", degreeName: "", experience: "", education: "", achievements: ""
            });
          }
        } catch (err) {
          if (err.response?.status === 404) {
            console.log("Bác sĩ chưa có hồ sơ chuyên môn, sẽ được tạo khi lưu lần đầu.");
            setInitialDoctorData({
              specialtyName: "", degreeName: "", experience: "", education: "", achievements: ""
            });
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
    // Cần cả 2 cục data gốc mới check được
    if (!initialData || !initialDoctorData) return false;

    if (avatarFile !== null || newCropData !== null) return true;

    return (
      // So sánh thông tin cá nhân
      fullName !== initialData.fullName ||
      hometown !== initialData.address ||
      phone !== initialData.phone ||
      // So sánh thông tin bác sĩ
      specialtyName !== initialDoctorData.specialtyName ||
      degreeName !== initialDoctorData.degreeName ||
      experience !== initialDoctorData.experience ||
      education !== initialDoctorData.education ||
      achievements !== initialDoctorData.achievements
    );
  };

  const { showLoading, hideLoading } = useGlobalLoading();

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    showLoading("Đang xử lý yêu cầu...");

    try {
      // Dữ liệu Profile
      const profilePayload = new FormData();
      profilePayload.append("fullName", fullName);
      profilePayload.append("address", hometown);
      profilePayload.append("phone", phone);

      if (avatarFile) {
        profilePayload.append("avatar", avatarFile);
      }
      if (newCropData) {
        profilePayload.append("avatarCropData", JSON.stringify(newCropData));
      }

      // Dữ liệu Doctor
      const selectedSpecialty = specialties.find(s => s.name === specialtyName);
      const selectedDegree = degrees.find(d => d.name === degreeName);

      const doctorPayload = {
        specialtyId: selectedSpecialty ? selectedSpecialty.id : null,
        degreeId: selectedDegree ? selectedDegree.id : null,
        experience: experience || "",
        education: education || "",
        achievements: achievements || "",
      };

      // Gọi đồng thời cả 2 API update
      const [resProfile, resDoctor] = await Promise.all([
        userApi.updateUser(userId, profilePayload),
        doctorApi.updateDoctorInfo(userId, doctorPayload),
      ]);

      if (resProfile.success && (resDoctor.success || resDoctor.data)) {
        alert("Cập nhật thông tin thành công!");

        // Cập nhật lại mốc so sánh (initial)
        setInitialData({ fullName, address: hometown, phone });
        setInitialDoctorData({ specialtyName, degreeName, experience, education, achievements });

        // Reset state ảnh
        setAvatarFile(null);
        setNewCropData(null);
      } else {
        alert("Có lỗi xảy ra khi cập nhật một số thông tin.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      alert(`Đã xảy ra lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
      hideLoading();
    }
  };

  const handleAvatarChange = (file, backendCropData) => {
    // Tuyệt đối chỉ hứng vào biến New
    setAvatarFile(file);
    setNewCropData(backendCropData);
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
            <InputForm label="Họ và tên" placeholder="Nhập tên" value={fullName} setValue={setFullName} />
            <InputForm label="Quê quán" placeholder="Nhập quê quán" value={hometown} setValue={setHometown} />
            <InputForm label="Email" placeholder="Nhập email" value={email} setValue={setEmail} isReadOnly={true} />
            <InputForm label="Số điện thoại" placeholder="Nhập số điện thoại" value={phone} setValue={setPhone} />
          </div>

          <div className="pt-6 space-y-1">
            <p className="text-[14px] font-bold text-gray-400 uppercase mb-2">
              Thông tin chuyên môn
            </p>
            <InputForm label="Chuyên khoa" placeholder="Chọn chuyên khoa..." value={specialtyName} setValue={setSpecialtyName} mode="select" options={specialties.map(s => s.name)} />
            <InputForm label="Bằng cấp" placeholder="Chọn bằng cấp..." value={degreeName} setValue={setDegreeName} mode="select" options={degrees.map(d => d.name)} />
            <InputForm label="Kinh nghiệm làm việc" placeholder="Số năm kinh nghiệm..." value={experience} setValue={setExperience} mode="normal" />
            <InputForm label="Trình độ học vấn" placeholder="Thông tin học vấn..." value={education} setValue={setEducation} mode="normal" />
            <InputForm label="Thành tựu" placeholder="Các giải thưởng, thành tựu..." value={achievements} setValue={setAchievements} mode="normal" />
          </div>

          {hasChanges() && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className={`w-fit px-8 mt-3 bg-[#070575] hover:bg-[#08069b] py-1.5 text-white transition-opacity ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
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
            // Truyền biến cố định từ Server
            defaultImage={serverAvatarUrl}
            defaultCropData={serverCropData}
            cropMode={true}
          />
        </div>
      </div>
    </div>
  );
}

function InputForm({ label, placeholder, value, setValue = () => { }, mode = "normal", options = [], isReadOnly = false }) {
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
        <Pencil className="mt-11 size-6 opacity-60 flex-none" />
      )}
    </div>
  );
}