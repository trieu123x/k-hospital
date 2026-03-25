import { prisma } from "../configs/prisma-config.js"

export const reportRepository = {
    getReports: async ({ mode, startDate, endDate, limit = 20 }) => {
        const where = {};
        if (mode) where.mode = mode;
        if (startDate) where.startDate = { gte: new Date(startDate) };
        if (endDate) {
            where.endDate = where.endDate || {};
            where.endDate.lte = new Date(endDate);
        }

        return await prisma.etlReports.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },

    getReportById: async (id) => {
        return await prisma.etlReports.findUnique({
            where: { id }
        });
    }
}
