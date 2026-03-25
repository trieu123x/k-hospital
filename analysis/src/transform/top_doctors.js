import { SCORES } from '../helpers/constants.js';

// Top bác sĩ THEO TỪNG CHUYÊN KHOA
export async function transformTopDoctors(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_top_doctors AS
    WITH doctor_scores AS (
      SELECT
        de.entity_id                      AS doctor_id,
        d.specialty_id                    AS specialty_id,
        s.name                            AS specialty_name,
        COUNT(*) FILTER (WHERE de.event_type = 'VIEW_DOCTOR')        AS view_count,
        COUNT(*) FILTER (WHERE de.event_type = 'SEARCH_DOCTOR')      AS search_count,
        COUNT(*) FILTER (WHERE de.event_type = 'BOOK_APPOINTMENT')   AS booking_count,
        COUNT(*) FILTER (WHERE de.event_type = 'CANCEL_APPOINTMENT') AS cancel_count,
        (
          COUNT(*) FILTER (WHERE de.event_type = 'VIEW_DOCTOR')        * ${SCORES.VIEW_DOCTOR} +
          COUNT(*) FILTER (WHERE de.event_type = 'SEARCH_DOCTOR')      * ${SCORES.SEARCH_DOCTOR} +
          COUNT(*) FILTER (WHERE de.event_type = 'BOOK_APPOINTMENT')   * ${SCORES.BOOK_APPOINTMENT} +
          COUNT(*) FILTER (WHERE de.event_type = 'CANCEL_APPOINTMENT') * ${SCORES.CANCEL_APPOINTMENT}
        ) AS popularity_score,
        COUNT(DISTINCT de.user_id) AS unique_users
      FROM doctor_events de
      LEFT JOIN pg.public.doctors d ON de.entity_id = d.id
      LEFT JOIN pg.public.specialties s ON d.specialty_id = s.id
      WHERE de.entity_id IS NOT NULL
      GROUP BY de.entity_id, p.full_name, d.specialty_id, s.name
    )
    SELECT
      *,
      ROW_NUMBER() OVER (
        PARTITION BY specialty_id
        ORDER BY popularity_score DESC
      ) AS rank_in_specialty
    FROM doctor_scores
    WHERE popularity_score > 0
    ORDER BY specialty_name, rank_in_specialty;
  `);

  return db.count('result_top_doctors');
}
