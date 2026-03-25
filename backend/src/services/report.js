import { reportRepository } from "../repositories/report.js"

export const reportService = {
    getReports: async (query) => {
        return await reportRepository.getReports(query);
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
