import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' })
    })
  }
}))

import nodemailer from 'nodemailer'
import { sendOtpEmail } from '@/services/mail.js'

describe('Email Service', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.MAIL_USER = 'test@gmail.com'
    process.env.MAIL_PASS = 'password123'
  })

  it('should send OTP email with correct parameters', async () => {
    const toEmail = 'recipient@example.com'
    const otp = '123456'

    await sendOtpEmail(toEmail, otp)

    const transporter = nodemailer.createTransport()
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
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

    const transporter = nodemailer.createTransport()
    const callArgs = transporter.sendMail.mock.calls[0][0]
    expect(callArgs.html).toContain(otp)
  })

  it('should throw error if sendMail fails', async () => {
    const transporter = nodemailer.createTransport()
    transporter.sendMail.mockRejectedValueOnce(new Error('SMTP Error'))

    await expect(sendOtpEmail('test@test.com', '123456'))
      .rejects.toThrow('SMTP Error')
  })
})
