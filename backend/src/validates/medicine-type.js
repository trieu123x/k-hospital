import { z } from "zod";

export const medicineTypeSchema = {
  params: z.object({
    id: z.string().uuid({
      message: "ID loại thuốc phải là định dạng UUID hợp lệ",
    }),
  }),
};
