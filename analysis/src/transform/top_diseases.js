import { SCORES } from '../helpers/constants.js';

// Top bệnh quan tâm — JOIN diseases để lấy tên và chuyên khoa
export async function transformTopDiseases(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_top_diseases AS
    WITH disease_scores AS (
      SELECT
        de.entity_id AS disease_id,
        COUNT(*) AS view_count
      FROM disease_events de
      WHERE de.entity_id IS NOT NULL
      GROUP BY de.entity_id
    )
    SELECT
      ds.disease_id,
      d.name AS disease_name,
      s.name AS specialty_name,
      ds.view_count AS total_views,
      (ds.view_count * ${SCORES.VIEW_DISEASE}) AS interest_score
    FROM disease_scores ds
    LEFT JOIN pg.public.diseases d ON ds.disease_id = d.id
    LEFT JOIN pg.public.specialties s ON d.specialty_id = s.id
    ORDER BY interest_score DESC
  `);

  return db.count('result_top_diseases');
}
