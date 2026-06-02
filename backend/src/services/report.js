import { reportRepository } from "../repositories/report.js"

export const reportService = {
    getReportsByTimeRange: async ({ reportName, mode, startDate, endDate }) => {
        const reports = await reportRepository.getReportsByTimeRange({ reportName, mode, startDate, endDate });

        if (!reports || reports.length === 0) {
            throw Object.assign(new Error("Không tìm thấy báo cáo nào trong khoảng thời gian này"), { statusCode: 404 });
        }

        return reports;
    },

    getReportById: async (id) => {
        const report = await reportRepository.getReportById(id);
        if (!report) {
            throw Object.assign(new Error("Không tìm thấy báo cáo"), { statusCode: 404 });
        }

        return report;
    }
}