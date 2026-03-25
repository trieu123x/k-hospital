import { supabase } from '../config/supabase.js';
import { log } from '../helpers/logger.js';

export async function saveEtlReport(payload) {
  const { mode, startDate, endDate, totalEvents, reports } = payload;

  const { data, error } = await supabase
    .from('etl_reports')
    .insert([{
      mode,
      start_date: startDate,
      end_date: endDate,
      total_events: totalEvents,
      reports
    }]);

  if (error) {
    log.error(`Lỗi khi insert etl_executions: ${error.message}`);
  } else {
    log.success('Đã lưu thông tin report ETL vào Database (etl_executions)');
  }
}
