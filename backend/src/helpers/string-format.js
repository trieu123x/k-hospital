export function removeVietnameseTones(str) {
  if (!str) return "";

  // 1. Chuẩn hóa chuỗi Unicode (Tách các dấu thanh điệu, mũ, râu ra khỏi chữ cái gốc)
  str = str.normalize("NFD");

  // 2. Xóa toàn bộ các ký tự dấu (nằm trong dải mã từ \u0300 đến \u036f)
  str = str.replace(/[\u0300-\u036f]/g, "");

  // 3. Xử lý riêng chữ Đ/đ (Vì chữ Đ là một ký tự độc lập, không phải là D ghép với gạch ngang)
  str = str.replace(/đ/g, "d");
  str = str.replace(/Đ/g, "D");

  // 4. Ép về chữ thường và xóa khoảng trắng dư thừa ở 2 đầu
  return str.toLowerCase().trim();
}

export const formatPhoneE164 = (phone) => {
  if (!phone) return null;
  let formattedPhone = phone.trim();
  // Nếu bắt đầu bằng số 0, thay thế bằng +84
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+84" + formattedPhone.slice(1);
  }
  return formattedPhone;
};