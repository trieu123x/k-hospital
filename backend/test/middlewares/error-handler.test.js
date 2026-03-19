import { describe, it, expect, vi, beforeEach } from 'vitest'
import { globalErrorHandler } from '@/middlewares/error-handler.js'

describe('globalErrorHandler Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = {
      status: vi.fn().mockReturnThis(), 
      json: vi.fn().mockReturnThis()
    }
    next = vi.fn()
    // Reset môi trường mặc định
    process.env.NODE_ENV = 'development'
  })

  it('nên trả về lỗi 500 mặc định nếu không có statusCode', () => {
    const err = new Error('Test Error')
    
    globalErrorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: 'error',
        message: 'Test Error'
      })
    )
  })

  it('nên đặt status là "fail" cho lỗi 404', () => {
    const err = { statusCode: 404, message: 'Not Found' }

    globalErrorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'fail' })
    )
  })

  it('không được trả về stack trace khi ở môi trường production', () => {
    process.env.NODE_ENV = 'production'
    const err = new Error('Secret Error')

    globalErrorHandler(err, req, res, next)

    const responseData = res.json.mock.calls[0][0] // Lấy data truyền vào hàm json()
    expect(responseData.stack).toBeUndefined()
  })
})