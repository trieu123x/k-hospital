import { reportRepository } from "../repositories/report.js"

export const reportService = {
    getReportsByTimeRange: async ({ reportName, mode, startDate, endDate }) => {
        const reports = await reportRepository.getReportsByTimeRange({ reportName, mode, startDate, endDate });

        if (!reports || reports.length === 0) {
            console.log("Không tìm thấy báo cáo nào trong khoảng thời gian này")
        }

        return reports;
    },

    getReportById: async (id) => {
        const report = await reportRepository.getReportById(id);
        if (!report) {
            console.log("Không tìm thấy báo cáo")
        }

        return report;
    }
}