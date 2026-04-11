import { z } from "zod";

export const degreeSchema = {
  params: z.object({
    id: z.string().uuid({
      message: "ID bằng cấp phải là định dạng UUID hợp lệ",
    }),
  }),
};
