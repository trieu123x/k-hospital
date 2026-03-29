import { prisma } from "../configs/prisma-config.js"

export const reportRepository = {
    getReportByTime: async ({ reportName, mode, date }) => {
        return await prisma.etlReports.findFirst({
            where: {
                reportName,
                mode,
                startDate: new Date(date)
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    getReportById: async (id) => {
        return await prisma.etlReports.findUnique({
            where: { id }
        });
    }
}
