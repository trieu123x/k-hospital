import { describe, it, expect, vi } from 'vitest'
import { catchError } from '@/helpers/catch-error.js'

describe('catchError Middleware', () => {
  it('nên gọi next(error) khi hàm async bị lỗi', async () => {
    const error = new Error('Database down!')
    const fn = vi.fn().mockRejectedValue(error) // Hàm giả lập bị lỗi
    const req = {}
    const res = {}
    const next = vi.fn()

    const wrappedFn = catchError(fn)
    await wrappedFn(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('nên thực thi hàm fn bình thường nếu không có lỗi', async () => {
    const fn = vi.fn().mockResolvedValue('Success')
    const req = {}
    const res = {}
    const next = vi.fn()

    const wrappedFn = catchError(fn)
    await wrappedFn(req, res, next)

    expect(fn).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})