import { z } from "zod";

export const chatSchema = {
  params: z.object({
    id: z.string().uuid({ message: "ID phiên chat không hợp lệ (phải là UUID)" }),
  }),

  createSession: z.object({
    content: z.string().min(1, "Nội dung tin nhắn không được để trống"),
  }),

  saveMessage: z.object({
    role: z.preprocess((val) => (typeof val === "string" ? val.toUpperCase() : val), 
      z.enum(["USER", "AI", "SYSTEM"], { message: "Role không hợp lệ" })
    ),
    content: z.string().min(1, "Nội dung tin nhắn không được để trống"),
    metadata: z.any().optional(),
  }),

  getHistory: z.object({
    lastId: z.string().uuid({ message: "lastId phải là UUID hợp lệ" }).optional(),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 50))
      .pipe(z.number().min(1).max(100)),
  }),

  getSessions: z.object({
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 50))
      .pipe(z.number().min(1).max(100)),
  }),
};
