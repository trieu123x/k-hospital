import { prisma, Prisma } from "../configs/prisma-config.js";

export const newsRespository = {
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

    findWithFilter: async ({ title, lastId, limit = 30 }) => {
        const searchFilter = title ? `%${title.toLowerCase()}%` : null

        const cursorCondition = lastId 
            ? Prisma.sql`AND id > ${lastId}::uuid` 
            : Prisma.empty

        const newsList = await prisma.$queryRaw`
            SELECT 
                id, 
                title, 
                new_url AS "newUrl", 
                created_at AS "createdAt"
            FROM news
            WHERE 1=1
                ${title ? Prisma.sql`AND LOWER(title) LIKE ${searchFilter}` : Prisma.empty}
                ${cursorCondition}
            ORDER BY id ASC
            LIMIT ${limit}
        `

        return newsList.map(news => ({
            id: news.id,
            title: news.title,
            content: news.content,
            newUrl: news.newUrl,
            createdAt: news.createdAt
        }))
    }

}