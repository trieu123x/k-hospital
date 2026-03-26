import { reportRepository } from "../repositories/report.js"

export const reportService = {
    getReportByTime: async ({ reportName, mode, date }) => {
        const report = await reportRepository.getReportByTime({ reportName, mode, date });
        if (!report) {
            const err = Object.assign(new Error("Không tìm thấy báo cáo cho thời gian này"), { statusCode: 404 });
            throw err;
        }

        return report
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
