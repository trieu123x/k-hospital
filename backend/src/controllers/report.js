import { catchError } from "../helpers/catch-error.js"
import { reportService } from "../services/report.js"

export const getReports = catchError(async (req, res) => {
    const reports = await reportService.getReports(req.query);
    res.status(200).json({
        success: true,
        message: "Lấy danh sách báo cáo thành công",
        data: reports
    });
});

export const getReportById = catchError(async (req, res) => {
    const { id } = req.params;
    const report = await reportService.getReportById(id);
    res.status(200).json({
        success: true,
        message: "Lấy chi tiết báo cáo thành công",
        data: report
    });
});
