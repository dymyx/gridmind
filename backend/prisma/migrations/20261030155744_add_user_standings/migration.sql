-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "scoredAt" TIMESTAMP(3);

CREATE VIEW "public"."UserGlobalStanding" AS
SELECT
  p.user_id,
  COALESCE(SUM(pr.points), 0)::int AS points,
  COUNT(DISTINCT p.id)::int AS predictions,
  (COUNT(*) FILTER (WHERE pr.points > 0))::int AS correct,
  (RANK() OVER (
    ORDER BY COALESCE(SUM(pr.points), 0) DESC,
             COUNT(*) FILTER (WHERE pr.points > 0) DESC
  ))::int AS position
FROM "public"."Prediction" p
JOIN "public"."PredictionResult" pr ON pr.prediction_id = p.id
WHERE p."scoredAt" IS NOT NULL
GROUP BY p.user_id;

CREATE VIEW "public"."UserSeasonStanding" AS
SELECT
  r.season_id,
  p.user_id,
  COALESCE(SUM(pr.points), 0)::int AS points,
  COUNT(DISTINCT p.id)::int AS predictions,
  (COUNT(*) FILTER (WHERE pr.points > 0))::int AS correct,
  (RANK() OVER (
    PARTITION BY r.season_id
    ORDER BY COALESCE(SUM(pr.points), 0) DESC,
             COUNT(*) FILTER (WHERE pr.points > 0) DESC
  ))::int AS position
FROM "public"."Prediction" p
JOIN "public"."Race" r ON r.id = p.race_id
JOIN "public"."PredictionResult" pr ON pr.prediction_id = p.id
WHERE p."scoredAt" IS NOT NULL
GROUP BY r.season_id, p.user_id;