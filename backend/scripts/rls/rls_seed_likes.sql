CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE public.seed_likes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.seed_likes
ALTER COLUMN id SET DEFAULT uuid_generate_v4();