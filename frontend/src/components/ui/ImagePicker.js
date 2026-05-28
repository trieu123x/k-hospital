/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "./Button"

export function AvatarPicker({
  label = "Tiêu đề",
  onChange = (file, cropData) => { },
  className = "",
  defaultImage = null,
  defaultCropData = null,
  cropMode = false,
}) {
  const [previewUrl, setPreviewUrl] = useState(defaultImage)
  const [logoUrl, setLogoUrl] = useState(null)
  const fileInputRef = useRef(null)

  // --- CÁC STATE QUẢN LÝ ĐỒNG BỘ VÀ LOCAL ---
  const [hasLocalChanges, setHasLocalChanges] = useState(false)
  const [prevDefaultImage, setPrevDefaultImage] = useState(defaultImage)

  // Crop states
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1
  })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imgSrc, setImgSrc] = useState(defaultImage) // The source loaded in the cropper
  const imgRef = useRef(null)
  const [currentFile, setCurrentFile] = useState(null)

  // ======================================================================
  // 1. ĐỒNG BỘ STATE TỪ SERVER TRONG QUÁ TRÌNH RENDER (CHỐNG LỖI CASCADING)
  // ======================================================================
  if (!hasLocalChanges && defaultImage !== prevDefaultImage) {
    setPrevDefaultImage(defaultImage)
    setPreviewUrl(defaultImage)
    setImgSrc(defaultImage)
  }

  // ======================================================================
  // 2. USE-EFFECT CHỈ DÙNG CHO TÁC VỤ BẤT ĐỒNG BỘ (VẼ CANVAS)
  // ======================================================================
  useEffect(() => {
    if (!hasLocalChanges && defaultImage && defaultCropData && cropMode) {
      let isMounted = true; // Cờ bảo vệ chống memory leak

      generateLogoFromUrl(defaultImage, defaultCropData).then((base64Logo) => {
        if (isMounted) {
          setLogoUrl(base64Logo);
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [defaultImage, defaultCropData, cropMode, hasLocalChanges])


  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setCurrentFile(file)

      // Đánh dấu người dùng đã can thiệp, khóa chặn data từ Server
      setHasLocalChanges(true)
      // Xóa khung crop cũ đi để ảnh mới luôn được cắt ở tâm
      setCompletedCrop(null)
      setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25, aspect: 1 })

      if (cropMode) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImgSrc(reader.result)
          setIsCropModalOpen(true)
        }
        reader.readAsDataURL(file)
      } else {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)
        onChange(file, null)
      }
    }
    event.target.value = ''
  }

  const triggerFilePicker = () => {
    if (cropMode && imgSrc) {
      setIsCropModalOpen(true)
    } else {
      fileInputRef.current.click()
    }
  }

  const handleImageLoad = (e) => {
    imgRef.current = e.currentTarget
    const { width, height, naturalWidth } = e.currentTarget

    // 1. Nếu mở lại Modal trên ảnh đang chỉnh sửa (Local), giữ nguyên khung crop vừa cắt
    if (hasLocalChanges && completedCrop && completedCrop.width) {
      setCrop(completedCrop);
      return;
    }

    // 2. Nếu là ảnh từ Server, nạp tọa độ từ Server vào
    let parsedCropData = !hasLocalChanges ? defaultCropData : null;

    // Parse lồng nhau an toàn
    if (typeof parsedCropData === 'string') {
      try { parsedCropData = JSON.parse(parsedCropData); } catch (e) { }
    }
    if (typeof parsedCropData === 'string') {
      try { parsedCropData = JSON.parse(parsedCropData); } catch (e) { }
    }

    if (parsedCropData && typeof parsedCropData === 'object' && parsedCropData.width) {
      const displayToTargetScale = naturalWidth / width;
      const initialCrop = {
        unit: 'px',
        width: parsedCropData.width / displayToTargetScale,
        height: parsedCropData.height / displayToTargetScale,
        x: parsedCropData.x / displayToTargetScale,
        y: parsedCropData.y / displayToTargetScale,
        aspect: 1
      }
      setCrop(initialCrop)
      setCompletedCrop(initialCrop)
    } else {
      // 3. Nếu là ảnh mới up lên, cắt tự động ở giữa tâm
      const size = Math.min(width, height)
      const x = (width - size) / 2
      const y = (height - size) / 2
      const initialCrop = { unit: 'px', width: size, height: size, x, y, aspect: 1 }

      setCrop(initialCrop)
      setCompletedCrop(initialCrop)
    }
  }

  const handleSaveCrop = async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      const { resizedFile, backendCropData, logoUrl, fullPreviewUrl } = await processAvatarData(
        imgRef.current,
        completedCrop,
        currentFile?.name || 'avatar.jpg'
      )

      setHasLocalChanges(true)
      setPreviewUrl(fullPreviewUrl)

      // Gán ảnh 400px ngược lại làm base để lần mở sau không bị lệch tọa độ
      setImgSrc(fullPreviewUrl)
      setLogoUrl(logoUrl)
      onChange(resizedFile, backendCropData)
    }
    setIsCropModalOpen(false)
  }

  return (
    <div className={twMerge("w-[220px] rasa-font", className)}>
      <div className="flex flex-col items-start">
        <label className="block text-[24px] font-bold text-black">
          {label}
        </label>

        <div
          className="relative group cursor-pointer rounded-[4px] w-full border border-black/10 overflow-hidden"
          onClick={triggerFilePicker}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview ảnh đại diện"
              className="w-[220px] h-auto block object-contain"
            />
          ) : (
            <Image
              src="/images/Avartar.jpg"
              alt="Preview ảnh đại diện"
              width={220}
              height={220}
              className="w-full h-fit block object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-[15px] text-center leading-tight">
              {cropMode && imgSrc ? "Chỉnh sửa / Cắt ảnh" : "Thay đổi ảnh"}
            </span>
          </div>
        </div>
      </div>

      {cropMode && logoUrl && (
        <div className="mt-8 flex flex-col items-center w-[220px]">
          <span className="text-sm font-bold text-black mb-2">Logo hiển thị:</span>
          <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={logoUrl}
              alt="Preview logo tròn"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isCropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center pt-10 pb-10 rasa-font">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-none">
              <h2 className="text-xl font-bold">Cắt ảnh đại diện</h2>
              <Button onClick={() => fileInputRef.current.click()} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded">
                Chọn ảnh khác
              </Button>
            </div>

            <div className="flex-1 bg-gray-800 rounded flex justify-center items-center min-h-[300px]">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop={true}
                >
                  <img
                    src={imgSrc}
                    alt="Crop me"
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                    className="max-w-full object-contain"
                    style={{ maxHeight: '70vh' }}
                  />
                </ReactCrop>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 flex-none">
              <Button
                onClick={() => setIsCropModalOpen(false)}
                className="px-6 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveCrop}
                className="px-6 py-1 bg-[#070575] text-white rounded hover:bg-[#08069b]"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ======================================================================
// HELPER FUNCTIONS (Đặt bên dưới Component)
// ======================================================================

async function processAvatarData(image, crop, originalFileName = 'image.jpg') {
  let targetWidth = image.naturalWidth;
  let targetHeight = image.naturalHeight;

  if (targetWidth > 400) {
    const ratio = 400 / targetWidth;
    targetWidth = 400;
    targetHeight = image.naturalHeight * ratio;
  }

  // BẠT 1: CHỨA ẢNH FULL ĐÃ RESIZE
  const fullCanvas = document.createElement('canvas');
  fullCanvas.width = targetWidth;
  fullCanvas.height = targetHeight;
  const fullCtx = fullCanvas.getContext('2d');
  fullCtx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const resizedFile = await new Promise((resolve) => {
    fullCanvas.toBlob((blob) => {
      resolve(new File([blob], originalFileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.9);
  });

  // TẠO BASE64 CHO ẢNH PREVIEW CHÍNH (ẢNH FULL CHƯA CẮT)
  const fullPreviewUrl = fullCanvas.toDataURL('image/jpeg');

  const displayToTargetScale = targetWidth / image.width;

  const backendCropData = {
    x: Math.round(crop.x * displayToTargetScale),
    y: Math.round(crop.y * displayToTargetScale),
    width: Math.round(crop.width * displayToTargetScale),
    height: Math.round(crop.height * displayToTargetScale)
  };

  // BẠT 2: CHỨA ẢNH ĐÃ CẮT (LÀM LOGO)
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = backendCropData.width;
  cropCanvas.height = backendCropData.height;
  const cropCtx = cropCanvas.getContext('2d');

  cropCtx.drawImage(
    fullCanvas,
    backendCropData.x, backendCropData.y, backendCropData.width, backendCropData.height,
    0, 0, backendCropData.width, backendCropData.height
  );

  const logoUrl = cropCanvas.toDataURL('image/jpeg');

  return {
    resizedFile,
    backendCropData,
    logoUrl,
    fullPreviewUrl
  };
}

const generateLogoFromUrl = (imageUrl, cropData) => {
  return new Promise((resolve) => {
    if (!imageUrl || !cropData) return resolve(imageUrl);

    // Xử lý parse JSON an toàn (chống double stringify)
    let parsedData = cropData;
    if (typeof parsedData === 'string') {
      try { parsedData = JSON.parse(parsedData); } catch (e) { }
    }
    if (typeof parsedData === 'string') {
      try { parsedData = JSON.parse(parsedData); } catch (e) { }
    }

    // Nếu không có tọa độ, trả về ảnh gốc
    if (!parsedData || !parsedData.width) return resolve(imageUrl);

    // Tải ảnh vào bộ nhớ để cắt
    const img = new window.Image();
    img.crossOrigin = "anonymous"; // Bắt buộc để không bị lỗi CORS từ Supabase

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = parsedData.width;
      canvas.height = parsedData.height;
      const ctx = canvas.getContext('2d');

      // Vẽ đúng vùng đã cắt vào canvas
      ctx.drawImage(
        img,
        parsedData.x, parsedData.y, parsedData.width, parsedData.height, // Vùng nguồn
        0, 0, parsedData.width, parsedData.height // Vùng đích
      );

      resolve(canvas.toDataURL('image/jpeg'));
    };

    img.onerror = () => {
      console.error("Lỗi khi tải ảnh để tạo logo preview");
      resolve(imageUrl); // Fallback về ảnh gốc nếu mạng lỗi
    };

    img.src = imageUrl;
  });
};