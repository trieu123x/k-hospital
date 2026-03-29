import { prisma } from "../configs/prisma-config.js"

export const reportRepository = {
    getReportsByTimeRange: async ({ reportName, mode, startDate, endDate }) => {
        return await prisma.etlReports.findMany({
            where: {
                reportName,
                mode,
                startDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            orderBy: { startDate: 'asc' }
        });
    },

    getReportById: async (id) => {
        return await prisma.etlReports.findUnique({
            where: { id }
        });
    }
}