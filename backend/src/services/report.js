import { reportRepository } from "../repositories/report.js"

export const reportService = {
    getReportsByTimeRange: async ({ reportName, mode, startDate, endDate }) => {
        const reports = await reportRepository.getReportsByTimeRange({ reportName, mode, startDate, endDate });

        if (!reports || reports.length === 0) {
            const err = Object.assign(new Error("Không tìm thấy báo cáo nào trong khoảng thời gian này"), { statusCode: 404 });
            throw err;
        }

        return reports;
    },

    getReportById: async (id) => {
        const report = await reportRepository.getReportById(id);
        if (!report) {
            const err = Object.assign(new Error("Không tìm thấy báo cáo"), { statusCode: 404 });
            throw err;
        }

        return report;
    }
}