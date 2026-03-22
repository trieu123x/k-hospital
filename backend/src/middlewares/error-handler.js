export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error'

    console.error(`[${err.status.toUpperCase()}] ${err.message}`)

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message || "Lỗi hệ thống nội bộ",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    })
}