import { catchError } from "../helpers/catch-error.js"
import { eventService } from "../services/event.js"

export const createEvent = catchError(async (req, res) => {
    const { userId, eventType, metadata } = req.body

    const event = await eventService.createEvent({ userId, eventType, metadata })

    res.status(201).json({
        success: true,
        message: "Tạo event thành công",
        data: event
    })
})

export const getEvents = catchError(async (req, res) => {
    const { date } = req.query

    if (!date) {
        const err = Object.assign(new Error("Thiếu query param 'date' (YYYY-MM-DD)"), { statusCode: 400 })
        throw err
    }

    const data = await eventService.getEvents(date)

    res.status(200).json({
        success: true,
        message: `Danh sách events ngày ${date}`,
        data
    })
})
