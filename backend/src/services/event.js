import { eventRepository } from "../repositories/event.js"

export const eventService = {
    // Gọi hàm này ở service layer, không cần await
    track(userId, eventType, metadata = {}) {
        eventRepository.track({ userId, eventType, metadata })
            .catch(err => console.error('[EventTracker]', err.message))
    },

    // Dùng cho API test từ Postman — cần await
    createEvent: async (data) => {
        return await eventRepository.track(data)
    },

    getEvents: async (dateStr) => {
        const events = await eventRepository.findByDate(dateStr)
        const count = await eventRepository.countByDate(dateStr)
        return { count, events }
    }
}
