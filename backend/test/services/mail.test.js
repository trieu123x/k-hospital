import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockSend } = vi.hoisted(() => {
  return {
    mockSend: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null })
  }
})

// Mock resend
vi.mock('resend', () => {
  return {
    Resend: class {
      constructor() {
        this.emails = {
          send: mockSend
        }
      }
    }
  }
})

import { sendOtpEmail } from '@/services/mail.js'

describe('Email Service', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.RESEND_API_KEY = 're_test123'
    process.env.RESEND_DOMAIN = 'testdomain.com'
  })

  it('should send OTP email with correct parameters', async () => {
    const toEmail = 'recipient@example.com'
    const otp = '123456'

    await sendOtpEmail(toEmail, otp)

    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      to: toEmail,
      subject: 'Mã OTP đặt lại mật khẩu',
      from: expect.stringContaining('MediAssist'),
      html: expect.stringContaining(otp)
    }))
  })

  it('should include the OTP in the html content', async () => {
    const toEmail = 'recipient@example.com'
    const otp = '987654'

    await sendOtpEmail(toEmail, otp)

    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).toContain(otp)
  })

  it('should log error if send fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSend.mockResolvedValueOnce({ data: null, error: new Error('API Error') })

    await sendOtpEmail('test@test.com', '123456')
    
    expect(consoleSpy).toHaveBeenCalledWith("Lỗi gửi email bằng Resend:", expect.any(Error))
    consoleSpy.mockRestore()
  })
})
