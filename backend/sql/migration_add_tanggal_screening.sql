-- Migration: Add tanggal_screening to screening_results table
-- This migration adds the tanggal_screening column and populates existing data

ALTER TABLE screening_results ADD COLUMN tanggal_screening DATE;

-- Populate existing records to use their created_at date as the screening date
UPDATE screening_results SET tanggal_screening = DATE(created_at) WHERE tanggal_screening IS NULL;

-- If you want to make it NOT NULL afterwards (optional but recommended since the app expects it to be NOT NULL):
-- ALTER TABLE screening_results MODIFY COLUMN tanggal_screening DATE NOT NULL;
