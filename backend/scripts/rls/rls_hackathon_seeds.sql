CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE public.hackathon_seeds ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.hackathon_seeds
ALTER COLUMN id SET DEFAULT uuid_generate_v4();