CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.participations
ALTER COLUMN id SET DEFAULT uuid_generate_v4();