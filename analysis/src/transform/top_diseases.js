import { SCORES } from '../helpers/constants.js';

// Top bệnh quan tâm — JOIN diseases để lấy tên
export async function transformTopDiseases(db) {
  await db.exec(`
    CREATE OR REPLACE TABLE result_top_diseases AS
    WITH disease_scores AS (
      SELECT
        entity_id AS disease_id,
        COUNT(*) FILTER (WHERE event_type = 'VIEW_DISEASE')   AS view_count,
        COUNT(*) FILTER (WHERE event_type = 'SEARCH_DISEASE') AS search_count,
        0 AS chat_count
      FROM disease_events
      WHERE entity_id IS NOT NULL
      GROUP BY entity_id

      UNION ALL

      SELECT
        entity_id AS disease_id,
        0 AS view_count,
        0 AS search_count,
        COUNT(*) AS chat_count
      FROM chat_events
      WHERE entity_id IS NOT NULL
      GROUP BY entity_id
    )
    SELECT
      ds.disease_id,
      SUM(ds.view_count)        AS total_views,
      SUM(ds.search_count)      AS total_searches,
      SUM(ds.chat_count)        AS total_chats,
      (
        SUM(ds.view_count)   * ${SCORES.VIEW_DISEASE} +
        SUM(ds.search_count) * ${SCORES.SEARCH_DISEASE} +
        SUM(ds.chat_count)   * ${SCORES.CHAT_AI_TOPIC}
      ) AS interest_score
    FROM disease_scores ds
    GROUP BY ds.disease_id
    ORDER BY interest_score DESC
    LIMIT 20;
  `);

  return db.count('result_top_diseases');
}
