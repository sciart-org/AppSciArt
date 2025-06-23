CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE public.seed_editions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.seed_editions
ALTER COLUMN id SET DEFAULT uuid_generate_v4();