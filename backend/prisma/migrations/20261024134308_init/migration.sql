-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dict";

-- CreateEnum
CREATE TYPE "Statuses" AS ENUM ('active', 'finished', 'upcoming');

-- CreateTable
CREATE TABLE "dict"."Season" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "Statuses" NOT NULL DEFAULT 'upcoming',

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dict"."Circuit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dict"."Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "principal" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dict"."Driver" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "circuit_id" TEXT NOT NULL,
    "raceName" TEXT NOT NULL,
    "raceDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "winnerId" TEXT,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualifying" (
    "id" TEXT NOT NULL,
    "race_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "time" TEXT,

    CONSTRAINT "Qualifying_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceResult" (
    "id" TEXT NOT NULL,
    "race_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "position" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,

    CONSTRAINT "RaceResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "favoriteDriverId" TEXT,
    "favoriteTeamId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "race_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictionResult" (
    "id" TEXT NOT NULL,
    "prediction_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "predicted_position" INTEGER NOT NULL,
    "actual_position" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PredictionResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStat" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "season_id" TEXT NOT NULL,
    "correct_predictions" INTEGER NOT NULL DEFAULT 0,
    "total_predictions" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,

    CONSTRAINT "UserStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "device_name" TEXT,
    "device_ip" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_year_key" ON "dict"."Season"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "dict"."Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Race_season_id_round_key" ON "Race"("season_id", "round");

-- CreateIndex
CREATE UNIQUE INDEX "Qualifying_race_id_driver_id_key" ON "Qualifying"("race_id", "driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_user_id_race_id_key" ON "Prediction"("user_id", "race_id");

-- CreateIndex
CREATE UNIQUE INDEX "PredictionResult_prediction_id_driver_id_key" ON "PredictionResult"("prediction_id", "driver_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "dict"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_circuit_id_fkey" FOREIGN KEY ("circuit_id") REFERENCES "dict"."Circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualifying" ADD CONSTRAINT "Qualifying_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualifying" ADD CONSTRAINT "Qualifying_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "dict"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceResult" ADD CONSTRAINT "RaceResult_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceResult" ADD CONSTRAINT "RaceResult_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "dict"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceResult" ADD CONSTRAINT "RaceResult_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "dict"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteDriverId_fkey" FOREIGN KEY ("favoriteDriverId") REFERENCES "dict"."Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteTeamId_fkey" FOREIGN KEY ("favoriteTeamId") REFERENCES "dict"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionResult" ADD CONSTRAINT "PredictionResult_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionResult" ADD CONSTRAINT "PredictionResult_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "dict"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStat" ADD CONSTRAINT "UserStat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStat" ADD CONSTRAINT "UserStat_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "dict"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CRATE VIEWS
CREATE VIEW "public"."DriverStanding" AS
SELECT
  r.season_id,
  rr.driver_id,
  (
    SELECT rr2.team_id
    FROM "public"."RaceResult" rr2
    JOIN "public"."Race" r2 ON r2.id = rr2.race_id
    WHERE rr2.driver_id = rr.driver_id
      AND r2.season_id = r.season_id
    ORDER BY r2.round DESC
    LIMIT 1
  ) AS team_id,
  SUM(rr.points)::int AS points,
  (COUNT(*) FILTER (WHERE rr.position = '1'))::int AS wins,
  (RANK() OVER (
    PARTITION BY r.season_id
    ORDER BY SUM(rr.points) DESC,
             COUNT(*) FILTER (WHERE rr.position = '1') DESC
  ))::int AS position
FROM "public"."RaceResult" rr
JOIN "public"."Race" r ON r.id = rr.race_id
GROUP BY r.season_id, rr.driver_id;


CREATE VIEW "public"."TeamStanding" AS
SELECT
  r.season_id,
  rr.team_id,
  SUM(rr.points)::int AS points,
  (COUNT(*) FILTER (WHERE rr.position = '1'))::int AS wins,
  (RANK() OVER (
    PARTITION BY r.season_id ORDER BY SUM(rr.points) DESC,
    COUNT(*) FILTER (WHERE rr.position = '1') DESC)
  )::int AS position
FROM "public"."RaceResult" rr
JOIN "public"."Race" r ON r.id = rr.race_id
GROUP BY r.season_id, rr.team_id;