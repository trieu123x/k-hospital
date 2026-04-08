import { SCORES } from '../helpers/constants.js';

// Top bác sĩ THEO TỪNG CHUYÊN KHOA
export async function transformTopDoctors(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_top_doctors AS
    WITH raw_scores AS (
      SELECT
        metadata->>'doctorId' AS doctor_id,
        COUNT(*) FILTER (WHERE event_type = 'VIEW_DOCTOR') AS view_count,
        COUNT(*) FILTER (WHERE event_type = 'BOOK_APPOINTMENT') AS booking_count,
        COUNT(*) FILTER (WHERE event_type = 'CANCEL_APPOINTMENT') AS cancel_count,
        (
          COUNT(*) FILTER (WHERE event_type = 'VIEW_DOCTOR') * ${SCORES.VIEW_DOCTOR} +
          COUNT(*) FILTER (WHERE event_type = 'BOOK_APPOINTMENT') * ${SCORES.BOOK_APPOINTMENT} +
          COUNT(*) FILTER (WHERE event_type = 'CANCEL_APPOINTMENT') * ${SCORES.CANCEL_APPOINTMENT}
        ) AS popularity_score,
        COUNT(DISTINCT user_id) AS unique_users
      FROM doctor_events
      WHERE metadata->>'doctorId' IS NOT NULL
      GROUP BY metadata->>'doctorId'
    )
    SELECT
      rs.*,
      p.full_name AS doctor_name,
      d.specialty_id,
      s.name AS specialty_name,
      ROW_NUMBER() OVER (
        PARTITION BY d.specialty_id
        ORDER BY rs.popularity_score DESC
      ) AS rank_in_specialty
    FROM raw_scores rs
    LEFT JOIN pg.public.doctors d ON CAST(rs.doctor_id AS UUID) = d.id
    LEFT JOIN pg.public.profiles p ON d.id = p.id
    LEFT JOIN pg.public.specialties s ON d.specialty_id = s.id
    WHERE rs.popularity_score > 0
    ORDER BY specialty_name, rank_in_specialty;
  `);

  return db.count('result_top_doctors');
}
