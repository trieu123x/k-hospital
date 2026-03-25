// Scoring weights — dùng bởi aggregate queries
export const SCORES = {
  VIEW_DOCTOR: 1,
  SEARCH_DOCTOR: 2,
  BOOK_APPOINTMENT: 5,
  CANCEL_APPOINTMENT: -3,

  VIEW_DISEASE: 1,
  SEARCH_DISEASE: 3,
  CHAT_AI_TOPIC: 4,
};

// Report registry — pipeline sẽ loop qua đây
export const REPORTS = [
  { name: 'raw_events', table: 'result_raw_events', label: 'Raw Events (Archive)' },
  { name: 'top_doctors', table: 'result_top_doctors', label: 'Top Bác sĩ theo chuyên khoa' },
  { name: 'top_diseases', table: 'result_top_diseases', label: 'Top Bệnh quan tâm' },
  { name: 'peak_hours', table: 'result_peak_hours', label: 'Giờ cao điểm' },
  { name: 'daily_summary', table: 'result_daily_summary', label: 'Tổng kết ngày' },
  { name: 'chat_topics', table: 'result_chat_topics', label: 'Top chủ đề AI Chat' },
];

// Supabase Storage bucket
export const STORAGE_BUCKET = process.env.SUPABASE_BUCKET || 'analytics';
