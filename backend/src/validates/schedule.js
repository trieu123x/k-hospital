import { z } from "zod";

export const scheduleSchema = {
  create: {
    body: z.object({
      doctorId: z
        .uuid({ message: "ID bác sĩ không hợp lệ (phải là UUID)" })
        .optional(),

      schedules: z
        .array(
          z.object({
            date: z
              .string()
              .regex(/^\d{4}-\d{2}-\d{2}$/, {
                message: "Ngày làm việc phải đúng định dạng YYYY-MM-DD",
              }),
            shifts: z
              .array(
                z
                  .number({ invalid_type_error: "Ca làm việc phải là số" })
                  .int()
                  .min(1, "Ca làm việc nhỏ nhất là 1")
                  .max(4, "Ca làm việc lớn nhất là 4"),
              )
              .min(1, "Mỗi ngày phải chọn ít nhất 1 ca làm việc"),
          }),
        )
        .min(1, "Vui lòng cung cấp ít nhất 1 ngày làm việc"),
    }),
  },

  getDoctor: {
    params: z.object({
      doctorId: z.string().uuid({ message: "ID bác sĩ không hợp lệ (phải là UUID)" }),
    }),
    query: z
      .object({
        fromDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Từ ngày (fromDate) phải đúng định dạng YYYY-MM-DD",
          }),
        toDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Đến ngày (toDate) phải đúng định dạng YYYY-MM-DD",
          }),
      })
      .refine(
        (data) => {
          const from = new Date(data.fromDate);
          const to = new Date(data.toDate);
          return to >= from;
        },
        {
          message: "Đến ngày (toDate) không được nhỏ hơn Từ ngày (fromDate)",
          path: ["toDate"],
        },
      ),
  },

  checkParamId: {
    params: z.object({
      scheduleId: z
        .string()
        .uuid({ message: "ID ca làm việc không hợp lệ (phải là UUID)" }),
    }),
  },
};
