import { prisma, Prisma } from "../configs/prisma-config.js";
import { removeVietnameseTones } from "../helpers/string-format.js";

export const newsRespository = {
    countAll: async () => {
        return await prisma.news.count()
    },

    findAllForAdmin: async ({ title, date, startDate, endDate, page = 1, limit = 30 }) => {
        const cleanTitle = title ? removeVietnameseTones(title) : null;
        const searchFilter = cleanTitle ? `%${cleanTitle}%` : null
        const offset = (page - 1) * limit

        let dateCondition = Prisma.empty
        if (startDate && endDate) {
            dateCondition = Prisma.sql`AND created_at >= ${startDate}::date AND created_at < (${endDate}::date + interval '1 day')`
        } else if (startDate) {
            dateCondition = Prisma.sql`AND created_at >= ${startDate}::date`
        } else if (endDate) {
            dateCondition = Prisma.sql`AND created_at < (${endDate}::date + interval '1 day')`
        } else if (date) {
            dateCondition = Prisma.sql`AND created_at >= ${date}::date AND created_at < (${date}::date + interval '1 day')`
        }

        const filterConditions = Prisma.sql`
            1=1
            ${title ? Prisma.sql`AND (title_clean LIKE ${searchFilter} OR title_clean % ${cleanTitle})` : Prisma.empty}
            ${dateCondition}
        `

        const totalCountParams = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count
            FROM news
            WHERE ${filterConditions}
        `
        const total = totalCountParams[0]?.count || 0

        const newsList = await prisma.$queryRaw`
            SELECT 
                id, 
                title, 
                content,
                new_url AS "newUrl", 
                created_at AS "createdAt"
            FROM news
            WHERE ${filterConditions}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `

        return {
            items: newsList.map(news => ({
                id: news.id,
                title: news.title,
                content: news.content,
                newUrl: news.newUrl,
                createdAt: news.createdAt
            })),
            total
        }
    },

    create: async (data) => {
        const {title, content, newUrl} = data
        return await prisma.news.create({
            data: {
                title,
                content,
                newUrl,
            },
            select: { id: true, title: true }
        })
    },

    update: async (id, data) => {
        return await prisma.news.update({
            where: { id },
            data: {
                ...data
            },
            select: { id: true, title: true }
        })
    },

    findById: async (id) => {
        return await prisma.news.findUnique({
            where: {id},
            select: {
                id: true,
                title: true,
                content: true,
                newUrl: true,
                createdAt: true
            }
        })
    },

    delete: async (id) => {
        return await prisma.news.delete({
            where: { id },
            select: { id: true, title: true }
        })
    },

    findWithFilter: async ({ title, date, startDate, endDate, page = 1, limit = 30 }) => {
        const cleanTitle = title ? removeVietnameseTones(title) : null;
        const searchFilter = cleanTitle ? `%${cleanTitle}%` : null
        const offset = (page - 1) * limit

        let dateCondition = Prisma.empty
        if (startDate && endDate) {
            dateCondition = Prisma.sql`AND created_at >= ${startDate}::date AND created_at < (${endDate}::date + interval '1 day')`
        } else if (startDate) {
            dateCondition = Prisma.sql`AND created_at >= ${startDate}::date`
        } else if (endDate) {
            dateCondition = Prisma.sql`AND created_at < (${endDate}::date + interval '1 day')`
        } else if (date) {
            dateCondition = Prisma.sql`AND created_at >= ${date}::date AND created_at < (${date}::date + interval '1 day')`
        }

        const filterConditions = Prisma.sql`
            1=1
            ${title ? Prisma.sql`AND (title_clean LIKE ${searchFilter} OR title_clean % ${cleanTitle})` : Prisma.empty}
            ${dateCondition}
        `

        const totalCountParams = await prisma.$queryRaw`
            SELECT COUNT(*)::int AS count
            FROM news
            WHERE ${filterConditions}
        `
        const total = totalCountParams[0]?.count || 0

        const newsList = await prisma.$queryRaw`
            SELECT 
                id, 
                title, 
                content,
                new_url AS "newUrl", 
                created_at AS "createdAt"
            FROM news
            WHERE ${filterConditions}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `

        return {
            items: newsList.map(news => ({
                id: news.id,
                title: news.title,
                content: news.content,
                newUrl: news.newUrl,
                createdAt: news.createdAt
            })),
            total
        }
    }

}