import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { validate } from '@/middlewares/validate-handler.js' 

describe('validate Middleware', () => {
  it('nên gọi next() khi dữ liệu hợp lệ', () => {
    const schema = {
      body: z.object({ name: z.string() })
    }
    const req = { body: { name: 'MediCare' } }
    const res = {}
    const next = vi.fn()

    validate(schema)(req, res, next)

    expect(next).toHaveBeenCalledWith() 
  })

  it('nên format đúng thông báo lỗi Zod và trả về statusCode 400', () => {
    const schema = {
      body: z.object({ 
        email: z.email('Email không đúng'),
        age: z.number().min(18, 'Phải trên 18 tuổi') 
      })
    }
    const req = { 
      body: { email: 'invalid-email', age: 10 } 
    }
    const res = {}
    const next = vi.fn()

    validate(schema)(req, res, next)

    // Lấy object error được truyền vào next(error)
    const calledError = next.mock.calls[0][0]

    expect(calledError.statusCode).toBe(400)
    expect(calledError.message).toContain('email: Email không đúng')
    expect(calledError.message).toContain('age: Phải trên 18 tuổi')
    expect(calledError.message).toContain('Dữ liệu không hợp lệ')
  })

  it('nên kiểm tra cả params và query nếu được cung cấp', () => {
    const schema = {
      params: z.object({ id: z.uuid() })
    }
    const req = { params: { id: 'not-a-uuid' } }
    const res = {}
    const next = vi.fn()

    validate(schema)(req, res, next)

    const calledError = next.mock.calls[0][0]
    expect(calledError.statusCode).toBe(400)
    expect(calledError.message.toLowerCase()).toContain('id: invalid uuid')
  })
})