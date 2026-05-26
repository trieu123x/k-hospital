export const getCroppedAvatarUrl = (avatarUrl, cropData) => {
  if (!avatarUrl || !cropData) return avatarUrl;

  let parsedCropData = cropData;
  if (typeof cropData === 'string') {
    try {
      parsedCropData = JSON.parse(cropData);
    } catch {
      return avatarUrl;
    }
  }

  if (!parsedCropData || !parsedCropData.width || !parsedCropData.height) return avatarUrl;

  const cropStr = `c_crop,x_${Math.round(parsedCropData.x)},y_${Math.round(parsedCropData.y)},w_${Math.round(parsedCropData.width)},h_${Math.round(parsedCropData.height)}`;

  if (avatarUrl.includes('/upload/')) {
    const parts = avatarUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${cropStr}/${parts[1]}`;
    }
  }

  return avatarUrl;
};
