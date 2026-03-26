import { catchError } from "../helpers/catch-error.js"
import { reportService } from "../services/report.js"

export const getReportByTime = catchError(async (req, res) => {
    const { reportName, mode, date } = req.query;
    const report = await reportService.getReportByTime({ reportName, mode, date });
    res.status(200).json({
        success: true,
        message: "Lấy báo cáo thành công",
        data: report
    });
});

export const getReportById = catchError(async (req, res) => {
    const { id } = req.params

    const report = await reportService.getReportById(id);
    res.status(200).json({
        success: true,
        message: "Lấy chi tiết báo cáo thành công",
        data: report
    });
});
